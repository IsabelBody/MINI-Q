import React, { useState } from 'react';
import { format, isValid, parse } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface DOBPickerProps {
  onDateSelect: (selectedDate: Date | null) => void;
}

const DOBPicker: React.FC<DOBPickerProps> = ({onDateSelect}) => {
  const [date, setDate] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState("");

  const thisYear = new Date().getFullYear();
  const furthestYear = thisYear - 122;

  const handleDayPickerSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setInputValue("");
      setDate(null);
      onDateSelect(null);
    } else {
      setInputValue(format(selectedDate, 'dd/MM/yyyy'));
      setDate(selectedDate);
      onDateSelect(selectedDate);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (e.target.value) {
      const parsedDate = parse(e.target.value, "dd/MM/yyyy", new Date()); // convert input into a Date object

      if (isValid(parsedDate)) { // if the date is valid, set the date and trigger filter
        setDate(parsedDate);
      } else {
        setDate(null);
      }
      onDateSelect(parsedDate);
    } else {
      onDateSelect(null)
    }
  }

  const handleClearDate = () => {
    setInputValue("");
    setDate(null);
    onDateSelect(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <div className="relative">
            <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 mr-2 h-3 w-3 sm:h-4 sm:w-4 text-accent-110" />
            <Input
              className={cn(
                "h-8 sm:h-10 p-2 sm:p-4 text-mobile-sm sm:text-p pl-6 sm:pl-7 w-28 sm:w-36",
              )}
              placeholder="Date of Birth"
              value={inputValue}
              onChange={handleInputChange}
            >
            </Input>
            {inputValue && <button className="absolute right-2 my-auto top-1/2 -translate-y-1/2" onClick={handleClearDate}>
              <X className="text-destructive/80 w-4 h-4 sm:w-5 sm:h-5"/>
            </button>}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 text-mobile-p sm:text-h5">
          <Calendar
            mode="single"
            selected={date || undefined}
            onSelect={handleDayPickerSelect}
            disabled={(date) => date > new Date() || date < new Date(furthestYear + '-01-01')} // disable dates after today and before 122 years in the past
            initialFocus
            defaultMonth={date || new Date(2000, 0)} // open to selected date or Jan 2000 if no date selected
            captionLayout="dropdown-buttons"
            fromYear={furthestYear}
            toYear={thisYear}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DOBPicker;
