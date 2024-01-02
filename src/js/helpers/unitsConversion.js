export function toEm(pxValue) {
	const baseFontSize = 16;
	return `${pxValue / baseFontSize}em`;
}

export function toRem(pxValue) {
	const baseFontSize = 16;
	return `${pxValue / baseFontSize}rem`;
}
