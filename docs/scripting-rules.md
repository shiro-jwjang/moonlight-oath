# 스크립팅 규칙 (Scripting Rules)

> 월영의 맹세(Moonlight Oath) script.js 작성 시 반드시 지켜야 하는 규칙.
> 엔진 기능 참고는 [direction-guide.md](direction-guide.md)를 참조.

---

## 1. 캐릭터 표시/숨기기

### 기본 원칙: show 전에 hide

캐릭터를 새로 표시하기 전에, **같은 위치에 있는 기존 캐릭터를 반드시 숨겨야 함.** 그렇지 않으면 캐릭터 이미지가 겹쳐서 나옴.

```
// ❌ 잘못됨 — hwaryeon과 dani가 모두 left에 표시됨
'show character hwaryeon normal at left with fadeIn',
'hwaryeon 설아야.',
'show character dani normal at left with fadeIn',   // hwaryeon 위에 겹쳐서 나옴

// ✅ 올바름 — hwaryeon을 먼저 숨기고 dani를 표시
'show character hwaryeon normal at left with fadeIn',
'hwaryeon 설아야.',
'hide character hwaryeon with fadeOut',
'show character dani normal at left with fadeIn',
```

### 동시 배치 위치 규칙

화면에 여러 캐릭터가 동시에 존재할 때, 위치는 인원수에 따라 배정:

| 인원 | 배치 |
|------|------|
| 1명 | `center` |
| 2명 | `left`, `right` |
| 3명 | `left`, `center`, `right` |

**절대 두 캐릭터를 같은 위치에 동시에 배치하지 않음.**

```
// ✅ 2명 동시 배치
'show character seol normal at left with fadeIn',
'show character bihyung normal at right with fadeIn',

// ✅ 3명 동시 배치
'show character seol normal at left with fadeIn',
'show character jingan normal at center with fadeIn',
'show character bihyung normal at right with fadeIn',
```

### 씬 전환 시 주의

`show scene`으로 배경을 바꾸면 화면의 캐릭터는 자동으로 제거됨 (main.js 패치 적용). 하지만 명시적으로 `hide`해도 무방함.

### 퇴장 애니메이션

캐릭터가 대화 중에 퇴장할 때는 반드시 애니메이션과 함께 hide:

```
'hide character seol with fadeOut',
```

---

## 2. 표정 변경

### ⚠️ 위치 생략 시 동작 (중요)

`show character <ID> <표정>`처럼 `at`을 생략하면, **이전 위치와 상관없이 항상 center로 처리됨.** 엔진이 이전 위치를 기억하지 않으므로 주의.

```
// ❌ 잘못됨 — left에 배치했지만, 표정만 바꾸려 한 것이 center로 이동해버림
'show character dani normal at left with fadeIn',
'dani 대사',
'show character dani shocked',    // center로 튕김!
'dani 대사',

// ✅ 올바름 — 표정만 바꿀 때도 at 명시
'show character dani normal at left with fadeIn',
'dani 대사',
'show character dani shocked at left with fadeIn',   // 위치 유지
'dani 대사',

// ✅ 올바름 — 1명일 때는 아예 at을 안 쓰면 center 기본값
'show character dani normal with fadeIn',
'dani 대사',
'show character dani shocked',   // center → center, 문제 없음
'dani 대사',
```

**핵심 규칙:**
- 캐릭터 1명만 화면에 있을 때 → `at` 생략 (center 기본값)
- 2명 이상 동시 배치 시 → 반드시 `at` 명시
- left/right에 배치된 캐릭터의 표정만 바꿀 때 → 반드시 `at` 다시 명시
- 위치를 다시 지정하면 이동 애니메이션이 됨 (`with move` 필요 없이 자동 이동)

---

## 3. BGM (배경 음악)

### 기본 원칙: play 전에 stop

새 BGM을 재생하기 전에 **기존 BGM을 반드시 정지.** 그렇지 않으면 두 곡이 동시에 재생됨.

```
// ❌ 잘못됨 — 이전 BGM이 계속 재생됨
'play music moon_jade_oath with loop',
// ... 대사 ...
'play music roofline_dawn with loop',   // moon_jade_oath와 겹침

// ✅ 올바름 — 이전 곡을 멈추고 새 곡 재생
'play music moon_jade_oath with loop',
// ... 대사 ...
'stop music fade 2',
'play music roofline_dawn with fade 2 with loop',
```

### 씬 전환 시 BGM

씬(배경)이 바뀔 때 BGM도 함께 바뀌는 경우가 일반적. 씬 전환 전에 BGM을 정지:

