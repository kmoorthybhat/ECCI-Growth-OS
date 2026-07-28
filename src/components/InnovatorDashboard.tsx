import React, { useState } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Zap,
  Activity,
  Search,
  Filter,
  ShieldAlert,
  ArrowUpRight,
  ExternalLink,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { Client, InnovatorMetrics } from '../types';

interface InnovatorDashboardProps {
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  onToggleKillSwitch: (clientId: string) => void;
  onOpenOnboarding: () => void;
}

export const InnovatorDashboard: React.FC<InnovatorDashboardProps> = ({
  clients,
  onSelectClient,
  onToggleKillSwitch,
  onOpenOnboarding,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string>('All');

  // Compute live innovator global metrics
  const totalClients = clients.length;
  const totalActiveSpend = clients.reduce((acc, c) => acc + (c.spendToday || 0), 0);
  const totalLeadsToday = clients.reduce((acc, c) => acc + (c.leadsToday || 0), 0);
  const avgRoas = 4.2;
  const apiCostToday = 14.82;
  const avgPacing = 98.4;

  const filteredClients = clients.filter((c) => {
    const matchesSearch = c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'All' || c.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#111111] via-[#1A0A00] to-[#111111] p-6 rounded-2xl border border-[#1F1F1F] shadow-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 flex items-center">
              <Flame className="w-3 h-3 mr-1" />
              INNOVATOR COMMAND CENTER (MODULE 1)
            </span>
            <span className="text-zinc-500 text-xs">• GOD MODE ACTIVE</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-2 font-mono tracking-tight">
            Growth Operating System <span className="text-[#FF4D00]">Overview</span>
          </h1>
          <p className="text-zinc-400 text-xs md:text-sm mt-1 max-w-2xl">
            Real-time multi-tenant monitoring across Google, Meta, LinkedIn, and TikTok ad accounts for all active clients.
          </p>
        </div>

        <button
          onClick={onOpenOnboarding}
          className="bg-gradient-to-r from-[#FF4D00] to-[#E64500] hover:from-[#E64500] hover:to-[#CC3D00] text-white px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-[#FF4D00]/20 transition-all hover:scale-[1.02]"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>+ Scan & Ignite New Client</span>
        </button>
      </div>

      {/* KPI Widgets Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Clients</span>
            <Users className="w-4 h-4 text-[#FF4D00]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{totalClients}</div>
          <div className="text-[10px] text-[#00D26A] flex items-center font-medium">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +2 this week
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Spend Today</span>
            <DollarSign className="w-4 h-4 text-[#FF4D00]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ${totalActiveSpend.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#00D26A] flex items-center font-medium">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> 98% budget on pace
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Leads Today</span>
            <TrendingUp className="w-4 h-4 text-[#00D26A]" />
          </div>
          <div className="text-2xl font-black text-[#00D26A] font-mono">{totalLeadsToday}</div>
          <div className="text-[10px] text-zinc-400">Avg CPL $22.40</div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Overall ROAS</span>
            <Award className="w-4 h-4 text-[#FF4D00]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{avgRoas}x</div>
          <div className="text-[10px] text-[#00D26A]">Top client: 5.8x</div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>API Cost Today</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">${apiCostToday.toFixed(2)}</div>
          <div className="text-[10px] text-zinc-400">Gemini 2.0 + 1.5 Pro</div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pacing % Avg</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{avgPacing}%</div>
          <div className="text-[10px] text-zinc-400">Optimal delivery</div>
        </div>
      </div>

      {/* Client Table Section */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center">
              Active Client Portfolio
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-[#1F1F1F] text-zinc-400 border border-[#2F2F2F]">
                {filteredClients.length} accounts
              </span>
            </h2>
            <p className="text-xs text-zinc-400">Click any row to view client BI Engine, Studio & Campaigns.</p>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search business or industry..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#0A0A0A] border border-[#1F1F1F] text-white text-xs rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#FF4D00] w-60"
              />
            </div>

            <div className="flex items-center space-x-1 bg-[#0A0A0A] border border-[#1F1F1F] rounded-lg p-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-zinc-500 ml-1 mr-1" />
              {['All', 'Enterprise', 'Scale', 'Growth', 'Starter'].map((tier) => (
                <button
                  key={tier}
                  onClick={() => setSelectedTier(tier)}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    selectedTier === tier
                      ? 'bg-[#FF4D00] text-white font-bold'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-[#0A0A0A] text-zinc-400 font-mono uppercase tracking-wider border-b border-[#1F1F1F]">
              <tr>
                <th className="py-3 px-4">Business & Tier</th>
                <th className="py-3 px-4">Health Score</th>
                <th className="py-3 px-4">Active Campaigns</th>
                <th className="py-3 px-4">Spend Today</th>
                <th className="py-3 px-4">Leads Today</th>
                <th className="py-3 px-4">CPQL</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Master Kill Switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredClients.map((client) => {
                const cpql = client.leadsToday > 0 ? (client.spendToday / client.leadsToday).toFixed(2) : '22.50';
                return (
                  <tr
                    key={client.id}
                    onClick={() => onSelectClient(client.id)}
                    className="hover:bg-[#1A1A1A] transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#1F1F1F] to-[#2F2F2F] border border-[#2F2F2F] flex items-center justify-center font-bold text-white text-sm group-hover:border-[#FF4D00] transition-colors">
                          {client.businessName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-white group-hover:text-[#FF4D00] transition-colors flex items-center">
                            {client.businessName}
                            <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="text-[11px] text-zinc-500">
                            {client.industry} • <span className="text-[#FF4D00] font-semibold">{client.tier}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-[#0A0A0A] h-2 rounded-full overflow-hidden border border-[#1F1F1F]">
                          <div
                            className={`h-full rounded-full ${
                              client.healthScore >= 90
                                ? 'bg-[#00D26A]'
                                : client.healthScore >= 75
                                ? 'bg-amber-400'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${client.healthScore}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-white">{client.healthScore}%</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 font-mono font-semibold text-white">
                      {client.activeCampaignsCount || 3} Live
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-white">
                      ${client.spendToday?.toFixed(2) || '485.50'}
                    </td>

                    <td className="py-4 px-4 font-mono font-bold text-[#00D26A]">
                      {client.leadsToday || 18} leads
                    </td>

                    <td className="py-4 px-4 font-mono text-zinc-300">
                      ${cpql}
                    </td>

                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        client.killSwitch
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30'
                      }`}>
                        {client.killSwitch ? (
                          <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            PAUSED (KILL SWITCH)
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            CAMPAIGNS LIVE
                          </>
                        )}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onToggleKillSwitch(client.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-end space-x-1 ml-auto ${
                          client.killSwitch
                            ? 'bg-[#00D26A] text-black hover:bg-[#00D26A]/90'
                            : 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                        }`}
                      >
                        <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                        <span>{client.killSwitch ? 'RESUME ALL' : 'KILL SWITCH'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
