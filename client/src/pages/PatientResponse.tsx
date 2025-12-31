import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Navbar from '@/components/Navbar';
import Visualisation from '@/components/Visualisation';
import { Button } from '@/components/ui/button';
import { getPatientDataByNHI, getPatientDataWithoutNHI, updateResponseToActioned } from '@/apiService';
import { formatDateOfBirth, formatSubmissionTime } from '@/utils/dateUtils';

interface PatientData {
  actioned: boolean;
  dateofbirth: string;
  first_name: string;
  last_name: string;
  nhi: string;
  response: { 
    additionalInformation: string,
    furtherInfo: {
      writtenFormats: string[],
      otherFormats: string,
    },
    medicineSelection: {
      medicineSelections: boolean[],
      specificMedicines: string,
    },
    response: { id: number, response: string }[], 
  };
  submission_time: string;
}

const PatientResponse: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<PatientData | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { state } = useLocation();
  const { NHI, firstName, lastName, DOB } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let result;

        if (NHI) {
          result = await getPatientDataByNHI(NHI);
        } else {
          result = await getPatientDataWithoutNHI(firstName, lastName, DOB);
        }
        
        setData(result);
      } catch (error) {
        setError('Our services are down right now. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [state]);

  const updateActioned = async (
    nhi: string,
    first_name: string,
    last_name: string,
    dateofbirth: string,
    actioned: boolean,
  ) => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }
  
      const params = nhi
        ? { nhi, actioned }
        : { first_name, last_name, dateofbirth, actioned };
      
      await updateResponseToActioned(params); 
  
      if (data) {
        const updatedData: PatientData = {
          ...data,
          actioned: actioned,
        };
        setData(updatedData);
      }
    } catch (err) {
      console.error("Error updating actioned status", err);
    }
  };
  

  if (loading) return <div><Navbar theme='light' isLoggedIn={true}/></div>;

  if (error) {
    return (
      <div className="bg-secondary-110 min-h-full">
        <Navbar theme="dark" isLoggedIn={true}/>
        <MaxWidthWrapper>
          <h2 className="text-h2 font-semibold text-center text-destructive bg-bg-red rounded-lg py-2 px-4">{error}</h2>
        </MaxWidthWrapper>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-secondary-110 min-h-full">
        <Navbar theme="dark" isLoggedIn={true}/>
        <MaxWidthWrapper>
          <h2 className="text-h2 font-semibold text-center text-destructive bg-bg-red rounded-lg py-2 px-4">No data available</h2>
        </MaxWidthWrapper>
      </div>
    );
  }

  return (
    <div>
      <Navbar theme='light' isLoggedIn={true} className="z-10"/>
      <MaxWidthWrapper className="relative overflow-hidden">
        <div className="flex flex-wrap items-center">
          <Button type="button" variant="link" className="sm:pl-2 sm:pr-5 px-2 h-6 sm:h-10 text-sm sm:text-p flex gap-1" onClick={() => navigate('/portal')}><ChevronLeft className="h-3 w-3 sm:h-4 sm:w-6"/>Back</Button>
          {!data.actioned && <Button type="button" className="px-2 sm:px-5 h-6 sm:h-8 text-mobile-sm sm:text-p text-wrap" onClick={() => {updateActioned( data.nhi, data.first_name, data.last_name, data.dateofbirth, !data.actioned )}}>Mark as actioned</Button>}
        </div>
        <br/>
        <Visualisation
          actioned={data.actioned}
          firstName={data.first_name}
          lastName={data.last_name}
          NHI={data.nhi}
          dateOfBirth={formatDateOfBirth(data.dateofbirth)}
          submissionTime={formatSubmissionTime(data.submission_time)}
          responses={data.response}
          />
      </MaxWidthWrapper>
    </div>
  );
};

export default PatientResponse;
