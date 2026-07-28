import React, { useState } from 'react';
import { Layers, CheckCircle2, Filter, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Campaign } from '../types';

interface ClientCampaignTrackerProps {
  campaigns: Campaign[];
}

export const ClientCampaignTracker: React.FC<ClientCampaignTrackerProps> = ({ campaigns }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');

  const filtered = campaigns.filter(
    (c) => selectedPlatform === 'All' || c.platform === selectedPlatform
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30 inline-flex items-center">
            <Layers className="w-3 h-3 mr-1" />
            MODULE 16: CAMPAIGN PERFORMANCE TRACKER
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            Active Multi-Platform <span className="text-[#00D26A]">Campaigns</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Live cross-channel ad campaign performance, delivery benchmarks, and conversion metrics across Google, Meta, and LinkedIn.
          </p>
        </div>

        <div className="flex items-center space-x-1 bg-[#0A0A0A] border border-[#1F1F1F] p-1 rounded-xl text-xs">
          <Filter className="w-3.5 h-3.5 text-zinc-500 ml-2" />
          {['All', 'Google', 'Meta', 'LinkedIn', 'TikTok'].map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`px-3 py-1.5 rounded-lg font-mono font-medium transition-all ${
                selectedPlatform === plat
                  ? 'bg-[#00D26A] text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {plat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#0A0A0A] text-zinc-400 font-mono uppercase tracking-wider border-b border-[#1F1F1F]">
              <tr>
                <th className="py-4 px-6">Campaign Name</th>
                <th className="py-4 px-4">Platform</th>
                <th className="py-4 px-4">Total Spend</th>
                <th className="py-4 px-4">Impressions</th>
                <th className="py-4 px-4">CTR %</th>
                <th className="py-4 px-4">Conversions</th>
                <th className="py-4 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-[#151515] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-sm">{c.title}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">Daily Budget: ${c.dailyBudget}/day</div>
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-[#FF4D00]">
                    {c.platform}
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-white">
                    ${c.spend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  <td className="py-4 px-4 font-mono text-zinc-300">
                    {c.impressions.toLocaleString()}
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-[#00D26A]">
                    {c.ctr}%
                  </td>

                  <td className="py-4 px-4 font-mono font-bold text-white">
                    {c.conversions} leads
                  </td>

                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D26A] mr-1.5 animate-pulse" />
                      LIVE & DELIVERING
                    </span>
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
