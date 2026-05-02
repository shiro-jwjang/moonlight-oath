/* global monogatari */

// ============================================================
// 월영의 맹약 (Moonlight Oath)
// A Korean-language visual novel built with Monogatari.js
// ============================================================

// --- Messages ---
monogatari.action ('message').messages ({
	'Help': {
		title: '도움말',
		subtitle: '게임 플레이 안내',
		body: '<p>클릭하거나 엔터 키를 눌러 대화를 진행하세요.</p><p>빠른 메뉴에서 저장/불러오기, 설정 등을 이용할 수 있습니다.</p>'
	}
});

// --- Notifications ---
monogatari.action ('notification').notifications ({
	'Welcome': {
		title: '월영의 맹약',
		body: '달빛 아래 맹세가 시작됩니다...',
		icon: ''
	}
});

monogatari.action ('particles').particles ({});
monogatari.action ('canvas').objects ({});
monogatari.configuration ('credits', {});
monogatari.assets ('gallery', {});
monogatari.assets ('music', {});
monogatari.assets ('voices', {});
monogatari.assets ('sounds', {});
monogatari.assets ('videos', {});

// --- Images (CG / Intro) ---
monogatari.assets ('images', {
	'cg_mugyeom_intro': 'cg_mugyeom_intro.png',
	'cg_bihyung_wall': 'cg_bihyung_wall.png',
	'cg_sadang_glass': 'cg_sadang_glass.png',
	'cg_four_confrontation': 'cg_four_confrontation.png',
	'intro_mugyeom': 'intro_mugyeom.png',
	'intro_seola_male': 'intro_seola_male.png',
	'intro_seola_normal': 'intro_seola_normal.png',
	'intro_bihyung': 'intro_bihyung.png',
	'intro_sadang': 'intro_sadang.png',
	'intro_seol_wollang': 'intro_seol_wollang.png'
});

// --- Scenes (Backgrounds) ---
monogatari.assets ('scenes', {
	'park_indoor': 'park_indoor.png',
	'park_library': 'park_library.png',
	'park_outside': 'park_outside.png',
	'seola_room': 'seola_room.png',
	'dark_alley': 'dark_alley.png',
	'market_street': 'market_street.png',
	'bookshop': 'bookshop.png',
	'special_top': 'special_top.png'
});

// ============================================================
// Characters
// ============================================================
monogatari.characters ({
	'seol': {
		name: '설원랑',
		color: '#a8d8ea',
		directory: 'seol',
		sprites: {
			normal: 'normal.png',
			angry: 'angry.png',
			surprised: 'surprised.png',
			sad: 'sad.png',
			smile: 'smile.png',
			worried: 'worried.png',
			expressionless: 'expressionless.png',
			bitter: 'bitter.png',
			playful: 'playful.png',
			serious: 'serious.png'
		}
	},
	'mugyeom': {
		name: '김무겸',
		color: '#c9a96e',
		directory: 'mugyeom',
		sprites: {
			normal: 'normal.png',
			angry: 'angry.png',
			surprised: 'surprised.png',
			sad: 'sad.png',
			happy: 'happy.png',
			smile: 'smile.png'
		}
	},
	'bihyung': {
		name: '비형',
		color: '#7eb8c9',
		directory: 'bihyung',
		sprites: {
			normal: 'normal.png',
			angry: 'angry.png',
			surprised: 'surprised.png',
			sad: 'sad.png',
			happy: 'happy.png',
			smile: 'smile.png',
			worried: 'worried.png',
			emotional: 'emotional.png'
		}
	},
	'sadang': {
		name: '사담',
		color: '#8bc98b',
		directory: 'sadang',
		sprites: {
			normal: 'normal.png',
			angry: 'angry.png',
			surprised: 'surprised.png',
			sad: 'sad.png',
			happy: 'happy.png',
			smile: 'smile.png',
			soft_smile: 'soft_smile.png',
			hurt_eyes: 'hurt_eyes.png',
			suspicious_smile: 'suspicious_smile.png',
			wink: 'wink.png',
			serious: 'serious.png',
			angry_smile: 'angry_smile.png',
			exaggerated: 'exaggerated.png'
		}
	},
	'dani': {
		name: '단이',
		color: '#e8b4c8',
		directory: 'dani',
		sprites: {
			normal: 'normal.png',
			moved: 'moved.png',
			worried: 'worried.png',
			shocked: 'shocked.png',
			conspiratorial: 'conspiratorial.png',
			proud: 'proud.png',
			crying: 'crying.png',
			suspicious: 'suspicious.png',
			nagging: 'nagging.png',
			sigh: 'sigh.png',
			dumbfounded: 'dumbfounded.png'
		}
	},
	'dana': {
		name: '단아',
		color: '#d4a5c9',
		directory: 'dana',
		sprites: {
			normal: 'normal.png'
		}
	},
	'narrator': {
		name: '',
		color: '#ffffff',
		type_animation: false
	}
});

