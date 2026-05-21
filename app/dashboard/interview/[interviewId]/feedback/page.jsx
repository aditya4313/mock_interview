"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const [feedbacklist, setFeedbacklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    GetFeedback();
  }, []);

  const GetFeedback = async () => {
    try {
      const res = await fetch(
        `/api/user-answer?mockIdRef=${encodeURIComponent(params.interviewId)}`
      );
      const json = await res.json();

      if (!res.ok) {
        setError(json.error || 'Failed to load feedback');
        return;
      }

      setFeedbacklist(json.data || []);
    } catch (err) {
      console.error("Error fetching feedback:", err);
      setError('Failed to load feedback');
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    feedbacklist.length > 0
      ? (
          feedbacklist.reduce((sum, item) => {
            const n = parseFloat(String(item.rating).replace(/[^\d.]/g, ''));
            return sum + (Number.isFinite(n) ? n : 0);
          }, 0) / feedbacklist.length
        ).toFixed(1)
      : null;

  return (
    <div className="p-10">
      <h2 className="text-3xl font-bold text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your Interview Data</h2>

      {loading ? (
        <p className="mt-4 text-gray-500">Loading your answers...</p>
      ) : error ? (
        <p className="mt-4 text-red-500">{error}</p>
      ) : feedbacklist?.length === 0 ? (
        <h2 className="font-bold text-xl text-gray-500 mt-4">
          No Interview data Found. Record answers during the interview first.
        </h2>
      ) : (
        <>
          {averageRating && (
            <h2 className="text-primary text-lg my-3">
              Your overall Interview Rating:{" "}
              <strong>{averageRating}/10</strong>
            </h2>
          )}
          <h2 className="text-sm text-gray-500">
            Find below interview questions with correct answers, your answers,
            and feedback for improvement.
          </h2>

          {feedbacklist.map((item, index) => (
            <Collapsible key={item.id ?? index} className="mt-7">
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg my-2 text-left flex justify-between gap-7 w-full">
                {item.question}
                <ChevronsUpDown className="h-5 w-5 shrink-0" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2">
                  <h2 className="text-red-500 p-2 border rounded-lg">
                    <strong>Rating:</strong> {item.rating}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                    <strong>Your Answer:</strong> {item.userAns || '—'}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                    <strong>Correct Answer:</strong> {item.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-primary">
                    <strong>Feedback:</strong> {item.feedback}
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}
      <Button className="mt-3" onClick={() => router.replace('/dashboard')}>
        Go Home
      </Button>
    </div>
  );
}

export default Feedback;
