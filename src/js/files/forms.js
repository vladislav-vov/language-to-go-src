import { goToBlock } from './goToBlock.js';

function setHeight(textarea, height) {
	textarea.style.height = `${height}px`;
}

export function formFieldsInit(
	options = { viewPass: false, autoHeight: false }
) {
	document.body.addEventListener('focusin', function (e) {
		const targetElement = e.target;
		if (
			targetElement.tagName === 'INPUT' ||
			targetElement.tagName === 'TEXTAREA'
		) {
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.add('_form-focus');
				targetElement.parentElement.classList.add('_form-focus');
			}
			formValidate.removeError(targetElement);
			targetElement.hasAttribute('data-validate')
				? formValidate.removeError(targetElement)
				: null;
		}
	});

	document.body.addEventListener('focusout', function (e) {
		const targetElement = e.target;
		if (
			targetElement.tagName === 'INPUT' ||
			targetElement.tagName === 'TEXTAREA'
		) {
			if (!targetElement.hasAttribute('data-no-focus-classes')) {
				targetElement.classList.remove('_form-focus');
				targetElement.parentElement.classList.remove('_form-focus');
			}

			targetElement.hasAttribute('data-validate')
				? formValidate.validateInput(targetElement)
				: null;
		}
	});

	if (options.autoHeight) {
		const textareas = document.querySelectorAll('textarea[data-autoHeight]');
		if (textareas.length) {
			textareas.forEach((textarea) => {
				const startHeight = textarea.hasAttribute('data-autoHeight-min')
					? Number(textarea.dataset.autoheightMin)
					: Number(textarea.offsetHeight);
				const maxHeight = textarea.hasAttribute('data-autoHeight-max')
					? Number(textarea.dataset.autoheightMax)
					: Infinity;
				setHeight(textarea, Math.min(startHeight, maxHeight));
				textarea.addEventListener('input', () => {
					if (textarea.scrollHeight > startHeight) {
						textarea.style.height = `auto`;
						setHeight(
							textarea,
							Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight)
						);
					}
				});
			});
		}
	}
}

export let formValidate = {
	getErrors(form) {
		let error = 0;
		let formRequiredItems = form.querySelectorAll('*[data-required]');
		if (formRequiredItems.length) {
			formRequiredItems.forEach((formRequiredItem) => {
				if (
					(formRequiredItem.offsetParent !== null ||
						formRequiredItem.tagName === 'SELECT') &&
					!formRequiredItem.disabled
				) {
					error += this.validateInput(formRequiredItem);
				}
			});
		}
		return error;
	},
	validateInput(formRequiredItem) {
		let error = 0;
		if (formRequiredItem.dataset.required === 'email') {
			formRequiredItem.value = formRequiredItem.value.replace(' ', '');
			if (this.emailTest(formRequiredItem)) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === 'name') {
			formRequiredItem.value = formRequiredItem.value.replace(' ', '');

			if (formRequiredItem.value.length < 2) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (formRequiredItem.dataset.required === 'phone') {
			formRequiredItem.value = formRequiredItem.value.replace(' ', '');

			if (formRequiredItem.value.replace('_', '').length < 18) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		} else if (
			formRequiredItem.type === 'checkbox' &&
			!formRequiredItem.checked
		) {
			this.addError(formRequiredItem);
			error++;
		} else {
			if (!formRequiredItem.value.trim()) {
				this.addError(formRequiredItem);
				error++;
			} else {
				this.removeError(formRequiredItem);
			}
		}
		return error;
	},
	addError(formRequiredItem) {
		formRequiredItem.classList.add('_form-error');
		formRequiredItem.parentElement.classList.add('_form-error');
		let inputError =
			formRequiredItem.parentElement.querySelector('.form-error');
		if (inputError) formRequiredItem.parentElement.removeChild(inputError);
		if (formRequiredItem.dataset.error) {
			formRequiredItem.parentElement.insertAdjacentHTML(
				'beforeend',
				`<div class="form-error">${formRequiredItem.dataset.error}</div>`
			);
		}
	},
	removeError(formRequiredItem) {
		formRequiredItem.classList.remove('_form-error');
		formRequiredItem.parentElement.classList.remove('_form-error');
		if (formRequiredItem.parentElement.querySelector('.form-error')) {
			formRequiredItem.parentElement.removeChild(
				formRequiredItem.parentElement.querySelector('.form-error')
			);
		}
	},
	formClean(form) {
		form.reset();
		setTimeout(() => {
			let inputs = form.querySelectorAll('input,textarea');
			for (let index = 0; index < inputs.length; index++) {
				const el = inputs[index];
				el.parentElement.classList.remove('_form-focus');
				el.classList.remove('_form-focus');
				formValidate.removeError(el);
			}
			let checkboxes = form.querySelectorAll('.checkbox__input');
			if (checkboxes.length > 0) {
				for (let index = 0; index < checkboxes.length; index++) {
					const checkbox = checkboxes[index];
					checkbox.checked = false;
				}
			}
		}, 0);
	},
	emailTest(formRequiredItem) {
		//eslint-disable-next-line
		return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(
			formRequiredItem.value
		);
	},
};

export function formSubmit() {
	const forms = document.forms;
	if (forms.length) {
		for (const form of forms) {
			form.addEventListener('submit', function (e) {
				const form = e.target;
				formSubmitAction(form, e);
			});
			form.addEventListener('reset', function (e) {
				const form = e.target;
				formValidate.formClean(form);
			});
		}
	}

	async function formSubmitAction(form, e) {
		const error = !form.hasAttribute('data-no-validate')
			? formValidate.getErrors(form)
			: 0;
		if (error === 0) {
			const ajax = form.hasAttribute('data-ajax');
			if (ajax) {
				e.preventDefault();
				const formAction = form.getAttribute('action')
					? form.getAttribute('action').trim()
					: '#';
				const formMethod = form.getAttribute('method')
					? form.getAttribute('method').trim()
					: 'GET';
				const formData = new FormData(form);

				form.classList.add('_sending');
				const response = await fetch(formAction, {
					method: formMethod,
					body: formData,
				});
				if (response.ok) {
					let responseResult = await response.json();
					form.classList.remove('_sending');
					formSent(form, responseResult);
				} else {
					form.classList.remove('_sending');
				}
			} else if (form.hasAttribute('data-dev')) {
				e.preventDefault();
				formSent(form);
			}
		} else {
			e.preventDefault();
			if (
				form.querySelector('._form-error') &&
				form.hasAttribute('data-goto-error')
			) {
				const formGoToErrorClass = form.dataset.gotoError
					? form.dataset.gotoError
					: '._form-error';
				goToBlock(formGoToErrorClass, true, 1000);
			}
		}
	}

	function formSent(form, responseResult = ``) {
		formValidate.formClean(form);

		console.log('Dev send');
	}
}
