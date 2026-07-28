import React, { useState, useEffect } from 'react';
import {
  Activity,
  Radio,
  Zap,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  RefreshCw,
  Play,
  Pause,
  Clock,
  ShieldCheck,
  BarChart2,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { Client, TelemetryEvent } from '../types';

interface TelemetryEngineViewProps {
  client: Client;
  onRecordEvent?: (event: TelemetryEvent) => void;
}

export const TelemetryEngineView: React.FC<TelemetryEngineViewProps> = ({
  client,
  onRecordEvent
}) => {
  const [isStreaming, setIsStreaming] = useState(true);
  const [latencyMs, setLatencyMs] = useState(124);
  const [eventsPerMin, setEventsPerMin] = useState(48);
  const [events, setEvents] = useState<TelemetryEvent[]>([
    {
      id: 'evt_1',
      clientId: client.id,
      timestamp: new Date(Date.now() - 1000 * 5).toLocaleTimeString(),
      source: 'Google Ads',
      eventType: 'conversion',
      metric: 'High-Intent Form Submit',
      value: 120,
      unit: 'USD',
      latencyMs: 112,
      details: 'User matched persona "Biohacking Founder", CPA $24.00'
    },
    {
      id: 'evt_2',
      clientId: client.id,
      timestamp: new Date(Date.now() - 1000 * 18).toLocaleTimeString(),
      source: 'Meta Webhook',
      eventType: 'cpa_spike',
      metric: 'CPA Anomaly Alert',
      value: 48.50,
      unit: 'USD',
      latencyMs: 145,
      details: 'Meta Adset #3812 CPA (+38% vs baseline target $35.00)'
    },
    {
      id: 'evt_3',
      clientId: client.id,
      timestamp: new Date(Date.now() - 1000 * 35).toLocaleTimeString(),
      source: 'System Micro-Agent',
      eventType: 'agent_action',
      metric: '14-L MM L08 Loop Triggered',
      value: 15,
      unit: '%',
      latencyMs: 88,
      details: 'Autonomous budget re-allocated +15% to Google Search high intent'
    },
    {
      id: 'evt_4',
      clientId: client.id,
      timestamp: new Date(Date.now() - 1000 * 60).toLocaleTimeString(),
      source: 'LinkedIn API',
      eventType: 'conversion',
      metric: 'Enterprise Lead Ingested',
      value: 850,
      unit: 'USD Est',
      latencyMs: 160,
      details: 'VP of Marketing lead from LinkedIn InMail Ad'
    }
  ]);

  // Simulate real-time stream updates every 4 seconds when streaming is active
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const sources: TelemetryEvent['source'][] = ['Google Ads', 'Meta Webhook', 'LinkedIn API', 'System Micro-Agent', 'CRM Event'];
      const types: TelemetryEvent['eventType'][] = ['conversion', 'conversion', 'cpa_spike', 'ctr_drop', 'agent_action'];
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomLat = Math.floor(Math.random() * 80) + 90; // 90ms - 170ms

      const newEvt: TelemetryEvent = {
        id: `evt_${Date.now()}`,
        clientId: client.id,
        timestamp: new Date().toLocaleTimeString(),
        source: randomSource,
        eventType: randomType,
        metric: randomType === 'conversion' ? 'Real-time Lead Ingestion' : randomType === 'cpa_spike' ? 'Meta CPA Anomaly' : 'Autonomous Micro-Agent Shift',
        value: Math.floor(Math.random() * 100) + 10,
        unit: randomType === 'conversion' ? 'USD' : 'ms',
        latencyMs: randomLat,
        details: `EAG Stream Processed. Verified by 14-L MM L01 Ingestion Layer for ${client.businessName}.`
      };

      setEvents((prev) => [newEvt, ...prev.slice(0, 19)]);
      setLatencyMs(randomLat);
      setEventsPerMin((prev) => Math.min(120, Math.max(30, prev + (Math.random() > 0.5 ? 2 : -1))));
      if (onRecordEvent) onRecordEvent(newEvt);
    }, 3800);

    return () => clearInterval(interval);
  }, [isStreaming, client, onRecordEvent]);

  const triggerManualAnomaly = () => {
    const anomalyEvt: TelemetryEvent = {
      id: `evt_manual_${Date.now()}`,
      clientId: client.id,
      timestamp: new Date().toLocaleTimeString(),
      source: 'Meta Webhook',
      eventType: 'cpa_spike',
      metric: 'CRITICAL CPA SPIKE (>45%)',
      value: 62.40,
      unit: 'USD',
      latencyMs: 110,
      details: 'Meta Adset #4092 CPA spiked to $62.40. EAG trigger auto-dispatched to Module 21 Orchestrator!'
    };
    setEvents((prev) => [anomalyEvt, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Banner */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF4D00]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30 flex items-center space-x-1">
                <Radio className="w-3 h-3 mr-1 animate-ping text-[#FF4D00]" />
                MODULE 20 • EAG TELEMETRY ENGINE
              </span>
              <span className="text-zinc-500 font-mono text-xs">Event-Augmented Generation</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Real-Time Reactive Event Telemetry & Audit Stream
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Streaming ad platform webhooks, conversion anomalies, and micro-agent state shifts directly into active client context without full page refreshes.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all ${
                isStreaming
                  ? 'bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/40 hover:bg-[#00D26A]/30'
                  : 'bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>PAUSE SSE STREAM</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>RESUME SSE STREAM</span>
                </>
              )}
            </button>

            <button
              onClick={triggerManualAnomaly}
              className="px-4 py-2 rounded-xl bg-[#FF4D00] text-white font-semibold text-xs hover:bg-[#FF4D00]/90 transition-all flex items-center space-x-2 shadow-lg shadow-[#FF4D00]/20"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SIMULATE EAG ANOMALY</span>
            </button>
          </div>
        </div>

        {/* Top Zone: Dynamic Live Pulse Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[#1F1F1F]">
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3.5 rounded-xl">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">Latency Delta (&lt;200ms)</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xl font-mono font-bold text-[#00D26A]">{latencyMs} ms</span>
              <span className="text-[10px] text-zinc-400">Target &lt;200ms</span>
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#00D26A] h-full transition-all duration-500"
                style={{ width: `${Math.min(100, (latencyMs / 200) * 100)}%` }}
              />
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3.5 rounded-xl">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">Event Density Index (EDI)</span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-xl font-mono font-bold text-white">{eventsPerMin}</span>
              <span className="text-[10px] text-zinc-400">events / min</span>
            </div>
            <p className="text-[10px] text-zinc-500 mt-1">Live Ad Webhooks Stream</p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3.5 rounded-xl">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">Active WebSocket Broker</span>
            <div className="flex items-center space-x-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-[#00D26A] animate-ping" />
              <span className="text-sm font-mono font-bold text-white">wss://eag.ecci.ai/stream</span>
            </div>
            <p className="text-[10px] text-[#00D26A] mt-1 font-mono">Deduplication: ACTIVE</p>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3.5 rounded-xl">
            <span className="text-zinc-500 text-[10px] uppercase font-mono block">14-L MM Active Layers</span>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="px-2 py-0.5 rounded bg-[#FF4D00]/20 text-[#FF4D00] text-[10px] font-mono">L01 Data Hygiene</span>
              <span className="px-2 py-0.5 rounded bg-[#00D26A]/20 text-[#00D26A] text-[10px] font-mono">L07 Tool Exec</span>
            </div>
            <p className="text-[10px] text-zinc-400 mt-1">100% Schema Compliant</p>
          </div>
        </div>
      </div>

      {/* Mid Zone: Real-time spend velocity vs lead pipeline generation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart2 className="w-5 h-5 text-[#FF4D00]" />
              <h3 className="font-bold text-white text-base">Spend Velocity vs Pipeline Yield (EAG Overlay)</h3>
            </div>
            <span className="text-xs font-mono text-zinc-400">Client: {client.businessName}</span>
          </div>

          {/* Visual Velocity Telemetry Bar Visualizer */}
          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Google Search Ad Velocity ($42.50/hr)</span>
                <span className="text-[#00D26A] font-mono">+18% Lead Conv Rate</span>
              </div>
              <div className="h-3 w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-full overflow-hidden flex">
                <div className="bg-gradient-to-r from-[#FF4D00] to-[#FF8800] h-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Meta Dynamic Retargeting ($31.10/hr)</span>
                <span className="text-[#FF4D00] font-mono">CPA Warning ($48.50)</span>
              </div>
              <div className="h-3 w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-full overflow-hidden flex">
                <div className="bg-[#FF4D00] h-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>LinkedIn Account-Based InMail ($28.00/hr)</span>
                <span className="text-[#00D26A] font-mono">High Quality SQLs</span>
              </div>
              <div className="h-3 w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-full overflow-hidden flex">
                <div className="bg-[#00D26A] h-full" style={{ width: '45%' }} />
              </div>
            </div>
          </div>

          <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-4 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center space-x-2 text-zinc-300">
              <Cpu className="w-4 h-4 text-[#FF4D00]" />
              <span>Real-time Context Assembly: 14-L MM L05 Contextual Memory ACTIVE</span>
            </div>
            <span className="text-[#00D26A]">Zero State Corruption</span>
          </div>
        </div>

        {/* System Micro-Agent Operational Status */}
        <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
          <h3 className="font-bold text-white text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#00D26A]" />
            EAG Micro-Agents Status
          </h3>

          <div className="space-y-3">
            <div className="p-3 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Bid Optimization Swarm</span>
                <span className="text-[10px] text-zinc-500">L08 Autonomous Looping</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00D26A]/20 text-[#00D26A] font-bold">
                ACTIVE
              </span>
            </div>

            <div className="p-3 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Ad Fatigue Guard</span>
                <span className="text-[10px] text-zinc-500">CTR Drop Detector</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00D26A]/20 text-[#00D26A] font-bold">
                MONITORING
              </span>
            </div>

            <div className="p-3 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Fraud & Bot Scraper Guard</span>
                <span className="text-[10px] text-zinc-500">L03 Security Isolation</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00D26A]/20 text-[#00D26A] font-bold">
                PROTECTED
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Zone: Proof-of-Work Audit Feed */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-[#FF4D00]" />
            <h3 className="font-bold text-white text-base">Proof-of-Work Real-time Audit Stream</h3>
          </div>
          <span className="text-xs text-zinc-500 font-mono">Showing last {events.length} stream payloads</span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 font-mono text-xs">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="p-3 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-2 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    evt.eventType === 'cpa_spike'
                      ? 'bg-[#FF4D00] animate-pulse'
                      : evt.eventType === 'conversion'
                      ? 'bg-[#00D26A]'
                      : 'bg-blue-400'
                  }`}
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{evt.source}</span>
                    <span className="text-zinc-500 text-[10px]">• {evt.timestamp}</span>
                    <span className="px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 text-[10px]">
                      {evt.metric}
                    </span>
                  </div>
                  <p className="text-zinc-400 text-xs mt-0.5">{evt.details}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <span className="text-zinc-500 text-[10px]">Latency: {evt.latencyMs}ms</span>
                <span className="px-2 py-1 rounded bg-[#111111] border border-[#1F1F1F] font-bold text-[#FF4D00]">
                  {evt.value} {evt.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
