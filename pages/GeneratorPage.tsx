import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import InputPanel from '../components/InputPanel';
import OutputPanel from '../components/OutputPanel';
import { QuestionFormData, GeneratedPaper } from '../types';
import { ChevronLeft, History, Loader2 } from 'lucide-react';
import { generateQuestionPaper } from '../services/ai';

const GeneratorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generation Timer State
  const [generationTimer, setGenerationTimer] = useState(179); // 2:59 in seconds
  
  // Mobile UI State
  const [mobileTab, setMobileTab] = useState<'config' | 'preview'>('config');
  
  // Initial State matching new fields
  const [formData, setFormData] = useState<QuestionFormData>({
    schoolName: '',
    examType: 'Periodic Test',
    classLevel: '10',
    section: '',
    subject: 'Science',
    date: new Date().toLocaleDateString(),
    duration: '3 Hours',
    totalMarks: '80',
    chapters: '',
    questionType: 'Mixed',
    difficulty: 'Medium',
    questionCount: 20,
    otherInstructions: 'All questions are compulsory.',
    userPromptOptional: ''
  });

  const [generatedPaper, setGeneratedPaper] = useState<GeneratedPaper | null>(null);

  // Check for history state on mount
  useEffect(() => {
    if (location.state && location.state.paper) {
      const paper = location.state.paper as GeneratedPaper;
      setGeneratedPaper(paper);
      setFormData(paper.formData);
      // If loading from history, show preview immediately on mobile
      setMobileTab('preview');
    }
  }, [location]);

  // Handle Generation Timer
  useEffect(() => {
    let interval: any;
    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationTimer((prev) => {
          if (prev <= 0) return 0;
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!formData.schoolName) {
      alert("Please enter a school name.");
      return;
    }
    
    setIsGenerating(true);
    setGenerationTimer(179); // Reset to 2:59
    
    try {
      // Direct Client-Side Call
      const responseData = await generateQuestionPaper(formData);
      
      const newPaper: GeneratedPaper = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        title: formData.examType || 'Examination',
        content: responseData.content,
        schoolName: formData.schoolName,
        classLevel: formData.classLevel,
        subject: formData.subject,
        date: responseData.meta.date,
        timestamp: Date.now(),
        formData: formData
      };

      setGeneratedPaper(newPaper);
      saveToHistory(newPaper);
      
      // Auto-switch to preview on mobile after generation
      setMobileTab('preview');

    } catch (error: any) {
      console.error(error);
      alert(`Generation Failed: ${error.message}\n\nPlease check your internet connection or try again later.`);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveToHistory = (paper: GeneratedPaper) => {
    try {
      const existingHistory = JSON.parse(localStorage.getItem('paper_history') || '[]');
      existingHistory.unshift(paper);
      const trimmedHistory = existingHistory.slice(0, 50);
      localStorage.setItem('paper_history', JSON.stringify(trimmedHistory));
    } catch (e) {
      console.error("Failed to save to history", e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-white relative">
      
      {/* Loading Overlay */}
      {isGenerating && (
        <div className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
          <div className="w-20 h-20 relative mb-6">
            <svg className="animate-spin w-full h-full text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono">
              {formatTime(generationTimer)}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Generating Question Paper</h2>
          <p className="text-gray-500 max-w-md">
            Our AI is crafting your {formData.subject} exam based on {formData.schoolName}'s requirements.
            This usually takes about 1-2 minutes.
          </p>
          <div className="mt-8 flex gap-2 text-sm text-gray-400">
             <Loader2 className="w-4 h-4 animate-spin" />
             <span>Connecting to DeepSeek R1 via OpenRouter...</span>
          </div>
        </div>
      )}

      {/* Header - Mobile Only */}
      <div className="md:hidden h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
        <button onClick={() => navigate('/')} className="p-2 text-gray-600">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-gray-800">Generator</span>
        <button onClick={() => navigate('/history')} className="p-2 text-gray-600">
           <History className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Panel (Config) */}
        <div className={`w-full md:w-1/3 lg:w-[400px] flex-shrink-0 bg-white z-0 overflow-hidden transition-transform duration-300 absolute md:relative h-full ${
          mobileTab === 'config' ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}>
          <div className="h-full flex flex-col">
             <div className="hidden md:flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </button>
                <div className="flex gap-2">
                   <button 
                      onClick={() => navigate('/history')}
                      className="p-2 text-gray-500 hover:bg-gray-200 rounded-md transition-colors"
                      title="History"
                   >
                      <History className="w-4 h-4" />
                   </button>
                </div>
             </div>
             
             <div className="flex-1 overflow-hidden">
                <InputPanel 
                  formData={formData} 
                  setFormData={setFormData} 
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
             </div>
          </div>
        </div>

        {/* Right Panel (Output) */}
        <div className={`w-full flex-1 bg-gray-50 overflow-hidden transition-transform duration-300 absolute md:relative h-full ${
          mobileTab === 'preview' ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
        }`}>
           <OutputPanel 
             paper={generatedPaper} 
             onRegenerate={handleGenerate}
             isGenerating={isGenerating}
             onMobileBackToConfig={() => setMobileTab('config')}
           />
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;