const timer = (id, minutes) => {
	const getTimeRemaining = (endtime) => {
		const time = endtime - Date.parse(new Date()),
			seconds = Math.floor((time / 1000) % 60),
			minutes = Math.floor((time / 1000 / 60) % 60);

		return {
			total: time,
			minutes: minutes,
			seconds: seconds,
		};
	};

	const addZero = (num) => {
		if (num <= 9) {
			return '0' + num;
		} else {
			return num;
		}
	};

	const setClock = (selector, endTime) => {
		const timer = document.querySelector(selector),
			minutesElement = timer.querySelector('#minutes'),
			secondsElement = timer.querySelector('#seconds'),
			timeInterval = setInterval(updateClock, 1000);

		function updateClock() {
			const t = getTimeRemaining(endTime);

			minutesElement.textContent = addZero(t.minutes);
			secondsElement.textContent = addZero(t.seconds);

			if (t.total <= 0) {
				minutesElement.textContent = '00';
				secondsElement.textContent = '00';

				clearInterval(timeInterval);
			}
		}

		updateClock();
	};

	const currentTime = new Date();
	const endTime = currentTime.getTime() + minutes * 60 * 1000;

	setClock(id, endTime);
};

export default timer;
