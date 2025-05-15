import React, { useState } from 'react';
import './App.css';
import { surveyTitle, questions } from './index';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [finishedEarly, setFinishedEarly] = useState(false);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleMultipleChoice = (option) => {
    const prev = answers[currentQuestion] || [];
    let updated;
    if (prev.includes(option)) {
      updated = prev.filter((o) => o !== option);
    } else {
      updated = [...prev, option];
    }
    handleAnswer(updated);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const finishSurvey = (save = true) => {
    setIsFinished(true);
    setFinishedEarly(!save);
    if (save) {
      // Збереження відповідей у файл
      const blob = new Blob([
        questions.map((q, i) => `${q.text}\nВідповідь: ${Array.isArray(answers[i]) ? answers[i].join(', ') : (answers[i] ?? '')}`).join('\n\n')
      ], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'survey-results.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const handleEarlyFinish = () => {
    if (window.confirm('Ви дійсно бажаєте завершити опитування без збереження відповідей? Всі введені дані буде втрачено.')) {
      finishSurvey(false);
    }
  };

  const renderInput = (q, idx) => {
    switch (q.type) {
      case 'text':
        return (
          <input
            type="text"
            onChange={(e) => handleAnswer(e.target.value)}
            value={answers[idx] || ''}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            min={q.validation?.min}
            max={q.validation?.max}
            onChange={(e) => handleAnswer(e.target.value)}
            value={answers[idx] || ''}
          />
        );
      case 'single-choice':
        return (
          <div>
            {q.options.map((opt) => (
              <label key={opt}>
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={opt}
                  checked={answers[idx] === opt}
                  onChange={() => handleAnswer(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        );
      case 'multiple-choice':
        return (
          <div>
            {q.options.map((opt) => (
              <label key={opt}>
                <input
                  type="checkbox"
                  value={opt}
                  checked={answers[idx]?.includes(opt)}
                  onChange={() => handleMultipleChoice(opt)}
                />
                {opt}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <h1>{surveyTitle}</h1>
      {isFinished ? (
        <div style={{textAlign: 'center'}}>
          <h2>
            {finishedEarly
              ? 'Ви завершили опитування без збереження відповідей.'
              : 'Дякуємо за проходження опитування! Ваші відповіді збережено у файл survey-results.txt.'}
          </h2>
          {!finishedEarly && (
            <div className="results" style={{marginTop: 32, textAlign: 'left'}}>
              <h3 style={{textAlign: 'center', color: '#3182ce'}}>Ваші відповіді:</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                {questions.map((q, i) => (
                  <li key={q.id} className="result-item">
                    <strong>{q.text}</strong><br/>
                    <span style={{color: '#374151'}}>
                      {Array.isArray(answers[i])
                        ? (answers[i].length > 0 ? answers[i].join(', ') : <em>—</em>)
                        : (answers[i] ?? <em>—</em>)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button style={{marginTop: 32, background: '#3182ce'}} onClick={() => {
            setIsFinished(false);
            setFinishedEarly(false);
            setAnswers([]);
            setCurrentQuestion(0);
          }}>
            Пройти опитування ще раз
          </button>
        </div>
      ) : (
        <>
          <div className="question-container">
            <h2>{questions[currentQuestion].text}</h2>
            {renderInput(questions[currentQuestion], currentQuestion)}
          </div>
          <div className="progress-container">
            <div className="progress-text">
              Питання {currentQuestion + 1} з {questions.length}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="navigation">
            <button onClick={prevQuestion} disabled={currentQuestion === 0}>
              Назад
            </button>
            {currentQuestion === questions.length - 1 ? (
              <button onClick={() => finishSurvey(true)} style={{background: '#28a745', width: '100%'}}>
                Завершити
              </button>
            ) : (
              <>
                <button onClick={nextQuestion}>
                  Далі
                </button>
                <button onClick={handleEarlyFinish} style={{background: '#6c757d', marginLeft: 8}}>
                  Завершити
                </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;