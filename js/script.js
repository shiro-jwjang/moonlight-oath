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
		body: `
			<p>클릭하거나 엔터 키를 눌러 대화를 진행하세요.</p>
			<p>빠른 메뉴에서 저장/불러오기, 설정 등을 이용할 수 있습니다.</p>
		`
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

// --- Particles ---
monogatari.action ('particles').particles ({});

// --- Canvas ---
monogatari.action ('canvas').objects ({});

// --- Credits ---
monogatari.configuration ('credits', {

});

// --- Gallery ---
monogatari.assets ('gallery', {

});

// --- Music ---
monogatari.assets ('music', {

});

// --- Voices ---
monogatari.assets ('voices', {

});

// --- Sounds ---
monogatari.assets ('sounds', {

});

// --- Videos ---
monogatari.assets ('videos', {

});

// --- Images ---
monogatari.assets ('images', {

});

// --- Scenes (Backgrounds) ---
monogatari.assets ('scenes', {

});

// ============================================================
// Characters
// ============================================================
monogatari.characters ({
	'seol': {
		name: '설',
		color: '#a8d8ea'
	},
	'moon': {
		name: '달',
		color: '#f0e6ff'
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
		'show scene #1a1a2e with fadeIn',
		'show notification Welcome',

		'narrator 달이 뜨는 밤, 조용한 산골 마을에 한 여인이 서 있었다.',

		'seol 오늘이야... 약속한 날이야.',

		'narrator 설은 하늘을 올려다보았다. 구름 사이로 달빛이 희미하게 비치고 있었다.',

		'seol 이 달빛 아래서, 나는 반드시 돌아올 거야.',

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
		'seol 고마워. 혼자 가는 것보다 훨씬 좋아.',
		'narrator 두 사람은 달빛을 따라 숲으로 들어섰다. 나뭇잎 사이로 반짝이는 빛이 길을 안내했다.',
		'seol 이 숲 너머에, 오래된 사당이 있어. 거기서 맹약을 하면 된대.',
		'narrator 설의 목소리에는 긴장과 기대가 섞여 있었다.',
		'seol 준비됐어? 가자.',
		'end'
	],

	'Alone': [
		'seol 알겠어... 하지만 괜찮아. 나 혼자도 할 수 있어.',
		'narrator 설은 씁쓸하게 웃으며 숲으로 향했다. 그녀의 등 뒤로 달빛이 그림자를 길게 늘어뜨렸다.',
		'seol 걱정 마. 반드시 돌아올 테니까.',
		'narrator 그녀의 발소리가 점점 멀어져 갔다. 밤바람이 속삭였다 — 마치 달이 무언가를 말하는 것 같았다.',
		'end'
	]
});
