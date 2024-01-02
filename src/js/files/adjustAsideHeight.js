import { toRem } from '../helpers/unitsConversion.js';

window.addEventListener('DOMContentLoaded', () => {
	const aside = document.querySelector('.page__aside-content');

	if (!aside) return;

	const tablet = 991.98;

	function adjustAsideHeight() {
		const viewportHeight = window.innerHeight;
		const updatedHeight = viewportHeight - aside.getBoundingClientRect().top;

		if (aside.getBoundingClientRect().bottom >= viewportHeight) {
			aside.style.height = toRem(updatedHeight);
		} else {
			aside.style.height = `auto`;
		}
	}

	function resize() {
		if (window.innerWidth >= tablet) {
			adjustAsideHeight();
		} else if (window.innerWidth <= tablet) {
			aside.style.height = `auto`;
		}
	}

	window.addEventListener('resize', resize);
	window.addEventListener('scroll', resize);

	window.addEventListener('unload', () => {
		window.removeEventListener('resize', resize);
		window.removeEventListener('scroll', resize);
	});
});
