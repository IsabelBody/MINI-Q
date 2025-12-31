import React from 'react'
import CustomSlider from './CustomSlider';
import clsx from 'clsx';
import { AnimatePresence, motion } from "framer-motion";

type QuestionData = {
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
  },
  fontSize: string
}

// Enable update of questionnaire data whenever new input is entered
type QuestionProps = QuestionData & {
  handleFontSize: (defaultFontSize: string) => string
  updateFields: (fields: Partial<QuestionData>) => void
  startInactivityTimer: () => void
  inactivityTimeout: React.MutableRefObject<NodeJS.Timeout | null>
  direction: number
}

const Question: React.FC<QuestionProps> = ({ questionID, question, responses, fontSize, handleFontSize, updateFields, startInactivityTimer, inactivityTimeout, direction }) => {
  

  return (
    <div className="pb-16 sm:pb-16" key={questionID}> 
      <AnimatePresence custom={direction}>
        <motion.div
          initial={{ x: direction > 0 ? 100 : -100, opacity: 0.8}}
          animate={{ x: 0, opacity: 1}}
          transition={{ duration: 0.6 }}
          className='overflow-hidden'
        >
          <div className={clsx('mb-6 sm:mb-6 flex p-6 justify-center items-center h-[120px] sm:h-[154px] max-w-[320px] sm:max-w-[455px] rounded-xl bg-primary mx-auto', {"h-[120px]": fontSize === "small" || fontSize === "medium", "h-[160px]": fontSize === "large"})}>
            <div className={`text-center text-white text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-semibold`}>{question}</div>
          </div>
        </motion.div>
      </AnimatePresence>
      

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <p className={`text-mobile-${handleFontSize("h5")} mb-6 sm:mb-8 sm:text-${handleFontSize("h5")} text-center mx-auto font-semibold`}>How important is this information to you?</p>
        <CustomSlider 
          questionID={questionID} 
          responses={responses}
          handleFontSize={handleFontSize}
          updateFields={updateFields}
          startInactivityTimer={startInactivityTimer}
          inactivityTimeout={inactivityTimeout}
        />
      </motion.div>
    </div>
  )
}

export default Question;