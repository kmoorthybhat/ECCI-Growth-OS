import React, { useState } from 'react';
import { Building2, Sliders, Users, Globe, ShieldCheck } from 'lucide-react';
import { InnovatorAgencyOverviewView } from './InnovatorAgencyOverviewView';
import { AgencySettingsConsoleView } from './AgencySettingsConsoleView';
import { AgencySubTenantManagerView } from './AgencySubTenantManagerView';
import { Client } from '../types';
import { UserSession, canAccessInnovator } from '../lib/roles';

interface WhiteLabelAgencyViewProps {
  session: UserSession;
  clients: Client[];
  onRefreshClients?: () => void;
}

export const WhiteLabelAgencyView: React.FC<WhiteLabelAgencyViewProps> = ({
  session,
  clients,
  onRefreshClients
}) => {
  const isInnovator = canAccessInnovator(session.role);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'settings' | 'clients'>(
    isInnovator ? 'overview' : 'settings'
  );

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111111] border border-[#1F1F1F] p-2 rounded-2xl">
        <div className="flex items-center space-x-2 font-mono text-xs">
          {isInnovator && (
            <button
              onClick={() => setActiveSubTab('overview')}
              className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
                activeSubTab === 'overview'
                  ? 'bg-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-[#1F1F1F]'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Global Agencies Directory (/innovator/agency)</span>
            </button>
          )}

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'settings'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                : 'text-zinc-400 hover:text-white hover:bg-[#1F1F1F]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Branding & Domains Console (/agency/settings)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('clients')}
            className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === 'clients'
                ? 'bg-[#00D26A] text-black shadow-lg shadow-[#00D26A]/20'
                : 'text-zinc-400 hover:text-white hover:bg-[#1F1F1F]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Agency Client Sub-Tenants (/agency/clients)</span>
          </button>
        </div>

        <div className="px-3 py-1 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] text-[10px] font-mono text-zinc-400 flex items-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00D26A]" />
          <span>Tenant Isolation Active</span>
        </div>
      </div>

      {/* SubTab Views */}
      {activeSubTab === 'overview' && isInnovator && (
        <InnovatorAgencyOverviewView clients={clients} onRefreshClients={onRefreshClients} />
      )}

      {activeSubTab === 'settings' && (
        <AgencySettingsConsoleView />
      )}

      {activeSubTab === 'clients' && (
        <AgencySubTenantManagerView
          clients={clients}
          onRefreshClients={onRefreshClients}
        />
      )}
    </div>
  );
};
