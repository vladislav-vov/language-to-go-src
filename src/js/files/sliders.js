import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

window.addEventListener('DOMContentLoaded', () => {
	function updateSliderState(slider, sliderSelector) {
		const currentSlidesPerView = slider.params.slidesPerView;
		const sliderEl = document.querySelector(`${sliderSelector}.slider`);

		if (slider.slides.length <= currentSlidesPerView) {
			slider.loop = false;
			slider.pagination.enabled = false;
			slider.pagination.clickable = false;
			slider.pagination.el.style.display = 'none';
			sliderEl.classList.remove('slider--pb-60');
			sliderEl.classList.add('slider--pb-0');
		} else {
			slider.pagination.el.style.display = 'flex';
			sliderEl.classList.remove('slider--pb-0');
			sliderEl.classList.add('slider--pb-60');
		}
	}

	function initSlider({
		sliderSelector,
		paginationSelector,
		breakpoints = {},
		loop = false,
	}) {
		if (document.querySelector(sliderSelector)) {
			new Swiper(sliderSelector, {
				modules: [Pagination],
				spaceBetween: 40,
				slidesPerView: 1,
				loop,
				pagination: {
					el: paginationSelector,
					enabled: true,
					clickable: true,
				},
				breakpoints,
				on: {
					init: function (slider) {
						updateSliderState(slider, sliderSelector);
					},
					resize: function (slider) {
						updateSliderState(slider, sliderSelector);
					},
				},
			});
		}
	}

	initSlider({
		sliderSelector: '.courses__slider',
		paginationSelector: '.courses__slider-pagination',
		breakpoints: {
			660: {
				spaceBetween: 25,
				slidesPerView: 2,
			},
			992: {
				slidesPerView: 3,
			},
		},
	});
	initSlider({
		sliderSelector: '.reviews__slider',
		paginationSelector: '.reviews__slider-pagination',
		loop: true,
	});
});
