'use strict';
/* global Monogatari */
/* global monogatari */

/**
 * =============================================================================
 * This is the file where you should put all your custom JavaScript code,
 * depending on what you want to do, there are 3 different places in this file
 * where you can add code.
 *
 * 1. Outside the $_ready function: At this point, the page may not be fully
 *    loaded yet, however you can interact with Monogatari to register new
 *    actions, components, labels, characters, etc.
 *
 * 2. Inside the $_ready function: At this point, the page has been loaded, and
 *    you can now interact with the HTML elements on it.
 *
 * 3. Inside the init function: At this point, Monogatari has been initialized,
 *    the event listeners for its inner workings have been registered, assets
 *    have been preloaded (if enabled) and your game is ready to be played.
 *
 * You should always keep the $_ready function as the last thing on this file.
 * =============================================================================
**/

const { $_ready, $_ } = Monogatari;

// 1. Outside the $_ready function:


$_ready (() => {
	// 2. Inside the $_ready function:

	monogatari.init ('#monogatari').then (() => {
		// 3. Inside the init function:
		const engine = customElements.get ('game-screen').engine;

		// [워크어라운드] 배포 환경에서 storage.js의 monogatari.storage() 호출이
		// init 이후에 평가되어 storageStructure에 flags가 포함되지 않는 문제 대응.
		// 로컬에서는 정상 동작하나 배포(GitHub Pages)에서만 타이밍 이슈 발생.
		if (!engine.storage ('flags')) {
			const defaultFlags = {
				glass_bead: false,
				astronomical_record: false,
				incense_pouch: false,
				nothing_taken: false,
				ceremony_choice: '',
				ch1_investigation: ''
			};
			engine.storage ({ flags: defaultFlags });
			const raw = engine.global ('storageStructure');
			if (raw) {
				const s = JSON.parse (raw);
				s.flags = defaultFlags;
				engine.global ('storageStructure', JSON.stringify (s));
			}
			console.log ('[Moonlight Oath] flags injected into storage (deployment workaround)');
		}


		// [워크어라운드] Monogatari.js 2.x delegated click handler가
		// shouldProceed() → isVisible() 체크에서 silent reject되는 이슈 대응
		// 키보드 단축키(right/space)는 engine.proceed()를 직접 호출하므로 정상 동작.
		// 마우스 클릭만 수동으로 engine.proceed()를 호출.
		const gameScreen = document.querySelector ('[data-screen="game"]');

		/**
		 * game-screen이 현재 보이고 상호작용 가능한지 확인.
		 * 엔진의 shouldProceed() 내부 isVisible() 체크를 사전에 수행하여
		 * 불필요한 reject 로그를 줄임.
		 */
		function isGameScreenReady () {
			if (!gameScreen) return false;
			const style = window.getComputedStyle (gameScreen);
			if (style.display === 'none') return false;
			if (gameScreen.offsetWidth === 0 || gameScreen.offsetHeight === 0) return false;
			// 엔진 내부 block 플래그 확인 (wait, video modal 등)
			if (engine.global ('block')) return false;
			if (engine.global ('_engine_block') && !engine.global ('_executing_sub_action')) return false;
			return true;
		}

		gameScreen.addEventListener ('click', (e) => {
			// 선택지/액션 버튼 클릭은 엔진이 직접 처리하므로 무시
			if (e.target.closest ('[data-choice]') ||
				e.target.closest ('[data-action]') ||
				e.target.closest ('button')) {
				return;
			}

			// 게임 화면이 보이지 않으면 무시 (메인 메뉴, 로딩 등)
			if (!isGameScreenReady ()) {
				return;
			}

			engine.proceed ({userInitiated: true, skip: false, autoPlay: false})
				.catch ((err) => {
					// shouldProceed() reject 이유를 경고로 출력하여 디버깅 가능하게 함
					if (err) {
						console.warn ('[Moonlight Oath] Proceed prevented:', err);
					}
				});
		});

		// [워크어라운드] 씬 전환 시 이전 캐릭터 자동 제거
		// Monogatari.js는 show scene 시 캐릭터 스프라이트를 자동으로 지우지 않음.
		// 매 씬 전환 시 화면에 남아있는 캐릭터를 모두 hide.
		const origRun = engine.run.bind (engine);
		engine.run = function (statement, advance = true) {
			if (typeof statement === 'string' && /^\s*show scene\s/i.test (statement)) {
				const visible = document.querySelectorAll (
					'[data-screen="game"] [data-character]:not([data-visibility="invisible"])'
				);
				if (visible.length > 0) {
					visible.forEach (el => el.remove ());
					engine.state ({ characters: [] });
					console.log (`[Moonlight Oath] Auto-hid ${visible.length} character(s) on scene change`);
				}
			}
			if (typeof statement === 'function') {
				const result = statement (engine);
				engine.global ('block', false);
				if (advance && result !== false) {
					engine.next ();
				}
				return Promise.resolve (result);
			}
			return origRun (statement, advance);
		};
	});
});
