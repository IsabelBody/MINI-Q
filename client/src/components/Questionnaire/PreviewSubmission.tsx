import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { questions, QuestionType } from '../../algorithm.ts'

type PreviewSubmissionData = {
    firstName: string
    lastName: string
    NHI: string
    dateOfBirth: string
    submissionTime: string
    responses: { 
        medicineSelection: {
            medicineSelections: boolean[] ,
            specificMedicines: string,
          },
        response: { id: number, response: string }[], 
        additionalInformation: string,
        furtherInfo: {
            writtenFormats: string[],
            otherFormats: string
        }
    }
}

const medicineOptions = [
    'New or just started medicine(s)',
    'Current or existing medicine(s)',
    'Changes to my usual medicine(s)',
    'All of my medicines',
    'Specific medicine(s) (please list)',
  ];

// Enable update of questionnaire data whenever new input is entered
type PreviewSubmissionProps = PreviewSubmissionData & {
  handleFontSize: (defaultFontSize: string) => string;
  updateFields: (fields: Partial<PreviewSubmissionData>) => void
}

const PreviewSubmission: React.FC<PreviewSubmissionProps> = ({ responses, updateFields, handleFontSize }) => {
    const questionResponses = (responses.response).slice(1, 21);
    let additionalInformation = responses.additionalInformation;

    const options = [
        { label: "Do not want this information", value: "none" },
        { label: "Not important", value: "0" },
        { label: "Important", value: "1" },
        { label: "Very important", value: "2" }
    ];
    
    const handleQuestionResponse = (value: string, id: number) => {
        const updatedResponses = responses.response.map((response) => {
            if (response.id === id) {
                const responseValue = value === 'none' ? '' : value;
                return { ...response, response: responseValue };
            }
            return response;
        });

        // Pass the updated responses to the parent via updateFields
        updateFields({
            responses: {
                ...responses,
                response: updatedResponses,
            }
        });
    };

    const handleAdditionalInfoInput = (event: any) => {
        responses.additionalInformation = event.target.value
        updateFields({responses: responses})
    }

    return (
        <div>
            <h1 className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-semibold mb-2 flex justify-center text-center`}>
                Review responses for the following medicines
            </h1>

            {/*
            <p>First name: {firstName}</p>
            <p>Last name: {lastName}</p>
            {NHI !== "" && <p>NHI: {NHI}</p>}
            {dateOfBirth && <p>Date of Birth: {dateOfBirth}</p>}

            <br /><br />
            */}
            <div className={`mb-8 text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")} flex justify-center`}>
                <ul className="pl-4">
                    {medicineOptions.map((option, i) => 
                        <div key={i}>
                            {option != 'Specific medicine(s) (please list)' && responses.medicineSelection.medicineSelections[i] && <li className="list-disc">{option}</li>}
                        </div>
                    )}
                    {responses.medicineSelection.specificMedicines.length > 1 && <li className="list-disc break-words">Specific Medicines: {responses.medicineSelection.specificMedicines}</li>}
                </ul>
            </div>
            
            <div className='flex flex-col items-center'>
                {questionResponses.map((questionResponse) => (
                    <div key={questionResponse.id} className='space-y-1 w-64 xs:w-96 sm:w-full'>
                        <p className={`font-medium text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")}`}>{questions[questionResponse.id as keyof QuestionType].question}</p>
                        <Select value={options.find(option => option.value === questionResponse.response)?.value ?? 'none'} onValueChange={(value) => handleQuestionResponse(value, questionResponse.id)}>
                            <SelectTrigger className={`h-10 sm:h-10 text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("p")} bg-white hover:bg-white px-2 focus:ring-offset-0 pl-3 sm:pl-4`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {options.map(option => (
                                    <SelectItem key={option.value} value={option.value} className={`text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("p")} py-1 sm:py-1.5`}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <br />
                    </div>
                ))}
            </div>
            
            {/* Additional Information */}
            <div className='flex flex-col items-center'>
                <div className="mb-8 mt-4 sm:mt-8 w-64 xs:w-96 sm:w-full">
                    <h3 className={`font-medium text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")}`}>    
                        Additional information requested
                    </h3>
                    <textarea className={`text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("p")} h-28 sm:h-28 w-full rounded-md border border-input p-3 ring-offset-background resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`} placeholder="Add other information here..." value={additionalInformation} onChange={handleAdditionalInfoInput}/>
                </div>
            </div>

        </div>
    );
};

export default PreviewSubmission;
