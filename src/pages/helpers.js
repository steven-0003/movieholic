export const getAnswers = (question) => {
	return question.dataAnswers.map((dataAnswer) => (
			{dataAnswer}
		));
};

