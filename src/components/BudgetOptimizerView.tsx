import React, { useState } from 'react';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, ArrowUpRight, ArrowDownRight, RefreshCw, Zap } from 'lucide-react';
import { Campaign, BudgetSuggestion } from '../types';

interface BudgetOptimizerViewProps {
  campaigns: Campaign[];
  onApplyOptimization: (suggestionId: string, campaignId: string, newBudget: number) => void;
}

export const BudgetOptimizerView: React.FC<BudgetOptimizerViewProps> = ({ campaigns, onApplyOptimization }) => {
  const [suggestions, setSuggestions] = useState<BudgetSuggestion[]>([
    {
      id: 'sug_1',
      campaignId: 'camp_ecci_meta_matcha',
      campaignName: 'Meta - Ceremonial Matcha VIP Pass Lead Gen',
      platform: 'Meta',
      currentBudget: 150,
      suggestedBudget: 185,
      reason: 'High CTR (2.84%) and lowest CPL ($21.39). AI recommends increasing daily spend by +23% to capture prime weekend booking traffic.',
      actionType: 'increase',
      applied: false
    },
    {
      id: 'sug_2',
      campaignId: 'camp_ecci_google_search',
      campaignName: 'Google - High Intent Cafe & WiFi Workspace Search',
      platform: 'Google',
      currentBudget: 120,
      suggestedBudget: 145,
      reason: 'Solid search intent conversion rate (4.12% CTR). AI suggests expanding daily budget by +$25.',
      actionType: 'increase',
      applied: false
    }
  ]);

  const handleApply = (sug: BudgetSuggestion) => {
    onApplyOptimization(sug.id, sug.campaignId, sug.suggestedBudget);
    setSuggestions((prev) =>
      prev.map((item) => (item.id === sug.id ? { ...item, applied: true } : item))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
            <Zap className="w-3 h-3 mr-1" />
            MODULE 11: SMART BUDGET & BID OPTIMIZER
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            AI Media Budget <span className="text-[#FF4D00]">Reallocation Engine</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Automated performance analysis reallocates client ad spend towards high-CTR and low-CPL ad sets to maximize ROAS.
          </p>
        </div>
      </div>

      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4 shadow-2xl">
        <h2 className="text-lg font-bold text-white font-mono flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-[#00D26A]" />
          Active AI Optimization Recommendations ({suggestions.length})
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#0A0A0A] text-zinc-400 font-mono uppercase tracking-wider border-b border-[#1F1F1F]">
              <tr>
                <th className="py-3 px-4">Campaign & Platform</th>
                <th className="py-3 px-4">Current Daily Budget</th>
                <th className="py-3 px-4">Suggested Budget</th>
                <th className="py-3 px-4">AI Reason & Performance Signal</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {suggestions.map((sug) => (
                <tr key={sug.id} className="hover:bg-[#151515] transition-colors">
                  <td className="py-4 px-4">
                    <div className="font-bold text-white">{sug.campaignName}</div>
                    <span className="text-[10px] text-[#FF4D00] font-mono">{sug.platform} Ad Network</span>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-white">
                    ${sug.currentBudget}/day
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-[#00D26A]">
                    ${sug.suggestedBudget}/day
                  </td>

                  <td className="py-4 px-4 max-w-md">
                    <p className="text-zinc-300 text-xs leading-relaxed">{sug.reason}</p>
                  </td>

                  <td className="py-4 px-4 text-right">
                    {sug.applied ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        OPTIMIZATION APPLIED
                      </span>
                    ) : (
                      <button
                        onClick={() => handleApply(sug)}
                        className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00D26A]/20 transition-all"
                      >
                        APPLY BUDGET INCREASE
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
