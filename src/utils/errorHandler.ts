import env from "../config/env";

const handleError = (error: unknown): string => {
	const message = error instanceof Error ? error.message : String(error);

	if (env.NODE_ENV === 'production') {
		console.error(error);
		return 'Server error. Please try again later.';
	}

	return message;
};

export default handleError;
