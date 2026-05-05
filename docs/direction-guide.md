# Monogatari.js 연출 가이드

> 월영의 맹세(Moonlight Oath) 프로젝트에서 사용 가능한 Monogatari.js 2.x 스크립트 액션 참고서.
> 공식 문서: https://developers.monogatari.io/documentation/

---

## 공통 애니메이션

모든 `show`/`hide` 명령에 `with` 키워드로 애니메이션을 지정할 수 있음. Animate.css 기반.

### 주요 애니메이션 목록

| 애니메이션 | 용도 |
|-----------|------|
| `fadeIn` | 서서히 나타남 (기본) |
| `fadeOut` | 서서히 사라짐 |
| `bounceIn` | 바운스 효과로 등장 |
| `slideInRight` | 오른쪽에서 슬라이드 등장 |
| `slideInLeft` | 왼쪽에서 슬라이드 등장 |
| `slideInDown` | 위에서 슬라이드 등장 |
| `slideInUp` | 아래에서 슬라이드 등장 |
| `zoomIn` | 확대 등장 |
| `flash` | 깜빡임 |
| `shake` | 흔들림 |
| `pulse` | 맥박/떨림 반복 |
| `flipInX` | X축 플립 등장 |
| `flipInY` | Y축 플립 등장 |

### duration (지속시간)

`with` 뒤에 `duration`으로 애니메이션 길이 지정 (기본: CSS 기본값)

```
'show character seol normal at center with fadeIn duration 1000',
```

### position (위치)

캐릭터/이미지 배치 위치

```
'show character seol normal at left with fadeIn',
'show character seol normal at center with fadeIn',
'show character seol normal at right with fadeIn',
```

---

## 1. 배경 / 씬

### `show scene` — 배경 씬 전환

배경 이미지를 표시. 씬 전환 시 이전 캐릭터는 자동 제거됨 (main.js 패치 적용).

```
'show scene park_indoor with fadeIn',
'show scene market_street with fadeIn duration 2000',
'show scene seola_room with fadeOut',
```

- 배경 이미지 경로: `assets/scenes/`
- CSS 색상 직접 지정도 가능: `'#000000'`, `'rgba(0,0,0,0.8)'`

### `show background` — 배경색/이미지 직접 지정

```
'show background #000000',
'show background black',
'show background url(이미지경로) with fadeIn',
```

---

## 2. 캐릭터

### `show character` — 캐릭터 표시

```
'show character seol normal at center with fadeIn',
'show character bihyung angry at right with slideInRight duration 500',
```

- 문법: `show character <ID> <표정> at <위치> with <애니메이션> [duration <ms>]`
- 동일 캐릭터를 다시 show하면 표정만 변경 (위치 유지)
- 캐릭터 이미지 경로: `assets/characters/<directory>/<표정>.webp`

### `show character <ID>:<layer>` — 캐릭터 레이어 (실험적)

캐릭터의 특정 레이어(의상, 액세서리 등)만 개별 표시. `ExperimentalFeatures: true` 필요.

```
'show character seol:outfit formal at center with fadeIn',
```

### `hide character` — 캐릭터 숨기기

```
'hide character seol',
'hide character seol with fadeOut',
'hide character seol with fadeOut duration 500',
```

### 캐릭터 이동 애니메이션

```
'show character seol normal at left with move duration 1000',
```

캐릭터가 현재 위치에서 다른 위치로 이동.

---

## 3. 이미지

### `show image` — CG / 아이템 이미지 표시

```
'show image cg_proposal at center with fadeIn',
'show image item_letter at left with bounceIn',
```

- 이미지 경로: `assets/images/`
- 위치 지정: `at left`, `at center`, `at right`

### `hide image` — 이미지 숨기기

```
'hide image cg_proposal',
'hide image cg_proposal with fadeOut',
```

---

## 4. Canvas (그리기)

### `show canvas` — 캔버스 표시

웹 캔버스에 직접 그리기 가능. 커스텀 엔진에서 활용.

```
'show canvas myCanvas',
```

### `hide canvas` — 캔버스 숨기기

```
'hide canvas myCanvas',
```

---

## 5. 비디오

### `show video` — 비디오 재생

```
'show video intro modal with fadeIn',     // 모달 재생 (클릭으로 닫기)
'show video intro displayable',           // 화면에 표시
'show video intro immersive',             // 몰입형 (전체화면)
'show video intro background',            // 배경 비디오
'show video intro modal close loop',      // 루프 + 닫기 버튼
```

