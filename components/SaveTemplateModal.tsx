'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveTemplate } from '@/lib/actions/templates';
import { toast } from 'sonner';
import { LayoutGrid, Save, Loader2 } from 'lucide-react';

interface SaveTemplateModalProps {
  mapping: Record<string, string>;
  onSaveSuccess?: () => void; // Added to trigger SWR refresh
}

export function SaveTemplateModal({ mapping, onSaveSuccess }: SaveTemplateModalProps) {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!name) return;
    setIsSaving(true);
    
    const result = await saveTemplate(name, mapping);
    
    if (result.success) {
      toast.success('Template Saved!', { 
        description: `"${name}" is now available for your next upload.` 
      });
      setName('');
      if (onSaveSuccess) onSaveSuccess(); // Refresh the list
    } else {
      toast.error(result.error || 'Error saving template');
    }
    setIsSaving(false);
  };

  return (
    <div className="p-6 bg-orange-50/50 border border-orange-100 rounded-[2rem] shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-orange-100 rounded-lg">
          <LayoutGrid className="w-4 h-4 text-orange-600" />
        </div>
        <h3 className="text-sm font-black uppercase tracking-tight text-gray-900">
          Save this mapping as a template?
        </h3>
      </div>
      <div className="flex flex-col md:flex-row gap-3">
        <Input 
          placeholder="e.g., Shopify Monthly Export" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded-xl bg-white border-orange-100 focus:ring-orange-500/20"
        />
        <Button 
          onClick={handleSave} 
          disabled={!name || isSaving}
          className="bg-orange-600 hover:bg-orange-700 rounded-xl font-bold px-8 shadow-lg shadow-orange-200 transition-all"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
          Save Template
        </Button>
      </div>
    </div>
  );
}