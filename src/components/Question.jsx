import { useState, useEffect } from 'react'
import Answer from "./Answer"

export default function Question(props) {
    const [answers, setAnswers] = useState(initializeAnswers())

    function initializeAnswers() {
        let allAnswers = []
        let answerArr = props.incorrectAnswers
        if (!answerArr.includes(props.correctAnswer)) {
            answerArr.push(props.correctAnswer)
        }
        shuffle(answerArr)

        for (let i = 0; i < answerArr.length; i++) {
            allAnswers.push({
                data: answerArr[i],
                isSelected: false,
                isCorrect: (answerArr[i] == props.correctAnswer ? true : false)
            })
        }

        return allAnswers
    }

    const answerElement = answers.map(answer => {
        return (
            <Answer
                key={Math.random()}
                questionIndex={props.index}
                data={decode(answer.data)}
                isSelected={answer.isSelected}
                isCorrect={answer.isCorrect}
                selectAnswer={selectAnswer}
            />
        )
    })

    function selectAnswer(e) {
        let selectedQuestionIndex = e.target.getAttribute("data-question-index")
        let selectedValue = e.target.getAttribute("value")
        let selectedIsCorrect = (e.target.getAttribute("data-is-correct") === 'true')

        props.changeAnswerStatus(selectedQuestionIndex, selectedIsCorrect)

        setAnswers(prevAnswers => prevAnswers.map(prevAnswer => {
            const isSelected = (selectedValue == decode(prevAnswer.data) ? !prevAnswer.isSelected : false)
            
            return {
                ...prevAnswer,
                isSelected: isSelected
            }
        }))
    }

    function shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }

        return array
    }

    function decode(str) {
        let txt = new DOMParser().parseFromString(str, "text/html")
        return txt.documentElement.textContent
    }

    return (
        <div className={`Question question-color-${(props.index) % 5}`}>
            <div className="question-text">{decode(props.question)}</div>
            <div className="choices">
                {answerElement}
            </div>
        </div>
    )
}