```
'stop music fade 2',
'show scene park_library with fadeIn',
'play music roofline_dawn with fade 2 with loop',
```

### 페이드 활용

BGM 전환 시 페이드를 주면 자연스러움:
- `stop music fade 2` — 2초 페이드 아웃
- `play music 곡명 with fade 2 with loop` — 2초 페이드 인

### loop 지정

모든 BGM에 `with loop`를 붙여 반복 재생. 단일 재생이 필요한 경우에만 생략.

---

## 4. 씬 전환

### 기본 패턴

```
'stop music fade 2',                        // BGM 정지 (필요시)
'show background black',                    // 블랙아웃 (필요시)
'wait 500',
'show scene new_location with fadeIn',      // 배경 전환 (캐릭터 자동 제거)
'play music new_bgm with fade 2 with loop', // 새 BGM (필요시)
```

### 화면 정리

씬 전환 시 캐릭터는 `show scene`에 의해 자동 제거되지만, 명시적으로 정리하는 것도 좋음:

```
'hide character seol with fadeOut',
'hide character bihyung with fadeOut',
'wait 500',
'show scene new_location with fadeIn',
```

---

## 5. 대사 형식

### 캐릭터 대사

```
'캐릭터ID 대사 내용',
```

### 나레이션

```
'narrator 나레이션 내용',
```

### 표정과 함께 대사

```
'캐릭터ID:표정 대사 내용',
```

예: `'seol:smile 반갑습니다.'`

---

## 6. 이미지 (CG/아이템)

### 표시/숨기기

캐릭터와 동일하게 show/hide 쌍으로 관리:

```
'show image cg_proposal at center with fadeIn',
'narrator 반지가 빛나고 있었다.',
'hide image cg_proposal with fadeOut',
```

### 주의

CG 이미지를 표시한 상태에서 캐릭터를 show하면 겹칠 수 있음. CG를 먼저 hide해야 함.

---

## 7. 표정 변화

### 기본 원칙: 2~3문장마다 표정 변경

캐릭터가 연속으로 대사할 때, **2~3문장마다 최소 한 번은 표정을 바꿔야 함.** 감정 변화, 반응, 호흸을 표현하는 핵심 수단임.

```
// ❌ 잘못됨 — 6문장 동안 표정 변화 없음
'show character dani normal at left with fadeIn',
'dani 오빠, 어디 가는 거야?',
'dani 아까도 말 안 했잖아.',
'dani 매일 늦게 들어오면 혼나.',
'dani 이번엔 진짜 혼나.',
'dani 엄마한테 일러버릴 거야.',
'dani 알아서 해.',

// ✅ 올바름 — 2~3문장마다 표정 변화
'show character dani normal at left with fadeIn',
'dani 오빠, 어디 가는 거야?',
'dani 아까도 말 안 했잖아.',
'show character dani angry',
'dani 매일 늦게 들어오면 혼나.',
'show character dani nagging',
'dani 이번엔 진짜 혼나.',
'dani 엄마한테 일러버릴 거야.',
'show character dani sigh',
'dani 알아서 해.',
```

### 표정 변경 방법

1. **`show character <ID> <표정>`** — 별도 라인 (권장, 분명함)
2. **`'캐릭터ID:표정 대사'`** — 대사 라인에 인라인 (간단한 변경)

```
'show character seol worried',           // 방법 1: 별도 라인
'seol:angry 정말 실망이에요.',            // 방법 2: 인라인
```

### 표정 선택 가이드

| 상황 | 추천 표정 |
|------|----------|
| 평온한 대화 | `normal` |
| 기분 좋음 | `smile`, `happy` |
| 화남/짜증 | `angry`, `bitter` |
| 걱정/불안 | `worried`, `sad` |
| 놀람 | `surprised`, `shocked` |
| 장난/익살 | `playful`, `conspiratorial` |
| 진지함 | `serious` |
| 억울함 | `wronged` |
| 눈물 | `crying`, `emotional` |

### 주의

- **나레이션 라인은 표정 변화 간격에 포함하지 않음** (캐릭터 대사 라인만 카운트)
- 같은 표정으로 돌아가는 것도 변화로 인정 (예: angry → normal → angry)
- 문맥에 맞지 않는 무작위 표정 변경은 피할 것

---

## 체크리스트 (커밋 전 확인)

- [ ] `show character` 전에 같은 위치 기존 캐릭터 `hide` 했는가?
- [ ] `play music` 전에 `stop music` 했는가?
- [ ] BGM에 `with loop`를 붙였는가?
- [ ] `show image` / `hide image`가 쌍으로 있는가?
- [ ] 동시 배치 캐릭터가 서로 다른 위치에 있는가?
