import React, { useState } from 'react';

export default function Converter() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any[] | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/convert', {
      method: 'POST',
      body: formData,
    });

    const json = await response.json();
    setResult(json.data);
    setLoading(false);
  };

  return (
    <div className="p-8 border-2 border-dashed border-gray-300 rounded-lg">
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload} 
        disabled={loading}
      />
      {loading && <p>Processing your SaaS magic...</p>}
      
      {result && (
        <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto max-h-60">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}