/* global monogatari */

// Persistent Storage Variable
// $_ready 콜백 내에서 정의하여 엔진 초기화 타이밍 보장
Monogatari.$_ready (() => {
	monogatari.storage ({
		player: {
			name: ''
		},
		game: {
			chapter: 1,
			oath_taken: false
		},
		flags: {
			glass_bead: false,
			astronomical_record: false,
			incense_pouch: false,
			nothing_taken: false,
			ceremony_choice: '',
			ch1_investigation: ''
		}
	});
});
