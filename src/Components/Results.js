import React from 'react';

const Results = ({ questions, answers, onRestart }) => {
  const downloadResults = () => {
    const surveyData = {
      title: "Опитування про звички харчування",
      date: new Date().toLocaleString(),
      questions: questions.map((q, index) => ({
        question: q.text,
        answer: answers[index] || 'Немає відповіді'
      }))
    };

    const dataStr = JSON.stringify(surveyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `food_habits_survey_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div className="results-container">
      <h2>Дякуємо за участь в опитуванні!</h2>
      <div className="results">
        <h3>Результати:</h3>
        {questions.map((question, index) => (
          <div key={question.id} className="result-item">
            <p><strong>{question.text}</strong></p>
            <p>→ {answers[index] || 'Немає відповіді'}</p>
          </div>
        ))}
      </div>
      <div className="results-actions">
        <button 
          className="btn btn-primary"
          onClick={downloadResults}
        >
          Завантажити результати
        </button>
        <button 
          className="btn btn-secondary restart-btn"
          onClick={onRestart}
        >
          Пройти опитування ще раз
        </button>
      </div>
    </div>
  );
};

export default Results;