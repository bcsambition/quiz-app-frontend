import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";

const AdminDashboard = () => {
  const { data: finalTests, isLoading, error } = useQuery({
    queryKey: ['finalTests'],
    queryFn: async () => {
      const response = await fetch('https://d1e6a0dc-df57-4153-a3cf-c21adae61f96-00-2zdfsm20qt7wz.sisko.replit.dev/admin/final-tests', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      });
      if (!response.ok) throw new Error('Failed to fetch final tests');
      return response.json();
    },
  });

  const handleDownloadMarks = async (testId) => {
    try {
      const response = await fetch(`https://d1e6a0dc-df57-4153-a3cf-c21adae61f96-00-2zdfsm20qt7wz.sisko.replit.dev/admin/final-tests/${testId}/marks`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` },
      });
      if (!response.ok) throw new Error('Failed to download marks');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `marks_${testId}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading marks:', error);
      // Handle error (show message to user)
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-xl font-semibold mb-2">Final Tests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {finalTests.map((test) => (
          <div key={test._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{test.title}</h3>
            <Button 
              onClick={() => handleDownloadMarks(test._id)} 
              className="mt-2"
            >
              Download Marks
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
