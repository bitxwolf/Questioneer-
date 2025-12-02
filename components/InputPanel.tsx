import React from 'react';
import { QuestionFormData } from '../types';
import { BookOpen, Layers, Type, Hash, School, FileText, BarChart, Clock, Award, Users, AlignLeft } from 'lucide-react';

interface InputPanelProps {
  formData: QuestionFormData;
  setFormData: React.Dispatch<React.SetStateAction<QuestionFormData>>;
  onGenerate: () => void;
  isGenerating: boolean;
}

const InputPanel: React.FC<InputPanelProps> = ({ formData, setFormData, onGenerate, isGenerating }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert numeric fields specifically to numbers
    if (name === 'questionCount') {
        // Allow empty string to handle deletion gracefully
        const numValue = value === '' ? 0 : parseInt(value);
        setFormData(prev => ({ ...prev, [name]: isNaN(numValue) ? 0 : numValue }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="bg-white p-6 border-r border-gray-200 h-full flex flex-col overflow-y-auto no-print">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Layers className="w-5 h-5 text-blue-600" />
        Configuration
      </h2>

      <div className="space-y-5 flex-1">
        {/* School Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <School className="w-4 h-4" /> School Name
          </label>
          <input
            type="text"
            name="schoolName"
            value={formData.schoolName}
            onChange={handleChange}
            placeholder="e.g. Kendriya Vidyalaya"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Basic Exam Details Grid */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <FileText className="w-4 h-4" /> Exam Type
                </label>
                <select
                    name="examType"
                    value={formData.examType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                >
                    <option value="Periodic Test">Periodic Test</option>
                    <option value="Annual Examination">Annual Exam</option>
                    <option value="Half-Yearly">Half-Yearly</option>
                    <option value="Unit Test">Unit Test</option>
                    <option value="Format Assessment">Formative (FA)</option>
                    <option value="Pre-Board">Pre-Board</option>
                </select>
            </div>
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Award className="w-4 h-4" /> Total Marks
                </label>
                <input
                    type="text"
                    name="totalMarks"
                    value={formData.totalMarks}
                    onChange={handleChange}
                    placeholder="e.g. 80"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> Duration
                </label>
                <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 3 Hours"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                    <Users className="w-4 h-4" /> Section
                </label>
                <input
                    type="text"
                    name="section"
                    value={formData.section}
                    onChange={handleChange}
                    placeholder="e.g. A"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Layers className="w-4 h-4" /> Class
            </label>
            <select
              name="classLevel"
              value={formData.classLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              {[6, 7, 8, 9, 10, 11, 12].map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <BookOpen className="w-4 h-4" /> Subject
            </label>
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              {['Science', 'Maths', 'English', 'Hindi', 'SST', 'Physics', 'Chemistry', 'Biology', 'Computer Science'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chapters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <BookOpen className="w-4 h-4" /> Chapters
          </label>
          <input
            type="text"
            name="chapters"
            value={formData.chapters}
            onChange={handleChange}
            placeholder="e.g. Force, Motion, Gravitation"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Separate chapter numbers or names with commas.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Question Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Type className="w-4 h-4" /> Type
            </label>
            <select
              name="questionType"
              value={formData.questionType}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="Mixed">Mixed</option>
              <option value="MCQ">MCQ</option>
              <option value="Short">Short Answer</option>
              <option value="Long">Long Answer</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <BarChart className="w-4 h-4" /> Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="Medium">Medium</option>
              <option value="Easy">Easy</option>
              <option value="Hard">Hard</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>
        </div>

        {/* Question Count */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <Hash className="w-4 h-4" /> Total Questions
          </label>
          <input
            type="number"
            name="questionCount"
            value={formData.questionCount === 0 ? '' : formData.questionCount}
            onChange={handleChange}
            min={1}
            max={100}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Other Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <AlignLeft className="w-4 h-4" /> Custom Instructions
          </label>
          <textarea
            name="otherInstructions"
            value={formData.otherInstructions}
            onChange={handleChange}
            placeholder="e.g. All questions are compulsory."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-16 resize-none"
          />
        </div>

         {/* User Prompt Optional (Side Box) */}
         <div>
          <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
            <AlignLeft className="w-4 h-4" /> Left Side Note (Optional)
          </label>
          <textarea
            name="userPromptOptional"
            value={formData.userPromptOptional}
            onChange={handleChange}
            placeholder="Extra note to appear in the side box"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm h-16 resize-none"
          />
        </div>

      </div>

      <div className="pt-6 mt-4 border-t border-gray-100">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium flex items-center justify-center gap-2 transition-all ${
            isGenerating 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-black hover:bg-gray-800 shadow-md'
          }`}
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>Generate Question Paper</>
          )}
        </button>
      </div>
    </div>
  );
};

export default InputPanel;
