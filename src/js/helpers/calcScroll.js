export default function calcScroll() {
	let div = document.createElement('div');

	div.style.width = '100px';
	div.style.height = '100px';
	div.style.overflowY = 'scroll';
	div.style.visibility = 'hidden';

	document.body.appendChild(div);
	let scrollWidth = div.offsetWidth - div.clientWidth;

	div.remove();

	return scrollWidth;
}
