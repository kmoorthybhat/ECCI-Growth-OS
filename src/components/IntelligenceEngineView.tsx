import React, { useState } from 'react';
import {
  Users,
  Target,
  Share2,
  RefreshCw,
  Sparkles,
  Search,
  PieChart,
  Lightbulb,
  Shield,
  Layers,
  ChevronRight,
  Zap,
  Loader2
} from 'lucide-react';
import { Client, IntelligenceEngine, Persona } from '../types';
import { generateIntelligence } from '../lib/gemini';

interface IntelligenceEngineViewProps {
  client: Client;
  onUpdateIntelligence: (clientId: string, bi: IntelligenceEngine) => void;
}

export const IntelligenceEngineView: React.FC<IntelligenceEngineViewProps> = ({
  client,
  onUpdateIntelligence,
}) => {
  const [activeTab, setActiveTab] = useState<'personas' | 'ad_intelligence' | 'content_pillars' | 'competitor_gap'>('personas');
  const [isGenerating, setIsGenerating] = useState(false);

  const bi = client.bi_engine;

  const handleRegenerate = async () => {
    if (!client.brand_kit) return;
    setIsGenerating(true);
    try {
      const newBI = await generateIntelligence(client.brand_kit);
      onUpdateIntelligence(client.id, newBI);
    } catch (err) {
      console.error('Failed to regenerate BI engine:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
              <Zap className="w-3 h-3 mr-1 text-[#FF4D00]" />
              MODULE 6: PERSONA & BUSINESS INTELLIGENCE ENGINE
            </span>
            <span className="text-zinc-500 text-xs">• {client.businessName}</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            AI Market Intelligence & <span className="text-[#FF4D00]">ICP Personas</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Synthesized by Gemini 1.5 Pro from brand kit telemetry. Powers downstream AI creative generation, audience keywords, and ad angles.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isGenerating}
          className="bg-[#1F1F1F] hover:bg-[#2F2F2F] text-white border border-[#2F2F2F] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4 text-[#FF4D00]" />}
          <span>{isGenerating ? 'Synthesizing...' : 'Regenerate BI Engine'}</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-[#1F1F1F] pb-2 text-xs font-mono">
        <button
          onClick={() => setActiveTab('personas')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'personas'
              ? 'bg-[#FF4D00] text-white font-bold shadow-lg shadow-[#FF4D00]/20'
              : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>1. Buyer Personas ({bi?.personas.length || 3})</span>
        </button>

        <button
          onClick={() => setActiveTab('ad_intelligence')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'ad_intelligence'
              ? 'bg-[#FF4D00] text-white font-bold shadow-lg shadow-[#FF4D00]/20'
              : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
          }`}
        >
          <Target className="w-3.5 h-3.5" />
          <span>2. Ad Angles & Keywords</span>
        </button>

        <button
          onClick={() => setActiveTab('content_pillars')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'content_pillars'
              ? 'bg-[#FF4D00] text-white font-bold shadow-lg shadow-[#FF4D00]/20'
              : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3. Content Pillars</span>
        </button>

        <button
          onClick={() => setActiveTab('competitor_gap')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 ${
            activeTab === 'competitor_gap'
              ? 'bg-[#FF4D00] text-white font-bold shadow-lg shadow-[#FF4D00]/20'
              : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
          }`}
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>4. Competitor Gap Analysis</span>
        </button>
      </div>

      {/* Tab 1: Buyer Personas */}
      {activeTab === 'personas' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bi?.personas.map((persona, idx) => (
            <div
              key={persona.id || idx}
              className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4 hover:border-[#FF4D00]/40 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={persona.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                    alt={persona.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF4D00]/60 shadow-lg"
                  />
                  <div>
                    <h3 className="font-bold text-white text-sm font-mono">{persona.name}</h3>
                    <p className="text-xs text-[#FF4D00] font-medium">{persona.role}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="bg-[#0A0A0A] p-2.5 rounded-xl border border-[#1F1F1F]">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase block">Demographics</span>
                    <span className="text-zinc-300 font-medium">{persona.demographics}</span>
                  </div>

                  <div className="bg-[#0A0A0A] p-2.5 rounded-xl border border-[#1F1F1F]">
                    <span className="text-zinc-500 font-mono text-[10px] uppercase block">Psychographics</span>
                    <span className="text-zinc-300">{persona.psychographics}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-red-500/10 p-2 rounded-xl border border-red-500/20">
                      <span className="text-red-400 font-mono text-[10px] uppercase block font-bold">Fears</span>
                      <ul className="text-zinc-300 text-[11px] list-disc list-inside">
                        {persona.fears?.map((f, i) => <li key={i}>{f}</li>)}
                      </ul>
                    </div>

                    <div className="bg-[#00D26A]/10 p-2 rounded-xl border border-[#00D26A]/20">
                      <span className="text-[#00D26A] font-mono text-[10px] uppercase block font-bold">Desires</span>
                      <ul className="text-zinc-300 text-[11px] list-disc list-inside">
                        {persona.desires?.map((d, i) => <li key={i}>{d}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#1F1F1F] space-y-1 text-xs">
                <span className="text-zinc-500 font-mono text-[10px] uppercase block">Target Keywords</span>
                <div className="flex flex-wrap gap-1">
                  {persona.keywords?.google_high_intent?.map((k, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#1F1F1F] text-zinc-300 text-[10px] font-mono">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Ad Intelligence & Keywords */}
      {activeTab === 'ad_intelligence' && (
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white font-mono flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-[#FF4D00]" />
              5 High-Converting Viral Ad Angles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {bi?.ad_angles.map((angle, idx) => (
                <div key={idx} className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl flex items-start space-x-3">
                  <span className="w-6 h-6 rounded-full bg-[#FF4D00]/20 text-[#FF4D00] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-zinc-200 font-medium leading-relaxed">{angle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-white font-mono">Platform Budget Split & Strategy</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1F1F1F] space-y-2">
                <span className="text-zinc-400 font-bold block">Google Search (High Intent)</span>
                <div className="text-2xl font-black text-[#FF4D00] font-mono">{bi?.platform_strategy?.budget_split?.Google || 40}%</div>
                <p className="text-zinc-500 text-[11px]">Captures active searchers for cafes, wifi lounges & matcha.</p>
              </div>

              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1F1F1F] space-y-2">
                <span className="text-zinc-400 font-bold block">Meta (Instagram Reels/Stories)</span>
                <div className="text-2xl font-black text-[#00D26A] font-mono">{bi?.platform_strategy?.budget_split?.Meta || 40}%</div>
                <p className="text-zinc-500 text-[11px]">Drives visual craving & subscription signups.</p>
              </div>

              <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#1F1F1F] space-y-2">
                <span className="text-zinc-400 font-bold block">LinkedIn (Founder Network)</span>
                <div className="text-2xl font-black text-cyan-400 font-mono">{bi?.platform_strategy?.budget_split?.LinkedIn || 20}%</div>
                <p className="text-zinc-500 text-[11px]">Targets corporate leaders and founders for group memberships.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Content Pillars */}
      {activeTab === 'content_pillars' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bi?.content_pillars.map((pillar, idx) => (
            <div key={idx} className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
              <div className="flex items-center space-x-2 text-[#FF4D00] font-bold text-xs font-mono">
                <Layers className="w-4 h-4" />
                <span>CONTENT PILLAR {idx + 1}</span>
              </div>
              <h4 className="text-lg font-bold text-white font-mono">{pillar}</h4>
              <p className="text-xs text-zinc-400">
                Automated social posts and ad creatives will rotate around this thematic pillar.
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Competitor Gap */}
      {activeTab === 'competitor_gap' && (
        <div className="bg-[#111111] border border-[#1F1F1F] p-8 rounded-2xl space-y-4">
          <h3 className="text-lg font-bold text-white font-mono flex items-center">
            <PieChart className="w-5 h-5 mr-2 text-[#FF4D00]" />
            Market Competitor Gap Analysis
          </h3>
          <p className="text-sm text-zinc-300 leading-relaxed bg-[#0A0A0A] border border-[#1F1F1F] p-6 rounded-xl font-mono">
            {bi?.competitor_gap || 'Analysis of what incumbents miss and how client wins market share.'}
          </p>
        </div>
      )}
    </div>
  );
};
