const Answer = ({answerText, onSelectAnswer, currentAnswer}) => {
	const isAnswerSelected = answerText === currentAnswer;
	const selectedClass = isAnswerSelected ? "selected-answer": "answer";
	return (
		<div className= {selectedClass} onClick={() => onSelectAnswer(answerText)}>
			<div className="answer-text">{answerText}</div>
		</div>

	);
};

export default Answer;