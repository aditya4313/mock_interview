import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function Questionsection({ mockinterviewquestion, activequestionindex }) {
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, your browser does not support Text to Speech');
    }
  };

  return (
    mockinterviewquestion && (
      <div className="p-5 border rounded-lg mt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.isArray(mockinterviewquestion) &&
            mockinterviewquestion.map((question, index) => (
              <h2
              className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${
                activequestionindex === index ? 'bg-blue-900 text-white' : ''
              }`}
              key={index}
              onClick={() => handleQuestionClick(index)}
            >
              Question #{index + 1}
            </h2>
            ))}
        </div>
        {mockinterviewquestion[activequestionindex] && (
          <>
            <h2 className="my-5 text-md md:text-lg">
              {mockinterviewquestion[activequestionindex].question}
            </h2>

            <Volume2
              className="cursor-pointer"
              onClick={() =>
                textToSpeech(
                  mockinterviewquestion[activequestionindex].question
                )
              }
              aria-label="Read question aloud"
            />

            <div className="border rounded-lg p-5 bg-blue-100 mt-20">
              <h2 className="flex gap-2 items-center text-blue-700">
                <Lightbulb />
                <strong>Note:</strong>
              </h2>
              <h2 className="text-sm text-primary my-2">
                Click on Record Answer when you want to answer the question. At
                the end of the interview, we will give you feedback along with
                the correct answer for each question and your answer to compare
                it.
              </h2>
            </div>
          </>
        )}
      </div>
    )
  );
}

export default Questionsection;
