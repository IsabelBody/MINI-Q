import React, { useState } from 'react'
import clsx from 'clsx'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import { ChevronDown, ChevronUp, CircleArrowDown, LoaderCircle, MessageCircleWarning, PersonStanding, Pill, PillBottle } from 'lucide-react'

import { Algorithm, categoryNames } from '../algorithm.ts'
import { options } from './Questionnaire/MedicineSelection.tsx'
import PDFPreviewModal from './PDFPreviewModal.tsx'

import { Button } from './ui/button.tsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog'

interface VisualisationProps {
    actioned?: boolean
    firstName: string
    lastName: string
    NHI: string
    dateOfBirth: string
    submissionTime: string
    responses: { 
        medicineSelection: {
            medicineSelections: boolean[] ,
            specificMedicines: string,
          },
        response: { id: number, response: string }[], 
        additionalInformation: string,
        furtherInfo: {
            writtenFormats: string[],
            otherFormats: string
        }
    },
}

interface Response {
    id: number;
    response: string;
}

interface ResponseData {
    responses: Response[];
}

// Number of open/expanded sections
let numberOfOpen = 0

function calculateAge(dateOfBirth: string): number {
    const [day, month, year] = dateOfBirth.split("/")
    const birthDate = new Date(`${year}-${month}-${day}`)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
        age--;
    }
    return age
}

