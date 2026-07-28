import React, { useState } from 'react';
import { Sparkles, Copy, Check, Send, RefreshCw, FileText, Loader2, Target } from 'lucide-react';
import { Client, Creative } from '../types';
import { generateTextCreative } from '../lib/gemini';

interface CreativeStudioTextProps {
  client: Client;
  onSaveCreative: (creative: Creative) => void;
}

export const CreativeStudioText: React.FC<CreativeStudioTextProps> = ({ client, onSaveCreative }) => {
  const personas = client.bi_engine?.personas || [];
  const adAngles = client.bi_engine?.ad_angles || [];

  const [selectedPersona, setSelectedPersona] = useState(personas[0]?.name || 'High-Vibe Tech Founder');
  const [selectedAngle, setSelectedAngle] = useState(adAngles[0] || 'Upgrade Your Focus with Nitro Matcha');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const content = await generateTextCreative({
        personaName: selectedPersona,
        adAngle: selectedAngle,
        brandKit: client.brand_kit
      });
      setGeneratedContent(content);
    } catch (err) {
      console.error('Failed to generate text creative:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndSubmit = () => {
    if (!generatedContent) return;

    const newCreative: Creative = {
      id: `cr_text_${Date.now()}`,
      clientId: client.id,
      type: 'text',
      title: `Text Creative - ${selectedPersona} (${selectedAngle.substring(0, 20)}...)`,
      personaId: selectedPersona,
      adAngle: selectedAngle,
      status: 'pending_approval',
      content: generatedContent,
      createdAt: new Date().toISOString()
    };

    onSaveCreative(newCreative);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(key);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
            <Sparkles className="w-3 h-3 mr-1" />
            MODULE 7: AI CREATIVE STUDIO - TEXT COPYWRITER
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            Multi-Platform <span className="text-[#FF4D00]">Ad Copy Generator</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Generates 5 Headlines, 5 Primary Copy options, 5 Descriptions & Landing Page Copy tailored for Google, Meta, and LinkedIn.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="bg-[#FF4D00] hover:bg-[#E64500] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF4D00]/25 flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-current" />}
          <span>{isGenerating ? 'Generating Ad Copy...' : 'Generate Copy Options'}</span>
        </button>
      </div>

      {/* Input Selection Controls */}
      <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">Target Persona</label>
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#FF4D00]"
          >
            {personas.map((p) => (
              <option key={p.id} value={p.name}>
                {p.name} ({p.role})
              </option>
            ))}
            {personas.length === 0 && <option value="General Target ICP">General Target ICP</option>}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">Core Viral Ad Angle</label>
          <select
            value={selectedAngle}
            onChange={(e) => setSelectedAngle(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#FF4D00]"
          >
            {adAngles.map((angle, i) => (
              <option key={i} value={angle}>
                {angle}
              </option>
            ))}
            {adAngles.length === 0 && <option value="Upgrade Your Focus">Upgrade Your Focus</option>}
          </select>
        </div>
      </div>

      {/* Output Results */}
      {generatedContent && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleSaveAndSubmit}
              className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#00D26A]/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>SUBMIT TO APPROVAL QUEUE (MODULE 5)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 5 Headlines */}
            <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white font-mono text-[#FF4D00]">5 Headlines (Google & Meta)</h3>
              <div className="space-y-2">
                {generatedContent.headlines?.map((h: string, idx: number) => (
                  <div key={idx} className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl flex items-center justify-between text-xs text-white font-medium">
                    <span>{h}</span>
                    <button
                      onClick={() => copyToClipboard(h, `h_${idx}`)}
                      className="text-zinc-500 hover:text-[#FF4D00] p-1"
                    >
                      {copiedIndex === `h_${idx}` ? <Check className="w-3.5 h-3.5 text-[#00D26A]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 5 Descriptions */}
            <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white font-mono text-[#00D26A]">5 Descriptions (Google & LinkedIn)</h3>
              <div className="space-y-2">
                {generatedContent.descriptions?.map((d: string, idx: number) => (
                  <div key={idx} className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl flex items-center justify-between text-xs text-zinc-300">
                    <span>{d}</span>
                    <button
                      onClick={() => copyToClipboard(d, `d_${idx}`)}
                      className="text-zinc-500 hover:text-[#FF4D00] p-1"
                    >
                      {copiedIndex === `d_${idx}` ? <Check className="w-3.5 h-3.5 text-[#00D26A]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5 Primary Texts */}
          <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white font-mono text-cyan-400">5 Primary Copy Variations (Meta & LinkedIn)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedContent.primaryTexts?.map((p: string, idx: number) => (
                <div key={idx} className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl space-y-2 text-xs text-zinc-300 relative">
                  <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-2 text-[10px] font-mono text-zinc-500">
                    <span>Variation #{idx + 1}</span>
                    <button
                      onClick={() => copyToClipboard(p, `p_${idx}`)}
                      className="text-zinc-400 hover:text-[#FF4D00] flex items-center space-x-1"
                    >
                      {copiedIndex === `p_${idx}` ? <Check className="w-3 h-3 text-[#00D26A]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === `p_${idx}` ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <p className="leading-relaxed">{p}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
