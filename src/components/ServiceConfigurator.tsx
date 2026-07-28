import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2, Shield, Info, Lock } from 'lucide-react';
import { ServiceMatrixItem, Tier } from '../types';

export const ServiceConfigurator: React.FC = () => {
  const [matrix, setMatrix] = useState<ServiceMatrixItem[]>([
    {
      id: 'srv_1',
      serviceName: 'AI Media Buying & Campaign Auto-Deployer',
      description: 'Auto-pilot campaign launcher across Google Ads, Meta Marketing, LinkedIn & TikTok.',
      limits: {
        Starter: { enabled: true, limitText: '1 Platform (Meta)' },
        Growth: { enabled: true, limitText: '2 Platforms (Google + Meta)' },
        Scale: { enabled: true, limitText: '3 Platforms (Google, Meta, LinkedIn)' },
        Enterprise: { enabled: true, limitText: 'All Platforms + TikTok & DSPs' },
      }
    },
    {
      id: 'srv_2',
      serviceName: 'AI Ad Creative Studio (Text & Visual)',
      description: 'Monthly volume of Gemini text & Imagen 3 visual banners generated and approved.',
      limits: {
        Starter: { enabled: true, limitText: '10 Creatives / mo' },
        Growth: { enabled: true, limitText: '30 Creatives / mo' },
        Scale: { enabled: true, limitText: '100 Creatives / mo' },
        Enterprise: { enabled: true, limitText: 'Unlimited AI Generation' },
      }
    },
    {
      id: 'srv_3',
      serviceName: 'AI Video Production (Short-Form Reels/TikTok)',
      description: 'Automated video scripts, voiceovers, and frame storyboards.',
      limits: {
        Starter: { enabled: false, limitText: 'Not Included' },
        Growth: { enabled: true, limitText: '4 Videos / mo' },
        Scale: { enabled: true, limitText: '15 Videos / mo' },
        Enterprise: { enabled: true, limitText: 'Unlimited Video Output' },
      }
    },
    {
      id: 'srv_4',
      serviceName: 'Persona & Business Intelligence Engine',
      description: 'AI deep market research, buyer personas, keywords & ad angles.',
      limits: {
        Starter: { enabled: true, limitText: '1 Persona' },
        Growth: { enabled: true, limitText: '3 Personas' },
        Scale: { enabled: true, limitText: '5 Personas' },
        Enterprise: { enabled: true, limitText: 'Custom Enterprise Personas' },
      }
    },
    {
      id: 'srv_5',
      serviceName: 'Smart Budget & Bid Optimizer',
      description: 'Daily automated CPA and CTR bid adjustments via AI feedback loops.',
      limits: {
        Starter: { enabled: false, limitText: 'Manual Adjustments' },
        Growth: { enabled: true, limitText: 'Weekly Auto-Optimize' },
        Scale: { enabled: true, limitText: 'Daily Auto-Optimize' },
        Enterprise: { enabled: true, limitText: 'Real-Time Dynamic Bidder' },
      }
    },
    {
      id: 'srv_6',
      serviceName: 'Lead Pipeline & Scoring Kanban',
      description: 'AI 0-100 lead scoring based on ICP match, call & WhatsApp integration.',
      limits: {
        Starter: { enabled: true, limitText: 'Up to 100 Leads / mo' },
        Growth: { enabled: true, limitText: 'Up to 500 Leads / mo' },
        Scale: { enabled: true, limitText: 'Up to 2,500 Leads / mo' },
        Enterprise: { enabled: true, limitText: 'Unlimited Pipeline Sync' },
      }
    },
    {
      id: 'srv_7',
      serviceName: 'AI Weekly Executive ROI Reports',
      description: 'Automated Monday morning PDF summaries, ROAS calculations, and strategy plans.',
      limits: {
        Starter: { enabled: true, limitText: 'Monthly Summary' },
        Growth: { enabled: true, limitText: 'Bi-Weekly AI Reports' },
        Scale: { enabled: true, limitText: 'Weekly AI Reports' },
        Enterprise: { enabled: true, limitText: 'Real-Time Executive Portal' },
      }
    }
  ]);

  const [saved, setSaved] = useState(false);

  const handleLimitChange = (serviceId: string, tier: Tier, key: 'enabled' | 'limitText', value: any) => {
    setMatrix((prev) =>
      prev.map((item) => {
        if (item.id === serviceId) {
          return {
            ...item,
            limits: {
              ...item.limits,
              [tier]: {
                ...item.limits[tier],
                [key]: value
              }
            }
          };
        }
        return item;
      })
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tiers: Tier[] = ['Starter', 'Growth', 'Scale', 'Enterprise'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
            <Sliders className="w-3 h-3 mr-1" />
            MODULE 3: SERVICE CONFIGURATOR & PRICING ENGINE
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            Tier Capabilities <span className="text-[#FF4D00]">Matrix</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Configure feature access and monthly limits for each client subscription tier. Controls what CLIENT users can see and execute in their portal.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#00D26A]/20 transition-all"
        >
          {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'MATRIX SAVED & ENFORCED' : 'SAVE SERVICE MATRIX'}</span>
        </button>
      </div>

      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#0A0A0A] text-zinc-400 font-mono uppercase tracking-wider border-b border-[#1F1F1F]">
              <tr>
                <th className="py-4 px-6 w-1/3">Service Module & Description</th>
                {tiers.map((t) => (
                  <th key={t} className="py-4 px-4 text-center font-bold text-white border-l border-[#1F1F1F]">
                    <div className="text-sm text-[#FF4D00]">{t}</div>
                    <div className="text-[10px] text-zinc-500 font-normal">Tier Column</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {matrix.map((item) => (
                <tr key={item.id} className="hover:bg-[#151515] transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-white text-sm">{item.serviceName}</div>
                    <div className="text-xs text-zinc-400 mt-0.5">{item.description}</div>
                  </td>

                  {tiers.map((tier) => {
                    const limit = item.limits[tier];
                    return (
                      <td key={tier} className="py-4 px-4 border-l border-[#1F1F1F] bg-[#0D0D0D]/50 text-center">
                        <div className="space-y-2 flex flex-col items-center">
                          <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={limit.enabled}
                              onChange={(e) => handleLimitChange(item.id, tier, 'enabled', e.target.checked)}
                              className="w-4 h-4 rounded border-[#1F1F1F] bg-[#0A0A0A] text-[#FF4D00] focus:ring-[#FF4D00]"
                            />
                            <span className={`text-[11px] font-medium ${limit.enabled ? 'text-[#00D26A]' : 'text-zinc-500'}`}>
                              {limit.enabled ? 'Enabled' : 'Locked'}
                            </span>
                          </label>

                          <input
                            type="text"
                            disabled={!limit.enabled}
                            value={limit.limitText}
                            onChange={(e) => handleLimitChange(item.id, tier, 'limitText', e.target.value)}
                            className="bg-[#0A0A0A] border border-[#1F1F1F] text-center text-white text-[11px] rounded-lg px-2 py-1 focus:outline-none focus:border-[#FF4D00] w-full disabled:opacity-30 disabled:cursor-not-allowed"
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
