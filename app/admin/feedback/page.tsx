import { getFeedbackWithUserNames } from '@/lib/db/queries';

export default async function FeedbackPage() {
  const allFeedback = await getFeedbackWithUserNames();

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">User Feedback</h1>
      
      <div className="grid gap-4">
        {allFeedback.length === 0 ? (
          <p className="text-gray-500">No feedback dropped yet. 🤷‍♂️</p>
        ) : (
          allFeedback.map((fb) => (
            <div key={fb.feedbackId} className="bg-white border p-5 rounded-xl shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{fb.userName || 'Unknown User'}</h3>
                  <p className="text-xs text-gray-500">{fb.userEmail}</p>
                </div>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-bold uppercase px-2 py-1 rounded">
                  {fb.type}
                </span>
              </div>
              
              <p className="text-gray-700 italic">"{fb.message}"</p>
              
              <div className="mt-4 text-[10px] text-gray-400">
                Received on: {new Date(fb.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}