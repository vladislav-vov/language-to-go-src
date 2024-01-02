import timer from './timer.js';

window.addEventListener('DOMContentLoaded', () => {
	if (document.querySelector('.login-form-code__timer')) {
		timer('.login-form-code__timer', 1);
	}

	const codeInputs = document.querySelectorAll('.login-form-code__input');
	const codeForm = document.querySelector('.login-form-code');

	if (!(codeForm && codeInputs)) return;

	codeForm.addEventListener('input', function (event) {
		const target = event.target;

		if (
			event.inputType !== 'deleteContentBackward' &&
			target.tagName === 'INPUT' &&
			target.type === 'number'
		) {
			const index = Array.from(codeInputs).indexOf(target);
			const nextField = codeInputs[index + 1];

			if (target.value.length > 1) {
				target.value = target.value.slice(0, 1);
			}

			if (nextField) {
				nextField.focus();
			}
		}
	});

	codeForm.addEventListener('keydown', function (event) {
		const target = event.target;

		if (
			event.key === 'Backspace' &&
			target.tagName === 'INPUT' &&
			target.type === 'number'
		) {
			if (target.value) {
				target.value = '';
			} else {
				const index = Array.from(codeInputs).indexOf(target);
				const prevField = codeInputs[index - 1];

				if (prevField) {
					prevField.focus();
				}
			}
		}
	});
});
