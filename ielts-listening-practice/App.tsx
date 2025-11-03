
import React, { useState, useCallback, useMemo } from 'react';
import { FeedbackStatus } from './types';
import { CORRECT_ANSWERS, SCRIPT } from './constants';

// --- Helper Components (defined outside App to prevent re-creation on re-renders) ---

interface QuestionProps {
  number: number;
  textBefore: React.ReactNode;
  textAfter?: React.ReactNode;
  value: string;
  feedback: FeedbackStatus;
  showAnswer: boolean;
  correctAnswer: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Question: React.FC<QuestionProps> = ({ number, textBefore, textAfter, value, feedback, showAnswer, correctAnswer, onChange }) => {
  const feedbackClass = useMemo(() => {
    if (showAnswer || feedback === 'correct') return 'border-green-500 focus:ring-green-500 focus:border-green-500 bg-green-50';
    if (feedback === 'incorrect') return 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50';
    return 'border-gray-300 focus:ring-teal-500 focus:border-teal-500';
  }, [feedback, showAnswer]);

  return (
    <li className="flex flex-wrap items-center gap-2 sm:gap-3 py-3">
      <span className="text-gray-700 leading-relaxed">• {textBefore}</span>
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-7 h-7 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow">
          {number}
        </div>
        <input
          type="text"
          className={`block w-40 sm:w-48 px-3 py-2 border rounded-md shadow-sm transition-colors duration-200 ${feedbackClass}`}
          value={showAnswer ? correctAnswer : value}
          onChange={onChange}
          disabled={showAnswer}
          aria-label={`Answer for question ${number}`}
        />
      </div>
      {textAfter && <span className="text-gray-700 leading-relaxed">{textAfter}</span>}
    </li>
  );
};

// --- Main App Component ---

export default function App() {
  const [userAnswers, setUserAnswers] = useState<string[]>(Array(10).fill(''));
  const [feedback, setFeedback] = useState<FeedbackStatus[]>(Array(10).fill(null));
  const [showAnswers, setShowAnswers] = useState<boolean>(false);
  const [showScript, setShowScript] = useState<boolean>(false);
  const [score, setScore] = useState<number | null>(null);

  const handleInputChange = useCallback((index: number, value: string) => {
    setUserAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[index] = value;
      return newAnswers;
    });
    setFeedback(prev => {
        const newFeedback = [...prev];
        newFeedback[index] = null;
        return newFeedback;
    });
    setScore(null);
  }, []);

  const handleCheckAnswers = useCallback(() => {
    setShowAnswers(false);
    let correctCount = 0;
    const newFeedback = userAnswers.map((answer, index) => {
      if (answer.trim().toLowerCase() === CORRECT_ANSWERS[index]) {
        correctCount++;
        return 'correct';
      }
      return 'incorrect';
    });
    setFeedback(newFeedback);
    setScore(correctCount);
  }, [userAnswers]);

  const handleShowAnswers = useCallback(() => {
    setShowAnswers(true);
    setScore(null);
    setFeedback(Array(10).fill(null));
  }, []);

  const handleReset = useCallback(() => {
    setUserAnswers(Array(10).fill(''));
    setFeedback(Array(10).fill(null));
    setShowAnswers(false);
    setShowScript(false);
    setScore(null);
  }, []);

  return (
    <div className="min-h-screen font-sans text-slate-800 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <main className="w-full max-w-4xl mx-auto">
        <header className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-teal-700">IELTS Listening Practice</h1>
          <p className="text-slate-600 mt-2">Part 1: Public Library Information</p>
        </header>

        <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
          <div className="mb-6">
            <iframe
              className="rounded-lg"
              width="100%"
              height="300"
              scrolling="no"
              frameBorder="no"
              allow="autoplay"
              src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2205205271&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
            ></iframe>
            <div style={{
              fontSize: '10px',
              color: '#cccccc',
              lineBreak: 'anywhere',
              wordBreak: 'normal',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontFamily: 'Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif',
              fontWeight: '100'
            }}>
              <a href="https://soundcloud.com/date-with-destiny-524621842" title="Date With Destiny" target="_blank" rel="noopener noreferrer" style={{color: '#cccccc', textDecoration: 'none'}}>Date With Destiny</a> · <a href="https://soundcloud.com/date-with-destiny-524621842/download" title="download" target="_blank" rel="noopener noreferrer" style={{color: '#cccccc', textDecoration: 'none'}}>download</a>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">Write <span className="font-bold text-red-600">ONE WORD ONLY</span> for each answer.</h2>
            <p className="text-gray-700">
                <span className="font-bold underline">Example:</span> The library re-opened last __<span className="font-semibold text-teal-600">month</span>__.
            </p>
            
            <ul className="divide-y divide-gray-200">
              <Question number={1} textBefore="an expanded section for books on" value={userAnswers[0]} feedback={feedback[0]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[0]} onChange={(e) => handleInputChange(0, e.target.value)} />
              <Question number={2} textBefore="a new section on local" value={userAnswers[1]} feedback={feedback[1]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[1]} onChange={(e) => handleInputChange(1, e.target.value)} />
              <Question number={3} textBefore="a community room for meetings (also possible to" value={userAnswers[2]} feedback={feedback[2]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[2]} onChange={(e) => handleInputChange(2, e.target.value)} textAfter="there)" />
              <Question number={4} textBefore="a new section of books for" value={userAnswers[3]} feedback={feedback[3]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[3]} onChange={(e) => handleInputChange(3, e.target.value)} />
            </ul>
            
            <h3 className="font-bold text-teal-700 pt-4">For younger children</h3>
             <ul className="divide-y divide-gray-200">
              <Question number={5} textBefore="the next Science Club meeting: experiments using things from your" value={userAnswers[4]} feedback={feedback[4]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[4]} onChange={(e) => handleInputChange(4, e.target.value)} />
            </ul>

            <h3 className="font-bold text-teal-700 pt-4">For adults</h3>
             <ul className="divide-y divide-gray-200">
              <Question number={6} textBefore="this Friday: a local author talks about a novel based on a real" value={userAnswers[5]} feedback={feedback[5]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[5]} onChange={(e) => handleInputChange(5, e.target.value)} />
              <Question number={7} textBefore="IT support is available on Tuesdays - no" value={userAnswers[6]} feedback={feedback[6]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[6]} onChange={(e) => handleInputChange(6, e.target.value)} textAfter="is necessary" />
              <Question number={8} textBefore="free check of blood" value={userAnswers[7]} feedback={feedback[7]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[7]} onChange={(e) => handleInputChange(7, e.target.value)} textAfter="and cholesterol levels (over 60s only)" />
            </ul>

            <h3 className="font-bold text-teal-700 pt-4">Other information</h3>
            <ul className="divide-y divide-gray-200">
              <Question number={9} textBefore="the library shop sells wall-charts, cards and" value={userAnswers[8]} feedback={feedback[8]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[8]} onChange={(e) => handleInputChange(8, e.target.value)} />
              <Question number={10} textBefore="evenings and weekends: free" value={userAnswers[9]} feedback={feedback[9]} showAnswer={showAnswers} correctAnswer={CORRECT_ANSWERS[9]} onChange={(e) => handleInputChange(9, e.target.value)} textAfter="is available" />
            </ul>
          </div>
        </div>

        {score !== null && (
          <div className="mt-6 p-4 bg-white rounded-xl shadow-md text-center">
            <p className="text-xl font-semibold">Your Score: <span className="text-teal-600">{score} / 10</span></p>
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 sticky bottom-4">
          <button onClick={handleCheckAnswers} className="w-full sm:w-auto text-white bg-teal-600 hover:bg-teal-700 focus:ring-4 focus:ring-teal-300 font-medium rounded-full text-md px-8 py-3 transition-all duration-200 shadow-lg">Check Answers</button>
          <button onClick={handleShowAnswers} className="w-full sm:w-auto text-teal-700 bg-white border border-teal-600 hover:bg-teal-50 focus:ring-4 focus:ring-teal-200 font-medium rounded-full text-md px-8 py-3 transition-all duration-200 shadow-lg">Show Answers</button>
          <button onClick={handleReset} className="w-full sm:w-auto text-gray-600 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-md px-8 py-3 transition-all duration-200 shadow-lg">Reset</button>
        </div>

        <div className="mt-8">
            <button onClick={() => setShowScript(!showScript)} className="w-full text-left text-lg font-semibold text-gray-700 p-4 bg-white rounded-lg shadow-md flex justify-between items-center hover:bg-gray-50 transition">
              <span>{showScript ? 'Hide' : 'Show'} Full Script</span>
              <svg className={`w-6 h-6 transform transition-transform ${showScript ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {showScript && (
              <div className="mt-2 p-6 bg-white rounded-lg shadow-md prose max-w-none text-gray-800 whitespace-pre-wrap">
                {SCRIPT}
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
