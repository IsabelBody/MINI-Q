import React, { HTMLProps, ReactNode, useEffect, useRef, useState } from 'react'
import jsPDF from 'jspdf'
import { Document, PDFViewer, Page, Image } from '@react-pdf/renderer'
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import clsx from 'clsx';
import { Send } from "lucide-react"
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import * as VisuallyHidden from '@radix-ui/react-visually-hidden';
import { sendEmail } from '@/apiService';
import { useAuth } from '@/context/AuthContext';

interface PDFViewerWrapperProps extends HTMLProps<HTMLDivElement> {
    children: ReactNode;
    hasMIMEError: boolean;
    updateHasMIMEErrorState: (newState: boolean) => void;
    updateHasLoadedState: (newState: boolean) => void;
    setShowLoadingSpinner: React.Dispatch<React.SetStateAction<boolean>>
}

interface PDFPreviewModalProps {
    imageData : any
    imageWidth : number
    imageHeight : number
    marginTop : number
    generatedPDF : jsPDF
    PDFName : string
    setShowLoadingSpinner: React.Dispatch<React.SetStateAction<boolean>>
}

const PDFViewerWrapper: React.FC<PDFViewerWrapperProps> = ({ className, children, hasMIMEError, updateHasMIMEErrorState, updateHasLoadedState, setShowLoadingSpinner, ...props }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    
    // render PDF preview if available
    useEffect(() => {
        const checkIfMIMEErrorMessagePresent = () => {
            if (contentRef.current) {
                const iframe = contentRef.current.querySelector('iframe') as HTMLIFrameElement;
                if (iframe) {
                    const handleLoad = () => {
                        try {
                            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
                            if (iframeDocument) {
                                
                                const bodyElement = iframeDocument.body;

                                if (bodyElement) {
                                    const bodyHasMIMEError = bodyElement.innerHTML.includes(
                                        '<!-- no enabled plugin supports this MIME type -->'
                                    );
                                    updateHasMIMEErrorState(bodyHasMIMEError);
                                    setShowLoadingSpinner(false)
                                    updateHasLoadedState(true)
                                }
                            }
                        } catch (error) {
                            console.error('Error accessing iframe document:', error);
                            updateHasMIMEErrorState(true)
                            setShowLoadingSpinner(false)
                            updateHasLoadedState(true)
                        }
                    }
                    iframe.addEventListener('load', handleLoad);
                }
            }
        }
        checkIfMIMEErrorMessagePresent();
    }, []);
  
    return (
        <div
            ref={contentRef}
            className={`${hasMIMEError ? 'hidden' : 'block'} ${className ?? ''}`}
            data-class="pdfViewer"
            {...props}
        >
            {children}
        </div>
    );
};


const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ imageData, imageWidth, imageHeight, marginTop, generatedPDF, PDFName, setShowLoadingSpinner}) =>  {
    const { clinicianEmail, updateSessionEmail } = useAuth();
    const [hasMIMEError, setHasMIMEError] = useState(true); // default to display nothing
    const [hasLoaded, setHasLoaded] = useState(false);
    const [emailAddress, setEmailAddress] = useState(clinicianEmail!);
    const [emailSendingStatus, setEmailSendingStatus] = useState('');

    const updateHasMIMEErrorState = (newState: boolean | ((prevState: boolean) => boolean)) => {
        setHasMIMEError(newState)
    }

    const updateHasLoadedState = async (newState: boolean | ((prevState: boolean) => boolean)) => {
        setHasLoaded(newState)
        setEmailSendingStatus('')
    }

    const downloadPDF = () => {
        updateHasLoadedState(false)
        generatedPDF.save(PDFName)
    }

    const updateEmailAddress = (email : string) => {
        setEmailAddress(email)
        setEmailSendingStatus('')
    }

    const sendToGivenEmail = async () => {
        let dataURI = generatedPDF.output('datauristring');
        setEmailSendingStatus("Sending email...")

        try {
            await sendEmail(emailAddress, dataURI, PDFName)
            setEmailSendingStatus("Sent! Please also check your Spam.")
            updateSessionEmail(emailAddress)
        } catch (err: any) {
            console.error("Sending email failed:", err.message)
            setEmailSendingStatus("Failed to send. Please check the email address.")
        }
    }

    return (
        <div className={clsx({"bg-secondary-110/95 inset-0 fixed": hasLoaded})} >
            <AlertDialogContent className={clsx('gap-2 min-w-max sm:w-full min-h-max max-h-full rounded-lg', {"hidden": !hasLoaded})}>
                <VisuallyHidden.Root>
                    <AlertDialogHeader>
                        <AlertDialogTitle className=" text-mobile-p xs:text-h5">Export to PDF</AlertDialogTitle>
                    </AlertDialogHeader>
                </VisuallyHidden.Root> 

                <AlertDialogDescription className={clsx("text-primary text-mobile-sm xs:text-sm", {"hidden": true})}>
                    Download or print patient's MINI-Q responses.
                </AlertDialogDescription>

                {/* Sending PDF to specified email address */}
                <div>
                    <div className="flex w-full">
                        <div className='flex-1'>
                            <Label htmlFor="email" className="text-primary text-mobile-p sm:text-h5">Send PDF via email</Label>
                            <div className='flex flex-row'>
                                <Input id="email" className="text-primary text-mobile-p sm:text-p sm:h-10 rounded-r-none z-10 focus-visible:ring-primary-10 border-r-0" placeholder='Email address...' value={emailAddress} onChange={e => updateEmailAddress(e.target.value)}/>
                                <Button type="submit" className="rounded-l-none h-8 p-2 sm:p-4 sm:h-10 bg-primary hover:bg-primary-25 text-white hover:text-primary" onClick={sendToGivenEmail}>
                                    <Send className="h-3 w-3 sm:h-5 sm:w-5"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <p className={clsx("text-mobile-p sm:text-h5 h-5 min-w-[282px] sm:min-w-[462px]", {"text-destructive": emailSendingStatus === "Failed to send. Please check the email address.", "text-secondary-50/80": emailSendingStatus === "Sending email..."})}>{emailSendingStatus}</p>
                </div>
                
                {/* If styling is adjusted in the pop-up window, change the style of PDFViewer only */}
                <PDFViewerWrapper hasMIMEError={hasMIMEError} updateHasMIMEErrorState={updateHasMIMEErrorState} updateHasLoadedState={updateHasLoadedState} setShowLoadingSpinner={setShowLoadingSpinner}>
                    <PDFViewer className={`min-w-full h-full`} showToolbar={true} style={{height: '43rem', maxHeight: 'calc(100svh - 200px)'}}>
                        <Document title='Patient Response'>
                            <Page size="A4" style={{display: 'flex', flexDirection: 'row', justifyContent: 'center', padding: '12px 30px', marginTop: marginTop + 'px'}}>
                                <Image src={imageData} style={{width: imageWidth, height: imageHeight}} />
                            </Page>
                        </Document>
                    </PDFViewer>
                </PDFViewerWrapper>

                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => updateHasLoadedState(false)} className="text-xs sm:px-4 h-8 hover:bg-accent-5">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={downloadPDF} className="text-xs sm:px-4 h-8">Download</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </div>
    )
}

export default PDFPreviewModal;