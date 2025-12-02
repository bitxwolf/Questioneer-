import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneratedPaper } from '../types';
import { ChevronLeft, Trash2, Eye, Calendar, BookOpen, School, Clock } from 'lucide-react';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<GeneratedPaper[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('paper_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this paper?')) {
      const updatedHistory = history.filter(paper => paper.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem('paper_history', JSON.stringify(updatedHistory));
    }
  };

  const handleView = (paper: GeneratedPaper) => {
    // Navigate to generator with the paper data in state to pre-fill the view
    navigate('/generate', { state: { paper } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <nav className="w-full py-4 px-6 md:px-12 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="text-xl font-bold text-gray-900">Paper History</div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-12">
        {history.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">No History Found</h2>
            <p className="text-gray-500 mb-6">You haven't generated any question papers yet.</p>
            <button
              onClick={() => navigate('/generate')}
              className="px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Generate Your First Paper
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {history.map((paper) => (
              <div 
                key={paper.id} 
                className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {paper.title || 'Untitled Examination'}
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded-md border border-blue-100 uppercase tracking-wide">
                      {paper.subject}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500 mt-3">
                    <div className="flex items-center gap-1.5">
                      <School className="w-4 h-4" />
                      {paper.schoolName}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      Class {paper.classLevel}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      {paper.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  <button
                    onClick={() => handleView(paper)}
                    className="flex-1 md:flex-none px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View & Download
                  </button>
                  <button
                    onClick={() => handleDelete(paper.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Paper"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;