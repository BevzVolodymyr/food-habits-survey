import React from 'react';

const Question = ({ 
  question, 
  answer, 
  onAnswerChange, 
  onOptionSelect 
}) => {
  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return (
          <textarea
            className="form-control"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            rows={4}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            className="form-control"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            min={question.validation?.min}
            max={question.validation?.max}
          />
        );
      case 'single-choice':
        return (
          <div className="options-container">
            {question.options.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={`question-${question.id}`}
                  id={`option-${question.id}-${index}`}
                  checked={answer === option}
                  onChange={() => onOptionSelect(option)}
                />
                <label 
                  className="form-check-label" 
                  htmlFor={`option-${question.id}-${index}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      case 'multiple-choice':
        return (
          <div className="options-container">
            {question.options.map((option, index) => (
              <div key={index} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`option-${question.id}-${index}`}
                  checked={answer.includes(option)}
                  onChange={() => onOptionSelect(option)}
                />
                <label 
                  className="form-check-label" 
                  htmlFor={`option-${question.id}-${index}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="question-container">
      <h3>{question.text}</h3>
      <div className="answer-container">
        {renderInput()}
      </div>
    </div>
  );
};

export default Question;