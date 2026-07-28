import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Palette,
  Link,
  Copy,
  Check,
  Eye,
  Sparkles,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Client, WhiteLabelConfig } from '../types';

interface WhiteLabelEngineViewProps {
  client: Client;
}

export const WhiteLabelEngineView: React.FC<WhiteLabelEngineViewProps> = ({ client }) => {
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState<WhiteLabelConfig>({
    clientId: client.id,
    agencyName: 'Energize Cult OS Partners',
    customDomain: `growth.${client.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    primaryColor: '#FF4D00',
    secondaryColor: '#00D26A',
    supportEmail: `growth@${client.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
    enabled: true
  });

  const magicInviteLink = `https://${config.customDomain}/portal?token=ecci_wl_${Math.random().toString(36).substring(2, 10)}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(magicInviteLink);
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
                MODULE 25 • MULTI-TENANT WHITE-LABEL OS ENGINE
              </span>
              <span className="text-zinc-500 font-mono text-xs">Custom Branding & CNAME Setup</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Multi-Tenant White-Label OS Engine
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Rebrand ECCI Growth OS with agency domains, custom CSS, color palettes, and custom client magic links.
            </p>
          </div>

          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl bg-[#00D26A] text-black font-bold text-xs hover:bg-[#00D26A]/90 transition-all flex items-center space-x-2 shadow-lg shadow-[#00D26A]/20"
          >
            {copied ? <Check className="w-4 h-4 text-black" /> : <Link className="w-4 h-4 text-black" />}
            <span>{copied ? 'MAGIC LINK COPIED!' : 'COPY WHITE-LABEL CLIENT LINK'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* White Label Configuration Form */}
        <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#FF4D00]" />
            Agency Brand Customizer
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Agency Name</label>
              <input
                type="text"
                value={config.agencyName}
                onChange={(e) => setConfig({ ...config, agencyName: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D00]"
              />
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Custom Sub-Domain / CNAME</label>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={config.customDomain}
                  onChange={(e) => setConfig({ ...config, customDomain: e.target.value })}
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Primary Color</label>
                <input
                  type="color"
                  value={config.primaryColor}
                  onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-1 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">Secondary Accent</label>
                <input
                  type="color"
                  value={config.secondaryColor}
                  onChange={(e) => setConfig({ ...config, secondaryColor: e.target.value })}
                  className="w-full h-10 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-1 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-zinc-400 block mb-1">Custom Support Email</label>
              <input
                type="email"
                value={config.supportEmail}
                onChange={(e) => setConfig({ ...config, supportEmail: e.target.value })}
                className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF4D00]"
              />
            </div>
          </div>
        </div>

        {/* Live White Label Preview Container */}
        <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#00D26A]" />
              Live White-Label Portal Preview
            </h3>
            <span className="text-xs font-mono text-zinc-500">{config.customDomain}</span>
          </div>

          <div
            className="p-6 rounded-2xl border border-[#1F1F1F] bg-[#0A0A0A] space-y-4 shadow-2xl"
            style={{ borderTop: `4px solid ${config.primaryColor}` }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white text-xs"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  {config.agencyName.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <span className="text-sm font-bold text-white block">{config.agencyName}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">White-Label Portal</span>
                </div>
              </div>

              <span
                className="px-2.5 py-1 rounded text-[10px] font-bold font-mono text-black"
                style={{ backgroundColor: config.secondaryColor }}
              >
                CLIENT PORTAL
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#111111] border border-[#1F1F1F] space-y-2">
              <span className="text-xs text-zinc-400">Welcome to your growth dashboard, {client.businessName}</span>
              <div className="flex justify-between items-baseline font-mono">
                <span className="text-xl font-bold text-white">${client.spendToday.toFixed(2)} spend</span>
                <span className="text-xs font-bold" style={{ color: config.secondaryColor }}>
                  {client.leadsToday} qualified leads today
                </span>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 font-mono text-center">
              Powered by {config.agencyName} • Support: {config.supportEmail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
