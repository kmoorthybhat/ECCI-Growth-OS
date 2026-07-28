import React, { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Plus,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Search,
  Send,
  Sparkles,
  Sliders,
  CheckCircle2,
  UserCheck,
  Link as LinkIcon,
  Globe,
  Trash2
} from 'lucide-react';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client, Agency } from '../types';

interface AgencySubTenantManagerViewProps {
  clients: Client[];
  agencyId?: string;
  agencyDomain?: string;
  onRefreshClients?: () => void;
}

export const AgencySubTenantManagerView: React.FC<AgencySubTenantManagerViewProps> = ({
  clients,
  agencyId = 'agency_apex',
  agencyDomain = 'portal.apexgrowth.com',
  onRefreshClients
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // New Client Assign Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientWebsite, setNewClientWebsite] = useState('');

  const agencyClients = clients.filter((c) => c.agencyId === agencyId || !c.agencyId);
  const assignedClients = clients.filter((c) => c.agencyId === agencyId);

  const handleAssignToAgency = async (client: Client) => {
    try {
      await updateDoc(doc(db, 'clients', client.id), {
        agencyId,
        domainHost: agencyDomain
      });
      if (onRefreshClients) onRefreshClients();
      setActionMsg(`Assigned client "${client.businessName}" to Agency pool.`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (e) {
      console.error('Error assigning client to agency:', e);
    }
  };

  const handleUnassignFromAgency = async (client: Client) => {
    try {
      await updateDoc(doc(db, 'clients', client.id), {
        agencyId: null,
        domainHost: null
      });
      if (onRefreshClients) onRefreshClients();
      setActionMsg(`Removed client "${client.businessName}" from Agency pool.`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (e) {
      console.error('Error unassigning client:', e);
    }
  };

  const generateOnboardingLink = (client: Client) => {
    const token = btoa(`${client.id}_${agencyId}_${Date.now()}`).substring(0, 24);
    return `https://${agencyDomain}/onboarding?client=${client.id}&token=${token}`;
  };

  const handleCopyLink = (client: Client) => {
    const link = generateOnboardingLink(client);
    navigator.clipboard.writeText(link);
    setCopiedToken(client.id);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const filteredClients = agencyClients.filter((c) =>
    c.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30">
                MODULE 14 • AGENCY CLIENT DIRECTORY
              </span>
              <span className="text-zinc-500 font-mono text-xs">Isolated Sub-Tenant Workspace Manager</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Agency Sub-Tenant & Onboarding Portal Manager
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Assign clients to your agency pool, generate custom domain onboarding links (`https://{agencyDomain}/...`), and enforce strict sub-tenant database scoping.
            </p>
          </div>
        </div>

        {actionMsg && (
          <div className="mt-4 p-3 bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-xl text-xs text-[#00D26A] font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMsg}</span>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs">
            <span>Agency Pool Clients</span>
            <Users className="w-4 h-4 text-[#00D26A]" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {assignedClients.length} <span className="text-xs text-[#00D26A] font-normal">Sub-Tenants</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">Scoped to {agencyDomain}</p>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs">
            <span>White-Label Onboarding Domain</span>
            <Globe className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-lg font-bold font-mono text-blue-400 truncate">
            https://{agencyDomain}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">SSL Encrypted & Routed via CNAME</p>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs">
            <span>Tenant Isolation Rules</span>
            <ShieldCheck className="w-4 h-4 text-[#FF4D00]" />
          </div>
          <div className="text-sm font-bold font-mono text-white flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D26A]"></span>
            <span>Firestore Rules Enforced</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">resource.data.agencyId == token.agencyId</p>
        </div>
      </div>

      {/* Client List */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00D26A]" />
            Sub-Tenant Client Directory & Access Link Generator
          </h3>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search clients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00D26A] font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1F1F1F] text-zinc-500 uppercase">
                <th className="py-3 px-4">Client Business</th>
                <th className="py-3 px-4">Tier & Status</th>
                <th className="py-3 px-4">Agency Scoping</th>
                <th className="py-3 px-4">White-Label Portal Link</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredClients.map((client) => {
                const isAssigned = client.agencyId === agencyId;

                return (
                  <tr key={client.id} className="hover:bg-[#0A0A0A]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{client.businessName}</div>
                      <div className="text-[10px] text-zinc-500 font-normal">{client.websiteUrl}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold text-[10px]">
                        {client.tier.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isAssigned ? (
                        <span className="px-2 py-0.5 rounded bg-[#00D26A]/20 text-[#00D26A] font-bold text-[10px] flex items-center gap-1 w-max">
                          <UserCheck className="w-3 h-3" /> ASSIGNED TO AGENCY
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold text-[10px]">
                          UNASSIGNED
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-blue-400 truncate max-w-[200px]">
                          https://{agencyDomain}/onboarding?id={client.id.substring(0, 6)}
                        </span>
                        <button
                          onClick={() => handleCopyLink(client)}
                          className="p-1 rounded bg-[#1F1F1F] text-zinc-300 hover:text-white transition-all shrink-0"
                          title="Copy White-labeled Portal Link"
                        >
                          {copiedToken === client.id ? (
                            <Check className="w-3.5 h-3.5 text-[#00D26A]" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {!isAssigned ? (
                        <button
                          onClick={() => handleAssignToAgency(client)}
                          className="px-2.5 py-1 rounded bg-[#00D26A]/10 text-[#00D26A] border border-[#00D26A]/30 hover:bg-[#00D26A]/20 transition-all font-bold text-[10px]"
                        >
                          ADD TO POOL
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnassignFromAgency(client)}
                          className="px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all font-bold text-[10px]"
                        >
                          REMOVE
                        </button>
                      )}
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
