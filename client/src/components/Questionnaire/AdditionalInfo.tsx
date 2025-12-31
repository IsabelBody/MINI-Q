import React from 'react'

type AdditionalInfoData = {
  responses: { 
    medicineSelection: {
      medicineSelections: boolean[],
      specificMedicines: string,
    },
    response: { id: number, response: string }[], 
    additionalInformation: string,
    furtherInfo: {
      writtenFormats: string[],
      otherFormats: string,
    }
  }
}

// Enable update of questionnaire data whenever new input is entered
type AdditionalInfoProps = AdditionalInfoData & {
  handleFontSize: (defaultFontSize: string) => string;
  updateFields: (fields: Partial<AdditionalInfoData>) => void
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({ responses, handleFontSize, updateFields }) => {
  let additionalInformation = responses.additionalInformation

  const handleInput = (event: any) => {
    responses.additionalInformation = event.target.value
    updateFields({responses: responses})
  }

  return (
    <div>
       <h1 className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-semibold`}>Please tell us about any other information you would like to know about your medicine</h1>
       <p className={`text-secondary-50 text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("h6")} mt-2 italic`}>E.g. "What should I do with my medicines while travelling?" or
        "How will my medicine affect the use of my traditional practices?"</p>
       <br/>
       <textarea className={`text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h6")} h-28 sm:h-28 w-full rounded-md border border-input p-3 ring-offset-background resize-none placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`} placeholder="Add other information here..." value={additionalInformation} onChange={handleInput}/>
       <br/>
    </div>
  )
}

export default AdditionalInfo;
