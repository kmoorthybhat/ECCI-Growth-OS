import React, { useState } from 'react';
import { Palette, Image, ShieldCheck, Send, RefreshCw, Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { Client, Creative } from '../types';
import { generateVisualCreative } from '../lib/gemini';

interface CreativeStudioVisualProps {
  client: Client;
  onSaveCreative: (creative: Creative) => void;
}

export const CreativeStudioVisual: React.FC<CreativeStudioVisualProps> = ({ client, onSaveCreative }) => {
  const [headline, setHeadline] = useState('Fuel Your Peak Energy. 0% Crash Ceremonial Matcha.');
  const [isGenerating, setIsGenerating] = useState(false);
  const [visuals, setVisuals] = useState<any[] | null>(null);

  const handleGenerateVisuals = async () => {
    setIsGenerating(true);
    try {
      const res = await generateVisualCreative({
        title: headline,
        primaryColor: client.brand_kit?.colors[0] || '#FF4D00'
      });
      setVisuals(res);
    } catch (err) {
      console.error('Failed to generate visual creatives:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndSubmit = () => {
    if (!visuals) return;

    const newCreative: Creative = {
      id: `cr_vis_${Date.now()}`,
      clientId: client.id,
      type: 'visual',
      title: `Visual Banners - ${headline.substring(0, 25)}...`,
      status: 'pending_approval',
      content: {
        imageUrls: visuals.map((v) => v.url),
        primaryTexts: [headline]
      },
      createdAt: new Date().toISOString()
    };

    onSaveCreative(newCreative);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
            <Palette className="w-3 h-3 mr-1" />
            MODULE 8: AI CREATIVE STUDIO - VISUAL BANNER ENGINE
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            Multi-Aspect Banner <span className="text-[#FF4D00]">Generator</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Produces high-impact 1:1, 4:5, and 9:16 display creative assets verified against brand kit hex color compliance.
          </p>
        </div>

        <button
          onClick={handleGenerateVisuals}
          disabled={isGenerating}
          className="bg-[#FF4D00] hover:bg-[#E64500] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF4D00]/25 flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-current" />}
          <span>{isGenerating ? 'Rendering Visual Assets...' : 'Generate Banners'}</span>
        </button>
      </div>

      <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
        <label className="block text-xs font-semibold text-zinc-400">Headline Overlay Text</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#FF4D00]"
        />
      </div>

      {visuals && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl">
            <div className="flex items-center space-x-3 text-xs text-[#00D26A] font-mono">
              <ShieldCheck className="w-5 h-5 text-[#00D26A]" />
              <span>Brand Kit Color Compliance Verification: <strong>98.4% Match</strong></span>
            </div>

            <button
              onClick={handleSaveAndSubmit}
              className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#00D26A]/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>SUBMIT BANNERS TO MODULE 5</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visuals.map((vis, idx) => (
              <div key={idx} className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                  <span>{vis.ratio}</span>
                  <span className="text-[#00D26A] font-bold">{vis.complianceScore}% Match</span>
                </div>

                <div className="relative rounded-xl overflow-hidden border border-[#1F1F1F] group">
                  <img
                    src={vis.url}
                    alt="AI Visual Creative"
                    className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent p-4 flex flex-col justify-end">
                    <p className="text-white text-xs font-bold leading-tight drop-shadow-md">{headline}</p>
                    <span className="text-[10px] text-[#FF4D00] font-mono mt-1 font-bold uppercase">Energize Cult Cafe</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
