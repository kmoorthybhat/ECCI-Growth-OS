import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Brain,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Play,
  Terminal,
  Activity,
  Sparkles
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Client } from '../types';

interface AiMaturityModelViewProps {
  client: Client;
}

export const AiMaturityModelView: React.FC<AiMaturityModelViewProps> = ({ client }) => {
  const [promptInput, setPromptInput] = useState(
    `Optimize budget allocation for ${client.businessName} and generate high-converting ad headlines for Google Search.`
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentChmStep, setCurrentChmStep] = useState<number | null>(null);
  const [simulationLogs, setSimulationLogs] = useState<Array<{ step: number; phase: string; layers: string; output: string }>>([]);

  const tiers = [
    {
      name: 'Tier 1: Foundational Data & Infrastructure',
      layers: [
        { code: 'L01', title: 'Data Ingestion & Hygiene', focus: 'Raw pipeline integrity, canonical schema validation' },
        { code: 'L02', title: 'Infrastructure & Compute', focus: 'Hardware efficiency, token throughput' },
        { code: 'L03', title: 'Security & Access Control', focus: 'Zero-trust verification, data masking, RBAC' }
      ]
    },
    {
      name: 'Tier 2: Cognitive & Model Execution',
      layers: [
        { code: 'L04', title: 'Base Representation & Embeddings', focus: 'High-dimensional vector spaces, semantic indexing' },
        { code: 'L05', title: 'Contextual Memory & Retrieval', focus: 'Episodic/semantic RAG, memory buffers' },
        { code: 'L06', title: 'Reasoning & Inferencing', focus: 'Chain-of-Thought (CoT), Tree-of-Thoughts (ToT)' }
      ]
    },
    {
      name: 'Tier 3: Agentic & Operational Execution',
      layers: [
        { code: 'L07', title: 'Tool Use & API Orchestration', focus: 'Function calling, external environment side-effects' },
        { code: 'L08', title: 'Autonomous Agentic Looping', focus: 'Goal decomposition, self-correction, iterative loops' },
        { code: 'L09', title: 'Multi-Agent Collaboration', focus: 'Swarm intelligence, role specialization' }
      ]
    },
    {
      name: 'Tier 4: Meta Cognition & Governance',
      layers: [
        { code: 'L10', title: 'Meta Cognition & Self-Refinement', focus: 'Critique modules, uncertainty estimation' },
        { code: 'L11', title: 'Governance & Guardrails', focus: 'Compliance, policy adherence' },
        { code: 'L12', title: 'Continuous Learning & Adaptation', focus: 'RLHF/RLAIF feedback loops, online fine-tuning' }
      ]
    },
    {
      name: 'Tier 5: Ecosystem & Generative Synthesis',
      layers: [
        { code: 'L13', title: 'Enterprise & Ecosystem Integration', focus: 'Cross-domain orchestration, strategic alignment' },
        { code: 'L14', title: 'Autonomous Generative Synthesis', focus: 'Novel paradigm generation, zero-shot system design' }
      ]
    }
  ];

  const chmSteps = [
    { step: 1, phase: 'PERCEPTION', layers: 'L01, L04', action: 'Parse raw input, strip noise, map into vector spaces.' },
    { step: 2, phase: 'RETRIEVAL_AND_BOUNDING', layers: 'L02, L03, L05', action: 'Apply security boundaries, fetch RAG context.' },
    { step: 3, phase: 'META_COGNITIVE_DECOMPOSITION', layers: 'L06, L10', action: 'Decompose task into sub-goals via CoT/ToT.' },
    { step: 4, phase: 'AGENTIC_EXECUTION', layers: 'L07, L08, L09', action: 'Orchestrate tool calls, dispatch sub-agents.' },
    { step: 5, phase: 'ALIGNMENT_AND_REFINEMENT', layers: 'L11, L12', action: 'Evaluate response against guardrails, perform self-critique.' },
    { step: 6, phase: 'SYNTHESIS_AND_OUTCOME', layers: 'L13, L14', action: 'Deliver structured high-value response.' }
  ];

  const handleSimulateChm = async () => {
    setIsSimulating(true);
    setSimulationLogs([]);
    setCurrentChmStep(1);

    for (let i = 0; i < chmSteps.length; i++) {
      const s = chmSteps[i];
      setCurrentChmStep(s.step);

      // Brief delay for visual effect
      await new Promise((res) => setTimeout(res, 600));

      setSimulationLogs((prev) => [
        ...prev,
        {
          step: s.step,
          phase: s.phase,
          layers: s.layers,
          output: `[CHM Step ${s.step}: ${s.phase}] Verified layers (${s.layers}) -> Action: ${s.action}`
        }
      ]);
    }

    // Call Gemini 2.0 Flash for final outcome
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: `Given input prompt: "${promptInput}" and client "${client.businessName}", synthesize final outcome after passing 14-Layer AI MM CHM sequence.`
      });

      setSimulationLogs((prev) => [
        ...prev,
        {
          step: 6,
          phase: 'FINAL_SYNTHESIS_OUTPUT',
          layers: 'L13, L14',
          output: response.text || '14-L MM Execution Completed successfully.'
        }
      ]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
      setCurrentChmStep(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30">
                14-LAYER AI MATURITY MODEL & COGNITIVE HIERARCHY (CHM)
              </span>
              <span className="text-zinc-500 font-mono text-xs">Deterministic Cognitive Engine v1.0.0</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              14-Layer AI Maturity Model Matrix & CHM Inspector
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Inspect the architectural layers (L01–L14) and simulate prompt execution trace through the 6-phase Cognitive Hierarchy Model (CHM).
            </p>
          </div>
        </div>
      </div>

      {/* CHM Simulator Section */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-[#FF4D00]" />
          CHM Interactive Prompt Execution Simulator
        </h3>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            className="flex-1 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF4D00]"
            placeholder="Type prompt to simulate through CHM layers..."
          />
          <button
            onClick={handleSimulateChm}
            disabled={isSimulating}
            className="px-5 py-2.5 rounded-xl bg-[#FF4D00] text-white font-bold text-xs hover:bg-[#FF4D00]/90 transition-all flex items-center space-x-2 shadow-lg shadow-[#FF4D00]/25 disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'EXECUTING CHM...' : 'RUN CHM TRACE'}</span>
          </button>
        </div>

        {/* CHM Step Indicator Bar */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 pt-2">
          {chmSteps.map((s) => (
            <div
              key={s.step}
              className={`p-3 rounded-xl border text-center font-mono text-[10px] transition-all ${
                currentChmStep === s.step
                  ? 'bg-[#FF4D00] text-white border-[#FF4D00] shadow-lg shadow-[#FF4D00]/30 animate-pulse'
                  : 'bg-[#0A0A0A] border-[#1F1F1F] text-zinc-400'
              }`}
            >
              <span className="block font-bold">Step {s.step}</span>
              <span className="block text-[9px] truncate">{s.phase}</span>
            </div>
          ))}
        </div>

        {/* Simulation Output Logs */}
        {simulationLogs.length > 0 && (
          <div className="p-4 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl font-mono text-xs space-y-2 text-[#00D26A] max-h-60 overflow-y-auto">
            {simulationLogs.map((log, idx) => (
              <p key={idx} className="leading-relaxed">
                {log.output}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* 14 Layers Matrix Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#FF4D00]" />
          Full 14-Layer AI MM Architecture Matrix
        </h3>

        <div className="space-y-4">
          {tiers.map((tier, idx) => (
            <div key={idx} className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-5 space-y-3">
              <h4 className="text-sm font-bold text-[#FF4D00] font-mono">{tier.name}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {tier.layers.map((l) => (
                  <div key={l.code} className="p-3.5 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded bg-[#1F1F1F] text-[#00D26A] font-mono text-[10px] font-bold">
                        {l.code}
                      </span>
                      <ShieldCheck className="w-3.5 h-3.5 text-[#00D26A]" />
                    </div>
                    <p className="text-xs font-bold text-white mt-1">{l.title}</p>
                    <p className="text-[10px] text-zinc-400">{l.focus}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
