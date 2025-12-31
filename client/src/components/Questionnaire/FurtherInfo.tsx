import React, { useState } from 'react';
import clsx from 'clsx';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface FurtherInfoProps {
  responses: {
    furtherInfo: {
      writtenFormats: string[],
      otherFormats: string
    }
  };
  handleFontSize: (defaultFontSize: string) => string;
  updateFields: (updatedData: any) => void;
  showWrittenFormat: boolean | null;
  setShowWrittenFormat: (value: boolean) => void;
}

const FurtherInfo: React.FC<FurtherInfoProps> = ({ responses, handleFontSize, updateFields, showWrittenFormat, setShowWrittenFormat }) => {
  const [otherFormats, setOtherFormats] = useState("");
  const [writtenFormats] = useState(responses.furtherInfo.writtenFormats);

  const [printedChecked, setPrintedChecked] = useState(false);
  const [leafletChecked, setLeafletChecked] = useState(false);
  const [websiteChecked, setWebsiteChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOtherFormats(event.target.value);
    updateFields({
      responses: {
        ...responses,
        furtherInfo: {
          writtenFormats: writtenFormats,
          otherFormats: event.target.value
        }
      }
    });
  };

  const updateWrittenFormats = (value: string) => {
    const index = writtenFormats.indexOf(value);
    if (index >= 0) {
      writtenFormats.splice(index, 1);
    } else {
      writtenFormats.push(value);
    }

    updateFields({
      responses: {
        ...responses,
        furtherInfo: {
          writtenFormats: writtenFormats,
          otherFormats: otherFormats
        }
      }
    });
  }

  const changePrintedChecked = () => {
    setPrintedChecked(!printedChecked);
    updateWrittenFormats("Printed information");
  }

  const changeLeafletChecked = () => {
    setLeafletChecked(!leafletChecked);
    updateWrittenFormats("Electronic leaflet");
  }

  const changeWebsiteChecked = () => {
    setWebsiteChecked(!websiteChecked);
    updateWrittenFormats("Website");
  }

  const changeEmailChecked = () => {
    setEmailChecked(!emailChecked);
    updateWrittenFormats("Email");
  }

  return (
    <div className="space-y-4">
      <h2 className={`font-semibold text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")}`}>Would you like further information about your medicines in a written format?</h2>
      <div className="flex space-x-4 mt-4">
        <Button 
          type="button"
          variant="outline"
          onClick={() => setShowWrittenFormat(true)}
          className={clsx(`hover:bg-accent-5 text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")} border-dashed border-2 border-primary-50 hover:border-2`, {"bg-accent-5 border-solid border-primary border-2": showWrittenFormat === true})}
        >
          Yes
        </Button>
        <Button 
          type="button"
          variant="outline"
          onClick={() => setShowWrittenFormat(false)}
          className={clsx(`hover:bg-accent-5 text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")} border-dashed border-2 border-primary-50 hover:border-2`, {"bg-accent-5 border-solid border-primary border-2": showWrittenFormat === false})}
        >
          No
        </Button>
      </div>

      {/* Show additional section if "Yes" is selected */}
      {showWrittenFormat && (
        <div className="mt-4">
          <h3 className={`font-semibold text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h5")}`}>
            Which written format would you prefer?
          </h3>
          <p className={`font-medium text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("p")}`}>
            You can tick as many boxes as you like.
          </p>
          <div className={`flex flex-col space-y-2 mt-2`}>
            <Label className={`flex items-center space-x-3 text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("h6")}`}>
              <Checkbox checked={printedChecked} onCheckedChange={changePrintedChecked}/>
              <span>Printed information</span>
            </Label>
            <Label className={`flex items-center space-x-3 text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("h6")}`}>
              <Checkbox checked={leafletChecked} onCheckedChange={changeLeafletChecked}/>
              <span>Electronic leaflet</span>
            </Label>
            <Label className={`flex items-center space-x-3 text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("h6")}`}>
              <Checkbox checked={websiteChecked} onCheckedChange={changeWebsiteChecked}/>
              <span>Website</span>
            </Label>
            <Label className={`flex items-center space-x-3 text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("h6")}`}>
              <Checkbox checked={emailChecked} onCheckedChange={changeEmailChecked}/>
              <span>Email</span>
            </Label>
          </div>
          <div className="mt-2">
            <Label className={`text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("h6")} font-medium`}>Other (Please specify)</Label>
            <Input placeholder="Please specify..." className={`text-${handleFontSize("sm")} sm:text-${handleFontSize("p")} mt-2`} value={otherFormats} onChange={handleInput}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default FurtherInfo;
