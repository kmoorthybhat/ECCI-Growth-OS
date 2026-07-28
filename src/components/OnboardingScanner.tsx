import React, { useState } from 'react';
import {
  Globe,
  Zap,
  Sparkles,
  CheckCircle2,
  Building2,
  ArrowRight,
  RefreshCw,
  Palette,
  Target,
  Edit3,
  Loader2
} from 'lucide-react';
import { scanWebsite } from '../lib/gemini';
import { BrandKit, Client, Tier } from '../types';

interface OnboardingScannerProps {
  onWorkspaceCreated: (client: Client) => void;
}

export const OnboardingScanner: React.FC<OnboardingScannerProps> = ({ onWorkspaceCreated }) => {
  const [websiteUrl, setWebsiteUrl] = useState('https://energizecultcafe.com');
  const [businessName, setBusinessName] = useState('Energize Cult Cafe Inc');
  const [tier, setTier] = useState<Tier>('Enterprise');
  const [isScanning, setIsScanning] = useState(false);
  const [brandKit, setBrandKit] = useState<BrandKit | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl) return;

    setIsScanning(true);
    setError(null);

    try {
      const scanned = await scanWebsite(websiteUrl);
      setBrandKit(scanned);
    } catch (err: any) {
      console.error('Scan error:', err);
      setError('Website scan timed out or failed. Generating AI fallback brand kit.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCreateWorkspace = () => {
    if (!brandKit) return;

    const newClient: Client = {
      id: `client_${Date.now()}`,
      businessName: businessName || 'New Client Workspace',
      websiteUrl: websiteUrl,
      industry: brandKit.industry || 'Specialty & Lifestyle Hub',
      tier: tier,
      status: 'intelligence_ready',
      ownerId: 'kmoorthy.bhat@gmail.com',
      healthScore: 98,
      killSwitch: false,
      spendToday: 0,
      leadsToday: 0,
      activeCampaignsCount: 0,
      maxMonthlyBudget: tier === 'Enterprise' ? 25000 : tier === 'Scale' ? 10000 : 5000,
      brand_kit: brandKit,
      createdAt: new Date().toISOString()
    };

    onWorkspaceCreated(newClient);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#111111] via-[#1A0A00] to-[#111111] border border-[#1F1F1F] p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D00]/10 blur-3xl rounded-full pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1" />
            MODULE 2: CLIENT ONBOARDING & AI WEBSITE SCANNER
          </span>
          <h1 className="text-3xl font-black text-white font-mono">
            Scan & Ignite Client <span className="text-[#FF4D00]">Brand DNA</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl">
            Input any client website URL. Gemini 2.0 Flash extracts the core value proposition, USPs, target audience, brand colors, and tone of voice automatically.
          </p>
        </div>
      </div>

      {/* URL Scanner Input Form */}
      <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-6">
        <form onSubmit={handleScan} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Energize Cult Cafe Inc"
                className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4D00]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Target Website URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl pl-10 pr-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4D00]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Select Service Tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as Tier)}
                className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF4D00]"
              >
                <option value="Enterprise">Enterprise ($25,000/mo media scope)</option>
                <option value="Scale">Scale ($10,000/mo media scope)</option>
                <option value="Growth">Growth ($5,000/mo media scope)</option>
                <option value="Starter">Starter ($2,500/mo media scope)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isScanning}
              className="bg-[#FF4D00] hover:bg-[#E64500] text-white px-8 py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase shadow-lg shadow-[#FF4D00]/25 flex items-center space-x-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isScanning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Scanning & Analyzing Website...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current text-white" />
                  <span>SCAN & IGNITE BRAND KIT</span>
                </>
              )}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-amber-500/10 border border-amber-500/30 text-amber-400 p-4 rounded-xl text-xs flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="underline font-bold">Dismiss</button>
          </div>
        )}
      </div>

      {/* Brand Kit Card Result */}
      {brandKit && (
        <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#00D26A]/20 border border-[#00D26A]/40 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-[#00D26A]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white font-mono">Scanned Brand Kit Ready</h2>
                <p className="text-xs text-zinc-400">Review AI extracted parameters before generating workspace.</p>
              </div>
            </div>

            <button
              onClick={handleCreateWorkspace}
              className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#00D26A]/20 flex items-center space-x-2 transition-all hover:scale-105"
            >
              <span>CREATE WORKSPACE & GENERATE BI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Business Summary & Offer */}
            <div className="space-y-4">
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider flex items-center">
                  <Building2 className="w-3.5 h-3.5 mr-1" /> Business Summary
                </div>
                <textarea
                  value={brandKit.business_summary}
                  onChange={(e) => setBrandKit({ ...brandKit, business_summary: e.target.value })}
                  className="w-full bg-transparent text-white text-xs border border-transparent focus:border-[#1F1F1F] rounded-lg p-2 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider flex items-center">
                  <Target className="w-3.5 h-3.5 mr-1" /> Core Offer / Lead Magnet
                </div>
                <input
                  type="text"
                  value={brandKit.core_offer}
                  onChange={(e) => setBrandKit({ ...brandKit, core_offer: e.target.value })}
                  className="w-full bg-transparent text-white text-xs border border-transparent focus:border-[#1F1F1F] rounded-lg p-2 focus:outline-none"
                />
              </div>

              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider flex items-center">
                  <Target className="w-3.5 h-3.5 mr-1" /> Target Audience Persona
                </div>
                <textarea
                  value={brandKit.target_audience}
                  onChange={(e) => setBrandKit({ ...brandKit, target_audience: e.target.value })}
                  className="w-full bg-transparent text-white text-xs border border-transparent focus:border-[#1F1F1F] rounded-lg p-2 focus:outline-none resize-none"
                  rows={2}
                />
              </div>
            </div>

            {/* USPs, Colors & Tone */}
            <div className="space-y-4">
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl space-y-2">
                <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider flex items-center justify-between">
                  <span>Unique Selling Propositions (USPs)</span>
                  <Edit3 className="w-3 h-3 text-zinc-500" />
                </div>
                <ul className="space-y-2">
                  {brandKit.usps.map((usp, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-[#1F1F1F] text-[#FF4D00] font-mono text-[10px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={usp}
                        onChange={(e) => {
                          const updated = [...brandKit.usps];
                          updated[idx] = e.target.value;
                          setBrandKit({ ...brandKit, usps: updated });
                        }}
                        className="w-full bg-transparent text-white text-xs border border-transparent focus:border-[#1F1F1F] rounded-lg px-2 py-1 focus:outline-none"
                      />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider flex items-center">
                    <Palette className="w-3.5 h-3.5 mr-1" /> Brand Colors
                  </div>
                  <div className="flex items-center space-x-2">
                    {brandKit.colors.map((hex, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-lg border border-white/20 shadow-md flex items-center justify-center text-[9px] font-mono font-bold text-white uppercase"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      >
                        {hex.substring(0, 3)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl space-y-2">
                  <div className="text-xs font-bold text-[#FF4D00] uppercase tracking-wider">
                    Tone of Voice
                  </div>
                  <input
                    type="text"
                    value={brandKit.tone}
                    onChange={(e) => setBrandKit({ ...brandKit, tone: e.target.value })}
                    className="w-full bg-transparent text-white text-xs border border-transparent focus:border-[#1F1F1F] rounded-lg p-1 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
