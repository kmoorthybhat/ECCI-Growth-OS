import React from 'react';
import {
  Flame,
  Shield,
  UserCheck,
  Building2,
  Zap,
  Globe,
  Sliders,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  MessageSquare,
  DollarSign,
  FileText,
  Target,
  PlayCircle,
  CreditCard,
  Cloud
} from 'lucide-react';
import { UserSession, canAccessInnovator } from '../lib/roles';
import { Client } from '../types';

interface HeaderProps {
  session: UserSession;
  setSession: React.Dispatch<React.SetStateAction<UserSession>>;
  clients: Client[];
  currentModule: string;
  setCurrentModule: (mod: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  session,
  setSession,
  clients,
  currentModule,
  setCurrentModule,
}) => {
  const isInnovator = canAccessInnovator(session);
  const activeClient = clients.find((c) => c.id === session.activeClientId) || clients[0];

  const handleRoleToggle = () => {
    if (session.role === 'innovator') {
      setSession({
        ...session,
        role: 'client',
        isGodMode: false,
        name: `${activeClient?.businessName || 'Client'} (Client Portal)`,
      });
      setCurrentModule('client-dashboard');
    } else {
      setSession({
        ...session,
        role: 'innovator',
        isGodMode: true,
        name: 'Krishna Moorthy M (Innovator / God Mode)',
      });
      setCurrentModule('innovator-dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur border-b border-[#1F1F1F]">
      {/* Top Banner: Energize Cult Cafe Inc Identity & Role Switcher */}
      <div className="bg-gradient-to-r from-[#111111] via-[#1A0A00] to-[#111111] border-b border-[#1F1F1F] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-[#A1A1AA]">
          <span className="flex items-center font-bold text-[#FF4D00]">
            <Flame className="w-3.5 h-3.5 mr-1 text-[#FF4D00] animate-pulse" />
            ENERGIZE CULT CAFE INC
          </span>
          <span className="hidden md:inline text-zinc-600">|</span>
          <span className="hidden md:inline text-zinc-400">
            ECCI Growth OS v1.0 • Founder: Krishna Moorthy M
          </span>
        </div>

        {/* Global Access Toggle Switcher */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-[#111111] border border-[#1F1F1F] rounded-full p-0.5">
            <button
              onClick={handleRoleToggle}
              className={`px-3 py-1 rounded-full font-medium transition-all text-xs flex items-center space-x-1 ${
                isInnovator
                  ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3 mr-1" />
              INNOVATOR MODE (GOD MODE)
            </button>
            <button
              onClick={handleRoleToggle}
              className={`px-3 py-1 rounded-full font-medium transition-all text-xs flex items-center space-x-1 ${
                !isInnovator
                  ? 'bg-[#00D26A] text-black font-semibold shadow-lg shadow-[#00D26A]/20'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3 mr-1" />
              CLIENT VIEW
            </button>
          </div>

          {/* Active Workspace Selector */}
          <div className="flex items-center space-x-1.5 bg-[#111111] border border-[#1F1F1F] rounded-md px-2 py-1">
            <Building2 className="w-3.5 h-3.5 text-[#FF4D00]" />
            <select
              value={session.activeClientId}
              onChange={(e) =>
                setSession({ ...session, activeClientId: e.target.value })
              }
              className="bg-transparent text-white text-xs border-none focus:outline-none cursor-pointer"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#111111] text-white">
                  {c.businessName} ({c.tier})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div
            onClick={() => setCurrentModule(isInnovator ? 'innovator-dashboard' : 'client-dashboard')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4D00] to-[#992E00] flex items-center justify-center shadow-lg shadow-[#FF4D00]/25 group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white font-mono flex items-center">
                ECCI<span className="text-[#FF4D00]">.GROWTH</span>
              </span>
              <span className="text-[10px] text-zinc-400 block -mt-1 font-medium tracking-wide">
                FULL STACK AI MARKETING OS
              </span>
            </div>
          </div>

          {/* Module Links - Innovator View */}
          {isInnovator && (
            <nav className="hidden lg:flex items-center space-x-1 text-xs">
              <button
                onClick={() => setCurrentModule('innovator-dashboard')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'innovator-dashboard'
                    ? 'bg-[#1F1F1F] text-[#FF4D00] font-bold border border-[#FF4D00]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>1. Command</span>
              </button>

              <button
                onClick={() => setCurrentModule('onboarding')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'onboarding'
                    ? 'bg-[#1F1F1F] text-[#FF4D00] font-bold border border-[#FF4D00]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>2. Scan</span>
              </button>

              <button
                onClick={() => setCurrentModule('services')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'services'
                    ? 'bg-[#1F1F1F] text-[#FF4D00] font-bold border border-[#FF4D00]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>3. Services</span>
              </button>

              <button
                onClick={() => setCurrentModule('innovator-billing')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'innovator-billing'
                    ? 'bg-[#1F1F1F] text-[#FF4D00] font-bold border border-[#FF4D00]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span>3B. Billing</span>
              </button>

              <button
                onClick={() => setCurrentModule('agency-management')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'agency-management'
                    ? 'bg-[#1F1F1F] text-purple-400 font-bold border border-purple-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <span>14. Agency OS</span>
              </button>

              <button
                onClick={() => setCurrentModule('cloudflare-pages')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'cloudflare-pages'
                    ? 'bg-[#1F1F1F] text-[#FF4D00] font-bold border border-[#FF4D00]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Cloud className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span>Cloudflare Pages</span>
              </button>

              <button
                onClick={() => setCurrentModule('prompts')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'prompts'
                    ? 'bg-[#1F1F1F] text-[#FF4D00] font-bold border border-[#FF4D00]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>4. Prompts</span>
              </button>

              <button
                onClick={() => setCurrentModule('approvals')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'approvals'
                    ? 'bg-[#1F1F1F] text-[#FF4D00] font-bold border border-[#FF4D00]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>5. Approvals</span>
              </button>

              <button
                onClick={() => setCurrentModule('intelligence')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'intelligence'
                    ? 'bg-[#1F1F1F] text-[#FF4D00] font-bold border border-[#FF4D00]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-[#FF4D00]" />
                <span>6. BI Engine</span>
              </button>

              <div className="relative group">
                <button className="px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#111111] flex items-center space-x-1">
                  <span>Studio & Core</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-56 bg-[#111111] border border-[#1F1F1F] rounded-xl shadow-2xl py-2 hidden group-hover:block z-50">
                  <button
                    onClick={() => setCurrentModule('studio-text')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    7. Text Creative Studio
                  </button>
                  <button
                    onClick={() => setCurrentModule('studio-visual')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    8. Visual Creative Studio
                  </button>
                  <button
                    onClick={() => setCurrentModule('studio-video')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    9. Video Production (Lite)
                  </button>
                  <button
                    onClick={() => setCurrentModule('budget-opt')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    11. Budget Optimizer
                  </button>
                  <button
                    onClick={() => setCurrentModule('leads')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    12. Lead Inbox (Kanban)
                  </button>
                </div>
              </div>

              {/* v2.0 Autonomous Modules Dropdown */}
              <div className="relative group">
                <button className="px-3 py-2 rounded-lg bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30 font-bold flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  <span>v2.0 OS Engine</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-64 bg-[#111111] border border-[#1F1F1F] rounded-xl shadow-2xl py-2 hidden group-hover:block z-50">
                  <button
                    onClick={() => setCurrentModule('telemetry')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    20. EAG Telemetry Engine
                  </button>
                  <button
                    onClick={() => setCurrentModule('autonomous-budget')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    21. Autonomous Budget Orchestrator
                  </button>
                  <button
                    onClick={() => setCurrentModule('geo-citation')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    22. GEO & Citation Engine
                  </button>
                  <button
                    onClick={() => setCurrentModule('apps-script')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    23. Apps Script Agent
                  </button>
                  <button
                    onClick={() => setCurrentModule('security-gateway')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    24. Ephemeral Security Gateway
                  </button>
                  <button
                    onClick={() => setCurrentModule('white-label')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    25. Multi-Tenant White Label
                  </button>
                  <button
                    onClick={() => setCurrentModule('edge-optimization')}
                    className="w-full text-left px-4 py-2 text-xs text-zinc-300 hover:bg-[#1F1F1F] hover:text-[#FF4D00]"
                  >
                    26. Cloudflare Edge & AI Optimization
                  </button>
                  <div className="border-t border-[#1F1F1F] my-1" />
                  <button
                    onClick={() => setCurrentModule('ai-maturity-model')}
                    className="w-full text-left px-4 py-2 text-xs text-[#00D26A] font-bold hover:bg-[#1F1F1F]"
                  >
                    14-L AI Maturity Model & CHM
                  </button>
                </div>
              </div>
            </nav>
          )}

          {/* Module Links - Client View */}
          {!isInnovator && (
            <nav className="hidden md:flex items-center space-x-1 text-xs">
              <button
                onClick={() => setCurrentModule('client-dashboard')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'client-dashboard'
                    ? 'bg-[#1F1F1F] text-[#00D26A] font-bold border border-[#00D26A]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>14. Dashboard</span>
              </button>

              <button
                onClick={() => setCurrentModule('client-billing')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'client-billing'
                    ? 'bg-[#1F1F1F] text-[#00D26A] font-bold border border-[#00D26A]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5 text-[#00D26A]" />
                <span>3B. Billing & Retainers</span>
              </button>

              <button
                onClick={() => setCurrentModule('client-profile')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'client-profile'
                    ? 'bg-[#1F1F1F] text-[#00D26A] font-bold border border-[#00D26A]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>13. Profile</span>
              </button>

              <button
                onClick={() => setCurrentModule('client-content')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'client-content'
                    ? 'bg-[#1F1F1F] text-[#00D26A] font-bold border border-[#00D26A]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>15. Content Calendar</span>
              </button>

              <button
                onClick={() => setCurrentModule('client-campaigns')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'client-campaigns'
                    ? 'bg-[#1F1F1F] text-[#00D26A] font-bold border border-[#00D26A]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>16. Campaigns</span>
              </button>

              <button
                onClick={() => setCurrentModule('client-leads')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'client-leads'
                    ? 'bg-[#1F1F1F] text-[#00D26A] font-bold border border-[#00D26A]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>17. Lead Inbox</span>
              </button>

              <button
                onClick={() => setCurrentModule('client-budget')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'client-budget'
                    ? 'bg-[#1F1F1F] text-[#00D26A] font-bold border border-[#00D26A]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>18. Budget Control</span>
              </button>

              <button
                onClick={() => setCurrentModule('client-reports')}
                className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-colors ${
                  currentModule === 'client-reports'
                    ? 'bg-[#1F1F1F] text-[#00D26A] font-bold border border-[#00D26A]/30'
                    : 'text-zinc-400 hover:text-white hover:bg-[#111111]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>19. AI Report</span>
              </button>
            </nav>
          )}

          {/* Quick Active Telemetry Badge */}
          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="hidden sm:flex items-center space-x-2 bg-[#111111] border border-[#1F1F1F] px-3 py-1 rounded">
              <span className="text-zinc-500 uppercase text-[10px]">API Latency</span>
              <span className="text-[#00D26A] font-bold">124ms [Gemini 2.0]</span>
            </div>

            <div className="flex items-center space-x-2 bg-[#111111] border border-[#1F1F1F] px-3 py-1 rounded">
              <div className="active-indicator"></div>
              <span className="text-white text-xs font-medium">System Operational</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
