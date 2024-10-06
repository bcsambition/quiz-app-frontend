import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: tests, isLoading, error } = useQuery({
    queryKey: ['tests'],
    queryFn: async () => {
      const response = await fetch('https://d1e6a0dc-df57-4153-a3cf-c21adae61f96-00-2zdfsm20qt7wz.sisko.replit.dev/tests', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch tests');
      return response.json();
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Tests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tests.map((test) => (
          <div key={test._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{test.title}</h2>
            <p>Type: {test.type}</p>
            <Button 
              onClick={() => navigate(`/test/${test._id}`)} 
              className="mt-2"
            >
              Start Test
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
