import React from 'react';
import { Building2, Globe, ShieldCheck, Palette, CheckCircle2, AlertCircle } from 'lucide-react';
import { Client } from '../types';

interface ClientProfileViewProps {
  client: Client;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({ client }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30 inline-flex items-center">
            <Building2 className="w-3 h-3 mr-1" />
            MODULE 13: CLIENT BUSINESS PROFILE & OAUTH VAULT
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            {client.businessName} <span className="text-[#00D26A]">Profile</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Read-only client workspace configuration and connected ad account API token statuses.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Ad Account Statuses */}
        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white font-mono flex items-center">
            <ShieldCheck className="w-4 h-4 mr-2 text-[#00D26A]" />
            Ad Account OAuth Vault
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl flex items-center justify-between">
              <span className="text-white font-medium">Google Ads Account</span>
              <span className="inline-flex items-center text-[10px] text-[#00D26A] font-mono font-bold">
                <CheckCircle2 className="w-3 h-3 mr-1" /> CONNECTED
              </span>
            </div>

            <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl flex items-center justify-between">
              <span className="text-white font-medium">Meta Marketing API</span>
              <span className="inline-flex items-center text-[10px] text-[#00D26A] font-mono font-bold">
                <CheckCircle2 className="w-3 h-3 mr-1" /> CONNECTED
              </span>
            </div>

            <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl flex items-center justify-between">
              <span className="text-white font-medium">LinkedIn Campaign Manager</span>
              <span className="inline-flex items-center text-[10px] text-[#00D26A] font-mono font-bold">
                <CheckCircle2 className="w-3 h-3 mr-1" /> CONNECTED
              </span>
            </div>
          </div>
        </div>

        {/* Brand Kit Overview */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white font-mono flex items-center">
            <Palette className="w-4 h-4 mr-2 text-[#FF4D00]" />
            Scanned Brand Kit Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3.5 rounded-xl space-y-1">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Business Summary</span>
              <p className="text-zinc-300">{client.brand_kit?.business_summary || 'Premium specialty cafe sanctuary.'}</p>
            </div>

            <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3.5 rounded-xl space-y-1">
              <span className="text-zinc-500 font-mono text-[10px] uppercase">Core Offer</span>
              <p className="text-white font-bold">{client.brand_kit?.core_offer || '$49/mo Unlimited Cold Brew & Matcha Pass'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl space-y-1">
                <span className="text-zinc-500 font-mono text-[10px] uppercase">Brand Colors</span>
                <div className="flex items-center space-x-2 pt-1">
                  {client.brand_kit?.colors.map((hex, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-md border border-white/20"
                      style={{ backgroundColor: hex }}
                      title={hex}
                    />
                  ))}
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl space-y-1">
                <span className="text-zinc-500 font-mono text-[10px] uppercase">Brand Tone</span>
                <p className="text-white font-medium">{client.brand_kit?.tone || 'Energetic, High-Vibe, Bold'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
