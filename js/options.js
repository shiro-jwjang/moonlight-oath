/**
 * =======================================
 * Engine Settings
 *
 * 월영의 맹약 (Moonlight Oath)
 * =======================================
 **/

'use strict';
/* global Monogatari */

const monogatari  = Monogatari.default;

monogatari.settings({

	// Game Name
	'Name': '월영의 맹약',

	// Version
	'Version': '0.1.0',

	// Initial Label
	'Label': 'Start',

	// Number of AutoSave Slots
	'Slots': 10,

	// Multi-language support
	'MultiLanguage': false,

	// Language Selection Screen
	'LanguageSelectionScreen': false,

	// Main Menu Music
	'MainScreenMusic': '',

	// Save labels
	'SaveLabel': 'Save',
	'AutoSaveLabel': 'AutoSave',

	// Show Main Menu
	'ShowMainScreen': true,

	// Asset Preloading
	'Preload': true,

	// Auto-save interval (minutes). 0 = Off
	'AutoSave': 0,

	// Service Workers
	'ServiceWorkers': false,

	// Aspect Ratio — 16:9 고정 (Visuals 영역만)
	'AspectRatio': '16:9',
	'ForceAspectRatio': 'Visuals',

	// Text animation
	'TypeAnimation': true,
	'InstantText': true,
	'NVLTypeAnimation': true,
	'NarratorTypeAnimation': true,
	'CenteredTypeAnimation': true,

	// Orientation — 가로모드 강제
	'Orientation': 'landscape-primary',

	// Skip speed (ms). 0 = disabled
	'Skip': 0,

	// Asset directories
	'AssetsPath': {
		'root': 'assets',
		'characters': 'characters',
		'icons': 'icons',
		'images': 'images',
		'music': 'music',
		'scenes': 'scenes',
		'sounds': 'sounds',
		'ui': 'ui',
		'videos': 'videos',
		'voices': 'voices',
		'gallery': 'gallery'
	},

	// Splash Screen Label
	'SplashScreenLabel': '',

	// Storage engine
	'Storage': {
		'Adapter': 'LocalStorage',
		'Store': 'GameData',
		'Endpoint': ''
	},

	// Rollback
	'AllowRollback': true,

	// Experimental features
	'ExperimentalFeatures': false
});

// Initial Player Preferences
monogatari.preferences ({
	'Language': 'English',
	'Volume': {
		'Music': 1,
		'Voice': 1,
		'Sound': 1,
		'Video': 1
	},
	'Resolution': '800x600',
	'TextSpeed': 20,
	'AutoPlaySpeed': 5
});
