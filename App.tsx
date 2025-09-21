
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { SchemaUploader } from './components/SchemaUploader';
import { QueryEditor } from './components/QueryEditor';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { analyzeSql } from './services/geminiService';
import { SQLAnalysis } from './types';
import { Loader } from './components/Loader';
import { ArrowRight, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [schema, setSchema] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [analysis, setAnalysis] = useState<SQLAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleAnalyzeClick = useCallback(async () => {
    if (!schema || !query) {
      setError('Please provide both a database schema and an SQL query.');
      return;
    }
    setIsLoading(true);
    setError('');
    setAnalysis(null);
    try {
      const result = await analyzeSql(schema, query);
      setAnalysis(result);
    } catch (err) {
      console.error('Analysis failed:', err);
      setError('Failed to analyze the SQL query. The API might be unavailable or the request failed. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  }, [schema, query]);
  
  const canAnalyze = schema.trim() !== '' && query.trim() !== '' && !isLoading;

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-200 flex flex-col">
      <Header />
      <main className="flex-grow p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6 bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg">
            <SchemaUploader onSchemaChange={setSchema} />
            <QueryEditor onQueryChange={setQuery} />
            <button
              onClick={handleAnalyzeClick}
              disabled={!canAnalyze}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg shadow-lg hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 disabled:scale-100"
            >
              {isLoading ? 'Analyzing...' : 'Find Bugs & Suggest Fix'}
              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </button>
          </div>

          <div className="relative bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg min-h-[400px] flex flex-col justify-center items-center">
            {isLoading && <Loader />}
            {!isLoading && !analysis && !error && (
              <div className="text-center text-slate-500">
                <Sparkles className="mx-auto h-12 w-12 text-slate-600" />
                <h3 className="mt-2 text-lg font-medium text-slate-400">Analysis Result</h3>
                <p className="mt-1 text-sm">Your SQL analysis will appear here.</p>
              </div>
            )}
            {error && <p className="text-red-400 text-center">{error}</p>}
            {analysis && !isLoading && <AnalysisDisplay analysis={analysis} />}
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-xs text-slate-500">
        <p>Powered by Google Gemini. For educational and demonstrational purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
