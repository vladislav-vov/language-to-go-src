class CookieConsent {
	constructor({ popupSelector, activePopupClass = '' } = {}) {
		this.popup = document.querySelector(popupSelector);
		this.btnClose = this.popup.querySelector('[data-close]');
		this.activePopupClass = activePopupClass;
		this.consentPropertyType = 'hideCookiePopup';
	}

	getItem(key) {
		const cookies = document.cookie
			.split(';')
			.map((cookie) => cookie.split('='))
			.reduce((acc, [key, value]) => ({ ...acc, [key.trim()]: value }), {});

		return cookies[key];
	}

	setItem(key, value) {
		document.cookie = `${key}=${value};expires=Sun, 12 Jul 2025 19:56:01 GMT`;
	}

	hasConsented() {
		return this.getItem(this.consentPropertyType) === 'true' ? true : false;
	}

	bindTriggers() {
		this.btnClose.addEventListener('click', () => {
			this.setItem(this.consentPropertyType, true);
			this.popup.classList.remove(this.activePopupClass);
		});
	}

	init() {
		this.bindTriggers();

		try {
			if (!this.hasConsented()) {
				this.popup.classList.add(this.activePopupClass);
			}

			myScripts();
		} catch (e) {
			console.error(e.message);
		}
	}
}

function myScripts() {
	console.log('Loading cookies...');
}

export default CookieConsent;
