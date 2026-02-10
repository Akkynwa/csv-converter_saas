import { CheckCircle } from "lucide-react";

export function DownloadSection({ status, fileUrl }: { status: string, fileUrl: string }) {
  if (status === 'processing') {
    return (
      <div className="flex items-center gap-4 p-6 bg-orange-50 rounded-2xl border border-orange-100 animate-pulse">
        <div className="size-10 bg-orange-200 rounded-full flex items-center justify-center">
          <div className="size-5 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <h4 className="font-bold text-orange-900">Processing Your Large File</h4>
          <p className="text-xs text-orange-700">Handling 10,000+ rows. We'll notify you when it's done.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-6 bg-green-50 rounded-2xl border border-green-100">
      <div className="flex items-center gap-4">
        <div className="size-10 bg-green-500 rounded-full flex items-center justify-center text-white">
          <CheckCircle className="size-6" />
        </div>
        <div>
          <h4 className="font-bold text-green-900">File Ready for Download</h4>
          <p className="text-xs text-green-700">Your full dataset has been processed successfully.</p>
        </div>
      </div>
      <a 
        href={fileUrl} 
        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors"
      >
        Download CSV
      </a>
    </div>
  );
}