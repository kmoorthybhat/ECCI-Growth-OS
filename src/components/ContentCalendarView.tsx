import React, { useState } from 'react';
import { Calendar, CheckCircle2, MessageSquare, Send, X, Clock, Layers, Sparkles } from 'lucide-react';
import { Creative } from '../types';

interface ContentCalendarViewProps {
  creatives: Creative[];
  onApproveCreative: (creativeId: string) => void;
  onRequestEdit: (creativeId: string, comment: string) => void;
}

export const ContentCalendarView: React.FC<ContentCalendarViewProps> = ({
  creatives,
  onApproveCreative,
  onRequestEdit,
}) => {
  const [selectedCreative, setSelectedCreative] = useState<Creative | null>(null);
  const [comment, setComment] = useState('');

  const handleSendComment = () => {
    if (selectedCreative && comment) {
      onRequestEdit(selectedCreative.id, comment);
      setSelectedCreative(null);
      setComment('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30 inline-flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            MODULE 15: CONTENT CALENDAR & APPROVALS
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            Scheduled Ad & <span className="text-[#00D26A]">Content Queue</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Review upcoming social posts and AI ad creatives before they publish live. Click any item to preview and approve.
          </p>
        </div>
      </div>

      {/* Grid of Scheduled Creatives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {creatives.map((cr) => (
          <div
            key={cr.id}
            onClick={() => setSelectedCreative(cr)}
            className="bg-[#111111] border border-[#1F1F1F] hover:border-[#00D26A]/50 rounded-2xl p-5 space-y-3 transition-all cursor-pointer group shadow-xl"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-[#1F1F1F] text-[#FF4D00]">
                {cr.type} creative
              </span>

              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                cr.status === 'approved'
                  ? 'bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30'
                  : 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
              }`}>
                {cr.status.toUpperCase()}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white group-hover:text-[#00D26A] transition-colors">{cr.title}</h3>

            <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#1F1F1F] text-xs text-zinc-300 space-y-1">
              <span className="text-zinc-500 text-[10px] font-mono block uppercase">Scheduled Deployment Date</span>
              <div className="flex items-center text-white font-mono font-medium">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-[#00D26A]" />
                {cr.createdAt ? new Date(cr.createdAt).toLocaleDateString() : 'This Week'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {selectedCreative && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 max-w-lg w-full space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
              <h3 className="text-base font-bold text-white font-mono">{selectedCreative.title}</h3>
              <button onClick={() => setSelectedCreative(null)} className="text-zinc-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#0A0A0A] p-3.5 rounded-xl border border-[#1F1F1F] space-y-1">
                <span className="text-zinc-500 font-mono text-[10px] uppercase">Creative Copy / Script</span>
                <p className="text-zinc-200">
                  {selectedCreative.content.primaryTexts?.[0] || selectedCreative.content.videoScript?.hook || 'Energize Cult Cafe - Ceremonial Grade Matcha Pass'}
                </p>
              </div>

              {selectedCreative.feedback && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-xl text-amber-400 space-y-1">
                  <span className="font-bold text-[10px] font-mono block">YOUR FEEDBACK COMMENT:</span>
                  <p>{selectedCreative.feedback}</p>
                </div>
              )}

              <div className="space-y-2 pt-2">
                <label className="block text-zinc-400 font-semibold">Request Edits (Adds comment for AI Engine)</label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g. Please emphasize zero sugar and organic sourcing."
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-3 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={handleSendComment}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#1F1F1F] text-zinc-300 hover:text-white"
              >
                Request Edit
              </button>

              <button
                onClick={() => {
                  onApproveCreative(selectedCreative.id);
                  setSelectedCreative(null);
                }}
                className="px-6 py-2 rounded-xl text-xs font-bold bg-[#00D26A] text-black hover:bg-[#00D26A]/90 shadow-lg shadow-[#00D26A]/20"
              >
                APPROVE FOR PUBLISHING
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
