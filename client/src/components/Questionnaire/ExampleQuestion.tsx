import React, { useState, useEffect } from 'react'
import CustomSlider from '@/components/Questionnaire/CustomSlider'
import { Button } from '../ui/button'
import { ChevronLeft } from 'lucide-react'
import clsx from 'clsx'

interface ExampleQuestionData {
  questionID: number
  question: string
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
  fontSize: string
}

type ExampleQuestionProps = ExampleQuestionData & {
  handleFontSize: (defaultFontSize: string) => string;
  updateFields: (fields: Partial<ExampleQuestionData>) => void
  handleExampleSliderInteraction: (value: boolean) => void
}

const ExampleQuestion: React.FC<ExampleQuestionProps> = ({ questionID, question, responses, fontSize, handleFontSize, updateFields, handleExampleSliderInteraction }) => {
  const [showDetails, setShowDetails] = useState(true);
  const [showModal, setShowModal] = useState<boolean>(true);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    setShowModal(true);
    handleExampleSliderInteraction(false)
  }, []);

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="pb-16 sm:pb-16">
        <h1 className={clsx(`text-mobile-${handleFontSize("h1")} sm:text-${handleFontSize("h1")} font-bold text-center sm:h-24`, {"h-20": fontSize === "small" || fontSize === "medium", "h-16": fontSize === "large"})}>Example Question</h1>

        {/* Intructions Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-cream/80 backdrop-blur-[3px] flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-xs sm:max-w-lg mx-auto border-2">
              {showDetails && <h2 className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-bold mb-3 sm:mb-4`}>What would you like to know about your medicine?</h2>}
              <div className="my-1 sm:my-4 text-left text-mobile-h4 sm:text-p font-medium text-primary space-y-2">
                {showDetails
                  ? <p className={`text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")} pb-2`}>You will be shown a series of statements of information that you can receive about your medicine.</p> 
                  : <div className={`space-y-2 sm:space-y-4 text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")}`}>
                      <p>This page has an example of a statement.</p>
                      <p>Please <b>use the slider</b> to indicate <b>how important</b> this information is to you <b>at the moment.</b></p>
                      <div>
                        <p>You have four options to choose from:</p>
                        <ul className="pl-6 pb-3 sm:pb-6 list-disc">
                          <li>Do not want this information</li>
                          <li>Not important</li>
                          <li>Important</li>
                          <li>Very important</li>
                        </ul>
                      </div>
                    </div>
                }
              </div>
              <div className={clsx("flex items-center justify-center space-x-4 mt-4", {"justify-between": !showDetails})}>
                <Button type="button" variant={showDetails ? 'default' : 'link'} className={clsx(`font-semibold text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")}`, {"px-2 sm:px-4": !showDetails})} onClick={toggleDetails} >
                  {showDetails ? "Next" : <div className={`flex items-center text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")}`}><ChevronLeft className="h-4 w-4 mr-2"/>Back</div>}
                </Button>
                {!showDetails && <Button 
                  onClick={closeModal} 
                  className={`text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")}`}>
                  Got it!
                </Button>}
              </div>
            </div>
          </div>
        )}
        
      <div className={clsx('mb-6 sm:mb-6 flex p-6 justify-center items-center h-[120px] sm:h-[154px] max-w-[320px] sm:max-w-[455px] rounded-xl bg-primary mx-auto', {"h-[120px]": fontSize === "small" || fontSize === "medium", "h-[160px]": fontSize === "large"})}>
          <div className={`text-center text-white text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-semibold`}>{question}</div>
      </div>
      <p className={`mb-6 sm:mb-8 text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h5")} text-center mx-auto font-semibold text-primary-100`}>How important is this information to you?</p>
        <CustomSlider 
          questionID={questionID} 
          responses={responses}
          handleFontSize={handleFontSize}
          updateFields={updateFields}
          handleExampleSliderInteraction={handleExampleSliderInteraction}
        />
    </div>
  )
}

export default ExampleQuestion;