**모드:**
- `modal` — 중앙 모달로 재생, `close` 옵션으로 닫기 버튼 표시
- `displayable` — 게임 화면 위에 표시
- `immersive` — 전체화면 몰입형 재생
- `background` — 배경으로 재생
- `fullscreen` — 브라우저 전체화면

### `hide video` — 비디오 중지/숨기기

```
'hide video intro',
```

---

## 6. 파티클 (효과)

### `show particles` — 파티클 효과

눈, 벚꽃, 불꽃 등 자연 현상 효과. tsParticles 기반.

```
'show particles snow',
'show particles cherry_blossom',
```

### `hide particles` — 파티클 중지

```
'hide particles',
```

---

## 7. 오디오

### `play music` — BGM 재생

```
'play music morning_breeze',
'play music morning_breeze loop',           // 반복 재생
'play music morning_breeze fade 2',        // 2초 페이드 인
'play music morning_breeze with fade 3',   // 3초 페이드 인
```

- 오디오 경로: `assets/audio/music/`
- `loop` — 반복 재생 (기본)
- `fade` / `with fade` — 페이드 인 (초 단위)

**오디오 이펙트 (AudioEffects 플러그인):**

```
'play music morning_breeze with filter lowpass 800',
'play music morning_breeze with delay 0.5 0.3 0.8',
'play music morning_breeze with reverb 2',
```

| 이펙트 | 설명 | 파라미터 |
|--------|------|---------|
| `filter` | 주파수 필터 | `lowpass <freq>`, `highpass <freq>`, `bandpass <freq> <q>` |
| `delay` | 딜레이/에코 | `<time> <feedback> <mix>` |
| `reverb` | 리버브 | `<duration>` 또는 `convreverb` |
| `compressor` | 압축 | 자동 적용 |
| `tremolo` | 트레몰로 | `<rate> <depth>` |
| `distortion` | 디스토션 | `<amount>` |
| `panner` | 패닝 | `<x> <y> <z>` |
| `phaser` | 페이저 | `<freq> <octaves>` |
| `chorus` | 코러스 | `<rate> <delay> <depth>` |
| `bitcrusher` | 비트크러셔 | `<bits>` |
| `autowah` | 오토와 | `<freq> <q>` |
| `wah` | 와 | `<freq> <q>` |
| `ringmod` | 링 모듈레이션 | `<freq> <depth>` |
| `saturator` | 포화 | `<amount>` |
| `limiter` | 리미터 | 자동 적용 |

### `stop music` — BGM 정지

```
'stop music',
'stop music morning_breeze',               // 특정 곡 정지
'stop music fade 2',                       // 2초 페이드 아웃
'stop music morning_breeze fade 3',        // 특정 곡 3초 페이드 아웃
```

### `play sound` — 효과음 (SE)

```
'play sound door_knock',
'play sound footstep loop',                // 반복 재생
'play sound footstep with fade 0.5',
```

- 오디오 경로: `assets/audio/sound/`

### `stop sound` — 효과음 정지

```
'stop sound',
'stop sound footstep',
'stop sound footstep fade 1',
```

### `play voice` — 보이스 (CV)

```
'play voice seol_line_001',
```

- 오디오 경로: `assets/audio/voice/`

### `stop voice` — 보이스 정지

```
'stop voice',
'stop voice seol_line_001',
```

### `pause music` / `pause sound` — 일시정지

```
'pause music',
'pause music morning_breeze',
```

`stop`과 다르게 일시정지. `play music`으로 재개 가능.

---

## 8. 플로우 제어

### `choices` — 선택지

```
'choice',
'Choice 1' {
    'seola 이걸 선택했다.',
    'jump choice_1_result',
},
'Choice 2' {
    'seola 저걸 선택했다.',
    'jump choice_2_result',
},
'endchoice',
```

**제한시간 선택지:**

```
'choice Timer 10',
'제한시간 있음 (10초)' {
    'jump timed_result',
},
'endchoice',
```

`Timer <초>`로 제한시간 설정. 시간 초과 시 아무것도 선택 안 된 상태로 진행.

### `jump` — 레이블 이동

```
'jump chapter_2',
'jump bad_ending',
```

지정한 레이블(label)로 이동.

