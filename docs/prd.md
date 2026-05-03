# 《월영의 맹약》 개발용 PRD

> **버전**: v0.1 | **작성일**: 2026-05-03
> **기반 기획서**: docs/scenario.md, docs/system.md, docs/design-summary.md

---

## 1. 개요

웹 기반 한국어 비주얼노벨. Monogatari.js 2.6 엔진 사용.
현재 Phase 1 프로토타입 완료 상태. 본 PRD는 Phase 2 이후 구현을 위한 개발 요구사항을 정의한다.

---

## 2. 현재 구현 상태 (Baseline)

### 엔진/인프라
- Monogatari.js 2.6, GitHub Pages 배포
- 로딩 최적화 완료 (WebP 변환, Preload false, 캐시 헤더, Gzip)
- 디버그 도구 프로덕션 제외 (debug.js HTML 주석 처리)
- Service Worker 비활성화, LocalStorage 저장

### 에셋 현황
- 캐릭터 스프라이트: 6캐릭터 (설원랑 10종, 김무겸 6종, 비형 7종, 사담 11종, 단이 10종, 단아 1종)
- 배경: 8종 (park_indoor, park_library, park_outside, seola_room, dark_alley, market_street, bookshop, special_top)
- CG 이미지: 10종 (인트로 5종 + 이벤트 CG 5종)
- 음악/효과음/보이스: 없음

### 스크립트 현황
- script.js에 Monogatari 형식으로 작성
- 현재 구현 라벨: Start → Together / Alone (2갈래, 각각 ~30줄)
- storage.js: 플레이어 이름, 챕터, 맹약 여부만 저장
- 선택지: Start 라벨에 1개 (함께 가자 / 혼자 가야 해)

### 미구현
- scenario.md에 정의된 본 시나리오 (프롤로그~4장 공통루트 + 4갈래 루트) 미반영
- 호감도 시스템, 단서 수집, 루트 분기 조건
- 설정 화면 (텍스트 속도, 음량 등은 엔진 기본 사용 중)
- AutoSave 비활성화 상태

---

## 3. 기능 요구사항

### 3.1 시나리오 엔진

| ID | 기능 | 우선순위 | 상태 | 비고 |
|----|------|----------|------|------|
| S-01 | Monogatari 스크립트 형식으로 scenario.md 시나리오 변환 | P0 | TODO | 프롤로그~4장 공통루트 |
| S-02 | 루트 분기 시스템 | P0 | TODO | 4장 끝에서 4갈래 분기 |
| S-03 | 개별 루트 시나리오 작성 | P0 | TODO | 무겸/원랑/사담/비형 각 루트 |
| S-04 | 최종장 시나리오 | P1 | TODO | 루트별 변형 포함 |

**인수 기준**:
- 각 장 진입 시 씬 전환 (배경 + 캐릭터) 정상 동작
- 선택지 선택 후 해당 라벨로 정상 분기
- 뒤로가기(Rollback)로 이전 선택지로 복귀 가능
- 저장/불러오기 후 선택지 상태 정상 복원

### 3.2 호감도/분기 시스템

| ID | 기능 | 우선순위 | 상태 | 비고 |
|----|------|----------|------|------|
| B-01 | 캐릭터별 호감도 변수 | P0 | TODO | storage에 추가 |
| B-02 | 선택지에 따른 호감도 변동 | P0 | TODO | |
| B-03 | 4장 루트 분기 조건 판정 | P0 | TODO | 호감도 기반 or 특정 선택 조합 |
| B-04 | 호감도 UI 표시 | P2 | TODO | 표시 여부는 기획 미정 |

**인수 기준**:
- 각 선택지가 정의된 호감도 변동값을 반영
- storage.js에 호감도 데이터 저장/복원 정상
- 4장 진입 시 조건 불충족 시 fallback 루트 진입 (or 선택지 강제)

### 3.3 단서 수집 시스템

| ID | 기능 | 우선순위 | 상태 | 비고 |
|----|------|----------|------|------|
| C-01 | 단서 데이터 정의 (이름, 설명, 획득 조건) | P1 | TODO | 기획서에서 단서 목록 추출 필요 |
| C-02 | 단서 획득 이벤트 | P1 | TODO | |
| C-03 | 단서 노트 UI | P2 | TODO | 수집한 단서 열람 |
| C-04 | 단서에 의한 엔딩 분기 | P2 | TODO | 기획 미정 |

> **NOTE**: 기획서에 단지 수집 시스템 구체적 구조 미정. 구현 전 기획 확정 필요.

### 3.4 저장/불러오기

