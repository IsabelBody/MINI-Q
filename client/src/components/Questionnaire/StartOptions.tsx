import React, { useState } from 'react'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '../ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import clsx from 'clsx';
import PrivacyStatement from './PrivacyStatement'; 

interface StartOptionsProps {
  fontSize: string;
  language: string;
  checkedBox: boolean;
  handleFontSize: (defaultFontSize: string) => string;
  updateFields: (updateStartingOptions: any) => void;
};

const StartOptions: React.FC<StartOptionsProps> = ({ fontSize, language, checkedBox, handleFontSize, updateFields }) => {
  const [isCheck, setCheck] = useState(checkedBox)
  const [selectedLanguage, setSelectedLanguage] = useState<string>(language)
  const [selectedFontSize, setFontSizeSelection] = useState(fontSize)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false); 

  const updateChecked = () => {
    setCheck(!isCheck)
  }

  const updateOptions = () => {
    updateFields({fontSize: selectedFontSize, language: selectedLanguage, checkedBox: isCheck})
  }

  const updateFontSizeSelection = (e: any) => {
    setFontSizeSelection((e.target as HTMLInputElement).value)
    updateFields({fontSize: (e.target as HTMLInputElement).value})
  }

  return (
    <div className={clsx(`flex flex-col justify-between sm:min-h-[624px] h-[calc(100svh-162px)] sm:h-[calc(100svh-194px)]`, {"min-h-[calc(544px)]": fontSize == "small", "min-h-[calc(560px)]": fontSize == "medium", "min-h-[calc(588px)]": fontSize == "large"})}>
      <div>
        {/*MINIQ and text-size accessibility feature */}
        <div className="w-full flex justify-between items-center">
          <h1 className={`text-${handleFontSize("h1")} font-bold`}>MINI-Q</h1> 
          <div className='flex'>
            <Button className={clsx("text-sm sm:text-sm h-[36px] w-[28px] sm:px-5 rounded-l-lg rounded-r-none", {"bg-accent-5 border-solid border-primary border-2": selectedFontSize === 'small'})} type='button' variant='outline' data-variant="outline" value="small" onClick={updateFontSizeSelection}>A</Button>
            <Button className={clsx("text-h4 sm:text-h4 h-[36px] w-[28px] sm:px-5 rounded-none", {"bg-accent-5 border-solid border-primary border-2": selectedFontSize === 'medium'})} type='button' variant='outline' data-variant="outline" value="medium" onClick={updateFontSizeSelection}>A</Button>
            <Button className={clsx("text-h3 sm:text-h3 h-[36px] w-[28px] sm:px-5 rounded-r-lg rounded-l-none", {"bg-accent-5 border-solid border-primary border-2": selectedFontSize === 'large'})} type='button' variant='outline' data-variant="outline" value="large" onClick={updateFontSizeSelection}>A</Button>
          </div>
        </div>

        {/*Select component to choose between English and Te Reo Māori */}
          <h2 className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-semibold mt-7 mb-3`}>Select a language</h2>

          <Select value = {selectedLanguage} onValueChange={(value: string) => setSelectedLanguage(value)}>
            <SelectTrigger className="w-full font-semibold bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EN"><p className={`text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("p")} font-medium focus:bg-accent-5`}>English</p></SelectItem>
              {/* <SelectItem value="TRM"><p className={`text-${selectedFontSize} sm:text-${selectedFontSize}`}>Te Reo Māori</p></SelectItem> */}
            </SelectContent>
          </Select>
        
        {/*Privacy statement*/}
          <h2 className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-semibold mb-3 mt-12`}>Privacy Statement</h2> 
          
          <div className="flex items-center space-x-3 sm:space-x-4">
              <Checkbox id="agreement" checked={isCheck} onCheckedChange={updateChecked}/>
              <label
                  htmlFor="agreement"
                  className={`text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("p")} font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}>
                  I have read the <span className="underline underline-offset-2 cursor-pointer" onClick={() => setShowPrivacyModal(true)}>privacy statement</span> and understand how my information will be used.
              </label>
          </div>
          <br/>

         {/* Privacy Modal */}
          {showPrivacyModal && (
            <div className="fixed inset-0 bg-cream/80 backdrop-blur-[3px] flex justify-center items-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-xs sm:max-w-lg border-2 overflow-auto max-h-[calc(100svh-4em)]">
                <h2 className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-bold mb-3 sm:mb-4`}>Privacy Statement</h2>
                <PrivacyStatement handleFontSize={handleFontSize}/>
                <div className="flex items-center justify-center space-x-4 mt-4">
                  <Button 
                    onClick={() => setShowPrivacyModal(false)} 
                    className={`text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")}`}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        
      </div>
      {/*Continue button*/}
      <div className='flex justify-center w-full min-h-[76px]'>
        <Button type={isCheck ? "submit" : "button"} variant={isCheck ? 'default' : 'ghost'} className={`w-[150px] h-[30px] text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("p")}`} onClick={updateOptions}>Continue</Button>
      </div>
    </div>
  )
}

export default StartOptions;
