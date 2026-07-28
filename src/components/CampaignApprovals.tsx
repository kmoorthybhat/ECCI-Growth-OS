import React, { useState } from 'react';
import { Target, CheckCircle2, XCircle, Edit3, Send, Play, Layers, ShieldCheck, DollarSign, ExternalLink, Activity } from 'lucide-react';
import { Campaign, Creative } from '../types';

interface CampaignApprovalsProps {
  pendingCampaigns: Campaign[];
  onApproveCampaign: (campaignId: string) => void;
  onRejectCampaign: (campaignId: string, feedback: string) => void;
  deploymentLogs: string[];
}

export const CampaignApprovals: React.FC<CampaignApprovalsProps> = ({
  pendingCampaigns,
  onApproveCampaign,
  onRejectCampaign,
  deploymentLogs,
}) => {
  const [rejectModalId, setRejectModalId] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleConfirmReject = () => {
    if (rejectModalId && feedbackText) {
      onRejectCampaign(rejectModalId, feedbackText);
      setRejectModalId(null);
      setFeedbackText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
            <Target className="w-3 h-3 mr-1" />
            MODULE 5 & MODULE 10: APPROVAL CONSOLE & AUTO-DEPLOYER
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            AI Campaign Approval <span className="text-[#FF4D00]">Queue</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Review AI generated ad campaigns before live launch. Approving immediately triggers Module 10 Auto-Deployer across Google Ads, Meta Marketing, and LinkedIn API adapters.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono bg-[#0A0A0A] border border-[#1F1F1F] px-4 py-3 rounded-xl">
          <ShieldCheck className="w-4 h-4 text-[#00D26A]" />
          <span>Pending Approvals: <strong className="text-white">{pendingCampaigns.length}</strong></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Queue of Pending Campaigns */}
        <div className="lg:col-span-2 space-y-4">
          {pendingCampaigns.length === 0 ? (
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-[#00D26A] mx-auto opacity-80" />
              <h3 className="text-lg font-bold text-white font-mono">Approval Queue Clean</h3>
              <p className="text-xs text-zinc-400 max-w-md mx-auto">
                All AI generated campaigns have been reviewed and auto-deployed to live ad network ad groups.
              </p>
            </div>
          ) : (
            pendingCampaigns.map((camp) => (
              <div
                key={camp.id}
                className="bg-[#111111] border border-[#1F1F1F] hover:border-[#FF4D00]/50 rounded-2xl p-6 space-y-4 transition-all"
              >
                <div className="flex items-start justify-between border-b border-[#1F1F1F] pb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 font-mono">
                        {camp.platform} Ad
                      </span>
                      <span className="text-xs text-zinc-400 font-mono">ID: {camp.id}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white font-mono mt-1">{camp.title}</h3>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Daily Media Budget</div>
                    <div className="text-lg font-bold text-[#00D26A] font-mono">${camp.dailyBudget}/day</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#1F1F1F] space-y-1">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase">Target Audience Scope</span>
                    <p className="text-zinc-300 font-medium">{camp.targetAudience || 'Biohackers & High Intent Creators'}</p>
                  </div>

                  <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#1F1F1F] space-y-1">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase">Ad Angle & Copy Preview</span>
                    <p className="text-zinc-300 italic">"Fuel Your Peak Energy. Ceremonial Organic Matcha & Nitro Cold Brew Pass."</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-2">
                  <button
                    onClick={() => setRejectModalId(camp.id)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject / Request Edit</span>
                  </button>

                  <button
                    onClick={() => onApproveCampaign(camp.id)}
                    className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#00D26A] text-black hover:bg-[#00D26A]/90 transition-all shadow-lg shadow-[#00D26A]/20 flex items-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>APPROVE & AUTO-DEPLOY (MODULE 10)</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Module 10 Auto-Deployer Console Trace Log */}
        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4 h-fit">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
            <h3 className="text-sm font-bold text-white font-mono flex items-center">
              <Activity className="w-4 h-4 mr-2 text-[#00D26A]" />
              Module 10 Deployment Trace
            </h3>
            <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-ping" />
          </div>

          <p className="text-xs text-zinc-400">
            Real-time API handshake logs sending approved campaign artifacts directly into ad account endpoints.
          </p>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl font-mono text-[11px] text-[#00D26A] space-y-2 h-80 overflow-y-auto leading-relaxed">
            {deploymentLogs.length === 0 ? (
              <div className="text-zinc-600 italic">Waiting for campaign approval trigger...</div>
            ) : (
              deploymentLogs.map((log, idx) => (
                <div key={idx} className="border-b border-zinc-900 pb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white font-mono">Reject & Provide AI Feedback</h3>
            <p className="text-xs text-zinc-400">
              Provide feedback for the AI Creative Engine to regenerate this campaign draft.
            </p>

            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="e.g. Tone is too aggressive. Soften the headline and focus on ceremonial matcha organic sourcing."
              className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#FF4D00] resize-none"
              rows={4}
            />

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setRejectModalId(null)}
                className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
