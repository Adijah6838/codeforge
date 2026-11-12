import { useState } from 'react';
import Editor from '@monaco-editor/react';
import DashboardLayout from '../layouts/DashboardLayout';
import { Save, Code, Plus, Trash2, CheckCircle2, AlertCircle, PlayCircle, FileText, Terminal } from 'lucide-react';
import axios from 'axios';

interface TestCase {
  input: string;
  output: string;
  isPublic: boolean;
}

export default function CreateProblem() {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('EASY');
  const [description, setDescription] = useState('Write problem description here...');
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedProblemId, setSavedProblemId] = useState<number | null>(null);
  
  const [validationReport, setValidationReport] = useState<any>(null);
  const [isValidating, setIsValidating] = useState(false);

  const [activeTab, setActiveTab] = useState<'statement' | 'solution'>('statement');
  const [solutionCode, setSolutionCode] = useState('# Write your reference solution here\n');
  const [solutionLang, setSolutionLang] = useState('PYTHON');
  const [verifyingSolution, setVerifyingSolution] = useState(false);
  const [solutionResult, setSolutionResult] = useState<any>(null);

  const handleAddTestCase = () => setTestCases([...testCases, { input: '', output: '', isPublic: false }]);
  const handleRemoveTestCase = (index: number) => setTestCases(testCases.filter((_, i) => i !== index));
  const handleTestCaseChange = (index: number, field: keyof TestCase, value: any) => {
    const updated = [...testCases];
    updated[index] = { ...updated[index], [field]: value };
    setTestCases(updated);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/problems', {
        title, description, inputFormat: 'Standard input', outputFormat: 'Standard output', constraints: 'N/A', difficulty
      }, { headers: { Authorization: `Bearer ${token}` } });

      const newProblemId = res.data.problem.id;
      setSavedProblemId(newProblemId);

      for (const tc of testCases) {
        await axios.post(`http://localhost:3000/api/problems/${newProblemId}/test-cases`, tc, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      alert('Problem and test cases saved successfully!');
    } catch (error) {
      alert('Failed to save problem');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleValidate = async () => {
    if (!savedProblemId) return alert('Please save the problem first.');
    setIsValidating(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/api/problems/${savedProblemId}/validate`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setValidationReport(res.data.report);
    } catch (error) {
      alert('Validation failed to run');
    } finally {
      setIsValidating(false);
    }
  };

  const handleVerifySolution = async () => {
    if (!savedProblemId) return alert('Please save the problem and test cases first.');
    setVerifyingSolution(true);
    setSolutionResult(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`http://localhost:3000/api/problems/${savedProblemId}/solutions`, {
        language: solutionLang,
        code: solutionCode
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSolutionResult(res.data.solution);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Verification failed');
    } finally {
      setVerifyingSolution(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex gap-6 h-[calc(100vh-8rem)]">
        
        <div className="w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Problem Details</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Sum of Two Numbers" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                  <option value="EXPERT">Expert</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">Test Cases</h3>
              <button onClick={handleAddTestCase} className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
                <Plus size={16} className="mr-1" /> Add
              </button>
            </div>
            
            {testCases.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No test cases added yet.</p>
            ) : (
              <div className="space-y-3">
                {testCases.map((tc, index) => (
                  <div key={index} className="p-3 border border-gray-200 rounded-lg bg-gray-50 relative group">
                    <button onClick={() => handleRemoveTestCase(index)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100">
                      <Trash2 size={16} />
                    </button>
                    <div className="space-y-2 mt-2">
                      <input type="text" placeholder="Input data" value={tc.input} onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded font-mono" />
                      <input type="text" placeholder="Expected output" value={tc.output} onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded font-mono" />
                      <label className="flex items-center text-xs text-gray-600">
                        <input type="checkbox" checked={tc.isPublic} onChange={(e) => handleTestCaseChange(index, 'isPublic', e.target.checked)} className="mr-2 rounded text-blue-600" />
                        Public Sample
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 pb-4">
            <button onClick={handleSave} disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-3 rounded-lg hover:bg-slate-900 font-medium">
              <Save size={18} /> {isSubmitting ? 'Saving...' : 'Save Problem & Tests'}
            </button>
            <button onClick={handleValidate} disabled={isValidating || !savedProblemId} className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-medium ${savedProblemId ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              <PlayCircle size={18} /> {isValidating ? 'Validating...' : 'Run Validation Engine'}
            </button>
          </div>
        </div>

        <div className="w-2/3 flex flex-col gap-4">
          
          {validationReport && activeTab === 'statement' && (
            <div className={`p-4 rounded-xl border shadow-sm ${validationReport.isValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {validationReport.isValid ? <CheckCircle2 className="text-green-600" /> : <AlertCircle className="text-red-600" />}
                <h4 className={`font-bold ${validationReport.isValid ? 'text-green-800' : 'text-red-800'}`}>
                  {validationReport.isValid ? 'Validation Passed' : 'Validation Failed'}
                </h4>
              </div>
              {validationReport.errors.length > 0 && <ul className="list-disc list-inside text-sm text-red-700 mt-2">{validationReport.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}</ul>}
              {validationReport.warnings.length > 0 && <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">{validationReport.warnings.map((w: string, i: number) => <li key={i}>{w}</li>)}</ul>}
            </div>
          )}

          {solutionResult && activeTab === 'solution' && (
            <div className={`p-4 rounded-xl border shadow-sm ${solutionResult.status === 'ACCEPTED' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex items-center gap-2 mb-2">
                {solutionResult.status === 'ACCEPTED' ? <CheckCircle2 className="text-green-600" /> : <AlertCircle className="text-red-600" />}
                <h4 className={`font-bold ${solutionResult.status === 'ACCEPTED' ? 'text-green-800' : 'text-red-800'}`}>
                  Verification: {solutionResult.status.replace('_', ' ')}
                </h4>
                <span className="text-sm text-gray-500 ml-auto">Time: {solutionResult.executionTime?.toFixed(3)}s</span>
              </div>
              {solutionResult.errorMessage && <pre className="text-sm text-red-700 bg-red-100 p-2 rounded mt-2 whitespace-pre-wrap">{solutionResult.errorMessage}</pre>}
            </div>
          )}

          <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center px-4 bg-gray-50 border-b border-gray-200">
              <button onClick={() => setActiveTab('statement')} className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'statement' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <FileText size={16} /> Problem Statement
              </button>
              <button onClick={() => setActiveTab('solution')} className={`flex items-center gap-2 py-3 px-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'solution' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
                <Terminal size={16} /> Reference Solution
              </button>
            </div>

            <div className="flex-1 relative flex flex-col">
              {activeTab === 'solution' && (
                <div className="flex items-center justify-between px-4 py-2 bg-gray-100 border-b border-gray-200">
                  <select value={solutionLang} onChange={(e) => setSolutionLang(e.target.value)} className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white font-medium">
                    <option value="PYTHON">Python 3</option>
                    <option value="CPP">C++</option>
                    <option value="JAVA">Java</option>
                  </select>
                  <button onClick={handleVerifySolution} disabled={verifyingSolution || !savedProblemId} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400">
                    <PlayCircle size={16} /> {verifyingSolution ? 'Running Tests...' : 'Verify Solution'}
                  </button>
                </div>
              )}
              
              {activeTab === 'statement' ? (
                <Editor height="100%" defaultLanguage="markdown" theme="vs-light" value={description} onChange={(v) => setDescription(v || '')} options={{ minimap: { enabled: false }, wordWrap: 'on', fontSize: 14, padding: { top: 16 } }} />
              ) : (
                <Editor height="100%" language={solutionLang === 'PYTHON' ? 'python' : solutionLang === 'CPP' ? 'cpp' : 'java'} theme="vs-dark" value={solutionCode} onChange={(v) => setSolutionCode(v || '')} options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }} />
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
