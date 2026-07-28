import React, { useState } from 'react';
import { Sparkles, Edit, Play, History, Lock, CheckCircle2, Copy, Save, Code, Zap } from 'lucide-react';
import { PromptItem } from '../types';

interface PromptLibraryProps {
  prompts: PromptItem[];
  onSavePrompt: (prompt: PromptItem) => void;
}

export const PromptLibrary: React.FC<PromptLibraryProps> = ({ prompts, onSavePrompt }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<PromptItem>(prompts[0] || {
    id: 'p_1',
    name: 'Persona Generator & Market Intelligence',
    description: 'Scrapes brand context and synthesizes 3 ultra-targeted ICP personas with keywords and ad angles.',
    category: 'Intelligence',
    model: 'gemini-1.5-pro',
    version: 'v2.4',
    updatedAt: new Date().toISOString(),
    promptText: `Act as Chief Growth Officer for {{brandName}}. Produce a structured JSON with 3 Buyer Personas, 5 Ad Angles, and Platform Budget Strategy.`
  });

  const [promptText, setPromptText] = useState(selectedPrompt.promptText);
  const [model, setModel] = useState<'gemini-2.0-flash' | 'gemini-1.5-pro'>(selectedPrompt.model);
  const [testInput, setTestInput] = useState('Brand: Energize Cult Cafe Inc\nCore Offer: Unlimited Cold Brew Pass');
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSelect = (p: PromptItem) => {
    setSelectedPrompt(p);
    setPromptText(p.promptText);
    setModel(p.model);
    setTestOutput(null);
  };

  const handleTestPrompt = async () => {
    setIsTesting(true);
    setTestOutput(null);

    try {
      const res = await fetch('/api/generate-text-creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personaName: 'Test Founder Persona',
          adAngle: 'Bio-Optimized Nitro Brew',
          brandKit: { business_summary: testInput }
        })
      });
      const data = await res.json();
      setTestOutput(JSON.stringify(data.content, null, 2));
    } catch (err) {
      setTestOutput('Error executing playground test.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const updated: PromptItem = {
      ...selectedPrompt,
      promptText,
      model,
      version: `v${(parseFloat(selectedPrompt.version.replace('v', '')) + 0.1).toFixed(1)}`,
      updatedAt: new Date().toISOString()
    };
    onSavePrompt(updated);
    setSelectedPrompt(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              MODULE 4: AI ARCHITECTURE & PROMPT LIBRARY
            </span>
            <span className="text-amber-400 text-xs font-bold flex items-center">
              <Lock className="w-3 h-3 mr-1" /> INNOVATOR IP VAULT
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            System Prompts & <span className="text-[#FF4D00]">Playground</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Manage, version, and live-test the foundational prompt templates driving ECCI Growth OS AI functions.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="bg-[#FF4D00] hover:bg-[#E64500] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#FF4D00]/20 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Save New Version ({selectedPrompt.version})</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left List of Prompts */}
        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-2xl space-y-3">
          <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Prompt Templates Vault</h2>
          {prompts.map((p) => (
            <div
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                selectedPrompt.id === p.id
                  ? 'bg-[#1F1F1F] border-[#FF4D00] shadow-lg shadow-[#FF4D00]/10'
                  : 'bg-[#0A0A0A] border-[#1F1F1F] hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{p.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#111111] text-[#FF4D00] font-mono border border-[#FF4D00]/30">
                  {p.version}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2">{p.description}</p>
              <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>Model: {p.model}</span>
                <span>Category: {p.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Prompt Editor & Playground */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Editor */}
          <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
              <div>
                <h3 className="font-bold text-white text-base font-mono">{selectedPrompt.name}</h3>
                <p className="text-xs text-zinc-400">{selectedPrompt.description}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-xs text-zinc-400">Target Model:</span>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value as any)}
                  className="bg-[#0A0A0A] border border-[#1F1F1F] text-xs text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#FF4D00]"
                >
                  <option value="gemini-2.0-flash">Gemini 2.0 Flash (Fast Output)</option>
                  <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Research)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">System Prompt Directive Text</label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-white font-mono text-xs rounded-xl p-4 focus:outline-none focus:border-[#FF4D00] leading-relaxed resize-none"
                rows={8}
              />
            </div>
          </div>

          {/* Test Playground */}
          <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white font-mono flex items-center">
                <Code className="w-4 h-4 mr-2 text-[#FF4D00]" />
                Live Prompt Test Playground
              </h3>

              <button
                onClick={handleTestPrompt}
                disabled={isTesting}
                className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black px-5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-[#00D26A]/20 transition-all disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isTesting ? 'Executing...' : 'Run Test Prompt'}</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1">Sample Variable Input Payload</label>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-white text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            {testOutput && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                  <span>Structured Output JSON Result:</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(testOutput);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="text-[#FF4D00] hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl text-xs text-[#00D26A] font-mono overflow-x-auto max-h-60">
                  {testOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
