import React from 'react'

interface BlurbProps {
  handleFontSize: (defaultFontSize: string) => string;
}

const Blurb: React.FC<BlurbProps> = ({ handleFontSize }) => {
  return (
    <div>
        <h1 className={`text-mobile-${handleFontSize("h2")} sm:text-${handleFontSize("h2")} font-semibold`}>Patient Medicines Information Needs</h1>
        <br/>
        <p className={`text-mobile-${handleFontSize("h5")} sm:text-${handleFontSize("h5")} font-medium`}>People often have preferences with the information they would like to know
          about their medicines. Your answers will help us understand what your
          preferences for medicines information are at the moment.<br/><br/>
          There are no right or wrong answers, we are simply interested in what you think.
        </p>
    </div>
  )
}

export default Blurb;
