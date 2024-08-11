import { createContext, useReducer } from "react";
import questions from "../data";
import { getAnswers } from "../helpers";

const initialState = {
	questions,
	currentQuestionIndex: 0,
	showResults: false,
	answers: getAnswers(questions[0]),
	currentAnswer: "",
	totalAnswers: [],
};

const reducer = (state, action) => {
	switch (action.type){
	case "SELECT_ANSWER": {
			if(state.totalAnswers.length === 0){
				state.totalAnswers = [action.payload];
			}
			if(state.totalAnswers.length === state.currentQuestionIndex ){
				state.totalAnswers = [...state.totalAnswers, action.payload];
			}
			if(state.totalAnswers.length === state.currentQuestionIndex + 1){
				state.totalAnswers[state.currentQuestionIndex] = action.payload
			}
			return {
				...state,
				currentAnswer: action.payload,
			};
	}
		case "NEXT_QUESTION": {
			const showResults = 
			 state.currentQuestionIndex === state.questions.length - 1;
			const currentQuestionIndex = showResults
			 ? state.currentQuestionIndex
			 : state.currentQuestionIndex + 1;
			const answers = showResults
			 ? [] 
			 : getAnswers(state.questions[currentQuestionIndex]);
			if(state.totalAnswers.length === state.currentQuestionIndex){
				state.totalAnswers = [...state.totalAnswers, " "]
			}
			window.sessionStorage.setItem("totalAnswers", state.totalAnswers);
			return {
				...state,
				currentQuestionIndex,
				showResults,
				answers,
				currentAnswer: "",
			};
		}
		case "RESTART":{
			return initialState;
		}
		default:
			return state;
	}
};

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
	const value = useReducer(reducer, initialState);
	return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>; 

};