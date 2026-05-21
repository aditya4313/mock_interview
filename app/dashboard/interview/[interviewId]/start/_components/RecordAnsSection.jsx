"use client";

import Webcam from 'react-webcam';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react';
import { toast } from 'sonner';

function RecordAnsSection({ mockinterviewquestion, activequestionindex, interviewdata }) {
  const [useranswer, setuseranswer] = useState('');
  const [loading, setloading] = useState(false);
  const [saved, setSaved] = useState(false);
  const useranswerRef = useRef('');
  const savingRef = useRef(false);

  const {
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    if (results.length > 0) {
      const transcript = results[results.length - 1].transcript;
      setuseranswer(transcript);
      useranswerRef.current = transcript;
    }
  }, [results]);

  useEffect(() => {
    setuseranswer('');
    useranswerRef.current = '';
    setSaved(false);
    savingRef.current = false;
    setResults([]);
  }, [activequestionindex, setResults]);

  const saveUserAnswer = async (answerText) => {
    const trimmed = answerText?.trim();
    if (!trimmed || trimmed.length <= 10) {
      toast.error('Answer is too short. Please record at least a few sentences.');
      return;
    }

    const question = mockinterviewquestion?.[activequestionindex];
    const mockId = interviewdata?.mockId;

    if (!question || !mockId) {
      toast.error('Interview data is still loading. Please wait.');
      return;
    }

    if (savingRef.current) return;
    savingRef.current = true;
    setloading(true);

    try {
      const res = await fetch('/api/user-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mockIdRef: mockId,
          question: question.question,
          correctAns: question.answer,
          userAns: trimmed,
          questionIndex: activequestionindex,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Failed to save your answer.');
        return;
      }

      setSaved(true);
      toast.success(
        data.updated
          ? 'Answer updated successfully'
          : 'Answer saved successfully'
      );
      setResults([]);
    } catch (error) {
      console.error('Error saving user answer:', error);
      toast.error('Error while saving your answer. Please try again.');
    } finally {
      savingRef.current = false;
      setloading(false);
    }
  };

  useEffect(() => {
    if (isRecording) return;

    const indexAtStop = activequestionindex;
    const timer = setTimeout(() => {
      if (indexAtStop !== activequestionindex) return;
      const ans = useranswerRef.current;
      if (ans.trim().length > 10 && !savingRef.current) {
        saveUserAnswer(ans);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [isRecording, activequestionindex]);

  const StartStopRecording = () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      setuseranswer('');
      useranswerRef.current = '';
      setSaved(false);
      savingRef.current = false;
      startSpeechToText();
    }
  };

  const currentQuestion = mockinterviewquestion?.[activequestionindex];

  return (
    <div className='flex flex-col items-center justify-center my-20'>
      <div className='relative bg-black rounded-lg p-5'>
        <Image src='/webcam.png' width={200} height={200} className='absolute' alt="" />
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
          <span className="text-red-600 flex items-center space-x-2">
            <Mic className="w-6 h-6" />
            <span>Stop Recording...</span>
          </span>
        ) : (
          'Record Answer'
        )}
      </Button>

      {useranswer.length > 0 && (
        <div className="w-full max-w-lg p-4 border rounded-lg bg-secondary/50 text-sm">
          <p className="font-semibold mb-1">Your answer {saved ? '(saved)' : ''}:</p>
          <p className="text-muted-foreground">{useranswer}</p>
        </div>
      )}

      {loading && (
        <p className="text-sm text-primary mt-2">Saving answer and generating feedback...</p>
      )}

      {!loading && saved && currentQuestion && (
        <p className="text-sm text-green-600 mt-2">
          Saved for: Question #{activequestionindex + 1}
        </p>
      )}
    </div>
  );
}

export default RecordAnsSection;
