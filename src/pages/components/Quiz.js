import {useContext} from "react";
import {QuizContext} from "../context/quiz";
import Question from "./Question";
import { Link } from "react-router-dom";

const Quiz = () => {
	const [quizState, dispatch] = useContext(QuizContext);
	return(
		<div className="quiz">
			{quizState.showResults && (
				<div className = "results">
					<div className = "congratulations">Congratulations!</div>
					<div className = "results-info">
						<div> You have completed the quiz</div>
						<div 
							className= "next-button" 
							onClick={() => dispatch({type: "RESTART"})}
						>
							Restart
						</div>
						<Link
							className= "view-results-link"
							to = "/results"
						>
							View your recommendations
						</Link>
					</div>
				</div>

			)}
			{!quizState.showResults && (
				<div>
					<div className="score">
						Question {quizState.currentQuestionIndex + 1} / 
						{quizState.questions.length}
					</div>
					<Question />
					<div 
						className="next-button" 
					 	onClick={() => dispatch({type: 'NEXT_QUESTION'})}
					>
					 	Next question
					</div>
				</div>
			)}
		</div>
	);
};

export default Quiz;