### `<<condition>>` — 조건 분기

```
'<<if glass_bead>>',
    'narrator 유리구슬을 가지고 있다.',
'<<elseif astronomical_record>>',
    'narrator 천문 기록을 가지고 있다.',
'<<else>>',
    'narrator 아무것도 가지고 있지 않다.',
'<<endif>>',
```

변수 값에 따라 분기. `engine.storage('flags.glass_bead')` 형태도 가능.

### `wait` — 대기

```
'wait 1000',    // 1초 대기
'wait 3000',    // 3초 대기
```

밀리초 단위. 대기 중에는 엔진이 block됨 (클릭 무시).

---

## 9. 메시지 / UI

### `show message` — 메시지 표시

```
'show message 아이템을 획득했습니다.',
```

화면에 메시지를 표시.

### `show notification` — 알림

```
'show notification 새로운 장면이 열렸습니다.',
```

알림 형태로 메시지를 표시.

### `clear` — 텍스트 박스 비우기

```
'clear',
```

텍스트 박스의 내용을 지움. 화면 전환 효과로 활용 가능.

### `dialog` — 다이얼로그 (커스텀 모달)

```
'dialog title 제목입니다.',
'dialog text 내용입니다.',
'dialog button 확인',
```

커스텀 다이얼로그 표시.

---

## 10. 고급

### `function` — JavaScript 실행

```
() => {
    engine.storage({ my_var: 'value' });
    return true;
}
```

JS 함수를 직접 실행. `engine` 객체로 엔진에 접근 가능.

> ⚠️ 월영의 맹세에서는 `main.js`에 `engine.run` 패치가 적용되어 있어,
> function 타입 엔트리가 정상 동작함.

### `input` — 사용자 입력

```
'input 이름을 입력하세요.',
```

사용자에게 텍스트 입력을 요청.

### `preload` — 에셋 사전 로딩

```
'preload images cg_proposal',
'preload music bgm_battle',
```

게임 진행 전에 에셋을 미리 로드. 로딩 화면에서 활용.

### `unload` — 에셋 해제

```
'unload images cg_proposal',
'unload music bgm_battle',
```

메모리 절약을 위해 사용하지 않는 에셋을 해제.

### `next` — 즉시 다음으로

현재 대사를 스킵하고 다음으로 넘어감.

### `end` — 게임 종료

```
'end',
```

게임을 종료하고 엔딩 화면으로 이동.

### `placeholder` — 자리표시자

개발 중 사용. 아직 구현되지 않은 부분을 표시.

### `vibrate` — 진동

```
'vibrate 500',         // 500ms 진동
'vibrate 200 100 200', // 패턴 진동
```

모바일 기기에서만 동작.

---

## 11. 갤러리

### `gallery` — CG 갤러리

```
'gallery cg_proposal',
```

CG를 갤러리에 등록. 엔딩 후 열람 가능한 CG 갤러리 시스템 구축에 사용.

---

## 실전 연출 패턴

### 장면 전환 (블랙아웃)

```
'show background black',
'wait 1000',
'show scene new_location with fadeIn',
```

### 캐릭터 퇴장 연출

```
'hide character seol with fadeOut duration 500',
'wait 500',
```

### 텐션 있는 등장

```
'show character mugyeom angry at center with bounceIn duration 800',
```

### 감정 전환 (표정 변화)

```
'show character seol smile at center',
'seol 무슨 말이에요?',
'show character seol angry',
'seol ……그런 말은 하지 마세요.',
```

### 분위기 전환 (BGM 페이드)

```
'stop music fade 3',
'wait 3000',
'play music tense_bgm with fade 2',
```

### 선택지와 분기

```
'choice',
'향낭을 열어본다' {
    'show image item_pouch at center with fadeIn',
    'narrator 향낭 안에는 작은 쪽지가 들어 있었다.',
    '<<if glass_bead>>',
        'narrator 유리구슬이 쪽지와 함께 반짝였다.',
    '<<endif>>',
    'jump opened_pouch',
},
'향낭을 그대로 둔다' {
    'narrator 설아는 향낭을 품속에 다시 넣었다.',
    'jump kept_pouch',
},
'endchoice',
```

### 캐릭터 교차 등장

```
'show character seol smile at left with slideInLeft duration 500',
'wait 300',
'show character mugyeom normal at right with slideInRight duration 500',
```
