import 'inputmask/dist/inputmask.min.js';

window.addEventListener('DOMContentLoaded', () => {
	const phoneInputs = document.querySelectorAll('input[data-tel-input]');

	if (phoneInputs.length) {
		Inputmask({ mask: '+7 (999) 999-99-99' }).mask(phoneInputs);
	}
});
