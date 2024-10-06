import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Test = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});

  const { data: test, isLoading, error } = useQuery({
    queryKey: ['test', testId],
    queryFn: async () => {
      const response = await fetch(`https://d1e6a0dc-df57-4153-a3cf-c21adae61f96-00-2zdfsm20qt7wz.sisko.replit.dev/tests/${testId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch test');
      return response.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (answers) => {
      const response = await fetch(`https://d1e6a0dc-df57-4153-a3cf-c21adae61f96-00-2zdfsm20qt7wz.sisko.replit.dev/tests/${testId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) throw new Error('Failed to submit test');
      return response.json();
    },
    onSuccess: (data) => {
      // Handle successful submission (e.g., show score for practice test)
      if (test.type === 'practice') {
        alert(`Your score: ${data.score}`);
      }
      navigate('/dashboard');
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSubmit = () => {
    submitMutation.mutate(answers);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{test.title}</h1>
      {test.questions.map((question, index) => (
        <div key={index} className="mb-6">
          <p className="font-semibold mb-2">{question.text}</p>
          <RadioGroup
            onValueChange={(value) => setAnswers({ ...answers, [index]: value })}
            value={answers[index]}
          >
            {question.options.map((option, optionIndex) => (
              <div className="flex items-center space-x-2" key={optionIndex}>
                <RadioGroupItem value={option} id={`q${index}-option${optionIndex}`} />
                <Label htmlFor={`q${index}-option${optionIndex}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      ))}
      <Button onClick={handleSubmit} disabled={submitMutation.isLoading}>
        {submitMutation.isLoading ? 'Submitting...' : 'Submit Test'}
      </Button>
    </div>
  );
};

export default Test;
