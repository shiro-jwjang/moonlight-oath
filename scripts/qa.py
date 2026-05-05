#!/usr/bin/env python3
"""
월영의 맹세 (Moonlight Oath) — 정적 에셋 QA

script.js에서 참조하는 모든 에셋 파일이 실제로 존재하는지 검사.
post-push 훅에서 자동 실행됨.

검사 항목:
1. 캐릭터 스프라이트 (directory + sprites → assets/characters/)
2. 배경 씬 (scenes → assets/scenes/)
3. 음악 (music → assets/music/)
4. 이미지/CG (images → assets/images/)
5. 갤러리 (gallery → assets/gallery/)
6. 효과음/보이스 (sounds, voices → assets/audio/)
7. 대사에서 사용된 캐릭터 ID가 정의되어 있는지
8. play music에서 참조한 곡이 assets에 등록되어 있는지

사용법:
  python3 scripts/qa.py              # 전체 검사
  python3 scripts/qa.py --json       # JSON 출력
"""

import os
import re
import sys
import json
import subprocess

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCRIPT_JS = os.path.join(PROJECT_ROOT, "js", "script.js")
ASSETS_DIR = os.path.join(PROJECT_ROOT, "assets")


def read_script():
    with open(SCRIPT_JS, "r", encoding="utf-8") as f:
        return f.read()


def extract_js_block(content, start_marker, end_marker=None):
    """start_marker부터 매칭되는 블록을 추출 (괄호 균형 기반)."""
    idx = content.find(start_marker)
    if idx == -1:
        return None
    # 여는 괄호 위치 찾기
    open_idx = content.index("(", idx)
    depth = 0
    for i in range(open_idx, len(content)):
        if content[i] in "({[":
            depth += 1
        elif content[i] in ")}]":
            depth -= 1
            if depth == 0:
                return content[open_idx:i + 1]
    return None


def parse_assets_block(block, asset_type):
    """monogatari.assets('type', { key: 'file', ... }) 형태 파싱."""
    if block is None:
        return {}
    results = {}
    # 키:값 쌍 추출 (문자열 키 → 문자열 값)
    pattern = r"'([^']+)'\s*:\s*'([^']+)'"
    for match in re.finditer(pattern, block):
        key, value = match.group(1), match.group(2)
        results[key] = value
    return results


def extract_balanced_block(text, start_pos):
    """start_pos부터 괄호 균형으로 닫히는 블록 추출."""
    open_idx = text.index("{", start_pos)
    depth = 0
    for i in range(open_idx, len(text)):
        if text[i] in "({[":
            depth += 1
        elif text[i] in ")}]":
            depth -= 1
            if depth == 0:
                return text[open_idx:i + 1]
    return None


def parse_characters_block(content):
    """monogatari.characters({ id: { directory: '...', sprites: { ... } }, ... }) 파싱."""
    block = extract_js_block(content, "monogatari.characters")
    if block is None:
        return {}

    characters = {}
    # 캐릭터 ID 추출 (단일 ' 들어간 값은 제외)
    char_pattern = r"'([^']+)'\s*:\s*\{"
    char_starts = list(re.finditer(char_pattern, block))

    for i, match in enumerate(char_starts):
        char_id = match.group(1)
        start = match.end()
        # 다음 캐릭터 시작 또는 블록 끝
        end = char_starts[i + 1].start() if i + 1 < len(char_starts) else len(block)
        char_body = block[start:end]

        # directory 추출
        dir_match = re.search(r"directory\s*:\s*'([^']+)'", char_body)
        directory = dir_match.group(1) if dir_match else char_id

        # sprites 추출 — 키에 따옴표가 없는 형태: { normal: 'file.webp', ... }
        sprites = {}
        sp_idx = char_body.find("sprites")
        if sp_idx != -1:
            sp_block = extract_balanced_block(char_body, sp_idx)
            if sp_block:
                for sp in re.finditer(r"(\w+)\s*:\s*'([^']+)'", sp_block):
                    sprites[sp.group(1)] = sp.group(2)

        characters[char_id] = {"directory": directory, "sprites": sprites}

    return characters


