'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, X } from 'lucide-react';
import { submitFeedback } from '@/app/(dashboard)/dashboard/actions';
import { toast } from 'sonner';

export function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await submitFeedback(message, 'general');
      toast.success('Feedback sent! Thanks for helping us improve.');
      setMessage('');
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to send. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="relative bg-white/70 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 w-80 mb-6 overflow-hidden"
          >
            {/* White Reflective Rim on the glass card */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent" />
            
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-[1000] text-gray-900 tracking-tighter text-xl uppercase">Feedback</h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10">
              <textarea
                className="w-full h-32 p-4 text-sm bg-white/50 border border-white/40 rounded-2xl focus:ring-2 focus:ring-[#e87d61] focus:border-transparent mb-4 placeholder:text-gray-400 font-medium resize-none outline-none transition-all shadow-inner"
                placeholder="What features would you like to see?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="w-full h-12 bg-[#e87d61] hover:bg-[#d16b52] text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-orange-900/20 active:scale-95 disabled:opacity-50"
                disabled={isSending}
              >
                {isSending ? 'Sending...' : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Send Feedback
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative group h-14 w-14 flex items-center justify-center rounded-2xl bg-[#151515] shadow-2xl overflow-hidden transition-all"
      >
        {/* Subtle orange glow behind the icon when hovered */}
        <div className="absolute inset-0 bg-[#e87d61] opacity-0 group-hover:opacity-20 transition-opacity" />
        
        {isOpen ? (
          <X className="h-6 w-6 text-white relative z-10" />
        ) : (
          <MessageSquare className="h-6 w-6 text-white relative z-10" />
        )}
        
        {/* Reflection light on the button */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </motion.button>
    </div>
  );
}