| ID | 기능 | 우선순위 | 상태 | 비고 |
|----|------|----------|------|------|
| SV-01 | 수동 저장/불러오기 | P0 | ✅ | 엔진 기본 (10슬롯) |
| SV-02 | AutoSave | P1 | TODO | 현재 비활성화. 활성화 간격 기획 필요 |
| SV-03 | 저장 데이터 확장 (호감도, 단서, 진행도) | P0 | TODO | storage.js 수정 |

**인수 기준**:
- 저장 후 브라우저 재시작해도 데이터 복원
- 호감도, 단지, 현재 라벨/인덱스 모두 저장/복원

### 3.5 설정

| ID | 기능 | 우선순위 | 상태 | 비고 |
|----|------|----------|------|------|
| ST-01 | 텍스트 표시 속도 조절 | P1 | ✅ | 엔진 기본 (TextSpeed: 20) |
| ST-02 | 음량 조절 | P1 | ✅ | 엔진 기본 (Music/Voice/Sound) |
| ST-03 | AutoPlay 속도 | P2 | ✅ | 엔진 기본 |
| ST-04 | 화면 해상도 | P2 | ✅ | 엔진 기본 (800x600) |

### 3.6 UI/UX

| ID | 기능 | 우선순위 | 상태 | 비고 |
|----|------|----------|------|------|
| UI-01 | 메인 메뉴 | P0 | ✅ | 엔진 기본 |
| UI-02 | 게임 내 UI (텍스트 박스, 이름표, 선택지) | P0 | ✅ | main.css 커스텀 |
| UI-03 | 빠른 메뉴 (저장/불러오기/설정/타이틀) | P0 | ✅ | 엔진 기본 |
| UI-04 | 챕터 타이틀 표시 | P1 | TODO | 장 진입 시 챕터명 표시 |
| UI-05 | CG 갤러리 | P2 | TODO | 엔진 기본 gallery 애셋 미설정 |
| UI-06 | 뮤직 룸 | P3 | TODO | |

### 3.7 오디오

| ID | 기능 | 우선순위 | 상태 | 비고 |
|----|------|----------|------|------|
| AU-01 | BGM 재생 | P1 | TODO | 에셋 없음. 에셋 준비 후 구현 |
| AU-02 | 효과음 | P2 | TODO | |
| AU-03 | 보이스 | P3 | TODO | 기획 미정 |
| AU-04 | 메인 메뉴 BGM | P2 | TODO | MainScreenMusic 현재 빈 값 |

---

## 4. 에셋 요구사항

### 4.1 캐릭터 스프라이트 (우선순위순)

> TODO: 기획서에서 에셋 스펙(해상도, 스타일 가이드) 미정

| 캐릭터 | 현재 스프라이트 | 추가 필요 | 비고 |
|--------|----------------|----------|------|
| 설원랑 | 10종 | 남장복 변형? | |
| 김무겸 | 6종 | | |
| 비형 | 7종 | | |
| 사담 | 11종 | | |
| 단이 | 10종 | | |
| 단아 | 1종 | 삭제 or 역할 재검토? | 기획서 미등장 |
| **설아(주인공)** | **없음** | **신규 제작 필수** | 남장 '설' + 여복 박설아, 각각 다수 표정 |
| 선덕여왕 | 없음 | 신규 | 3장~ |
| 도삼 | 없음 | 신규 | 2장~ |
| 박진관 | 없음 | 신규 | 1장~4장 + 최종장 |
| 김도윤 | 없음 | 신규 | 김무겸 루트 |
| 묵선 | 없음 | 신규 | 설원랑 루트 |
| 청라 | 없음 | 신규 | 사담 루트 |
| 기타 | 없음 | 신규 | 기획 확정 후 |

### 4.2 배경

| 배경 | 현재 | 파일명 | 추가 필요 |
|------|------|--------|----------|
| 박씨 가문 별당 (야간) | ✅ | park_outside | |
| 박씨 가문 내부 | ✅ | park_indoor | |
| 박씨 가문 서고 | ✅ | park_library | |
| 설아 방 | ✅ | seola_room | |
| 골목 | ✅ | dark_alley | |
| 저잣거리 | ✅ | market_street | |
| 서책방 | ✅ | bookshop | |
| 사당(특수) | ✅ | special_top | |
| 궁궐 | 없음 | TODO | 3장~ |
| 청류상단 내부 | 없음 | TODO | 사담 루트 |
| 월영대 | 없음 | TODO | 최종장 |
| 황룡사 | 없음 | TODO | 중후반 |

### 4.3 CG 이벤트 일러스트

| CG | 현재 | 비고 |
|----|------|------|
| 인트로 CG 5종 | ✅ | 프로토타입용 |
| 이벤트 CG 5종 | ✅ | 프로토타입용 |
| 완성본 CG | TODO | 기획에서 CG 목록 미정 |

---

## 5. 파일 구조

