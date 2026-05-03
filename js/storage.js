/* global monogatari */

// Persistent Storage Variable
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
