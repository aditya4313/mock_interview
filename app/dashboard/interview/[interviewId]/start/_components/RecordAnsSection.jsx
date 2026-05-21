"use client"

import Webcam from 'react-webcam';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';
import { chatSession } from '@/utils/GeminiAI';
import { db } from '@/utils/db';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { UserAnswer } from '@/utils/schema';

function RecordAnsSection({ mockinterviewquestion, activequestionindex, interviewdata }) {
  const [useranswer, setuseranswer] = useState('');
  const { user } = useUser();
  const [loading, setloading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      setuseranswer(results[results.length - 1].transcript);
    }
  }, [results]);

  useEffect(() => {
    if (!isRecording && useranswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [isRecording, useranswer]);
  
  
  
  useEffect(() => {
    // Reset useranswer when a new question is selected
    setuseranswer('');
  }, [activequestionindex]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setuseranswer(''); // Reset useranswer when recording starts
      startSpeechToText();
    }
  };

  const UpdateUserAnswer = async () => {
    setloading(true);

    const feedbackPrompt = `Question: ${mockinterviewquestion[activequestionindex]?.question}, User Answer: ${useranswer}, Depending on the question and user answer for the given interview question, please give us a rating for the answer and feedback as areas of improvement if any, in just 3 to 5 lines to improve it in JSON format with rating and feedback fields.`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockjsonResp = (await result.response.text()).replace('```json', '').replace('```', '');
      
      console.log(mockjsonResp);

      const jsonfeedbackresp = JSON.parse(mockjsonResp);

      const resp = await db.insert(UserAnswer).values({
        mockIdRef: interviewdata.mockId,
        question: mockinterviewquestion[activequestionindex].question,
        correctAns: mockinterviewquestion[activequestionindex].answer,
        userAns: useranswer,
        feedback: jsonfeedbackresp.feedback,
        rating: jsonfeedbackresp.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-YYYY'),
      });

      if (resp) {
        toast.success('User Answer recorded successfully');
        setResults([]);
      }
    } catch (error) {
      console.error('Error during UpdateUserAnswer:', error);
      toast.error('Error while saving your answer, please try again');
    } finally {
      setResults([]);
      setloading(false);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center my-20'>
      <div className='relative bg-black rounded-lg p-5'>
        <Image src='/webcam.png' width={200} height={200} className='absolute' />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>

      <Button 
        disabled={loading}
        variant="outline" 
        className='my-10'
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex items-center space-x-2 border-black">
          <Mic className="w-6 h-6" /> {/* Adjust size as needed */}
          <span>Stop Recording...</span>
        </h2> ) : (
          'Record Answer'
        )}
      </Button>
    
      <Button className="mt-2" onClick={() => console.log(useranswer)}>Show User Answer</Button>
    </div>
  );
}

export default RecordAnsSection;