```
moonlight-oath/
├── index.html              # 진입점
├── manifest.json           # PWA 매니페스트
├── service-worker.js       # (비활성화)
├── js/
│   ├── options.js          # 엔진 설정 (Preload, Storage 등)
│   ├── script.js           # 캐릭터 정의 + 시나리오 스크립트 ★
│   ├── storage.js          # 저장 변수 정의 ★
│   └── main.js             # 커스텀 JS (초기화)
├── style/
│   └── main.css            # 커스텀 스타일
├── engine/                 # Monogatari.js 2.6 코어 (수정 금지)
├── assets/
│   ├── characters/         # 캐릭터 스프라이트 (WebP)
│   │   ├── seol/           # 설원랑
│   │   ├── mugyeom/        # 김무겸
│   │   ├── bihyung/        # 비형
│   │   ├── sadang/         # 사담
│   │   ├── dani/           # 단이
│   │   └── dana/           # 단아
│   ├── scenes/             # 배경 이미지 (WebP)
│   ├── images/             # CG 이미지 (WebP)
│   ├── icons/              # 아이콘
│   ├── _png_backup/        # PNG 원본 백업 (배포 제외)
│   ├── music/              # TODO: BGM
│   ├── sounds/             # TODO: 효과음
│   └── voices/             # TODO: 보이스
└── docs/
    ├── scenario.md         # 시나리오 v0.1
    ├── system.md           # 캐릭터 소개 + 스토리보드 v0.2
    └── design-summary.md   # 기획 요약서
```

---

## 6. 구현 순서 (Phase별)

### Phase 2: 공통 루트 구현
- [ ] S-01: scenario.md 프롤로그~4장을 Monogatari 스크립트로 변환
- [ ] B-01~B-03: 호감도 시스템 구현
- [ ] SV-03: storage.js 확장 (호감도, 진행도)
- [ ] 설아 캐릭터 스프라이트 에셋 확보
- [ ] 2~3장 등장 NPC 스프라이트 (박진관, 도삼 등) 에셋 확보
- [ ] UI-04: 챕터 타이틀 표시

### Phase 3: 개별 루트
- [ ] S-03: 4갈래 루트 시나리오 작성 (기획서에 시나리오 미작성 — 기획 선행 필요)
- [ ] 루트별 신규 캐릭터 에셋 확보
- [ ] 루트별 배경 에셋 확보

### Phase 4: 최종장 + 엔딩
- [ ] S-04: 최종장 시나리오
- [ ] 월영대 배경 에셋
- [ ] 엔딩 분기 구현 (기획 미정 — 기획 선행 필요)

### Phase 5: 오디오
- [ ] AU-01~AU-04: BGM/효과음 에셋 확보 + 적용

### Phase 6: 폴리싱
- [ ] C-01~C-04: 단서 수집 시스템 (기획 확정 후)
- [ ] UI-05~UI-06: 갤러리, 뮤직 룸
- [ ] SV-02: AutoSave 활성화
- [ ] 최종 QA

---

## 7. 기술 참고

### Monogatari.js 스크립트 문법
```
// 캐릭터 대사
'character_id 대사 내용'

// 내레이션
'narrator 서술 내용'

// 씬 전환
'show scene scene_id with fadeIn'

// 캐릭터 표시/변경
'show character char_id expression at position with fadeIn'

// 선택지
{ 'Choice': { 'Dialog': '질문', 'OptionKey': { 'Text': '표시', 'Do': 'jump Label' } } }

// 조건부 분기
{ 'Conditional': { 'Condition': 'variable == value', 'True': [...], 'False': [...] } }

// 저장 변수 조작
'set variable value'
```

### 현재 설정값 (options.js)
- Version: 0.1.0
- Slots: 10
- Preload: false
- AutoSave: 0 (비활성화)
- Storage: LocalStorage
- AllowRollback: true
- AspectRatio: 16:9 (Visuals 영역만)
- TextSpeed: 20, AutoPlaySpeed: 5

### 에셋 등록 방법
```js
// script.js에 등록
monogatari.assets('images', { 'id': 'filename.webp' });
monogatari.assets('scenes', { 'id': 'filename.webp' });
monogatari.assets('music', { 'id': 'filename.mp3' });
```

---

## 8. 기획 선행 필요 항목

다음 항목은 개발 전 기획 확정이 필요하다. (docs/design-summary.md 10장 참조)

- [ ] 각 루트 엔딩 종류 및 분기 조건
- [ ] 독립/월영단 루트 포함 여부
- [ ] 단서 수집 시스템 구체적 구조
- [ ] 호감도 수치 범위 및 분기 임계값
- [ ] 에셋 스펙 (해상도, 스타일 가이드)
- [ ] CG 목록
- [ ] BGM/효과음 분위기별 구성
