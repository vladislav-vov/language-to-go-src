import './libs/dynamicAdapt.js';

import { isWebp } from './helpers/isWebp.js';
import { menuInit } from './files/menu.js';
import './files/spollers.js';
import './files/sliders.js';
import './files/login.js';
import './files/adjustAsideHeight.js';
import './files/phoneValidate.js';
import { formFieldsInit, formSubmit } from './files/forms.js';
import VideoPlayer from './files/playVideo.js';
import CookieConsent from './files/cookieConsent.js';

import '../scss/style.scss';

window.addEventListener('DOMContentLoaded', () => {
	isWebp();
	menuInit();

	formFieldsInit({ autoHeight: true });
	formSubmit();

	try {
		new VideoPlayer({
			triggers: '.hero__play',
			popupSelector: '.popup',
			closeSelector: '.popup__close',
			activeClass: 'popup--open',
		}).init();
	} catch (e) {}

	try {
		new CookieConsent({
			popupSelector: '.cookie-popup',
			activePopupClass: 'cookie-popup--active',
		}).init();
	} catch (e) {}
});
