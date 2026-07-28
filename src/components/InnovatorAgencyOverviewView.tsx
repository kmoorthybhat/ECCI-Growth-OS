import React, { useState, useEffect } from 'react';
import {
  Globe,
  Building2,
  Users,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  ShieldCheck,
  Lock,
  ExternalLink,
  Search,
  Sparkles,
  Sliders,
  Settings,
  MoreVertical,
  Ban,
  Check
} from 'lucide-react';
import { collection, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Agency, Client } from '../types';

interface InnovatorAgencyOverviewViewProps {
  clients: Client[];
  onRefreshClients?: () => void;
}

const DEFAULT_AGENCIES: Agency[] = [
  {
    id: 'agency_apex',
    ownerId: 'user_agency_1',
    agencyName: 'Apex Growth Digital',
    customDomain: 'portal.apexgrowth.com',
    domainVerificationStatus: 'verified',
    sslStatus: 'active',
    branding: {
      companyName: 'Apex Growth Digital',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=32&auto=format&fit=crop&q=80',
      primaryColor: '#7C3AED',
      accentColor: '#10B981',
      supportEmail: 'support@apexgrowth.com',
      customCss: '/* Apex Theme */'
    },
    assignedClients: ['client_1', 'client_2'],
    status: 'active',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'agency_nexus',
    ownerId: 'user_agency_2',
    agencyName: 'Nexus AI Media',
    customDomain: 'growth.nexusmedia.io',
    domainVerificationStatus: 'pending',
    sslStatus: 'pending',
    branding: {
      companyName: 'Nexus AI Media',
      logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=32&auto=format&fit=crop&q=80',
      primaryColor: '#00D26A',
      accentColor: '#FF4D00',
      supportEmail: 'ops@nexusmedia.io'
    },
    assignedClients: ['client_3'],
    status: 'active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const InnovatorAgencyOverviewView: React.FC<InnovatorAgencyOverviewViewProps> = ({
  clients,
  onRefreshClients
}) => {
  const [agencies, setAgencies] = useState<Agency[]>(DEFAULT_AGENCIES);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // New Agency Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyDomain, setNewAgencyDomain] = useState('');
  const [newAgencyOwnerEmail, setNewAgencyOwnerEmail] = useState('');

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, 'agencies'));
      const list: Agency[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as Agency);
      });
      if (list.length > 0) {
        setAgencies(list);
      }
    } catch (e) {
      console.error('Error loading agencies:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveDomain = async (agency: Agency) => {
    try {
      const updatedAgency = {
        ...agency,
        domainVerificationStatus: 'verified' as const,
        sslStatus: 'active' as const
      };
      await setDoc(doc(db, 'agencies', agency.id), updatedAgency, { merge: true });

      // Add to domains_registry
      await setDoc(doc(db, 'domains_registry', agency.customDomain), {
        agencyId: agency.id,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      setAgencies(agencies.map((a) => (a.id === agency.id ? updatedAgency : a)));
      setActionMsg(`Approved custom domain ${agency.customDomain} and activated SSL certificate.`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (e) {
      console.error('Error approving domain:', e);
    }
  };

  const handleForceResyncSsl = async (agency: Agency) => {
    try {
      const res = await fetch('/api/agency/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyId: agency.id, customDomain: agency.customDomain })
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`SSL Certificate successfully re-synced via Cloudflare for ${agency.customDomain}`);
        setTimeout(() => setActionMsg(null), 3000);
        fetchAgencies();
      }
    } catch (e) {
      console.error('SSL resync error:', e);
    }
  };

  const handleToggleAgencyStatus = async (agency: Agency) => {
    const newStatus = agency.status === 'active' ? 'disabled' : 'active';
    try {
      await updateDoc(doc(db, 'agencies', agency.id), { status: newStatus });
      setAgencies(agencies.map((a) => (a.id === agency.id ? { ...a, status: newStatus } : a)));
      setActionMsg(`Agency ${agency.agencyName} state changed to ${newStatus.toUpperCase()}`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (e) {
      console.error('Toggle status error:', e);
    }
  };

  const handleCreateAgency = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgencyName || !newAgencyDomain) return;

    const id = `agency_${Date.now()}`;
    const newAgency: Agency = {
      id,
      ownerId: `user_${Math.random().toString(36).substring(2, 8)}`,
      agencyName: newAgencyName,
      customDomain: newAgencyDomain.toLowerCase(),
      domainVerificationStatus: 'pending',
      sslStatus: 'pending',
      branding: {
        companyName: newAgencyName,
        logoUrl: '/logo.png',
        faviconUrl: '/favicon.ico',
        primaryColor: '#FF4D00',
        accentColor: '#00D26A',
        supportEmail: newAgencyOwnerEmail || 'support@agency.com'
      },
      assignedClients: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'agencies', id), newAgency);
      setAgencies([newAgency, ...agencies]);
      setShowAddModal(false);
      setNewAgencyName('');
      setNewAgencyDomain('');
      setNewAgencyOwnerEmail('');
      setActionMsg(`Agency partner ${newAgencyName} created!`);
      setTimeout(() => setActionMsg(null), 3000);
    } catch (e) {
      console.error('Create agency error:', e);
    }
  };

  const totalActiveDomains = agencies.filter((a) => a.sslStatus === 'active').length;
  const totalSubTenants = clients.filter((c) => c.agencyId).length;

  const filteredAgencies = agencies.filter(
    (a) =>
      a.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.customDomain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30">
                MODULE 14 • INNOVATOR AGENCY OVERVIEW
              </span>
              <span className="text-zinc-500 font-mono text-xs">White-Label Multi-Tenancy & Custom Domains</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Global Agency Partner & Domain Directory
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Manage white-label Agency Partners, verify custom CNAME domains, approve SSL certs, and monitor sub-tenant workspace allocations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#FF4D00] text-white font-bold text-xs hover:bg-[#FF4D00]/90 transition-all flex items-center space-x-2 shadow-lg shadow-[#FF4D00]/20"
            >
              <Plus className="w-4 h-4" />
              <span>ONBOARD NEW AGENCY</span>
            </button>
          </div>
        </div>

        {actionMsg && (
          <div className="mt-4 p-3 bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-xl text-xs text-[#00D26A] font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{actionMsg}</span>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs">
            <span>Registered Agency Partners</span>
            <Building2 className="w-4 h-4 text-[#FF4D00]" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {agencies.length} <span className="text-xs text-zinc-500 font-normal">Agencies</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            {agencies.filter((a) => a.status === 'active').length} active, 0 suspended
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs">
            <span>Verified Custom Domains (SSL)</span>
            <Globe className="w-4 h-4 text-[#00D26A]" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {totalActiveDomains} <span className="text-xs text-[#00D26A] font-normal">Active SSL</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            Routed via Cloudflare for Platforms / Edge Middleware
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs">
            <span>Agency-Managed Sub-Tenants</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {totalSubTenants} <span className="text-xs text-zinc-500 font-normal">Clients</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            Isolated tenant database scoping enabled
          </p>
        </div>
      </div>

      {/* Agency Table */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#FF4D00]" />
            Agency Partner & Sub-Tenancy Registry
          </h3>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search agency or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#FF4D00] font-mono"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1F1F1F] text-zinc-500 uppercase">
                <th className="py-3 px-4">Agency Name</th>
                <th className="py-3 px-4">Custom Domain</th>
                <th className="py-3 px-4">DNS Verification</th>
                <th className="py-3 px-4">SSL Status</th>
                <th className="py-3 px-4">Sub-Tenants</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {filteredAgencies.map((agency) => {
                const isVerified = agency.domainVerificationStatus === 'verified';
                const isSslActive = agency.sslStatus === 'active';

                return (
                  <tr key={agency.id} className="hover:bg-[#0A0A0A]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div className="flex items-center space-x-2">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: agency.branding.primaryColor || '#7C3AED' }}
                        ></span>
                        <span>{agency.agencyName}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-normal pl-5">
                        Owner: {agency.branding.supportEmail}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-blue-400">
                      <a
                        href={`https://${agency.customDomain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center space-x-1"
                      >
                        <span>{agency.customDomain}</span>
                        <ExternalLink className="w-3 h-3 text-zinc-500" />
                      </a>
                    </td>

                    <td className="py-3.5 px-4">
                      {isVerified ? (
                        <span className="px-2 py-0.5 rounded bg-[#00D26A]/20 text-[#00D26A] font-bold text-[10px] flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold text-[10px] flex items-center gap-1 w-max animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> PENDING DNS
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      {isSslActive ? (
                        <span className="px-2 py-0.5 rounded bg-[#00D26A]/20 text-[#00D26A] font-bold text-[10px] flex items-center gap-1 w-max">
                          <ShieldCheck className="w-3 h-3" /> ACTIVE
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-bold text-[10px]">
                          PROVISIONING
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-zinc-300">
                      {agency.assignedClients?.length || 0} Clients
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          agency.status === 'active'
                            ? 'bg-[#00D26A]/20 text-[#00D26A]'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {agency.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-2">
                      {!isVerified && (
                        <button
                          onClick={() => handleApproveDomain(agency)}
                          className="px-2.5 py-1 rounded bg-[#00D26A]/10 text-[#00D26A] border border-[#00D26A]/30 hover:bg-[#00D26A]/20 transition-all font-bold text-[10px]"
                        >
                          APPROVE CNAME
                        </button>
                      )}

                      <button
                        onClick={() => handleForceResyncSsl(agency)}
                        className="px-2 py-1 rounded bg-[#1F1F1F] text-zinc-300 hover:text-white transition-all font-bold text-[10px]"
                        title="Force Re-sync SSL"
                      >
                        RE-SYNC SSL
                      </button>

                      <button
                        onClick={() => handleToggleAgencyStatus(agency)}
                        className={`px-2 py-1 rounded font-bold text-[10px] transition-all ${
                          agency.status === 'active'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                            : 'bg-[#00D26A]/10 text-[#00D26A] border border-[#00D26A]/30'
                        }`}
                      >
                        {agency.status === 'active' ? 'DISABLE' : 'ENABLE'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Agency Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateAgency}
            className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl font-mono text-xs"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#FF4D00]" /> Register New White-Label Agency
              </span>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 block mb-1">Agency Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Growth Digital"
                  value={newAgencyName}
                  onChange={(e) => setNewAgencyName(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Custom Domain (e.g. portal.myagency.com)</label>
                <input
                  type="text"
                  required
                  placeholder="portal.myagency.com"
                  value={newAgencyDomain}
                  onChange={(e) => setNewAgencyDomain(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3 py-2 text-blue-400 focus:outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Agency Admin Support Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@myagency.com"
                  value={newAgencyOwnerEmail}
                  onChange={(e) => setNewAgencyOwnerEmail(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF4D00]"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-[#FF4D00] text-white font-bold hover:bg-[#FF4D00]/90 transition-all shadow-lg shadow-[#FF4D00]/20"
              >
                CREATE AGENCY TENANT
              </button>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 rounded-xl bg-[#1F1F1F] text-zinc-300 font-bold hover:bg-zinc-800"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
