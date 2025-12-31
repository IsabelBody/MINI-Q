import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { getPrivacyStatement, updatePrivacyStatement } from '../apiService';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyStatementEditor: React.FC = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); 
  const isAdminStatus = localStorage.getItem("isAdmin") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrivacyStatement = async () => {
      try {
        const response = await getPrivacyStatement();
        setContent(response.content);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching privacy statement:', error);
      }
    };
    fetchPrivacyStatement();
  }, []);

  const handleSave = async () => {
    setSuccess(null);
    setError(null); 

    try {
      await updatePrivacyStatement({ content }, isAdminStatus);
      setSuccess('Privacy statement updated successfully!');
    } catch (error) {
      console.error('Error saving privacy statement:', error);
      setError('There was an issue saving the privacy statement.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-secondary-110 min-h-full">
      <Navbar theme="dark" isLoggedIn={true} className="z-10"/>
      <div className="p-8 pb-0 max-w-screen-lg mx-auto">
        <Button
          type="button"
          variant="link"
          className="sm:pl-2 sm:pr-5 px-2 flex gap-1 h-6 sm:h-10 text-sm sm:text-h5 text-white"
          onClick={() => navigate('/portal')}
        >
          <ChevronLeft className="h-3 w-3 sm:h-5 sm:w-6" />
          Back to portal
        </Button>
        <h1 className="text-mobile-h2 sm:text-h1 font-semibold text-white text-center pt-4 sm:pt-2">
          Edit Privacy Statement
        </h1>
      </div>
      <MaxWidthWrapper className="xs:max-w-screen-lg space-y-4">
        <p className='text-white text-mobile-p sm:text-h6'>Note: Any changes made will take effect immediately after saving and will be visible to everyone who uses the questionnaire.</p>
        <div className="bg-secondary-5 p-6 sm:p-10 rounded-lg">
          <div className="flex justify-center mb-4">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="w-full bg-white text-black p-5 rounded-lg"
              style={{
                maxHeight: '400px',  
                overflowY: 'auto',  
              }}
              modules={editorModules}
              formats={editorFormats}
            />
          </div>
          {success && (
            <div className="flex justify-center text-success font-semibold bg-bg-green/50 text-mobile-p sm:text-h5 p-2 gap-2 rounded-sm">
              {success}
            </div>
          )}

          {error && (
            <div className="flex justify-center text-destructive font-semibold bg-bg-red/50 text-mobile-p sm:text-h5 p-2 gap-2 rounded-sm">
              <TriangleAlert className="h-4 w-4 sm:h-6 sm:w-6" />
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <Button
              onClick={handleSave}
              className="text-mobile-h6 sm:text-h5 mt-4 sm:mt-6 bg-secondary hover:bg-secondary/80 rounded-lg w-32 sm:w-56"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
};

const editorModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
  ],
};

const editorFormats = [ // can add more styling 
  'bold',
  'italic',
  'underline',
];

export default PrivacyStatementEditor;
