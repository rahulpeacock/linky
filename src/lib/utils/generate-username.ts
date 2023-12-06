export const genetateUserName = (userName: string): string => {
	const val = userName
		.split(' ')
		.map((val) => val[0])
		.join()
		.replaceAll(',', '')
		.toUpperCase();
	return val.length < 2 ? val : val.substring(0, 2);
};
