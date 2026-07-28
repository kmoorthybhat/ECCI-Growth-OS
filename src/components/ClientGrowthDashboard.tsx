import React from 'react';
import { DollarSign, Users, TrendingUp, Award, ArrowUpRight, BarChart3, Flame } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Client } from '../types';

interface ClientGrowthDashboardProps {
  client: Client;
}

export const ClientGrowthDashboard: React.FC<ClientGrowthDashboardProps> = ({ client }) => {
  const chartData = [
    { day: 'Mon', leads: 12, spend: 140 },
    { day: 'Tue', leads: 15, spend: 160 },
    { day: 'Wed', leads: 18, spend: 175 },
    { day: 'Thu', leads: 22, spend: 210 },
    { day: 'Fri', leads: 28, spend: 250 },
    { day: 'Sat', leads: 32, spend: 280 },
    { day: 'Sun', leads: 24, spend: 220 },
  ];

  const totalSpendMonth = (client.spendToday || 485) * 22;
  const totalLeadsMonth = (client.leadsToday || 18) * 22;
  const avgCpl = (totalSpendMonth / totalLeadsMonth).toFixed(2);
  const pipelineValue = totalLeadsMonth * 48;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#111111] via-[#0A1A10] to-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30 inline-flex items-center">
            <BarChart3 className="w-3 h-3 mr-1" />
            MODULE 14: MY GROWTH DASHBOARD
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            {client.businessName} <span className="text-[#00D26A]">Growth Hub</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Real-time verified media performance metrics, qualified lead volume, and return on ad spend.
          </p>
        </div>

        <div className="text-right bg-[#0A0A0A] border border-[#1F1F1F] px-4 py-3 rounded-xl font-mono text-xs">
          <span className="text-zinc-500 block text-[10px]">ACTIVE TIER LEVEL</span>
          <span className="text-white font-bold text-sm text-[#FF4D00]">{client.tier} PASS</span>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#1F1F1F] p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Spend This Month</span>
            <DollarSign className="w-4 h-4 text-[#00D26A]" />
          </div>
          <div className="text-2xl font-black text-white font-mono">
            ${totalSpendMonth.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
          <div className="text-[10px] text-[#00D26A] flex items-center font-medium">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> On pace with budget
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Total Leads</span>
            <Users className="w-4 h-4 text-[#00D26A]" />
          </div>
          <div className="text-2xl font-black text-[#00D26A] font-mono">{totalLeadsMonth}</div>
          <div className="text-[10px] text-[#00D26A] flex items-center font-medium">
            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +18% vs last month
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Cost Per Lead (CPL)</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-mono">${avgCpl}</div>
          <div className="text-[10px] text-zinc-400">Industry avg $38.00</div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-zinc-400 text-xs">
            <span>Pipeline Value</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            ${pipelineValue.toLocaleString()}
          </div>
          <div className="text-[10px] text-[#00D26A]">ROAS: 4.2x</div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono">Leads Acquired Over Time (Past 7 Days)</h3>
          <span className="text-xs text-zinc-500 font-mono">Updated Real-Time</span>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D26A" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#00D26A" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#52525b" fontSize={11} />
              <YAxis stroke="#52525b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0A0A0A', borderColor: '#1F1F1F', borderRadius: '12px', color: '#fff' }}
              />
              <Area type="monotone" dataKey="leads" stroke="#00D26A" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
