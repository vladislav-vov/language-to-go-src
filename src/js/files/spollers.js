import { _slideToggle, _slideUp } from '../helpers/smoothAnimationHelpers.js';

(function () {
	const spollersArray = document.querySelectorAll('[data-spollers]');

	if (spollersArray.length > 0) {
		const spollersRegular = Array.from(spollersArray).filter(
			(item) => !item.dataset.spollers.split(',')[0]
		);

		if (spollersRegular.length > 0) {
			initSpollers(spollersRegular);
		}

		const spollersMedia = Array.from(spollersArray).filter(
			(item) => item.dataset.spollers.split(',')[0]
		);

		if (spollersMedia.length > 0) {
			const breakpointsArray = [];

			spollersMedia.forEach((item) => {
				const params = item.dataset.spollers;
				const paramsArray = params.split(',');

				breakpointsArray.push({
					value: paramsArray[0],
					type: paramsArray[1] ? paramsArray[1].trim() : 'max',
					item,
				});
			});

			let mediaQueries = breakpointsArray.map(
				(item) =>
					'(' +
					item.type +
					'-width: ' +
					item.value +
					'px),' +
					item.value +
					',' +
					item.type
			);

			mediaQueries = mediaQueries.filter(
				(item, i, arr) => arr.indexOf(item) == i
			);

			mediaQueries.forEach((breakpoint) => {
				const [mediaQuery, mediaBreakpoint, mediaType] = breakpoint.split(',');
				const matchMedia = window.matchMedia(mediaQuery);

				const spollersArray = breakpointsArray.filter(
					(item) => item.value === mediaBreakpoint && item.type === mediaType
				);

				matchMedia.addListener(() => {
					initSpollers(spollersArray, matchMedia);
				});

				initSpollers(spollersArray, matchMedia);
			});
		}
	}

	function initSpollers(spollersArray, matchMedia = false) {
		spollersArray.forEach((spollersBlock) => {
			spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;

			if (matchMedia.matches || !matchMedia) {
				spollersBlock.classList.add('_spoller-init');
				initSpollerBody(spollersBlock);
				spollersBlock.addEventListener('click', setSpollerAction);
			} else {
				spollersBlock.classList.remove('_spoller-init');
				initSpollerBody(spollersBlock, false);
				spollersBlock.removeEventListener('click', setSpollerAction);
			}
		});
	}

	function initSpollerBody(spollersBlock, hideSpollerBody = true) {
		const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');

		if (spollerTitles.length > 0) {
			spollerTitles.forEach((spollerTitle) => {
				if (hideSpollerBody) {
					spollerTitle.removeAttribute('tabindex');
					if (!spollerTitle.classList.contains('_spoller-active')) {
						spollerTitle.nextElementSibling.hidden = true;
					}
				} else {
					spollerTitle.removeAttribute('tabindex', '-1');
					spollerTitle.nextElementSibling.hidden = false;
				}
			});
		}
	}

	function setSpollerAction(e) {
		const target = e.target;

		if (
			target.hasAttribute('data-spoller') ||
			target.closest('[data-spoller]')
		) {
			const spollerTitle = target.hasAttribute('data-spoller')
				? target
				: target.closest('[data-spoller]');
			const isParentNode = spollerTitle.dataset.spoller === 'parent';
			const spollersBlock = spollerTitle.closest('[data-spollers]');
			const oneSpoller = spollersBlock.hasAttribute('data-one-spollers');

			if (!spollersBlock.querySelectorAll('._slide').length) {
				if (oneSpoller && !spollerTitle.classList.contains('_spoller-active')) {
					hideSpollersBody(spollersBlock);
				}

				isParentNode
					? spollerTitle.parentNode.classList.toggle('_spoller-active')
					: spollerTitle.classList.toggle('_spoller-active');
				_slideToggle(spollerTitle.nextElementSibling, 400);
			}

			e.preventDefault();
		}
	}

	function hideSpollersBody(spollersBlock) {
		const spollerActiveTitle = spollersBlock.querySelector(
			'[data-spoller]._active'
		);

		if (spollerActiveTitle) {
			spollerActiveTitle.classList.remove('_spoller-active');
			_slideUp(spollerActiveTitle.nextElementSibling, 400);
		}
	}
})();
