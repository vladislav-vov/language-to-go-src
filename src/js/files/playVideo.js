import calcScroll from '../helpers/calcScroll.js';

class VideoPlayer {
	constructor({ triggers, popupSelector, closeSelector, activeClass }) {
		this.btns = document.querySelectorAll(triggers);
		this.popup = document.querySelector(popupSelector);
		if (this.popup) {
			this.close = this.popup.querySelector(closeSelector);
		}
		this.activeClass = activeClass;
		this.scroll = calcScroll();
	}

	bindTriggers() {
		this.btns.forEach((btn, i) => {
			btn.addEventListener('click', () => {
				document.body.style.overflow = 'hidden';
				document.body.style.marginRight = `${this.scroll}px`;

				this.popup.classList.add(this.activeClass);

				if (document.querySelector('iframe#frame')) {
					if (this.path !== btn.getAttribute('data-url')) {
						this.path = btn.getAttribute('data-url');
						this.player.loadVideoById({
							videoId: this.path,
							startSeconds: this.savedTime,
						});
					}
				} else {
					this.path = btn.getAttribute('data-url');
					this.createPlayer(this.path);
				}
			});
		});
	}

	bindClose() {
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				this.closeVideo();
			}
		});

		if (this.close) {
			this.close.addEventListener('click', () => {
				this.closeVideo();
			});
		}
	}

	closeVideo() {
		document.body.style.overflow = 'auto';
		document.body.style.marginRight = `0px`;

		this.popup.classList.remove(this.activeClass);

		if (
			this.player.getPlayerState &&
			this.player.getPlayerState() === YT.PlayerState.PLAYING
		) {
			this.savedTime = this.player.getCurrentTime();
			this.player.pauseVideo();
		}
	}

	createPlayer(url) {
		const spinner = document.createElement('div');
		spinner.classList.add('spinner');
		this.popup.querySelector('.popup__video').appendChild(spinner);

		this.player = new YT.Player('frame', {
			width: '100%',
			height: '100%',
			videoId: `${url}`,
			events: {
				onReady: this.onPlayerReady.bind(this),
			},
		});
	}

	onPlayerReady() {
		const spinner = this.popup.querySelector('.spinner');

		if (spinner) {
			spinner.remove();
		}
	}

	init() {
		if (this.btns.length > 0) {
			const tag = document.createElement('script');

			tag.src = 'https://www.youtube.com/iframe_api';
			const firstScriptTag = document.getElementsByTagName('script')[0];
			firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

			try {
				this.bindTriggers();
				this.bindClose();
			} catch (e) {}
		}
	}
}

export default VideoPlayer;