// ============================================================
// Script
// ============================================================
monogatari.script ({
	'Start': [
		'show scene park_outside with fadeIn',
		'show notification Welcome',

		'narrator 조선, 박씨가문의 별당. 달빛이 기와 위로 흘러내리는 밤이었다.',

		'show character seol normal at center with fadeIn',
		'seol 오늘이야... 약속한 날이야.',

		'seol 이 달빛 아래서, 나는 반드시 돌아올 거야.',

		'show character seol worried',
		'narrator 원랑은 하늘을 올려다보았다. 구름 사이로 달빛이 희미하게 비치고 있었다.',

		{
			'Choice': {
				'Dialog': 'seol 너도 같이 올래?',
				'Yes': {
					'Text': '함께 가자',
					'Do': 'jump Together'
				},
				'No': {
					'Text': '혼자 가야 해',
					'Do': 'jump Alone'
				}
			}
		}
	],

	'Together': [
		'show character seol smile',
		'seol 고마워. 혼자 가는 것보다 훨씬 좋아.',

		'show scene dark_alley with fadeIn',
		'narrator 두 사람은 달빛을 따라 골목으로 들어섰다.',

		'show character seol serious',
		'seol 이 골목 너머에, 오래된 사당이 있어. 거기서 맹약을 하면 된대.',

		'show character mugyeom normal at left with fadeIn',
		'mugyeom 잠깐. 누구 거기야?',

		'show character seol surprised',
		'seol ...!',

		'show character mugyeom angry',
		'mugyeom 이 시간에 웬 사람이 골목을 돌아다니는 거지?',

		'show character seol expressionless',
		'seol 나는... 박씨가문 사람이에요.',

		'show character mugyeom surprised',
		'mugyeom 박씨가문?',

		'narrator 무겸의 눈빛이 변했다. 경계심 대신 호기심이 스쳐 지나갔다.',

		'show character mugyeom normal',
		'mugyeom 흥미로운데. 나도 사당에 가는 길이야. 같이 가지.',

		'end'
	],

	'Alone': [
		'show character seol bitter',
		'seol 알겠어... 하지만 괜찮아. 나 혼자도 할 수 있어.',

		'show scene dark_alley with fadeIn',
		'narrator 원랑은 씁쓸하게 웃으며 골목으로 향했다.',

		'show character seol sad',
		'seol 걱정 마. 반드시 돌아올 테니까.',

		'show character seol normal',
		'narrator 그녀의 발소리가 점점 멀어져 갔다.',

		'show character sadang normal at center with fadeIn',
		'sadang 어머, 이 시간에 혼자 돌아다니는 건 위험해요.',

		'show character seol surprised',
		'seol 누구세요?',

		'show character sadang soft_smile',
		'sadang 나는 사담이라고 해요. 당신을 도와드릴 수 있을 것 같은데요.',

		'narrator 밤바람이 속삭였다 — 마치 달이 무언가를 말하는 것 같았다.',

		'end'
	]
});
