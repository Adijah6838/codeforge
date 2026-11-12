import { useState } from 'react';
import Editor from '@monaco-editor/react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Save, Send, Code } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function CreateProblem() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [description, setDescription] = useState('Write problem description here using Markdown...');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:3000/api/problems', {
        title,
        description,
        inputFormat: 'Standard input',
        outputFormat: 'Standard output',
        constraints: 'N/A',
        difficulty
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      alert('Failed to create problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        <div className="w-1/3 flex flex-col gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Problem Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="e.g. Sum of Two Numbers"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select 
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                >
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex gap-3">
              <button onClick={handleSave} disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 bg-slate-800 text-white py-2 rounded-lg hover:bg-slate-900 transition-colors">
                <Save size={18} /> Save Draft
              </button>
              <button disabled={isSubmitting} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Send size={18} /> Submit Review
              </button>
            </div>
          </div>
        </div>

        <div className="w-2/3 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
            <Code size={18} className="text-gray-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Problem Statement (Markdown Supported)</span>
          </div>
          <Editor
            height="100%"
            defaultLanguage="markdown"
            theme="vs-light"
            value={description}
            onChange={(value) => setDescription(value || '')}
            options={{
              minimap: { enabled: false },
              wordWrap: 'on',
              fontSize: 14,
              padding: { top: 16 }
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
