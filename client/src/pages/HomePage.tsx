import React from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import MINIQLogo from './../assets/MINI-Q-logo.png'

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className="bg-secondary-100 bg-taniko-pattern h-full w-full flex flex-col justify-center items-center">
      <img src={ MINIQLogo } alt="MINI-Q logo" className="w-56 sm:w-[28rem]"/>
      <h4 className="py-4 text-mobile-h6 min-[549px]:text-mobile-h3 sm:text-h4 font-medium text-white text-center max-w-64 min-[549px]:max-w-sm sm:max-w-xl">A collection tool to tell your health professional what information you require about your medication.</h4>
      <br/>
      <div className="flex flex-col sm:flex-row">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/questions') }
          className="text-mobile-h3 sm:text-h3 w-56 sm:w-64 h-16 sm:h-32 rounded-lg sm:rounded-xl my-2 sm:mx-6 font-semibold border-secondary-100 hover:bg-accent"
        >
          I'm a patient
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/portal') }
          className="text-mobile-h3 sm:text-h3 w-56 sm:w-64 h-16 sm:h-32 rounded-lg sm:rounded-xl my-2 sm:mx-6 font-semibold border-secondary-100 hover:bg-accent"
        >
          I'm a clinician
        </Button>
      </div>
    </div>
  )
}

export default HomePage