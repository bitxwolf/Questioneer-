import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, BookOpen, Layers, Download, CheckCircle, ArrowRight } from 'lucide-react';
import { FeatureItem } from '../types';

const features: FeatureItem[] = [
  {
    id: '1',
    title: 'DeepSeek R1 Powered',
    description: 'Utilizes the powerful DeepSeek R1 model via OpenRouter for logical question generation.',
    icon: <CheckCircle className="w-6 h-6 text-green-500" />
  },
  {
    id: '2',
    title: 'NCERT Syllabus Support',
    description: 'Strictly adheres to the latest NCERT curriculum for classes 6 to 12.',
    icon: <BookOpen className="w-6 h-6 text-blue-500" />
  },
  {
    id: '3',
    title: 'Multi-Format Questions',
    description: 'Supports MCQs, Short Answer, Long Answer, and Case-based questions.',
    icon: <Layers className="w-6 h-6 text-purple-500" />
  },
  {
    id: '4',
    title: 'Class & Subject Selection',
    description: 'Tailored content for Science, Maths, English, SST, and more.',
    icon: <FileText className="w-6 h-6 text-orange-500" />
  },
  {
    id: '5',
    title: 'Print & PDF Export',
    description: 'Generate professional PDFs ready for printing and distribution.',
    icon: <Download className="w-6 h-6 text-red-500" />
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFeatures = features.filter(feature => 
    feature.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    feature.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="w-full py-6 px-6 md:px-12 flex justify-between items-center border-b border-gray-100">
        <div className="text-2xl font-bold tracking-tight text-black cursor-pointer" onClick={() => navigate('/')}>
          QUESTIONEER
        </div>
        <div className="hidden md:flex space-x-6 text-sm font-medium text-gray-600">
          <span className="cursor-pointer hover:text-black transition-colors">How it works</span>
          <span className="cursor-pointer hover:text-black transition-colors" onClick={() => navigate('/history')}>History</span>
          <span className="cursor-pointer hover:text-black transition-colors">Features</span>
        </div>
        <button 
          onClick={() => navigate('/generate')}
          className="bg-black text-white px-5 py-2.5 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          Get Started
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 w-full pt-16 pb-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            NCERT-Based AI <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Question Paper Generator
            </span>
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto leading-relaxed">
            Effortlessly create professional exams and worksheets for Classes 6-12. 
            Aligned with the latest curriculum, customizable, and ready in seconds using DeepSeek AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/generate')}
              className="px-8 py-4 bg-black text-white rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg flex items-center gap-2 group"
            >
              Generate Question Paper
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="relative w-full sm:w-auto">
              <input 
                type="text" 
                placeholder="Search features..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-600 bg-gray-50"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeatures.map(feature => (
            <div key={feature.id} className="p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all bg-white group">
              <div className="mb-4 bg-gray-50 w-12 h-12 rounded-lg flex items-center justify-center group-hover:bg-gray-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
          
          {filteredFeatures.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">
              No features found matching "{searchTerm}"
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} QUESTIONEER. Built with React & DeepSeek.
      </footer>
    </div>
  );
};

export default HomePage;