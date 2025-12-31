import React, { useState, useEffect } from 'react'
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';

type QuestionData = {
  questionID: number
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
  className?: string
}

// Enable update of questionnaire data whenever new input is entered
type QuestionProps = QuestionData & {
  handleFontSize: (defaultFontSize: string) => string
  updateFields: (fields: Partial<QuestionData>) => void
  handleExampleSliderInteraction?: (value: boolean) => void
  startInactivityTimer?: () => void
  inactivityTimeout?: React.MutableRefObject<NodeJS.Timeout | null>
}

const CustomSlider: React.FC<QuestionProps> = ({ questionID, responses, handleFontSize, updateFields, className, handleExampleSliderInteraction, startInactivityTimer, inactivityTimeout }) => {
  const options = [
    { label: "Do not want this information", value: 0 },
    { label: "Not important", value: 1 },
    { label: "Important", value: 2 },
    { label: "Very important", value: 3 }
  ];

  let response = responses.response[questionID].response
  if (response == "") response = "-1"
  let formattedResponse = (Number(response) + 1)

  const [sliderValue, setSliderValue] = useState(formattedResponse);

  const handleSliderChange = (val: number) => {
    if (handleExampleSliderInteraction) 
      handleExampleSliderInteraction(true)
    setSliderValue(val);
    if (questionID != 0) { // only update if not example question
      responses.response[questionID].response = (val != 0 ? val - 1 : "").toString(); // set response to "", 0, 1, or 2
      updateFields({ responses: responses });
    }
  };

  const clearInactivityTimer = () => {
    if (inactivityTimeout?.current) {
      clearTimeout(inactivityTimeout?.current);
    }
  }

  // Reset slider when question changes
  useEffect(() => {
    setSliderValue(formattedResponse); // Reset slider to 0 or any initial value
    if (inactivityTimeout?.current) {
      clearTimeout(inactivityTimeout?.current);
    }
  }, [questionID]);

  const handleMarkerClick = (index: number) => {
    handleSliderChange(options[index].value);
  };

  return (
    <div className={cn("relative w-full max-w-[309px] sm:max-w-[455px] mx-auto", className)}>
      {/* Slider */}
      <Slider
        value={[sliderValue]}
        max={3}
        step={1}
        onValueChange={(val) => handleSliderChange(val[0])}
        onPointerUp={startInactivityTimer}
        onPointerDown={clearInactivityTimer}
        className="p-4"
      />

      {/* Markers */}
      <div className="absolute inset-0 flex justify-between pointer-events-none">
        {options.map((option, index) => (
          <div
            key={option.value}
            className="relative"
          >
            <button
              onClick={() => handleMarkerClick(index)}
              className={cn("relative transform translate-y-[3px] sm:-translate-y-[1px] h-8 w-8 sm:w-10 sm:h-10 rounded-full bg-white border-primary-25 border", 
                {'border-4 bg-primary-25 border-primary': index <= sliderValue})}
              aria-label={option.label}
            >
            </button>
            {sliderValue === option.value && (
                <div className={cn("absolute text-left mt-4 max-w-8 sm:max-w-10", {"text-right": option.value===3})}>
                  <p className='text-5xl sm:text-6xl font-semibold mb-[3px]'>{option.value}</p>
                  <p className={cn(`text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h5")} font-medium text-left text-nowrap whitespace-nowrap`, {"text-right": option.value===3})} dir={option.value===3 ? "rtl" : "ltr"}>{option.label}</p>
                </div>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomSlider;