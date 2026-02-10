'use client';

import { useState } from 'react';
import { FileText, Download, CheckCircle2 } from 'lucide-react';

export default function CSVProcessor() {
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [fileInfo, setFileInfo] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload/preview', { method: 'POST', body: formData });
      const result = await res.json();
      
      setPreviewData(result.preview);
      setFileInfo(result.info);
    } catch (err) {
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* Upload Zone */}
      <div className="border-4 border-dashed border-gray-200 rounded-[2.5rem] p-12 text-center hover:border-[#e87d61] transition-colors bg-white/50 backdrop-blur-sm">
        <input type="file" id="csv-upload" className="hidden" onChange={onFileChange} accept=".csv" />
        <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
          <FileText className="size-12 text-[#e87d61] mb-4" />
          <span className="text-xl font-bold text-gray-900">
            {isUploading ? "Processing 10k rows..." : "Drop your CSV here"}
          </span>
          <p className="text-gray-500 text-sm mt-2">Maximum file size 50MB</p>
        </label>
      </div>

      {previewData.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="text-green-500 size-6" />
              <div>
                <h3 className="font-black text-gray-900 leading-none">PREVIEW LOADED</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">
                  Showing top {previewData.length} of 10,000+ rows
                </p>
              </div>
            </div>
            
            {/* The "Full Download" Button */}
            <button 
               onClick={() => alert("This would trigger the S3/Signed URL download logic we discussed!")}
               className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#e87d61] transition-all shadow-lg"
            >
              <Download className="size-4" /> Download Full File
            </button>
          </div>

          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50">
                    {Object.keys(previewData[0]).map((header) => (
                      <th key={header} className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-tighter border-b">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {previewData.map((row, i) => (
                    <tr key={i} className="hover:bg-orange-50/30 transition-colors">
                      {Object.values(row).map((val: any, j) => (
                        <td key={j} className="px-6 py-4 text-sm text-gray-600 font-medium">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}