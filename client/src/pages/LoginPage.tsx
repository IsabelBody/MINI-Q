// LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z, ZodError } from 'zod';
import { loginClinician } from '@/apiService';

import Navbar from '@/components/Navbar';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TriangleAlert } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';

// Define the Zod schema for validation
const schema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Define TypeScript types based on the schema
type FormValues = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<FormValues>({
    email: '',
    password: ''
  });
  const [inputErrors, setInputErrors] = useState<{ email?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isFocused, setIsFocused] = useState<{ [key: string]: boolean }>({
    email: false,
    password: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    try {
      if (inputErrors.email && name === "email") {
        schema.shape.email.parse(value);
      } else if (inputErrors.password && name === "password") {
        schema.shape.password.parse(value);
      }
      setInputErrors((prevInputErrors) => ({
        ...prevInputErrors,
        [name]: undefined,
      }));
    } catch (err) {
      // Change the error message if error still exists
      if (err instanceof ZodError) {
        const inputError = err.errors[0]?.message || undefined;
        setInputErrors((prevInputErrors) => ({
          ...prevInputErrors,
          [name]: inputError,
        }));
      }
    }
  };

  const handleFocus = (field: string) => {
    setIsFocused(prevState => ({ ...prevState, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused(prevState => ({ ...prevState, [field]: false }));
  };

  const handleLogin = async (formData: { email: string; password: string }) => {
    try {
      const response = await loginClinician(formData.email, formData.password);
      const { token, clinicianName, isAdmin } = response; 
  
      console.log('API Response:', response);
  
      localStorage.setItem('token', token);
      login(clinicianName, isAdmin, token); 
  
      setInputErrors({});
      setLoginError(null);
      navigate('/portal');
    } catch (err) {
      setLoginError("Your email and password didn't match. Please check that what you've entered is correct.");
    }
  };
  
  
  
  
  
  

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      schema.parse(formData);
      await handleLogin(formData);

    } catch (err) {
      // Set most relevant validation error
      if (err instanceof ZodError) {
        const inputError = err.errors[0].message;
        setInputErrors((prevInputErrors) => ({
          ...prevInputErrors,
          [err.errors[0].path[0]]: inputError,
        }));
      }
    }
  };

  return (
    <div className="bg-secondary-110 min-h-full">
      <Navbar theme='dark' isLoggedIn={false} className="z-10"/>
      <MaxWidthWrapper className="xs:max-w-screen-xs">
        <h1 className="text-mobile-h1 sm:text-h1 sm:pb-6 font-semibold text-white text-center xs:pt-12">Clinician Login</h1><br />

        <form className="bg-secondary-5 p-6 sm:p-10 rounded-lg" onSubmit={handleSubmit}>

          <div className="space-y-1">
            <Label className={clsx("text-secondary text-mobile-h4", { "font-bold": isFocused.email, "text-destructive": inputErrors.email })} htmlFor="email">Email</Label>
            <Input className={clsx("focus-visible:ring-secondary-75 text-mobile-h4 p-5", { "ring-2 ring-destructive focus-visible:ring-destructive": inputErrors.email })} id="email" placeholder="Your email" name="email" value={formData.email} onChange={handleChange} onFocus={() => handleFocus('email')} onBlur={() => handleBlur('email')} />
            {inputErrors.email &&
              <div className="text-destructive text-sm font-medium flex gap-1 bg-bg-red/50 p-1 rounded-sm">
                <TriangleAlert className="h-4" />{inputErrors.email}
              </div>}
          </div>

          <br />

          <div className="space-y-1">
            <Label className={clsx("text-secondary text-mobile-h4", { "font-bold": isFocused.password, "text-destructive": !inputErrors.email && inputErrors.password })} htmlFor="password">Password</Label>
            <Input className={clsx("focus-visible:ring-secondary-75 text-mobile-h4 p-5", { "ring-2 ring-destructive focus-visible:ring-destructive": !inputErrors.email && inputErrors.password })} id="password" type="password" placeholder="Your password" name="password" value={formData.password} onChange={handleChange} onFocus={() => handleFocus('password')} onBlur={() => handleBlur('password')} />
            {inputErrors.password &&
              <div className="text-destructive text-sm font-medium flex gap-1 bg-bg-red/50 p-1 rounded-sm">
                <TriangleAlert className="h-4" />{inputErrors.password}
              </div>}
          </div>

          {loginError &&
            <div className="mt-6 text-destructive font-semibold flex gap-2 bg-bg-red/50 p-2 rounded-sm">
              <TriangleAlert className="h-6 w-10" />
              <div>
                <h3 className="text-h5 font-semibold">We couldn't log you in</h3>
                <p className="text-sm font-normal">{loginError}</p>
              </div>
            </div>}

          <div className="w-full text-center">
            <Button className="text-mobile-h4 mt-12 sm:mt-12 bg-secondary hover:bg-secondary/80 sm:text-h5 rounded-lg w-32 sm:w-56" type="submit">Login</Button>
          </div>

        </form>
      </MaxWidthWrapper>
    </div>
  );
};

export default LoginPage;