const Visualisation: React.FC<VisualisationProps> = ({ actioned, firstName, lastName, NHI, dateOfBirth, submissionTime, responses }) => {
    const transformedResponses : ResponseData = {
        responses: responses.response
    }

    const { 
        getNumberOfQuestionsForQuestionType,
        getOrderedCategoriesForQuestionType,
        getNumberofQuestionsRequested,
        getNotImportantQuestions,
        getNotWantedQuestions } = Algorithm(transformedResponses);

    const VIQByCategory = getOrderedCategoriesForQuestionType("VIQ")
    const IQByCategory = getOrderedCategoriesForQuestionType("IQ")
    const notImportantQuestions = getNotImportantQuestions()
    const notWantedQuestions = getNotWantedQuestions()

    const numberOfQuestionsRequested = getNumberofQuestionsRequested()
    const numberOfVIQ = getNumberOfQuestionsForQuestionType("VIQ")
    const numberOfIQ = getNumberOfQuestionsForQuestionType("IQ")
    const numberOfNWIQ = 20 - numberOfQuestionsRequested

    const [showVIQ, setVIQ] = useState((numberOfVIQ > 0) ? true : false) // whether Very Important Questions section is open
    const [showIQ, setIQ] = useState((numberOfIQ > 0) ? true : false) // whether Important Questions section is open
    const [showNWIQ, setNWIQ] = useState((numberOfNWIQ > 0) ? true : false) // whether Not Wanted / Important Questions section is open
    const [showAll, setAll] = useState(false) // whether all sections can be expanded (not all are opened yet)

    const numberOfExpandableSections = (+(numberOfVIQ > 0)) + (+(numberOfIQ > 0)) + (+(numberOfNWIQ > 0)) // counts the number of sections that are not NONE

    // Change wording of button depending on how many sections are currently open/expanded
    function updateNumberOfOpen(sectionIsOpen : boolean) {
        sectionIsOpen ? numberOfOpen += 1 : numberOfOpen -= 1
        numberOfOpen < numberOfExpandableSections ? setAll(true) : setAll(false)
    }

    // Expand or close specific sections on button click // 
    function renderVIQ() { 
        if (numberOfVIQ > 0) {
            setVIQ(!showVIQ)
            updateNumberOfOpen(!showVIQ)
        }
    }

    function renderIQ() { 
        if (numberOfIQ > 0) {
            setIQ(!showIQ)
            updateNumberOfOpen(!showIQ)
        }
    }

    function renderNWIQ() { 
        if (numberOfNWIQ > 0) {
            setNWIQ(!showNWIQ)
            updateNumberOfOpen(!showNWIQ)
        }
    }

    // Expand all sections
    function openAll() {
        if (numberOfVIQ > 0) setVIQ(true) 
        if (numberOfIQ > 0) setIQ(true)
        if (numberOfNWIQ > 0) setNWIQ(true)
        numberOfOpen = numberOfExpandableSections
    }
    
    // Change expansion of sections depending on button status
    function changeExpansion() {
        setAll(!showAll)

        if (showAll) {
            openAll()
        } else {
            setVIQ(false)
            setIQ(false)
            setNWIQ(false)
            numberOfOpen = 0
        }
    }
    
    const [viewPDF, setViewPDF] = useState(false)
    const [imageWidth, setImageWidth] = useState(0)
    const [imageHeight, setImageHeight] = useState(0)
    const [marginTop, setMarginTop] = useState(0)
    const [imageData, setImageData] = useState<any | null>(null)
    const [generatedPDF, setGeneratedPDF] = useState<any | null>(null)
    const [PDFName, setPDFName] = useState('')
    const [showLoadingSpinner, setShowLoadingSpinner] = useState<boolean>(false)

    type PDFPreviewData = {
        imageData: any
        imageWidth: number
        imageHeight: number
        marginTop: number
        generatedPDF : jsPDF
        PDFName : string
    }

    let data : PDFPreviewData = {
        imageData : imageData,
        imageWidth: imageWidth,
        marginTop: marginTop,
        imageHeight: imageHeight,
        generatedPDF : generatedPDF,
        PDFName : PDFName
    }

    const exportPDF = async () => {
        await openAll()
        setAll(false)

        // To avoid issue with text sliding downwards in PDF
        const style = document.createElement('style');
        document.head.appendChild(style);
        style.sheet?.insertRule('body > div:last-child img { display: inline-block; }');

        const input = document.getElementById("visualisation")!

        setShowLoadingSpinner(true)
        
        // Make CSS changes here (before starting to generate PDF)
        input.style.width = "960px";

        html2canvas(input, {logging: false}).then(async canvas => {
            // Reverse the CSS changes 
            input.style.removeProperty('width');

            const pdf = new jsPDF('p', 'mm', 'a4', true)
            
            // Dimensions for high-resolution PDF for Download
            let top = 7
            let PDFPreviewTop = top
            let PDFimageHeight = pdf.internal.pageSize.getHeight() - top
            let PDFimageWidth = canvas.width / canvas.height * PDFimageHeight
            let margin = (pdf.internal.pageSize.getWidth() - PDFimageWidth) / 2

            // Dimensions for PDF in preview modal
            const imageData = canvas.toDataURL('image/png')
            let imageHeight = 800

            // Dimensions for desktop view (when the visualisation is widest)
            if (PDFimageWidth > pdf.internal.pageSize.getWidth()) {
                top = 20
                PDFPreviewTop += 40
                margin = 10
                PDFimageWidth = pdf.internal.pageSize.getWidth() - (margin * 2)
                PDFimageHeight = canvas.height / canvas.width * PDFimageWidth

                imageHeight = 600
            }
            
            // Generating PDF image for PDF Preview
            const imageWidth = canvas.width / canvas.height * imageHeight
            setImageWidth(imageWidth)
            setImageHeight(imageHeight)
            setMarginTop(PDFPreviewTop)
            setImageData(imageData)

            setViewPDF(true)

            // Generate the high-resolution PDF for Download
            pdf.addImage(imageData, 'PNG', margin, top, PDFimageWidth, PDFimageHeight, '', 'FAST')
            setGeneratedPDF(pdf)
            
            const pdfName = NHI != "" ? "MINI-Q Response " + firstName +  " " + lastName + " " + NHI : "MINI-Q Response " + firstName +  " " + lastName
            setPDFName(pdfName)

            style.remove()
        })
    }

    return (
        <div className="relative">
            <div id="visualisation" className="flex flex-col gap-4 pb-4 @container">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                        <h1 className="text-mobile-h2 sm:text-h1 @[960px]:text-h1 font-bold">{firstName} {lastName}</h1>
                        {actioned && <div className="bg-secondary-25 text-secondary-75 py-1 px-4 sm:px-6 @[960px]:px-6 rounded-sm text-mobile-p sm:text-h6 @[960px]:text-h6 font-medium" data-html2canvas-ignore="true">Actioned</div>}
                    </div>
                    <p className="text-mobile-p sm:text-h5 @[960px]:text-h5 text-secondary-50"><i>Submitted {(submissionTime)}</i></p>
                </div>
                
                <div className="flex justify-between flex-wrap gap-2 mb-3 sm:mb-6 @[960px]:mb-6">
                    <Table className="sm:max-w-80 @[960px]:max-w-80 sm:mt-1 @[960px]:mt-1">
                        <TableHeader>
                            <TableRow className="bg-accent">
                                {NHI != "" && <TableHead className="text-mobile-p sm:text-h6 @[960px]:text-h6 text-primary text-center h-6 sm:h-8 @[960px]:h-8 font-semibold">NHI</TableHead>}
                                <TableHead className="text-mobile-p sm:text-h6 @[960px]:text-h6 text-primary text-center h-6 sm:h-8 @[960px]:h-8 font-semibold">Date of Birth</TableHead>
                                <TableHead className="text-mobile-p sm:text-h6 @[960px]:text-h6 text-primary text-center h-6 sm:h-8 @[960px]:h-8 font-semibold">Age</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="bg-secondary-5">
                                {NHI != "" && <TableCell className="text-mobile-p sm:text-h6 @[960px]:text-h6 text-center py-1 sm:py-1 @[960px]:py-1">{NHI}</TableCell>}
                                <TableCell className="text-mobile-p sm:text-h6 @[960px]:text-h6 text-center py-1 sm:py-1 @[960px]:py-1">{dateOfBirth}</TableCell>
                                <TableCell className="text-mobile-p sm:text-h6 @[960px]:text-h6 text-center py-1 sm:py-1 @[960px]:py-1">{calculateAge(dateOfBirth)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>

                    <div className="overflow-hidden">
                        <h3 className="text-mobile-p sm:text-h3 @[960px]:text-h3 font-semibold">Medicines</h3>
                        <ul className="text-mobile-sm sm:text-p @[960px]:text-p">
                            {options.map((option, i) => 
                                <div key={i} className="ml-6">
                                    {option != 'Specific medicine(s) (please list)' && responses.medicineSelection.medicineSelections[i] && <li className="list-disc">{option}</li>}
                                </div>
                            )}
                            {responses.medicineSelection.specificMedicines.length > 1 && <li className="ml-6 list-disc break-words">Specific Medicines: {responses.medicineSelection.specificMedicines}</li>}
                        </ul>
                    </div>
                
                    <div className="flex sm:flex-col @[960px]:flex-col items-center">
                        <span className="text-mobile-p sm:text-h5 @[960px]:text-h5 font-semibold">Information requested:&nbsp;</span>
                        <span className="text-mobile-p sm:text-h2 @[960px]:text-h2 font-semibold sm:font-bold @[960px]:font-bold">{getNumberofQuestionsRequested()}/20</span>
                    </div>
                </div>

                <div className="text-right" data-html2canvas-ignore="true">
                    <Button className="border-accent-75 hover:bg-accent-5 shadow-[0_4px_30px_0_rgba(64,64,64,0.1)] sm:px-3 @[960px]:px-3 h-7 sm:h-9 @[960px]:h-9 mb-1 text-mobile-p sm:text-p @[960px]:text-p" type="button" variant="outline" data-variant="outline" onClick={changeExpansion}>
                        {showAll ? <p>Expand all</p> : <p>Collapse all</p>}
                    </Button>
                </div>
                
                <div className="rounded-lg overflow-clip">
                    {/* Rendering Very Important Questions and show specific questions for each category when expanded */}
                    <Button className={clsx("w-full flex justify-between rounded-none border-primary-50 rounded-t-lg bg-accent-110 hover:bg-accent-110 cursor-default sm:py-6 @[960px]:py-6 text-white hover:text-white text-mobile-p sm:text-h5 @[960px]:text-h5", {"border-primary-110 border sm:border-2 @[960px]:border-2 border-b-0 sm:border-b-0 @[960px]:border-b-0": showVIQ, "hover:bg-accent-110/80 cursor-pointer": numberOfVIQ > 0})} variant="outline" type="button" onClick={renderVIQ}>
                        <span>Very Important</span>
                        {VIQByCategory.length > 0 && 
                            <div className="flex gap-2 items-center">
                                <p>{numberOfVIQ}/20</p>
                                {!showVIQ && <ChevronDown className="h-4 sm:h-6 @[960px]:h-6 w-4 sm:w-8 @[960px]:w-8" data-html2canvas-ignore="true" />}
                                {showVIQ && <ChevronUp className="h-4 sm:h-6 @[960px]:h-6 w-4 sm:w-8 @[960px]:w-8" data-html2canvas-ignore="true" />}
                            </div>}
                        {VIQByCategory.length == 0 && <p className="text-white">NONE</p>}
                    </Button>
                    <div className={clsx("border sm:border-2 @[960px]:border-2 border-x-primary-110 border-b-primary-110 border-t-0 sm:border-t-0 @[960px]:border-t-0 bg-white", {"border-none": !showVIQ})}>
                        {showVIQ && <div className="p-4 sm:p-6 @[960px]:p-6 flex flex-wrap">
                            {VIQByCategory.map((category, i) => 
                                <div key={i} className="w-full sm:w-[calc(50%-2rem)] @[960px]:w-[calc(50%-2rem)] m-2 sm:m-4 @[960px]:m-4 flex flex-col gap-1 sm:gap-2 @[960px]:gap-2 text-secondary">
                                    <h4 className="flex gap-2 items-center text-mobile-sm sm:text-p @[960px]:text-p font-medium text-center sm:text-left @[960px]:text-left p-1 sm:py-2 @[960px]:py-2 px-4 bg-secondary-25/40">
                                        {categoryNames[category.categoryNumber].name == "Medicine description" ? <Pill className='h-3 w-3 sm:h-5 sm:w-5'/> : categoryNames[category.categoryNumber].name == "Using my medicine" ? <PillBottle className='h-3 w-3 sm:h-5 sm:w-5' /> : categoryNames[category.categoryNumber].name == "Possible side effects" ? <MessageCircleWarning className='h-[14px] w-[14px] sm:h-5 sm:w-5' /> :  <PersonStanding className='h-[14px] w-[14px] sm:h-5 sm:w-5' />} {categoryNames[category.categoryNumber].name} 
                                    </h4>
                                    <ul className="list-disc ml-8">
                                        {category.questions.map((question, i) => <li id="questionText" key={i} className={`text-mobile-sm sm:text-p @[960px]:text-p`}>{question}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>}
                    </div>
                    
                    {/* Rendering Important Questions and show specific questions for each category when expanded */}
                    <Button className={clsx("w-full flex justify-between rounded-none bg-accent-50/90 hover:bg-accent-50/90 cursor-default sm:py-6 @[960px]:py-6 text-primary-110 hover:text-primary-110 text-mobile-p sm:text-h5 @[960px]:text-h5", {"border-primary-110 border sm:border-2 @[960px]:border-2 border-b-0 sm:border-b-0 @[960px]:border-b-0": showIQ, "hover:bg-accent-50/70 cursor-pointer": numberOfIQ > 0})} variant="outline" type="button" onClick={renderIQ}>
                        <span>Important</span>
                        {IQByCategory.length > 0 && 
                            <div className="flex gap-2 items-center">
                                <p>{numberOfIQ}/20</p>
                                {!showIQ && <ChevronDown className="h-4 sm:h-6 @[960px]:h-6 w-4 sm:w-8 @[960px]:w-8" data-html2canvas-ignore="true" />}
                                {showIQ && <ChevronUp className="h-4 sm:h-6 @[960px]:h-6 w-4 sm:w-8 @[960px]:w-8" data-html2canvas-ignore="true" />}
                            </div>}
                        {IQByCategory.length == 0 && <p>NONE</p>}
                    </Button>
                    <div className={clsx("border sm:border-2 @[960px]:border-2 border-x-primary-110 border-b-primary-110 border-t-0 sm:border-t-0 @[960px]:border-t-0 bg-white", {"border-none": !showIQ})}>
                        {showIQ && <div className="p-4 sm:p-6 @[960px]:p-6 flex flex-wrap">
                            {IQByCategory.map((category, i) => 
                                <div key={i} className="w-full sm:w-[calc(50%-2rem)] @[960px]:w-[calc(50%-2rem)] m-2 sm:m-4 @[960px]:m-4 flex flex-col gap-1 sm:gap-2 @[960px]:gap-2 text-secondary">
                                    <h4 className="flex gap-2 items-center text-mobile-sm sm:text-p @[960px]:text-p font-medium text-center sm:text-left @[960px]:text-left p-1 sm:py-2 @[960px]:py-2 px-4 bg-secondary-25/40">
                                        {categoryNames[category.categoryNumber].name == "Medicine description" ? <Pill className='h-3 w-3 sm:h-5 sm:w-5' /> : categoryNames[category.categoryNumber].name == "Using my medicine" ? <PillBottle className='h-3 w-3 sm:h-5 sm:w-5' /> : categoryNames[category.categoryNumber].name == "Possible side effects" ? <MessageCircleWarning className='h-[14px] w-[14px] sm:h-5 sm:w-5' /> :  <PersonStanding className='h-[14px] w-[14px] sm:h-5 sm:w-5' />} {categoryNames[category.categoryNumber].name} 
                                    </h4>
                                    <ul className="list-disc ml-8">
                                        {category.questions.map((question, i) => <li key={i} className="text-mobile-sm sm:text-p @[960px]:text-p">{question}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>}
                    </div>

                    {/* Rendering Not Wanted & Not Important Questions and show specific questions for each question type */}
                    <Button className={clsx("w-full flex justify-between rounded-none rounded-b-lg bg-accent-5 hover:bg-accent-5 cursor-default sm:py-6 @[960px]:py-6 text-primary-110 hover:text-primary-110 text-mobile-p sm:text-h5 @[960px]:text-h5", {"border-primary-110 border sm:border-2 @[960px]:border-2 border-b-0 sm:border-b-0 @[960px]:border-b-0 rounded-none": showNWIQ, "hover:bg-accent-25/80 cursor-pointer": (numberOfNWIQ > 0)})} type="button" variant="outline" onClick={renderNWIQ}>
                        <span className="text-wrap text-left">Not important nor wanted at this time</span>
                        {numberOfNWIQ > 0 && 
                            <div className="flex gap-2 items-center">
                                <p>{numberOfNWIQ}/20</p>
                                {!showNWIQ && <ChevronDown className="h-4 sm:h-6 @[960px]:h-6 w-4 sm:w-8 @[960px]:w-8" data-html2canvas-ignore="true" />}
                                {showNWIQ && <ChevronUp className="h-4 sm:h-6 @[960px]:h-6 w-4 sm:w-8 @[960px]:w-8" data-html2canvas-ignore="true" />}
                            </div>}
                        {numberOfNWIQ == 0 && <p>NONE</p>}
                    </Button>
                    <div className={clsx("border sm:border-2 @[960px]:border-2 border-x-primary-110 rounded-b-lg border-b-primary-110 border-t-0 sm:border-t-0 @[960px]:border-t-0 bg-white flex flex-col w-full", {"border-none": !showNWIQ})}>
                        {showNWIQ && <div className="text-secondary text-mobile-sm sm:text-p @[960px]:text-p p-4 sm:p-6 @[960px]:p-6 flex flex-wrap">
                            <div className={clsx("w-full sm:w-[calc(50%-2rem)] @[960px]:w-[calc(50%-2rem)] m-2 sm:m-4 @[960px]:m-4 flex flex-col gap-1 sm:gap-2 @[960px]:gap-2", {"hidden": notImportantQuestions.length == 0})}>
                                {notImportantQuestions.length > 0 && 
                                <h4 className="text-mobile-sm sm:text-p @[960px]:text-p font-medium bg-secondary-25/40 text-center sm:text-left @[960px]:text-left p-1 sm:py-2 @[960px]:py-2 px-4">Not Important</h4>}
                                <ul className="list-disc ml-8">
                                    {notImportantQuestions.map((question, i) => <li key={i}>{question}</li>)}
                                </ul>
                            </div>
                            <div className={clsx("w-full sm:w-[calc(50%-2rem)] @[960px]:w-[calc(50%-2rem)] m-2 sm:m-4 @[960px]:m-4 flex flex-col gap-1 sm:gap-2 @[960px]:gap-2", {"hidden": notWantedQuestions.length == 0})}>
                                {notWantedQuestions.length > 0 && 
                                <h4 className="text-mobile-sm sm:text-p @[960px]:text-p font-medium bg-secondary-25/40 text-center sm:text-left @[960px]:text-left p-1 sm:py-2 @[960px]:py-2 px-4">Not Wanted</h4>}
                                <ul className="list-disc ml-8">
                                    {notWantedQuestions.map((question, i) => <li key={i}>{question}</li>)}
                                </ul>
                            </div>
                        </div>}
                    </div>
                </div>

                <div>
                    <h3 className="text-mobile-p sm:text-h3 @[960px]:text-h3 font-medium">Other information requested</h3>
                    <p className="text-mobile-sm sm:text-p @[960px]:text-p break-words whitespace-pre-line">{responses.additionalInformation ? <span>{responses.additionalInformation}</span> : <span>NONE</span>}</p>
                </div>

                <div>
                    <h3 className="text-mobile-p sm:text-h3 @[960px]:text-h3 font-medium">Preferred written formats of information</h3>
                    {responses.furtherInfo.writtenFormats.length != 0 || responses.furtherInfo.otherFormats != "" ? 
                        <ul className="text-mobile-sm sm:text-p @[960px]:text-p">
                            {responses.furtherInfo.writtenFormats.length != 0 && responses.furtherInfo.writtenFormats.map((format, i) => <li key={i} className="ml-6 list-disc">{format}</li>)}
                            {responses.furtherInfo.otherFormats != "" && <li className="ml-6 list-disc break-words">Other formats: {responses.furtherInfo.otherFormats}</li>}
                        </ul>
                        
                        : <p className="text-mobile-sm sm:text-p @[960px]:text-p">NONE</p>
                    }
                </div>
            </div>
            {/* Loading spinner when clicking Export to PDF */}
            <div className={clsx("fixed inset-0 flex items-center justify-center bg-secondary-110 bg-opacity-0", {"hidden": !showLoadingSpinner})}>
                <LoaderCircle className="w-16 h-16 text-white/60 animate-spin z-100"/>
            </div>
            {/* Display pop-up of PDF preview */}
            <div className="absolute -top-[46px] sm:-top-[60px] right-0">
                <AlertDialog>
                    <AlertDialogTrigger className="text-mobile-p sm:text-h5 p-0 sm:p-0 flex items-center gap-1 sm:gap-2 hover:text-accent-110" onClick={exportPDF}>
                        <span className="underline underline-offset-2 hover:decoration-accent-100">Export to PDF</span>
                        <CircleArrowDown className="h-4 sm:h-8" />
                    </AlertDialogTrigger>
                    {viewPDF && <PDFPreviewModal {...data} setShowLoadingSpinner={setShowLoadingSpinner}/>}
                </AlertDialog>
            </div>
        </div>
    )
}

export default Visualisation;