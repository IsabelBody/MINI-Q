import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import clsx from 'clsx'
import { TriangleAlert } from 'lucide-react';

type DetailsData = {
  firstName: string
  lastName: string
  NHI: string
  dateOfBirth: string
  fontSize: string
}

// Enable update of questionnaire data whenever new input is entered
type DetailsProps = DetailsData & {
  handleFontSize: (defaultFontSize: string) => string,
  updateFields: (fields: Partial<DetailsData>) => void,
  showDOBError: boolean,
  showNHIError: boolean,
}

const Details: React.FC<DetailsProps> = ({ fontSize, firstName, lastName, dateOfBirth, NHI, handleFontSize, updateFields, showDOBError, showNHIError }) => {
  const [isFocused, setIsFocused] = useState<{ [key: string]: boolean}>({
    firstName: false,
    lastName: false,
    day: false,
    month: false,
    year: false,
    NHI: false,
  });
  const [NHIInput, setNHIInput] = useState<string[]>(NHI.length != 0 ? NHI.split('') : Array(7).fill(''))

  const handleFocus = (field: string) => {
    setIsFocused(prevState => ({ ...prevState, [field]: true }));
  };

  const handleBlur = (field: string, e?: React.FocusEvent<HTMLInputElement>, ) => {
    if (field == 'day' || field == 'month') {
      if (e && e.target.value.length == 1) {
        const parts = dateOfBirth.split('/');
        let day, month, year;
        if (field == 'day') {
          day = `0${e.target.value}` // pad with leading zero
          month = parts[1] || ''
        } else {
          day = parts[0] || ''
          month = `0${e.target.value}` // pad with leading zero
        }
        year = parts[2] || ''
        updateFields({ dateOfBirth: `${day}/${month}/${year}`}) 
      }
    }
    setIsFocused(prevState => ({ ...prevState, [field]: false }));
  };
 
  return (
    <div className="space-y-4 sm:space-y-8">
      <h1 className={`text-mobile-${handleFontSize("h2")} sm:text-${handleFontSize("h2")} font-semibold`}>Your Details</h1>
      <div className="space-y-2 sm:space-y-6">
        {/* Name Section */}
        <div className='w-full sm:flex sm:justify-around space-y-2 sm:space-y-0'>
          <div className='flex-1'>
            <Label htmlFor="firstName" className={clsx(`text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h5")} font-medium`, {"font-semibold": isFocused.firstName})}>First name</Label>
            <Input
              className={`text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h6")} h-9 sm:h-10 sm:w-60 md:w-64`}
              required
              id="firstName"
              value={firstName}
              onChange={e => updateFields({firstName: e.target.value})}
              onFocus={() => handleFocus('firstName')}
              onBlur={e => {
                updateFields({firstName: (e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)).trim()})
                handleBlur('firstName')
              }}
            />
          </div>
          <div className='flex-1'>
            <Label htmlFor="LastName" className={clsx(`text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h5")} font-medium`, {"font-semibold": isFocused.lastName})}>Last name</Label>
            <Input
              className={`text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h6")} h-9 sm:h-10 sm:w-60 md:w-64`}
              required
              id="lastName"
              value={lastName}
              onChange={e => updateFields({lastName: e.target.value})}
              onFocus={() => handleFocus('lastName')}
              onBlur={e => {
                updateFields({lastName: (e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)).trim()})
                handleBlur('lastName')
              }}
            />
          </div>
        </div>


        {/* Date of Birth Section */}
        <div>
          <Label htmlFor="dateOfBirth" className={clsx(`text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h5")} font-medium`, {"font-semibold": isFocused.day || isFocused.month || isFocused.year})}>Date of Birth</Label>
          <p className={`text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("h6")} pt-0 mb-2 text-primary-50 italic`}>e.g. 01/01/2000</p>
          <div className="flex space-x-2">
            <div className='flex flex-col'>
              <Input
                required
                id="day"
                type="number"
                className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h5")} h-10 sm:h-12 w-14 md:w-18`}
                value={dateOfBirth.split('/')[0] || ''}
                maxLength={2}
                onChange={(e) => {
                  const day = e.target.value;
                  if (/^3[01]$|^0?[1-9]$|^[0]$|^[12]\d$/.test(day) || day == "") { // Ensure it's only digits and up to 2 characters                  
                    const parts = dateOfBirth.split('/');
                    const month = parts[1] || ''
                    const year = parts[2] || ''
                    updateFields({ dateOfBirth: `${day}/${month}/${year}` });
                    if (day.length == 2) {
                      const nextInput = document.getElementById('month');
                      if (nextInput) nextInput.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (["e", "E", "+", "-"].includes(e.key))
                    e.preventDefault()
                }}
                onFocus={() => handleFocus('day')}
                onBlur={(e) => handleBlur('day', e)}
              />
              <Label htmlFor="day" className={clsx(`text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("sm")} md:foreground-100 mt-1`, {"font-semibold": isFocused.day})}>Day</Label>
            </div>
            <div className='flex flex-col'>
              <Input
                required
                id="month"
                type="number"
                className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h5")} h-10 sm:h-12 w-14 md:w-18`}
                value={dateOfBirth.split('/')[1] || ''}
                maxLength={2}
                onChange={(e) => {
                  let month = e.target.value;
                  if (/^1[0-2]$|^0?[1-9]$|^[0-9]$/.test(month) || month == "") { // Ensure it's only digits and up to 2 characters
                    const parts = dateOfBirth.split('/')
                    const day = parts[0] || ''
                    const year = parts[2] || ''
                    updateFields({ dateOfBirth: `${day}/${month}/${year}` });
                    if (month.length == 2) {
                      const nextInput = document.getElementById('year');
                      if (nextInput) nextInput.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !e.currentTarget.value) {
                    e.preventDefault()
                    const previousInput = document.getElementById('day');
                    if (previousInput) previousInput.focus();
                  }
                  else if (["e", "E", "+", "-"].includes(e.key))
                    e.preventDefault()
                }}
                onFocus={() => handleFocus('month')}
                onBlur={(e) => handleBlur('month', e)}
              />
              <Label htmlFor="month" className={clsx(`text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("sm")} md:foreground-100 mt-1`, {"font-semibold": isFocused.month})}>Month</Label>
            </div>
            <div className='flex flex-col'>
              <Input
                required
                id="year"
                type="number"
                className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h5")} h-10 sm:h-12 w-20 md:w-24`}
                value={dateOfBirth.split('/')[2] || ''}
                maxLength={4}
                onChange={(e) => {
                  const year = e.target.value;
                  if (/^\d{0,4}$/.test(year) || year == "") { // Ensure it's only digits and up to 4 characters                  
                    const parts = dateOfBirth.split('/')
                    const day = parts[0] || ''
                    const month = parts[1] || ''
                    updateFields({ dateOfBirth: `${day}/${month}/${year}` });
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !e.currentTarget.value) {
                    e.preventDefault()
                    const previousInput = document.getElementById('month');
                    if (previousInput) previousInput.focus();
                  }
                  else if (["e", "E", "+", "-"].includes(e.key))
                    e.preventDefault()
                }}
                onFocus={() => handleFocus('year')}
                onBlur={() => handleBlur('year')}
              />
              <Label htmlFor="year" className={clsx(`text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("sm")} md:foreground-100 mt-1`, {"font-semibold": isFocused.year})}>Year</Label>
            </div>
          </div>
          {/* DOB error validation message */}
          {showDOBError && (
            <div className="flex items-center mt-2 text-destructive bg-bg-red/50 p-2 rounded-sm">
              <TriangleAlert className={`w-${fontSize === 'small' ? '4' : fontSize === 'medium' ? '5' : '6'} h-${fontSize === 'small' ? '4' : fontSize === 'medium' ? '5' : '6'} mr-2`} />
              <p className={`text-${handleFontSize("p")} sm:text-${handleFontSize("p")}`}>Invalid Date of Birth. Please check your input.</p>
            </div>
          )}
        </div>
     
        {/* NHI Number Section */}
        <div>
          <div className="inline-flex">
          <Label htmlFor="NHI" className={clsx(`text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h5")} font-medium md:foreground-100 mt-1`, {"font-semibold": isFocused.NHI})}>NHI Number <p className={`inline-flex font-medium text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("h6")}`}>(recommended to include if you know it)</p></Label>
          </div>
          <p className={`text-mobile-${handleFontSize("p")} sm:text-${handleFontSize("h6")} pt-0 text-primary-50 italic`}>e.g. NHI1234</p>

          <div className="flex space-x-1 mt-2 sm:space-x-3">
            {[...Array(7)].map((_, index) => (
              <Input
                id={`nhi-${index}`}
                key={index}
                type={`${index < 3 ? 'text' : 'number'}`} // Handle keyboard change for mobile and tablet devices
                maxLength={1}
                className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h6")} h-10 sm:h-12 w-10 sm:w-12 text-center`}
                value={NHIInput[index]}
                onChange={(e) => {
                  setNHIInput(prev => {
                    let newNHIInput = [...prev]
                    newNHIInput[index] = e.target.value.toUpperCase().charAt(0)
                    updateFields({ NHI: newNHIInput.join('')})

                    // Handle move focus to next input
                    if (e.target.value && index < 6) {
                      const nextInput = document.getElementById(`nhi-${index + 1}`);
                      if (nextInput) nextInput.focus();
                    }

                    return newNHIInput
                  })
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Backspace' && !e.currentTarget.value &&index > 0) {
                    e.preventDefault()
                    const previousInput = document.getElementById(`nhi-${index - 1}`);
                    if (previousInput) previousInput.focus();
                  }
                  else if (index < 3 && (/(?=.*\d|.*[!@#$%^&*(),.?"':;{}|[\]<>\-_+\=`~\\\/])/.test(e.key)))
                    e.preventDefault()
                  else if (index >= 3 && ["e", "E", "+", "-"].includes(e.key))
                    e.preventDefault()
                }}
                onFocus={() => handleFocus('NHI')}
                onBlur={() => handleBlur('NHI')}
              />
            ))}
          </div>
          {/* NHI error validation message */}
          {showNHIError && (
            <div className="flex items-center mt-2 text-destructive bg-bg-red/50 p-2 rounded-sm">
              <TriangleAlert className={`w-${fontSize === 'small' ? '4' : fontSize === 'medium' ? '5' : '6'} h-${fontSize === 'small' ? '4' : fontSize === 'medium' ? '5' : '6'} mr-2`} />
              <p className={`text-${handleFontSize("p")} sm:text-${handleFontSize("p")}`}>Invalid NHI number. Please check your input.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Details;