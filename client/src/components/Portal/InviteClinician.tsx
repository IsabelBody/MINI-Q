import React, { useEffect, useState } from "react";
import { z, ZodError } from "zod";
import { inviteClinician } from "../../apiService";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { MailCheck, TriangleAlert } from "lucide-react";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; 

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
});

type FormValues = z.infer<typeof schema>;

const InviteClinician: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/portal');
    }
  }, [isAdmin, navigate]);

  const [formData, setFormData] = useState<FormValues>({
    name: "",
    email: "",
  });
  const [inputErrors, setInputErrors] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [isAdminStatus, setIsAdminStatus] = useState(false); 
  const [isFocused, setIsFocused] = useState<{ [key: string]: boolean }>({
    name: false,
    email: false,
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFocus = (field: string) => {
    setIsFocused((prevState) => ({ ...prevState, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused((prevState) => ({ ...prevState, [field]: false }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (success) setSuccess("");

    try {
      if (inputErrors.name && name === "name") {
        schema.shape.name.parse(value);
      } else if (inputErrors.email && name === "email") {
        schema.shape.email.parse(value);
      }
      setInputErrors((prevInputErrors) => ({
        ...prevInputErrors,
        [name]: undefined,
      }));
    } catch (err) {
      if (err instanceof ZodError) {
        const inputError = err.errors[0]?.message || undefined;
        setInputErrors((prevInputErrors) => ({
          ...prevInputErrors,
          [name]: inputError,
        }));
      }
    }
  };

  const handleInvite = async () => {
    setLoading(true);
    setInputErrors({});
    setSuccess(null);

    try {
      schema.parse(formData);
      await inviteClinician({ ...formData, isAdminStatus }, isAdmin); 
      console.log({ ...formData, isAdminStatus });
      setSuccess("Clinician invited successfully!");
      setFormData({ name: "", email: "" });
      setIsAdminStatus(false); 
    } catch (error) {
      console.error("Error inviting clinician:", error);
      if (error instanceof ZodError) {
        const inputError = error.errors[0].message;
        setInputErrors((prevInputErrors) => ({
          ...prevInputErrors,
          [error.errors[0].path[0]]: inputError,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-mobile-h2 sm:text-h1 sm:pb-6 font-semibold text-white text-center pt-6 xs:pt-12 mb-6">
        Invite a clinician
      </h1>
      <div className="bg-secondary-5 p-6 sm:p-10 rounded-lg">
        <div className="space-y-4">
          <div className="space-y-1 pb-1 sm:pb-3">
            <Label
              htmlFor="name"
              className={clsx("text-secondary text-mobile-h5 sm:text-h5", {
                "font-bold": isFocused.name,
                "text-destructive": inputErrors.name,
              })}
            >
              Name
            </Label>
            <Input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="text-mobile-h4 sm:text-h6 p-5"
              placeholder="Name"
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
            />
            {inputErrors.name && (
              <div className="text-destructive text-sm font-medium flex gap-1 bg-bg-red/50 p-1 rounded-sm">
                <TriangleAlert className="h-4" />
                {inputErrors.name}
              </div>
            )}
          </div>

          <div className="space-y-1 pb-1 sm:pb-3">
            <Label
              htmlFor="email"
              className={clsx("text-secondary text-mobile-h5 sm:text-h5", {
                "font-bold": isFocused.email,
                "text-destructive": inputErrors.email,
              })}
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              name="email"
              className="text-mobile-h4 sm:text-h6 p-5"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
            />
            {inputErrors.email && (
              <div className="text-destructive text-sm font-medium flex gap-1 bg-bg-red/50 p-1 rounded-sm">
                <TriangleAlert className="h-4" />
                {inputErrors.email}
              </div>
            )}
          </div>

          <div className="space-y-1 pb-1 sm:pb-3">
            <Label className="text-secondary text-mobile-h5 sm:text-h5">Access Permissions</Label>
            <Select value={isAdminStatus ? 'admin' : 'clinician'} onValueChange={(value) => setIsAdminStatus(value==='admin')}>
              <SelectTrigger className="text-mobile-h6 sm:text-h6 bg-white p-5 h-8 sm:h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clinician" className="text-mobile-h6 sm:text-p">Clinician</SelectItem>
                <SelectItem value="admin" className="text-mobile-h6 sm:text-p">Administrator</SelectItem>
              </SelectContent>
            </Select>
            {isAdminStatus && <p className="italic text-secondary-50 text-mobile-p sm:text-h6">Note: Administrators can invite clinicians.</p>}
          </div>

          {success && (
            <div className="flex justify-center text-success font-semibold bg-bg-green/50 text-mobile-p sm:text-h5 p-2 gap-2 rounded-sm">
              <MailCheck className="h-4 w-4 sm:h-6 sm:w-6" />
              {success}
            </div>
          )}

          <div className="w-full text-center">
            <Button
              onClick={handleInvite}
              disabled={loading}
              className="text-mobile-h6 sm:text-h5 mt-4 sm:mt-6 bg-secondary hover:bg-secondary/80 rounded-lg w-32 sm:w-56"
            >
              {loading ? "Sending..." : "Send Invite"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteClinician;
