import React, { useState } from 'react';
import {
  FileCode,
  Code2,
  Copy,
  Check,
  Play,
  Database,
  Layers,
  Sparkles,
  ShieldAlert,
  FileSpreadsheet,
  Presentation
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Client } from '../types';

interface AppsScriptAgentViewProps {
  client: Client;
}

export const AppsScriptAgentView: React.FC<AppsScriptAgentViewProps> = ({ client }) => {
  const [scriptType, setScriptType] = useState<'sheets' | 'slides' | 'drive'>('sheets');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const [generatedScript, setGeneratedScript] = useState<string>(
`/**
 * ECCI Growth OS v2.0 - Module 23 Deterministic Google Apps Script
 * Automated CRM & Lead Sync for ${client.businessName}
 * Guardrails: 14-Layer AI MM L03 Security & L07 Tool Orchestration
 */
function syncECCIGrowthLeads() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (!sheet) return;

  var endpoint = "https://ecci-growth.app/api/v2/leads?clientId=${client.id}";
  var options = {
    "method": "get",
    "headers": {
      "Authorization": "Bearer ECCI_SECURE_TOKEN_EPHEMERAL"
    }
  };

  try {
    var response = UrlFetchApp.fetch(endpoint, options);
    var data = JSON.parse(response.getContentText());
    
    // Append rows deterministically
    data.leads.forEach(function(lead) {
      sheet.appendRow([
        new Date(),
        lead.name,
        lead.email,
        lead.score,
        lead.status,
        lead.personaMatch
      ]);
    });
    Logger.log("Successfully synced " + data.leads.length + " leads.");
  } catch(e) {
    Logger.log("Error syncing leads: " + e.toString());
  }
}`
  );

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const prompt = `Generate a Google Apps Script (GAS) function for client "${client.businessName}" (Industry: ${client.industry}).
Type: ${scriptType} script.
The script should automate ${scriptType === 'sheets' ? 'Google Sheets real-time lead pipeline logging' : scriptType === 'slides' ? 'Weekly Google Slides growth deck automated rendering' : 'Google Drive client campaign asset archiving'}.
Include strict 14-Layer AI MM L03 & L07 deterministic execution parameters.
Return clean Google Apps Script JavaScript code only inside code block.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
      });

      const raw = response.text || '';
      const cleanScript = raw.replace(/```javascript|```gs|```/g, '').trim();
      setGeneratedScript(cleanScript || generatedScript);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30">
                MODULE 23 • DETERMINISTIC APPS SCRIPT AGENT
              </span>
              <span className="text-zinc-500 font-mono text-xs">Google Workspace Automation</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Google Workspace Deterministic Apps Script Agent
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Generates type-safe Google Apps Script code for automatic synchronization with Google Sheets, Google Slides presentation generation, and Drive storage.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateScript}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-[#FF4D00] text-white font-bold text-xs hover:bg-[#FF4D00]/90 transition-all flex items-center space-x-2 shadow-lg shadow-[#FF4D00]/25 disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'GENERATING SCRIPT...' : 'REGENERATE SCRIPT'}</span>
            </button>
          </div>
        </div>

        {/* Script Selection Tabs */}
        <div className="flex space-x-2 mt-6 pt-6 border-t border-[#1F1F1F]">
          <button
            onClick={() => setScriptType('sheets')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              scriptType === 'sheets'
                ? 'bg-[#FF4D00] text-white'
                : 'bg-[#0A0A0A] text-zinc-400 border border-[#1F1F1F]'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Google Sheets Sync</span>
          </button>

          <button
            onClick={() => setScriptType('slides')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              scriptType === 'slides'
                ? 'bg-[#FF4D00] text-white'
                : 'bg-[#0A0A0A] text-zinc-400 border border-[#1F1F1F]'
            }`}
          >
            <Presentation className="w-4 h-4" />
            <span>Google Slides Pitch Generator</span>
          </button>
        </div>
      </div>

      {/* Code Editor Preview */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 font-mono text-xs text-zinc-300">
            <Code2 className="w-4 h-4 text-[#FF4D00]" />
            <span>Code Editor: GoogleAppsScript_ECCI_{scriptType.toUpperCase()}.gs</span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] text-xs font-mono text-white hover:border-zinc-700 transition-all flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#00D26A]" /> : <Copy className="w-3.5 h-3.5 text-[#FF4D00]" />}
            <span>{copied ? 'COPIED TO CLIPBOARD' : 'COPY SCRIPT'}</span>
          </button>
        </div>

        <pre className="p-4 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl text-xs font-mono text-[#00D26A] overflow-x-auto leading-relaxed">
          {generatedScript}
        </pre>
      </div>
    </div>
  );
};
