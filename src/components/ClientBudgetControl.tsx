import React, { useState } from 'react';
import { DollarSign, ShieldAlert, CheckCircle2, Sliders, AlertTriangle, Flame } from 'lucide-react';
import { Client } from '../types';

interface ClientBudgetControlProps {
  client: Client;
  onUpdateMaxBudget: (newBudget: number) => void;
  onTogglePause: () => void;
}

export const ClientBudgetControl: React.FC<ClientBudgetControlProps> = ({
  client,
  onUpdateMaxBudget,
  onTogglePause,
}) => {
  const [maxBudget, setMaxBudget] = useState(client.maxMonthlyBudget || 15000);
  const totalSpent = (client.spendToday || 485) * 22;
  const remaining = Math.max(0, maxBudget - totalSpent);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setMaxBudget(val);
    onUpdateMaxBudget(val);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#111111] via-[#1A0A00] to-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
            <DollarSign className="w-3 h-3 mr-1" />
            MODULE 18: CLIENT BUDGET CONTROL & TRANSPARENCY
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            100% Media Budget <span className="text-[#FF4D00]">Autonomy</span>
          </h1>
          <p className="text-sm font-semibold text-[#00D26A] mt-1">
            "You have full control over your money. 0% marked-up media spend."
          </p>
        </div>

        <button
          onClick={onTogglePause}
          className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-lg ${
            client.killSwitch
              ? 'bg-[#00D26A] text-black shadow-[#00D26A]/20'
              : 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>{client.killSwitch ? 'RESUME ALL CAMPAIGNS' : 'EMERGENCY PAUSE ALL CAMPAIGNS'}</span>
        </button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <span className="text-xs text-zinc-400 font-mono uppercase">Max Monthly Spend Limit</span>
          <div className="text-3xl font-black text-white font-mono">${maxBudget.toLocaleString()}</div>
          <p className="text-[11px] text-zinc-500">Adjustable anytime via slider below.</p>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <span className="text-xs text-zinc-400 font-mono uppercase">Total Spend Month-To-Date</span>
          <div className="text-3xl font-black text-[#FF4D00] font-mono">${totalSpent.toLocaleString()}</div>
          <p className="text-[11px] text-[#00D26A]">Billed directly by Google/Meta ad accounts.</p>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <span className="text-xs text-zinc-400 font-mono uppercase">Remaining Safe Allowance</span>
          <div className="text-3xl font-black text-[#00D26A] font-mono">${remaining.toLocaleString()}</div>
          <p className="text-[11px] text-zinc-500">Auto-pauses if cap is reached.</p>
        </div>
      </div>

      {/* Slider Control */}
      <div className="bg-[#111111] border border-[#1F1F1F] p-8 rounded-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-mono flex items-center">
              <Sliders className="w-5 h-5 mr-2 text-[#FF4D00]" />
              Set Max Monthly Media Budget Cap
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              Drag slider to cap maximum ad spend allowed across all connected networks.
            </p>
          </div>

          <span className="text-2xl font-black text-[#FF4D00] font-mono border border-[#FF4D00]/30 px-4 py-2 rounded-xl bg-[#0A0A0A]">
            ${maxBudget.toLocaleString()} / mo
          </span>
        </div>

        <input
          type="range"
          min="1000"
          max="50000"
          step="500"
          value={maxBudget}
          onChange={handleSliderChange}
          className="w-full accent-[#FF4D00] bg-[#0A0A0A] h-3 rounded-lg cursor-pointer border border-[#1F1F1F]"
        />

        <div className="flex justify-between text-xs text-zinc-500 font-mono">
          <span>$1,000 / mo</span>
          <span>$25,000 / mo</span>
          <span>$50,000 / mo</span>
        </div>
      </div>
    </div>
  );
};
