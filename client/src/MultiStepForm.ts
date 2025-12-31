import { ReactElement, useState } from 'react'

export function MultiStepForm(steps: ReactElement[]) {
  const numberOfSteps = steps.length
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  
  // Ensure form doesn't go beyond the last step when going forward
  function next() {
    setCurrentStepIndex(i => {
      if (i >= steps.length - 1) return i
      return i + 1
    })
  }

  // Ensure form doesn't go beyond first step when going back
  function back() {
    setCurrentStepIndex(i => {
      if (i <= 0) return i
      return i - 1
    })
  }

  function goTo(index: number) {
    setCurrentStepIndex(index)
  }

  return {
    currentStepIndex,
    numberOfSteps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    isAboutToStart: currentStepIndex === 4,
    isDetailsStep: currentStepIndex === 1,
    isMedicineSelectionStep: currentStepIndex === 3,
    isAQuestion: currentStepIndex >= 4 && currentStepIndex <= 24,
    isWrittenFormatStep: currentStepIndex === steps.length - 2,
    step: steps[currentStepIndex],
    steps,
    goTo,
    next,
    back,
  }
}