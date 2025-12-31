import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/MINI-Q-logo.png';
import clsx from 'clsx';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useAuth } from '../context/AuthContext'; 

interface NavProps {
  theme: 'light' | 'dark';
  isLoggedIn: boolean;
  className?: string;
}

const Navbar: React.FC<NavProps> = ({ theme, isLoggedIn, className }) => {
  const navigate = useNavigate();
  const { logout, clinicianName, isAdmin } = useAuth();

  const handleLogout = async () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={clsx("bg-secondary-100 bg-taniko-pattern sticky", className)}>
      <div className={clsx("flex justify-center", { "flex justify-between mx-auto max-w-screen-lg px-8 items-center": isLoggedIn })}>
        <Link to="/">
          <img src={logo} alt="MINI-Q Logo" className="w-24 md:w-32 py-2" />
        </Link>
        {isLoggedIn &&
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-transparent hover:bg-transparent text-white hover:text-accent-100 hover:underline hover:underline-offset-4 hover:decoration-accent-100 text-mobile-h6 sm:text-h5 data-[state=open]:text-accent-100 data-[state=open]:underline data-[state=open]:underline-offset-4 data-[state=open]:decoration-accent-100">
                  {clinicianName || 'Clinician'} 
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="w-32 sm:w-40 text-mobile-p sm:text-h6 font-medium">
                    {isAdmin && ( 
                      <>
                        <li>
                          <NavigationMenuLink className="block select-none px-3 sm:px-4 py-2 hover:text-accent-105 hover:underline hover:underline-offset-4 hover:decoration-accent-100" onClick={() => navigate('/invite-clinician')}>Invite a clinician</NavigationMenuLink>
                        </li>
                        <li>
                          <NavigationMenuLink className="block select-none px-3 sm:px-4 py-2 hover:text-accent-105 hover:underline hover:underline-offset-4 hover:decoration-accent-100" onClick={() => navigate('/privacy-editor')}>Edit statement</NavigationMenuLink>
                        </li>
                      </>
                    )}
                    <li>
                      <NavigationMenuLink className="block select-none px-3 sm:px-4 py-2 hover:text-accent-105 hover:underline hover:underline-offset-4 hover:decoration-accent-100" onClick={handleLogout}>Log out</NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        }
      </div>
      {theme === 'light' && <div className="bg-light-banner bg-repeat h-6" />}
      {theme === 'dark' && <div className="bg-dark-banner h-6" />}
    </div>
  );
};

export default Navbar;
