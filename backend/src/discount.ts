function discount(initialValue: number, discountInPercent: number) {
	return initialValue * ((100 - discountInPercent) / 100)
}

console.log(discount(100, 10))