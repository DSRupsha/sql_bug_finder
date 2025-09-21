
import React, { useState } from 'react';
import { Code } from 'lucide-react';

interface QueryEditorProps {
  onQueryChange: (query: string) => void;
}

const placeholderQuery = `SELECT UserID, FirsName FROM Users WHERE Email = 'test@example.com'`;

export const QueryEditor: React.FC<QueryEditorProps> = ({ onQueryChange }) => {
  const [queryText, setQueryText] = useState('');

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQueryText(event.target.value);
    onQueryChange(event.target.value);
  };

  const handleUsePlaceholder = () => {
    setQueryText(placeholderQuery);
    onQueryChange(placeholderQuery);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
        <Code className="h-5 w-5 text-indigo-400" />
        2. Enter SQL Query
      </h2>
      <textarea
        value={queryText}
        onChange={handleTextChange}
        placeholder="Enter your SQL query to analyze..."
        className="w-full h-32 p-3 bg-slate-900 border border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm"
      />
       <button
          onClick={handleUsePlaceholder}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors text-sm"
        >
          Use Example Query
        </button>
    </div>
  );
};
