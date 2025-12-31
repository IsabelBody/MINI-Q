import React, { useEffect, useState } from 'react';
import { getPrivacyStatement } from '../../apiService'; 

interface PrivacyStatementProps {
  handleFontSize: (defaultFontSize: string) => string;
}

const PrivacyStatement: React.FC<PrivacyStatementProps> = ({ handleFontSize }) => {
  const [content, setContent] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrivacyStatement = async () => {
      try {
        const response = await getPrivacyStatement(); 
        setContent(response.content); 
        setLoading(false);
      } catch (error) {
        console.error('Error fetching privacy statement:', error);
        setError('Failed to load the privacy statement.');
        setLoading(false);
      }
    };
    fetchPrivacyStatement();
  }, []);

  if (loading) {
    return <div className='h-10'>Loading privacy statement...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-3">
      <div className={`max-w-none text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("p")}`} dangerouslySetInnerHTML={{ __html: content || '' }}></div>
    </div>
  );
};

export default PrivacyStatement;
