import React, { useState } from 'react';
import { GeneratedPaper, StructuredPaperData } from '../types';
import { Download, RefreshCw, AlertCircle, Printer, Loader2, Settings } from 'lucide-react';

declare const html2pdf: any;

interface OutputPanelProps {
  paper: GeneratedPaper | null;
  onRegenerate: () => void;
  isGenerating: boolean;
  onMobileBackToConfig?: () => void;
}

const OutputPanel: React.FC<OutputPanelProps> = ({ paper, onRegenerate, isGenerating, onMobileBackToConfig }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (typeof html2pdf === 'undefined') {
      alert("PDF generator library is still loading. Please wait a moment or refresh the page.");
      return;
    }

    const element = document.getElementById('paper-content');
    if (!element) {
        alert("Paper content not found.");
        return;
    }
    
    setIsDownloading(true);

    const opt = {
      margin:       [10, 10, 10, 10], // top, left, bottom, right in mm
      filename:     `${paper?.title || 'Exam'}_${paper?.subject || 'Paper'}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, logging: false },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Increased delay to 500ms to ensure layout is stable
      await new Promise(resolve => setTimeout(resolve, 500));
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF Generation failed:", error);
      alert("Failed to generate PDF file. You can use the 'Print' button as a backup.");
    } finally {
      setIsDownloading(false);
    }
  };

  if (!paper || !paper.content) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-8 text-center no-print">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8 text-gray-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-500 mb-2">No Paper Generated Yet</h3>
        <p className="max-w-xs text-sm">Fill out the details on the left and click "Generate" to create your first question paper.</p>
        
        {/* Mobile Button to go back to Config if stuck here */}
        <button 
          onClick={onMobileBackToConfig}
          className="mt-6 md:hidden px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
        >
          <Settings className="w-4 h-4" />
          Configure Paper
        </button>
      </div>
    );
  }

  // Type guard or casting with safe defaults
  const data = paper.content as StructuredPaperData;
  const header = data.header || {
    school_name: paper.schoolName || 'Unknown School',
    basic_formal_box: {
      exam_type: '-',
      class: '-',
      section: '-',
      subject: '-',
      date: '-',
      duration: '-',
      total_marks: '-'
    },
    other_specific_details_box: {
      sections_in_exam: '-',
      basic_instructions: 'All questions are compulsory.',
      marks_distribution: '-',
      total_questions: '-',
      custom_details: '-'
    },
    user_prompt_box_optional: ''
  };

  const sections = data.sections || [];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 p-3 md:p-4 flex flex-col xl:flex-row justify-between items-center shadow-sm no-print sticky top-0 z-10 gap-3 md:gap-4">
        
        <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-start">
          <div className="flex items-center gap-3">
             {/* Mobile Only Back Button */}
             <button 
                onClick={onMobileBackToConfig}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                title="Edit Configuration"
             >
                <Settings className="w-5 h-5" />
             </button>
             <h2 className="font-semibold text-gray-800">Preview</h2>
          </div>
        </div>

        <div className="flex gap-2 w-full xl:w-auto justify-end overflow-x-auto pb-1 xl:pb-0">
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
          
          <button
            onClick={handlePrint}
            className="px-3 py-1.5 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2 transition-colors whitespace-nowrap"
            title="Print via Browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="px-3 py-1.5 text-xs md:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors disabled:opacity-70 disabled:cursor-wait whitespace-nowrap"
          >
            {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
            Download PDF
          </button>
        </div>
      </div>

      {/* Paper Content Wrapper - id="print-area" helps targeting if needed, but the class does the heavy lifting */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 print-only">
        {/* The Paper Sheet - ID added for html2pdf */}
        <div id="paper-content" className="bg-white shadow-lg mx-auto print:shadow-none print:m-0 print:w-full max-w-[210mm] min-h-[297mm] p-[10mm] md:p-[15mm] text-black">
          
          {/* 1. TOP OF PAPER: School Name (Big Header) */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide border-b-2 border-black inline-block pb-1">
              {header.school_name || paper.schoolName || 'SCHOOL NAME'}
            </h1>
          </div>

          {/* 2. LAYOUT SPLIT: Left Optional Box vs Right Formal Details */}
          <div className="flex flex-row gap-4 mb-8">
            
            {/* Left Vertical Area (Optional User Prompt Box) */}
            {header.user_prompt_box_optional && (
               <div className="w-1/4 border border-gray-400 p-2 text-[10px] md:text-xs italic text-gray-600 flex flex-col justify-center text-center">
                  {header.user_prompt_box_optional}
               </div>
            )}

            {/* Right Side Area (Formal + Specific Details) */}
            <div className={`flex-1 flex flex-col gap-4 ${!header.user_prompt_box_optional ? 'w-full' : ''}`}>
               
               {/* Basic Formal Details Box */}
               <div className="border border-black p-3">
                  <div className="grid grid-cols-2 gap-y-2 text-xs md:text-sm">
                     <div className="font-bold">Exam: <span className="font-normal">{header.basic_formal_box?.exam_type || '-'}</span></div>
                     <div className="font-bold text-right">Date: <span className="font-normal">{header.basic_formal_box?.date || '-'}</span></div>
                     
                     <div className="font-bold">Class: <span className="font-normal">{header.basic_formal_box?.class || '-'}</span></div>
                     <div className="font-bold text-right">Duration: <span className="font-normal">{header.basic_formal_box?.duration || '-'}</span></div>
                     
                     <div className="font-bold">Subject: <span className="font-normal">{header.basic_formal_box?.subject || '-'}</span></div>
                     <div className="font-bold text-right">Max Marks: <span className="font-normal">{header.basic_formal_box?.total_marks || '-'}</span></div>

                     {header.basic_formal_box?.section && (
                        <div className="font-bold col-span-2">Section: <span className="font-normal">{header.basic_formal_box.section}</span></div>
                     )}
                  </div>
               </div>

               {/* Other Specific Details Box */}
               <div className="border border-gray-300 p-3 bg-gray-50 print:bg-transparent">
                  <div className="text-xs md:text-sm space-y-1">
                    <p><span className="font-semibold">General Instructions:</span> {header.other_specific_details_box?.basic_instructions || 'All questions are compulsory.'}</p>
                    <div className="flex justify-between text-[10px] md:text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200 print:border-gray-400">
                         <span>Total Questions: {header.other_specific_details_box?.total_questions || '-'}</span>
                         <span>Sections: {header.other_specific_details_box?.sections_in_exam || '-'}</span>
                    </div>
                  </div>
               </div>

            </div>
          </div>

          {/* 3. BODY: Sections and Questions */}
          <div className="space-y-8">
            {sections.length > 0 ? (
              sections.map((section, sIndex) => (
                <div key={sIndex} className="mb-6 break-inside-avoid">
                  
                  {/* Section Header */}
                  <div className="flex justify-center mb-4">
                    <div className="bg-black text-white px-4 py-1 rounded-full font-bold text-xs md:text-sm uppercase print:bg-white print:text-black print:border print:border-black">
                      Section {section.section_name} &mdash; {section.type}
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="space-y-6">
                    {section.questions && section.questions.map((q, qIndex) => (
                      <div key={qIndex} className="break-inside-avoid">
                        <div className="flex gap-3">
                           <span className="font-bold min-w-[20px] text-sm md:text-base">{q.q_id || qIndex + 1}.</span>
                           <div className="flex-1">
                              <p className="text-sm md:text-base font-medium leading-snug">{q.q_text}</p>
                           </div>
                           <span className="font-bold text-xs md:text-sm whitespace-nowrap ml-2 flex flex-col items-end gap-0.5">
                             <span>[{q.marks_allocated}]</span>
                             {q.estimated_time_mins && (
                               <span className="text-[10px] text-gray-500 font-normal border border-gray-200 rounded px-1 print:hidden">
                                 {q.estimated_time_mins} min
                               </span>
                             )}
                           </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">No sections found in the generated data.</div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-800 flex justify-between text-[10px] md:text-xs text-gray-500">
             <span>Generated via Questioneer</span>
             <span>Page 1 of 1</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OutputPanel;