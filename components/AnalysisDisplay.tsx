
import React from 'react';
import { SQLAnalysis } from '../types';
import { CheckCircle, AlertTriangle, Wrench } from 'lucide-react';

interface AnalysisDisplayProps {
  analysis: SQLAnalysis;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  const { isBuggy, bugDescription, suggestedFix } = analysis;

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {isBuggy ? (
        <div className="flex items-center gap-3 bg-red-900/40 p-3 rounded-lg border border-red-800">
          <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0" />
          <h3 className="text-lg font-bold text-red-300">Bug Detected</h3>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-green-900/40 p-3 rounded-lg border border-green-800">
          <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0" />
          <h3 className="text-lg font-bold text-green-300">No Bugs Found</h3>
        </div>
      )}

      <div className="space-y-2">
        <h4 className="font-semibold text-slate-400">Analysis:</h4>
        <p className="text-slate-300 bg-slate-900/50 p-4 rounded-md border border-slate-700 text-sm">
          {bugDescription}
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-semibold text-slate-400 flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Suggested Fix:
        </h4>
        <pre className="bg-slate-900 p-4 rounded-md border border-slate-700 overflow-x-auto">
          <code className="font-mono text-sm text-cyan-300">{suggestedFix}</code>
        </pre>
      </div>
    </div>
  );
};
