import React, { useEffect, useState } from 'react';
import { getAllResponses } from '../apiService';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Navbar from '@/components/Navbar';
import ResponsesTable from '@/components/Portal/ResponsesTable';
import { columns } from '@/components/Portal/columns';
import { Toaster } from "@/components/ui/toaster";

const Portal: React.FC = () => {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResponses = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const fetchedResponses = await getAllResponses(token);
          if (JSON.stringify(fetchedResponses) !== JSON.stringify(responses)) {
            setResponses(fetchedResponses);
          }
        } catch (error) {
          console.error('Error fetching responses:', error);
          setError('Failed to fetch patient responses. Please try again later.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('You are not logged in. Please log in to access this page.');
      }
    };

    fetchResponses()

    const interval = setInterval(fetchResponses, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-secondary-110 min-h-full">
        <Navbar theme="dark" isLoggedIn={true} />
        <MaxWidthWrapper>
          <h2 className="text-mobile-h2 sm:text-h2 font-semibold text-white">Loading patient responses...</h2>
        </MaxWidthWrapper>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-secondary-110 min-h-full">
        <Navbar theme="dark" isLoggedIn={true} />
        <MaxWidthWrapper>
          <h2 className="text-mobile-h2 sm:text-h2 font-semibold text-center text-destructive bg-bg-red rounded-lg py-2 px-4">{error}</h2>
        </MaxWidthWrapper>
      </div>
    );
  }

  return (
    <div className="bg-secondary-110 min-h-full overflow-hidden">
      <Navbar theme="dark" isLoggedIn={true} className="z-10"/>
      <MaxWidthWrapper className="flex flex-col gap-4">
        <h2 className="text-mobile-h2 sm:text-h1 text-white font-semibold">Patient Responses</h2>
        <ResponsesTable columns={columns} data={responses} />
        <Toaster />
      </MaxWidthWrapper>
    </div>
  );
};

export default Portal;
