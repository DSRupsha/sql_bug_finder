
import React, { useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface SchemaUploaderProps {
  onSchemaChange: (schema: string) => void;
}

const placeholderSchema = `
CREATE TABLE Users (
    UserID int NOT NULL PRIMARY KEY,
    LastName varchar(255) NOT NULL,
    FirstName varchar(255),
    Email varchar(255) UNIQUE
);

CREATE TABLE Orders (
    OrderID int NOT NULL PRIMARY KEY,
    OrderNumber int NOT NULL,
    UserID int,
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
`.trim();

export const SchemaUploader: React.FC<SchemaUploaderProps> = ({ onSchemaChange }) => {
  const [schemaText, setSchemaText] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setSchemaText(text);
        onSchemaChange(text);
        setFileName(file.name);
      };
      reader.readAsText(file);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSchemaText(event.target.value);
    onSchemaChange(event.target.value);
    if(fileName) setFileName(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleUsePlaceholder = () => {
    setSchemaText(placeholderSchema);
    onSchemaChange(placeholderSchema);
    setFileName('placeholder.sql');
  };

  const handleClear = () => {
    setSchemaText('');
    onSchemaChange('');
    setFileName(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
        <FileText className="h-5 w-5 text-indigo-400" />
        1. Provide Database Schema
      </h2>
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={handleUploadClick}
          className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors text-sm"
        >
          <Upload className="h-4 w-4" />
          Upload .sql File
        </button>
        <button
          onClick={handleUsePlaceholder}
          className="px-4 py-2 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors text-sm"
        >
          Use Example Schema
        </button>
        { (schemaText || fileName) && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 bg-red-900/50 text-red-300 rounded-md hover:bg-red-900/80 transition-colors text-sm ml-auto"
            >
              <X className="h-4 w-4" />
              Clear
            </button>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".sql,.txt"
      />
      {fileName && (
        <div className="text-sm text-slate-400 bg-slate-700/50 px-3 py-2 rounded-md">
          Loaded from: <span className="font-medium text-indigo-300">{fileName}</span>
        </div>
      )}
      <textarea
        value={schemaText}
        onChange={handleTextChange}
        placeholder="Or paste your SQL schema here..."
        className="w-full h-48 p-3 bg-slate-900 border border-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors font-mono text-sm"
      />
    </div>
  );
};