def check_character_assets(characters):
    """캐릭터 스프라이트 파일 존재 여부 검사."""
    missing = []
    found = []
    for char_id, data in characters.items():
        directory = data["directory"]
        for sprite_name, filename in data["sprites"].items():
            filepath = os.path.join(ASSETS_DIR, "characters", directory, filename)
            full_path = os.path.join(PROJECT_ROOT, filepath)
            if os.path.isfile(full_path):
                found.append(filepath)
            else:
                missing.append({
                    "type": "character_sprite",
                    "character": char_id,
                    "sprite": sprite_name,
                    "expected": filepath
                })
    return found, missing


def check_generic_assets(assets, asset_type, subfolder):
    """music, scenes, images 등 범용 에셋 검사."""
    missing = []
    found = []
    for asset_id, filename in assets.items():
        filepath = os.path.join(ASSETS_DIR, subfolder, filename)
        full_path = os.path.join(PROJECT_ROOT, filepath)
        if os.path.isfile(full_path):
            found.append(filepath)
        else:
            missing.append({
                "type": asset_type,
                "id": asset_id,
                "expected": filepath
            })
    return found, missing


def check_dialog_character_ids(content, defined_ids):
    """대사에서 사용된 캐릭터 ID가 정의되어 있는지 검사."""
    # 대사 패턴: 'char_id 대사내용' 또는 'char_id_expression 대사내용'
    dialog_pattern = r"^\s*'([a-z_]+)(?:_\w+)?\s+"
    used_ids = set()
    for match in re.finditer(dialog_pattern, content, re.MULTILINE):
        cid = match.group(1)
        # 모노가타리 내장 액션 제외
        if cid not in ("show", "hide", "play", "stop", "pause", "jump", "wait",
                        "narrator", "end", "clear", "center", "left", "right",
                        "function", "window", "document", "console"):
            used_ids.add(cid)

    undefined = used_ids - defined_ids
    return sorted(undefined), sorted(used_ids & defined_ids)


def check_play_music_refs(content, defined_music):
    """play music에서 참조한 곡이 assets에 등록되어 있는지 검사."""
    pattern = r"'play\s+music\s+([a-z0-9_]+)"
    used_music = set(m.group(1) for m in re.finditer(pattern, content))
    undefined = used_music - set(defined_music.keys())
    return sorted(undefined), sorted(used_music & set(defined_music.keys()))


def run_js_check():
    """JS 문법 검사."""
    js_files = ["js/main.js", "js/script.js", "js/options.js", "js/storage.js"]
    errors = []
    for f in js_files:
        path = os.path.join(PROJECT_ROOT, f)
        if os.path.isfile(path):
            result = subprocess.run(
                ["node", "--check", path],
                capture_output=True, text=True
            )
            if result.returncode != 0:
                errors.append({"file": f, "error": result.stderr.strip()})
    return errors


