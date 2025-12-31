import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

interface MedicineSelectionProps {
  responses: {
    medicineSelection: {
      medicineSelections: boolean[];
      specificMedicines: string;
    }
  };
  handleFontSize: (defaultFontSize: string) => string;
  updateFields: (updatedData: any) => void;
}

export const options = [
  'New or just started medicine(s)',
  'Current or existing medicine(s)',
  'Changes to my usual medicine(s)',
  'All of my medicines',
  'Specific medicine(s) (please list)',
];

const MedicineSelection: React.FC<MedicineSelectionProps> = ({ responses, handleFontSize, updateFields }) => {
  const { medicineSelection } = responses;
  const [specificMedicines, setSpecificMedicines] = useState<string>(medicineSelection.specificMedicines);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputVisible, setInputVisible] = useState<boolean>(responses.medicineSelection.specificMedicines != "");

  // Map options to their corresponding index in the medicineSelections array
  const optionKeyMap: { [key: string]: number } = {
    'New or just started medicine(s)': 0,
    'Current or existing medicine(s)': 1,
    'Changes to my usual medicine(s)': 2,
    'All of my medicines': 3,
    'Specific medicine(s) (please list)': 4,
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpecificMedicines(event.target.value);
    updateFields({
      responses: {
        ...responses,
        medicineSelection: {
          ...medicineSelection,
          specificMedicines: event.target.value
        }
      }
    });
  };

  const handleInputBlur = () => {
    // Set Specific medicines button to unselected if input is empty
    if (!responses.medicineSelection.specificMedicines) {
      const updatedSelections = [...medicineSelection.medicineSelections];
      updatedSelections[4] = false;

      updateFields({
        responses: {
          ...responses,
          medicineSelection: {
            ...medicineSelection,
            medicineSelections: updatedSelections,
            specificMedicines: specificMedicines
          }
        }
      });

      setInputVisible(false)
    }
  }

  const handleClick = (option: string) => {
    const index = optionKeyMap[option];
    const updatedSelections = [...medicineSelection.medicineSelections];
    updatedSelections[index] = !updatedSelections[index];

    if (index == 4) {
      if (!responses.medicineSelection.specificMedicines)
        setInputVisible(!inputVisible);
      else if (inputRef.current) { // input exists so button should not appear disabled
        inputRef.current.focus()
        return
      }
    }

    updateFields({
      responses: {
        ...responses,
        medicineSelection: {
          ...medicineSelection,
          medicineSelections: updatedSelections,
          specificMedicines: specificMedicines
        }
      }
    });
  };

  // Set the input to focus after Specific medicines button is clicked
  useEffect(() => {
    if (inputVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputVisible]);

  return (
    <div>
      <h3 className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-semibold`}>Which of your medicines would you like to receive information about?</h3>
      <p className={`text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")} font-semibold mt-1 sm:mt-3 text-secondary-50`}><i>You can select as many as you would like.</i></p>
      <p className={`text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("p")} text-secondary-50`}><i>Note: Refer to pharmacy receipts for official names of medicine.</i></p>

      {/* Selectable Options */}
      <div className="mt-2 sm:mt-4">
        {options.map(option => (
          <Button
            key={option}
            type="button"
            variant="outline"
            data-variant="outline"
            onClick={() => handleClick(option)}
            className={clsx(`text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")} w-full mt-[14px] sm:mt-5 border-dashed border-2 font-medium h-9 sm:h-12`, 
              {"bg-accent-5 border-solid border-primary border-2": medicineSelection.medicineSelections[optionKeyMap[option]], 
                "rounded-br-none rounded-bl-none": option === 'Specific medicine(s) (please list)' && responses.medicineSelection.medicineSelections[4]})}
          >
            {option}
          </Button>
        ))}
      </div>
      {inputVisible && <Input
        className={`text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("p")} mt-0 rounded-tr-none rounded-tl-none border-2 border-t-0 border-current focus-visible:ring-0 h-9 sm:h-12`}
        placeholder="Please list the medicines here"
        value={specificMedicines}
        ref={inputRef}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
      />}
    </div>
  );
}

export default MedicineSelection;
