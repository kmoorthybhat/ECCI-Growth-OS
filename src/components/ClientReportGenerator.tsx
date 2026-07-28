import React, { useState } from 'react';
import { FileText, Download, Sparkles, RefreshCw, CheckCircle2, TrendingUp, Award, Loader2 } from 'lucide-react';
import { Client } from '../types';
import { generateWeeklyReport } from '../lib/gemini';

interface ClientReportGeneratorProps {
  client: Client;
}

export const ClientReportGenerator: React.FC<ClientReportGeneratorProps> = ({ client }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [report, setReport] = useState<any>({
    summary: `${client.businessName} generated 86 high-intent leads this week at an average CPL of $21.39, achieving a 4.2x ROAS across Google Ads and Meta Marketing.`,
    topCampaign: 'Meta - Ceremonial Matcha VIP Pass Lead Gen (2.84% CTR, $21.39 CPL)',
    nextWeekPlan: [
      'Increase Meta daily budget by +20% for peak Thursday-Saturday booking windows.',
      'Deploy Module 9 Short-Form Reels creatives to TikTok Ad Manager.',
      'Launch retargeting flow for non-converting website visitors.'
    ]
  });

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      const res = await generateWeeklyReport({
        clientName: client.businessName,
        spend: (client.spendToday || 485) * 7,
        leads: (client.leadsToday || 18) * 7,
        cpl: 21.39,
        roas: 4.2
      });
      setReport(res);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    const text = `ECCI GROWTH OS - EXECUTIVE WEEKLY PERFORMANCE REPORT\nClient: ${client.businessName}\nDate: ${new Date().toLocaleDateString()}\n\nEXECUTIVE SUMMARY:\n${report.summary}\n\nTOP PERFORMING CAMPAIGN:\n${report.topCampaign}\n\nNEXT WEEK ACTION PLAN:\n${report.nextWeekPlan?.join('\n')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${client.businessName.replace(/\s+/g, '_')}_Weekly_Report.txt`;
    a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30 inline-flex items-center">
            <FileText className="w-3 h-3 mr-1" />
            MODULE 19: REPORT & ROI GENERATOR
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            AI Weekly Executive <span className="text-[#00D26A]">Performance Report</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Synthesized every Monday morning by Gemini 2.0 Flash to deliver clear, C-suite insights on marketing spend efficiency.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="bg-[#1F1F1F] hover:bg-[#2F2F2F] text-white border border-[#2F2F2F] px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-[#00D26A]" />}
            <span>{isGenerating ? 'Synthesizing Report...' : 'Re-Generate Weekly AI Report'}</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#00D26A]/20 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD REPORT</span>
          </button>
        </div>
      </div>

      {/* PDF Executive Visual View */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* PDF Watermark / Header Branding */}
        <div className="border-b border-[#1F1F1F] pb-6 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-[#FF4D00] font-mono tracking-widest uppercase">
              ENERGIZE CULT CAFE INC • ECCI GROWTH OS
            </div>
            <h2 className="text-2xl font-black text-white font-mono mt-1">
              Weekly Performance & ROAS Audit
            </h2>
            <span className="text-xs text-zinc-500 font-mono">Week Ending: {new Date().toLocaleDateString()}</span>
          </div>

          <div className="text-right font-mono bg-[#0A0A0A] border border-[#1F1F1F] px-4 py-2 rounded-xl">
            <span className="text-zinc-500 block text-[10px]">VERIFIED ROAS</span>
            <span className="text-2xl font-black text-[#00D26A]">4.2x</span>
          </div>
        </div>

        {/* Executive Summary Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">
            1. Executive Performance Summary
          </h3>
          <p className="text-sm text-zinc-200 leading-relaxed bg-[#0A0A0A] border border-[#1F1F1F] p-5 rounded-xl font-medium">
            {report.summary}
          </p>
        </div>

        {/* Top Campaign */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">
            2. Primary Conversion Driver
          </h3>
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-5 rounded-xl flex items-center justify-between text-xs text-white font-bold font-mono">
            <span>{report.topCampaign}</span>
            <span className="px-2.5 py-1 rounded bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30">
              #1 ROAS
            </span>
          </div>
        </div>

        {/* Next Week Plan */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider">
            3. Next Week Action Strategy
          </h3>
          <ul className="space-y-2">
            {report.nextWeekPlan?.map((item: string, idx: number) => (
              <li key={idx} className="bg-[#0A0A0A] border border-[#1F1F1F] p-4 rounded-xl text-xs text-zinc-300 flex items-start space-x-3">
                <span className="w-5 h-5 rounded-full bg-[#00D26A]/20 text-[#00D26A] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