def run_qa():
    content = read_script()

    # 1. JS 문법 검사
    js_errors = run_js_check()

    # 2. 캐릭터 파싱 + 검사
    characters = parse_characters_block(content)
    char_found, char_missing = check_character_assets(characters)

    # 3. 에셋 파싱 + 검사
    music_block = extract_js_block(content, "monogatari.assets ('music'")
    music = parse_assets_block(music_block, "music")
    music_found, music_missing = check_generic_assets(music, "music", "music")

    scenes_block = extract_js_block(content, "monogatari.assets ('scenes'")
    scenes = parse_assets_block(scenes_block, "scenes")
    scenes_found, scenes_missing = check_generic_assets(scenes, "scenes", "scenes")

    images_block = extract_js_block(content, "monogatari.assets ('images'")
    images = parse_assets_block(images_block, "images")
    images_found, images_missing = check_generic_assets(images, "images", "images")

    gallery_block = extract_js_block(content, "monogatari.assets ('gallery'")
    gallery = parse_assets_block(gallery_block, "gallery")
    gallery_found, gallery_missing = check_generic_assets(gallery, "gallery", "gallery")

    sounds_block = extract_js_block(content, "monogatari.assets ('sounds'")
    sounds = parse_assets_block(sounds_block, "sounds")
    sounds_found, sounds_missing = check_generic_assets(sounds, "sounds", "audio")

    voices_block = extract_js_block(content, "monogatari.assets ('voices'")
    voices = parse_assets_block(voices_block, "voices")
    voices_found, voices_missing = check_generic_assets(voices, "voices", "audio")

    # 4. 대사 캐릭터 ID 검사
    undefined_chars, valid_chars = check_dialog_character_ids(content, set(characters.keys()))

    # 5. play music 참조 검사
    undefined_music, valid_music = check_play_music_refs(content, music)

    # 결과 집계
    all_missing = (
        char_missing + music_missing + scenes_missing +
        images_missing + gallery_missing + sounds_missing + voices_missing
    )

    result = {
        "summary": {
            "total_assets": len(char_found) + len(music_found) + len(scenes_found) +
                           len(images_found) + len(gallery_found) + len(sounds_found) + len(voices_found),
            "missing_files": len(all_missing),
            "js_errors": len(js_errors),
            "undefined_char_ids": len(undefined_chars),
            "undefined_music_refs": len(undefined_music_refs) if 'undefined_music_refs' in dir() else len(undefined_music),
            "pass": len(all_missing) == 0 and len(js_errors) == 0 and len(undefined_chars) == 0
        },
        "js_errors": js_errors,
        "missing_assets": all_missing,
        "undefined_char_ids": undefined_chars,
        "undefined_music_refs": undefined_music,
        "stats": {
            "characters": {"defined": len(characters), "sprites_found": len(char_found), "missing": len(char_missing)},
            "music": {"defined": len(music), "found": len(music_found), "missing": len(music_missing)},
            "scenes": {"defined": len(scenes), "found": len(scenes_found), "missing": len(scenes_missing)},
            "images": {"defined": len(images), "found": len(images_found), "missing": len(images_missing)},
            "gallery": {"defined": len(gallery), "found": len(gallery_found), "missing": len(gallery_missing)},
            "sounds": {"defined": len(sounds), "found": len(sounds_found), "missing": len(sounds_missing)},
            "voices": {"defined": len(voices), "found": len(voices_found), "missing": len(voices_missing)}
        }
    }

    return result


def print_report(result):
    s = result["summary"]
    st = result["stats"]

    if s["pass"]:
        print(f"✅ QA PASSED — {s['total_assets']} 에셋 전부 정상")
    else:
        print(f"❌ QA FAILED")

    # 에셋 통계
    for name, data in st.items():
        if data["defined"] > 0:
            status = "✅" if data["missing"] == 0 else f"❌ {data['missing']}개 누락"
            found_key = next((k for k in ("sprites_found", "found") if k in data), "found")
            found = data[found_key]
            print(f"  {name}: {found}/{data['defined']} {status}")

    # JS 에러
    if result["js_errors"]:
        print(f"\n❌ JS 문법 에러 ({len(result['js_errors'])}개):")
        for e in result["js_errors"]:
            print(f"  {e['file']}: {e['error']}")

    # 누락 파일
    if result["missing_assets"]:
        print(f"\n❌ 누락 에셋 ({len(result['missing_assets'])}개):")
        for m in result["missing_assets"]:
            if m["type"] == "character_sprite":
                print(f"  🧑 {m['character']}/{m['sprite']}: {m['expected']}")
            else:
                print(f"  📁 {m['type']}/{m['id']}: {m['expected']}")

    # 미정의 캐릭터 ID
    if result["undefined_char_ids"]:
        print(f"\n⚠️  대사에 사용되지만 정의 안 된 캐릭터 ID ({len(result['undefined_char_ids'])}개):")
        for cid in result["undefined_char_ids"]:
            print(f"  {cid}")

    # 미정의 음악 참조
    if result["undefined_music_refs"]:
        print(f"\n⚠️  play music에 참조되지만 assets에 없는 곡 ({len(result['undefined_music_refs'])}개):")
        for mid in result["undefined_music_refs"]:
            print(f"  {mid}")

    print()
    return s["pass"]


if __name__ == "__main__":
    json_mode = "--json" in sys.argv
    result = run_qa()

    if json_mode:
        print(json.dumps(result, indent=2, ensure_ascii=False))
        sys.exit(0 if result["summary"]["pass"] else 1)
    else:
        passed = print_report(result)
        sys.exit(0 if passed else 1)
