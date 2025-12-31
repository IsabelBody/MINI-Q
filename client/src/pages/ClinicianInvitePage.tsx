import React from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Navbar from '@/components/Navbar';
import InviteClinician from "../components/Portal/InviteClinician";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ClinicianInvitePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-secondary-110 min-h-full">
      <Navbar theme="dark" isLoggedIn={true} className="z-10"/>
      <div className="p-8 pb-0 max-w-screen-md mx-auto">
        <Button
          type="button"
          variant="link"
          className="sm:pl-2 sm:pr-5 px-2 flex gap-1 h-6 sm:h-10 text-sm sm:text-h5 text-white"
          onClick={() => navigate("/portal")}
        >
          <ChevronLeft className="h-3 w-3 sm:h-5 sm:w-6" />
          Back to portal
        </Button>
      </div>
      <MaxWidthWrapper className="xs:max-w-screen-xs pt-0">
        <InviteClinician />
      </MaxWidthWrapper>
    </div>
  );
};

export default ClinicianInvitePage;
