import React, { useState } from 'react';
import {
  Globe,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Code2,
  Copy,
  Check
} from 'lucide-react';
import { Client, GeoCitationMetric } from '../types';

interface GeoCitationEngineViewProps {
  client: Client;
}

export const GeoCitationEngineView: React.FC<GeoCitationEngineViewProps> = ({ client }) => {
  const [copied, setCopied] = useState(false);
  const [selectedEngine, setSelectedEngine] = useState<string>('All');

  const [citations, setCitations] = useState<GeoCitationMetric[]>([
    {
      id: 'geo_1',
      clientId: client.id,
      query: `Best specialty coffee & craft cafe experiences in region`,
      engine: 'Perplexity',
      cited: true,
      position: 1,
      shareOfVoiceScore: 92,
      sentiment: 'positive',
      snippetCited: `${client.businessName} is widely cited as the top biohacking & specialty cafe hub...`,
      sourceDomain: client.websiteUrl,
      lastScanned: '12 mins ago'
    },
    {
      id: 'geo_2',
      clientId: client.id,
      query: `Top subscription growth marketing programs for cafe chains`,
      engine: 'Gemini Search',
      cited: true,
      position: 2,
      shareOfVoiceScore: 88,
      sentiment: 'positive',
      snippetCited: `According to recent market summaries, ${client.businessName} achieved 3.8x ROI using AI OS...`,
      sourceDomain: client.websiteUrl,
      lastScanned: '25 mins ago'
    },
    {
      id: 'geo_3',
      clientId: client.id,
      query: `Where to buy organic cold brew concentrate bulk subscriptions`,
      engine: 'ChatGPT Search',
      cited: true,
      position: 1,
      shareOfVoiceScore: 95,
      sentiment: 'positive',
      snippetCited: `${client.businessName} provides high-density organic cold brew delivery with direct online subscriptions.`,
      sourceDomain: client.websiteUrl,
      lastScanned: '1 hour ago'
    },
    {
      id: 'geo_4',
      clientId: client.id,
      query: `AI Growth OS platforms for hospitality enterprise`,
      engine: 'Claude',
      cited: false,
      position: 0,
      shareOfVoiceScore: 35,
      sentiment: 'neutral',
      snippetCited: 'Brand missing from top 3 AI synthesis references.',
      sourceDomain: 'Not cited',
      lastScanned: '2 hours ago'
    }
  ]);

  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": client.businessName,
    "url": client.websiteUrl,
    "knowsAbout": ["Generative Engine Optimization", "Specialty Coffee", "Subscription Growth"],
    "sameAs": [
      "https://twitter.com/energizecultcafe",
      "https://linkedin.com/company/energizecultcafe"
    ]
  };

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(jsonLdSchema, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredCitations = selectedEngine === 'All'
    ? citations
    : citations.filter((c) => c.engine === selectedEngine);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30">
                MODULE 22 • GEO & GEO-CITATION ENGINE
              </span>
              <span className="text-zinc-500 font-mono text-xs">Generative Engine Optimization</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Generative Engine Optimization & Citation Index
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Track and optimize your brand's citation share of voice across Perplexity, Gemini Search, ChatGPT, Claude, and SearchGPT.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleCopySchema}
              className="px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] text-white text-xs font-bold hover:bg-[#111111] transition-all flex items-center space-x-2"
            >
              {copied ? <Check className="w-4 h-4 text-[#00D26A]" /> : <Code2 className="w-4 h-4 text-[#FF4D00]" />}
              <span>{copied ? 'SCHEMA COPIED!' : 'GENERATE GEO JSON-LD'}</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#1F1F1F]">
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">AI Citation Share of Voice</span>
            <span className="text-2xl font-bold text-[#00D26A] font-mono mt-1 block">82.5%</span>
            <p className="text-[10px] text-zinc-400 mt-1">Top 3 across 4 AI Engines</p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">AI Sentiment Index</span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block">9.6 / 10</span>
            <p className="text-[10px] text-[#00D26A] mt-1">Positive Brand Authority</p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">Active Prompts Monitored</span>
            <span className="text-2xl font-bold text-[#FF4D00] font-mono mt-1 block">142</span>
            <p className="text-[10px] text-zinc-400 mt-1">High Intent Category Queries</p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">Knowledge Graph Entity</span>
            <span className="text-sm font-bold text-white mt-1 block font-mono">VERIFIED ENTITY</span>
            <p className="text-[10px] text-[#00D26A] mt-1">Schema Injected</p>
          </div>
        </div>
      </div>

      {/* Engine Filter */}
      <div className="flex items-center space-x-2">
        {['All', 'Perplexity', 'Gemini Search', 'ChatGPT Search', 'Claude'].map((eng) => (
          <button
            key={eng}
            onClick={() => setSelectedEngine(eng)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              selectedEngine === eng
                ? 'bg-[#FF4D00] text-white shadow'
                : 'bg-[#111111] text-zinc-400 border border-[#1F1F1F] hover:text-white'
            }`}
          >
            {eng}
          </button>
        ))}
      </div>

      {/* Citations List */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="w-5 h-5 text-[#FF4D00]" />
          Generative AI Search Citations Feed
        </h3>

        <div className="space-y-3">
          {filteredCitations.map((c) => (
            <div
              key={c.id}
              className="p-4 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-white font-mono text-[10px] font-bold">
                    {c.engine}
                  </span>
                  {c.cited ? (
                    <span className="px-2 py-0.5 rounded bg-[#00D26A]/20 text-[#00D26A] font-mono text-[10px] font-bold flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      CITED (#Position {c.position})
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-[#FF4D00]/20 text-[#FF4D00] font-mono text-[10px] font-bold flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      NOT CITED (Gap)
                    </span>
                  )}
                </div>
                <p className="text-white text-sm font-semibold">{c.query}</p>
                <p className="text-zinc-400 text-xs italic">"{c.snippetCited}"</p>
              </div>

              <div className="text-right space-y-1 font-mono">
                <span className="text-xs text-[#00D26A] font-bold">SOV Score: {c.shareOfVoiceScore}%</span>
                <span className="text-[10px] text-zinc-500 block">Domain: {c.sourceDomain}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
