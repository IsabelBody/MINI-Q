import React, { FormEvent, useRef, useState } from 'react'
import { isValid, parse } from 'date-fns';
import { ChevronLeft } from 'lucide-react'
import { JSX } from 'react/jsx-runtime'
import { Button } from '@/components/ui/button'
import { Details, MedicineSelection, ExampleQuestion, Question, AdditionalInfo, Visualisation, Navbar, StartOptions, Blurb, FurtherInfo, PreviewSubmission } from '@/components/Questionnaire'
import { MultiStepForm } from '@/MultiStepForm'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { submitResponse } from '@/apiService'
import { Progress } from '@/components/ui/progress'
import { submissionFormatDateOfBirth, submissionformatSubmissionTime } from '@/utils/dateUtils'
import { validateNHI } from '@/checksumAlgorithm'
import clsx from 'clsx'

// Defining the type of data to be received
type QuestionnaireData = {
  firstName: string
  lastName: string
  NHI: string
  dateOfBirth: string
  submissionTime: string
  responses: {
    medicineSelection: {
      medicineSelections: boolean[],
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

type StartingOptions = {
  fontSize: string
  language: string
  checkedBox: boolean
}


// Initialising the questionnaire data responses
const INITIAL_DATA: QuestionnaireData = {
  firstName: "",
  lastName: "",
  NHI: "",
  dateOfBirth: "",
  submissionTime: "",
  responses: {
    medicineSelection: {
      medicineSelections: [false, false, false, false],  // corresponds to 4 medicine categories
      specificMedicines: "",
    },
    response: [
      { "id": 0, "response": ""},
      { "id": 1, "response": ""},
      { "id": 2, "response": ""},
      { "id": 3, "response": ""},
      { "id": 4, "response": ""},
      { "id": 5, "response": ""},
      { "id": 6, "response": ""},
      { "id": 7, "response": ""},
      { "id": 8, "response": ""},
      { "id": 9, "response": ""},
      { "id": 10, "response": ""},
      { "id": 11, "response": ""},
      { "id": 12, "response": ""},
      { "id": 13, "response": ""},
      { "id": 14, "response": ""},
      { "id": 15, "response": ""},
      { "id": 16, "response": ""},
      { "id": 17, "response": ""},
      { "id": 18, "response": ""},
      { "id": 19, "response": ""},
      { "id": 20, "response": ""}
    ],
    additionalInformation: "",
    furtherInfo: {
      writtenFormats: new Array(0),
      otherFormats: ""
    } 
  },
}

const INITIAL_STARTING_OPTIONS: StartingOptions = {
  fontSize: "small",
  language: "EN",
  checkedBox: false
}

const Questionnaire: React.FC = () => {
  let initialData : QuestionnaireData = JSON.parse(JSON.stringify(INITIAL_DATA))
  const [data, setData] = useState(initialData)
  const [startingOptions, setStartingOptions] = useState(INITIAL_STARTING_OPTIONS)
  const [isSubmitted, setSubmittedStatus] = useState(false)
  const [visualisationShown, setVisualisation] = useState(false)
  const [exampleSliderUsed, setExampleSliderUsed] = useState<boolean>(false)
  const [showWrittenFormat, setShowWrittenFormat] = useState<boolean | null>(null)
  const [showDOBError, setShowDOBError] = useState<boolean>(false)
  const [showNHIError, setShowNHIError] = useState<boolean>(false)
  const inactivityTimeout = useRef<NodeJS.Timeout | null>(null)
  const [direction, setDirection] = useState(0)

  const questionWordings = [
    { "id": 0, "wording": "The weather conditions today"},
    { "id": 1, "wording": "What my medicine is called"},
    { "id": 2, "wording": "What my medicine is used for"},
    { "id": 3, "wording": "What my medicine does"},
    { "id": 4, "wording": "How my medicine works"},
    { "id": 5, "wording": "How long it will take to work"},
    { "id": 6, "wording": "How I will know it is working"},
    { "id": 7, "wording": "How long I will need to take my medicine"},
    { "id": 8, "wording": "How to take or use my medicine"},
    { "id": 9, "wording": "Whether my medicine is available at my local pharmacy and if there will be a cost to me"},
    { "id": 10, "wording": "Possible side effects of my medicine"},
    { "id": 11, "wording": "How likely I am to experience side effects"},
    { "id": 12, "wording": "What I should do if I experience side effects"},
    { "id": 13, "wording": "If I can drink alcohol while taking my medicine"},
    { "id": 14, "wording": "If I can take my medicines with other medicines, natural health products, supplements or food"},
    { "id": 15, "wording": "Whether my medicine can affect my sex life"},
    { "id": 16, "wording": "Whether my medicine can make me feel sleepy"},
    { "id": 17, "wording": "What to do if I miss a dose"},
    { "id": 18, "wording": "How to get good information about my medicine from the internet"},
    { "id": 19, "wording": "Changes to my medicine e.g. tablet colour, dose etc."},
    { "id": 20, "wording": "What impact taking my medicine will have on my lifestyle"}
  ]

  function handleFontSize (defaultFontSize: string) {
    let fontSizes = ['xs', 'sm', 'p', 'h6', 'h5', 'h4', 'h3', 'h2', 'h1']
    let index = fontSizes.findIndex((el) => el == defaultFontSize)
    if (startingOptions.fontSize == "medium") index+=1
    else if (startingOptions.fontSize == "large") index+=2

    return fontSizes[index] || 'h1' // default to h1 (largest) if not found
  }

  const startInactivityTimer = () => {
    if (inactivityTimeout.current) {
      clearTimeout(inactivityTimeout.current);
    }

    inactivityTimeout.current = setTimeout(() => {
      setDirection(1)
      next();
    }, 2500);
  };

  // Populate list with components, including all questions
  const questions: JSX.Element[] = [
    <StartOptions {...startingOptions} handleFontSize={handleFontSize} updateFields={updateStartingOptions}/>, 
    <Details {...startingOptions} {...data} handleFontSize={handleFontSize} updateFields={updateData} showDOBError={showDOBError} showNHIError={showNHIError} />, 
    <Blurb {...startingOptions} handleFontSize={handleFontSize}/>, 
    <MedicineSelection {...startingOptions} {...data} handleFontSize={handleFontSize} updateFields={updateData}/>, 
  ];

  const handleExampleSliderInteraction = (value: boolean) => {
    setExampleSliderUsed(value);
  };

  questionWordings.forEach(
    question => {questions.push(
      question.id === 0 
        ? <ExampleQuestion questionID={question.id} question={question.wording} {...data} {...startingOptions} handleFontSize={handleFontSize} updateFields={updateData} handleExampleSliderInteraction={handleExampleSliderInteraction}/> 
        : <Question questionID={question.id} question={question.wording} {...data} {...startingOptions} handleFontSize={handleFontSize} updateFields={updateData} startInactivityTimer={startInactivityTimer} inactivityTimeout={inactivityTimeout} direction={direction}/>
    )})

  questions.push(
    <AdditionalInfo {...startingOptions} {...data} handleFontSize={handleFontSize} updateFields={updateData}/>,
    <FurtherInfo {...startingOptions} {...data} handleFontSize={handleFontSize} updateFields={updateData} showWrittenFormat={showWrittenFormat} setShowWrittenFormat={setShowWrittenFormat}/>,
    <PreviewSubmission {...startingOptions} {...data} handleFontSize={handleFontSize} updateFields={updateData}/>
  )

  // Create multi-step questionnaire form
  const {
    step, 
    currentStepIndex,
    numberOfSteps,
    isFirstStep, 
    isLastStep,
    isAboutToStart,
    isDetailsStep,
    isMedicineSelectionStep,
    isAQuestion,
    isWrittenFormatStep,
    steps,
    back, 
    next
  } = MultiStepForm(questions);

  const [progress, setProgress] = useState(getNewProgress(0))

  // Calculate new value for progress bar
  function getNewProgress(buffer : number) {
    return ((currentStepIndex + buffer) * 100) / (numberOfSteps - 1)
  }

  // Update current questionnaire data
  function updateData(fields: Partial<QuestionnaireData>) {
    setData(prev => {
      return { ...prev, ...fields }
    })
  }

  // Update the selected starting options
  function updateStartingOptions(fields: Partial<StartingOptions>) {
    setStartingOptions(prev => {
      return { ...prev, ...fields }
    })
  }

  function displayVisualisation() {
    data.dateOfBirth = submissionFormatDateOfBirth(data.dateOfBirth);
    data.submissionTime = submissionformatSubmissionTime(data.submissionTime);
    setVisualisation(true)
  }

  function allFieldsInputted() {
    if (isDetailsStep) {
      if (data.NHI && data.NHI.length != 7) {
        return false
      }
      return data.firstName !== "" && data.lastName !== "" && !(data.dateOfBirth.split('/').includes(""))
    } else if (isMedicineSelectionStep) {
      return data.responses.medicineSelection.medicineSelections.includes(true)
    } else if (isAQuestion) {
      return exampleSliderUsed
    } else if (isWrittenFormatStep) {
      if (showWrittenFormat) {
        return data.responses.furtherInfo.writtenFormats.some(item => item !== '') || data.responses.furtherInfo.otherFormats !== ''
      }
      return showWrittenFormat == false
    }
    return true
  }

  function checkValidDOB() {
    const [day, month, year] = data.dateOfBirth.split('/')
    const parsedDate = parse(`${day}/${month}/${year}`, "dd/MM/yyyy", new Date())
    if (isValid(parsedDate) && parseInt(year, 10) >= new Date().getFullYear() - 122 && parsedDate <= new Date()) { // check that date is valid, date is >= 122 and is <= today's date
      setShowDOBError(false)
      return true
    }
    setShowDOBError(true)
    return false
  }

  function checkValidNHI() {
    if (validateNHI(data.NHI) || data.NHI === "") {
      setShowNHIError(false)
      return true
    }
    setShowNHIError(true)
    return false
  }

  function validateDetailsInputs() {
    let validDOB = checkValidDOB()
    let validNHI = checkValidNHI()
    return validDOB && validNHI
  }

  function goBack() {
    setDirection(-1)
    back()
    setProgress(getNewProgress(-1))
  }

  /*
  function goToStep(index : number) {
    goTo(index)
    setProgress(getNewProgress(-(currentStepIndex - index)))
  }
  */

  async function onSubmitResponse(e: FormEvent) {
    e.preventDefault()
    if (isDetailsStep && !validateDetailsInputs()) {
      return false // prevent submission if dob or nhi is invalid
    }
    if (!isLastStep) {
      setProgress(getNewProgress(1))
      setDirection(1)
      return next();
    }
    
    data.submissionTime = (new Date().toISOString());

    try {
        const response = await submitResponse(data); // connects to backend here
        setSubmittedStatus(true);
        console.log("Response submitted successfully:", response);

    } catch (err: any) {
        console.error("Submission failed:", err.message);
    }
  }

  return (
    <div>
      <Navbar theme='light' isLoggedIn={false}/>
      
      {!isSubmitted && 
        <form onSubmit={onSubmitResponse}>
          {!isFirstStep && <div className="p-6 pb-0 sm:p-8 sm:pb-0 max-w-screen-md mx-auto"><Progress value={progress} /></div>}
          <div className={clsx("sm:min-h-[660px] h-[calc(100svh-140px)] sm:h-[calc(100svh-158px)] flex flex-col justify-between", {"min-h-[576px]": startingOptions.fontSize == "small", "min-h-[592px]": startingOptions.fontSize == "medium", "min-h-[620px]": startingOptions.fontSize == "large"})}>
            <MaxWidthWrapper className='max-w-screen-sm'>

            {/* Show questionnaire progress */}
            {isAQuestion && (currentStepIndex-4 != 0) && <p className={clsx(`text-${handleFontSize("h6")} sm:text-${handleFontSize("h5")} font-medium text-center sm:h-24`, {"h-20": startingOptions.fontSize === "small" || startingOptions.fontSize === "medium", "h-16": startingOptions.fontSize === "large"})}>{currentStepIndex - 4} / {steps.length - 8}</p>}

              {/* Display specific component */}
              {step}
            </MaxWidthWrapper>

            {/* Render buttons based on index */}
            {!isFirstStep && <div className="flex flex-col w-full items-center space-y-4 pb-12">
              <Button type={allFieldsInputted() ? 'submit' : 'button'} className={`w-[150px] h-[30px] text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("p")}`} variant={allFieldsInputted() ? 'default' : 'ghost'}>
                  {!isLastStep && !isAboutToStart ? "Continue": (isAboutToStart ? "Start": "Submit" )}
              </Button>
              <Button type="button" variant="link" onClick={goBack} className={`w-[150px] h-[30px] text-mobile-${handleFontSize("h6")} sm:text-${handleFontSize("p")} relative focus-visible:ring-offset-0`}><ChevronLeft className="h-4 w-4 mr-2 absolute left-9"/>Back</Button>
            </div>}
          </div>
        </form>
      }

      {/* Submission page */}
      {isSubmitted && !visualisationShown &&
        <MaxWidthWrapper className='max-w-screen-sm flex flex-col justify-center items-center gap-4 h-[calc(100svh-66.92px)] sm:h-[calc(100svh-75.91px)]'>
          <h2 className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} font-semibold text-center`}>Thank you for answering these questions.</h2>
          <Button type="button" variant="outline" onClick={displayVisualisation} className={`text-mobile-${handleFontSize("h4")} sm:text-${handleFontSize("h4")} hover:bg-accent-5 hover:border-2 hover:border-primary`}>View Responses</Button>
        </MaxWidthWrapper>
      }

      {/* {isLastStep && 
        <div className="flex flex-row items-center">
          <Button type="button" onClick={() => goToStep(1)}>Edit Details</Button><br/><br/>
          <Button type="button" onClick={() => goToStep(3)}>Edit Medicines</Button>
        </div>
      } */}

      {/* Patient view of response visualisation */}
      {visualisationShown && 
        <MaxWidthWrapper className="relative">
          <br />
          <br />
          <Visualisation {...data}/>
        </MaxWidthWrapper>
      }
    </div>
  )
}

export default Questionnaire;