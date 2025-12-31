import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { registerClinician } from '../apiService'; 
import Navbar from '@/components/Navbar';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { TriangleAlert, UserRoundCheck } from 'lucide-react';
import clsx from 'clsx';

const schema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [isFocused, setIsFocused] = useState<{ [key: string]: boolean }>({
        name: false,
        email: false,
        password: false,
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null); 

    const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormValues>({
        resolver: zodResolver(schema),
    });

    const handleFocus = (field: string) => {
        setIsFocused((prevState) => ({ ...prevState, [field]: true }));
    };
    
    const handleBlur = (field: string) => {
        setIsFocused((prevState) => ({ ...prevState, [field]: false }));
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const tokenParam = query.get('token');
        const nameParam = query.get('name');
        const emailParam = query.get('email');

        setToken(tokenParam);

        if (nameParam) setValue('name', nameParam);
        if (emailParam) setValue('email', emailParam);

        if (!tokenParam) {
            setError('Token is missing.');
        }
    }, [location.search, setValue]);

    const onSubmit = async (data: FormValues) => {
        if (!token) {
            setError('Invalid or missing token.');
            return;
        }

        try {
            const response = await registerClinician(data.name, data.email, data.password, token);
            setSuccess(response.message); 
            setError(null); 

            setTimeout(() => {
                navigate('/login');
            }, 1000);  

        } catch (err: any) {
            setError(err.message);
            setSuccess(null); 
        }
    };

    

    return (
        <div className="bg-secondary-110 min-h-full">
            <Navbar theme='dark' isLoggedIn={false} className="z-10"/>
            <MaxWidthWrapper className="xs:max-w-screen-xs">
                <h1 className="text-mobile-h1 sm:text-h1 pb-4 sm:pb-6 font-semibold text-white text-center xs:pt-12">Clinician Registration</h1>

                <form className="bg-secondary-5 p-6 sm:p-10 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
                    <div className="space-y-1">
                        <Label className={clsx("text-secondary", { "font-bold": isFocused.name,"text-destructive": errors.name })} htmlFor="name">Name</Label>
                        <Input 
                            className={clsx("focus-visible:ring-secondary-75 text-mobile-h4 sm:text-h5 p-5", { "ring-2 ring-destructive focus-visible:ring-destructive": errors.name,})}
                            id="name" 
                            placeholder="Your name" 
                            {...register('name')}
                            onFocus={() => handleFocus("name")}
                            onBlur={() => handleBlur("name")}
                        />
                        {errors.name && 
                            <div className="text-destructive text-sm font-medium flex gap-1 bg-bg-red/50 p-1 rounded-sm">
                                <TriangleAlert className="h-4"/>{errors.name.message}
                            </div>}
                    </div>

                    <br/>

                    <div className="space-y-1">
                        <Label className={clsx("text-secondary", { "font-bold": isFocused.email, "text-destructive": errors.email })} htmlFor="email">Work Email</Label>
                        <Input 
                            className={clsx("focus-visible:ring-secondary-75 text-mobile-h4 sm:text-h5 p-5", { "ring-2 ring-destructive focus-visible:ring-destructive": errors.email })}
                            id="email" 
                            placeholder="Your clinician email" 
                            {...register('email')}
                            onFocus={() => handleFocus("email")}
                            onBlur={() => handleBlur("email")}
                        />
                        {errors.email && 
                            <div className="text-destructive text-sm font-medium flex gap-1 bg-bg-red/50 p-1 rounded-sm">
                                <TriangleAlert className="h-4"/>{errors.email.message}
                            </div>}
                    </div>

                    <br/>

                    <div className="space-y-1">
                        <Label className={clsx("text-secondary", { "font-bold": isFocused.password, "text-destructive": errors.password })} htmlFor="password">Password</Label>
                        <Input 
                            className={clsx("focus-visible:ring-secondary-75 text-mobile-h4 sm:text-h5 p-5", { "ring-2 ring-destructive focus-visible:ring-destructive": errors.password })}
                            id="password" 
                            type="password" 
                            placeholder="Your password" 
                            {...register('password')}
                            onFocus={() => handleFocus("password")}
                            onBlur={() => handleBlur("password")}
                        />
                        {errors.password && 
                            <div className="text-destructive text-sm font-medium flex gap-1 bg-bg-red/50 p-1 rounded-sm">
                                <TriangleAlert className="h-4"/>{errors.password.message}
                            </div>}
                    </div>

                    {error && 
                    <div className="mt-6 text-destructive font-semibold flex gap-2 bg-bg-red/50 p-2 rounded-sm">
                        <TriangleAlert className="h-6 w-10"/>
                        <div>
                            <h3 className="text-h5 font-semibold">Registration failed</h3>
                            <p className="text-sm font-normal">{error}</p>
                        </div>
                    </div>}

                    {success && 
                    <div className="flex gap-2 mt-6 justify-center text-success font-semibold bg-bg-green/50 p-2 rounded-sm">
                        <UserRoundCheck className="h-4 w-4 sm:h-6 sm:w-6"/>
                        <h3 className="text-mobile-p sm:text-h5 font-semibold">Registration successful</h3>
                        {/* <p className="text-sm font-normal">{success}</p> */}
                    </div>}

                    <div className="w-full text-center">
                        <Button className="mt-12 sm:mt-12 bg-secondary hover:bg-secondary/80 sm:text-h5 rounded-lg w-32 sm:w-56" type="submit">Register</Button>
                    </div>

                </form>
            </MaxWidthWrapper>
        </div>
    );
};

export default RegisterPage;
