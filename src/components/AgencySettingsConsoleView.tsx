import React, { useState, useEffect } from 'react';
import {
  Palette,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Save,
  Sparkles,
  ShieldCheck,
  Copy,
  Check,
  ExternalLink,
  Code2,
  Eye,
  Sliders,
  Image as ImageIcon,
  Mail,
  Lock
} from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Agency, AgencyBranding } from '../types';

interface AgencySettingsConsoleViewProps {
  agencyId?: string;
}

const DEFAULT_BRANDING: AgencyBranding = {
  companyName: 'Apex Growth Digital',
  logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
  faviconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=32&auto=format&fit=crop&q=80',
  primaryColor: '#7C3AED',
  accentColor: '#10B981',
  supportEmail: 'support@apexgrowth.com',
  customCss: '/* Custom agency overrides */\n.btn-primary { border-radius: 12px; }'
};

export const AgencySettingsConsoleView: React.FC<AgencySettingsConsoleViewProps> = ({
  agencyId = 'agency_apex'
}) => {
  const [branding, setBranding] = useState<AgencyBranding>(DEFAULT_BRANDING);
  const [customDomain, setCustomDomain] = useState('portal.apexgrowth.com');
  const [domainVerificationStatus, setDomainVerificationStatus] = useState<'pending' | 'verified' | 'failed'>('verified');
  const [sslStatus, setSslStatus] = useState<'active' | 'pending' | 'error'>('active');

  const [isSavingBranding, setIsSavingBranding] = useState(false);
  const [isVerifyingDomain, setIsVerifyingDomain] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [copiedTxt, setCopiedTxt] = useState(false);
  const [copiedCname, setCopiedCname] = useState(false);

  useEffect(() => {
    fetchAgencySettings();
  }, [agencyId]);

  const fetchAgencySettings = async () => {
    try {
      const snap = await getDoc(doc(db, 'agencies', agencyId));
      if (snap.exists()) {
        const data = snap.data() as Agency;
        if (data.branding) setBranding(data.branding);
        if (data.customDomain) setCustomDomain(data.customDomain);
        if (data.domainVerificationStatus) setDomainVerificationStatus(data.domainVerificationStatus);
        if (data.sslStatus) setSslStatus(data.sslStatus);
      }
    } catch (e) {
      console.error('Error loading agency settings:', e);
    }
  };

  const handleSaveBranding = async () => {
    setIsSavingBranding(true);
    try {
      // API call to backend
      const res = await fetch('/api/agency/branding/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyId, branding })
      });
      const data = await res.json();

      // Firestore update
      await setDoc(doc(db, 'agencies', agencyId), { branding }, { merge: true });

      setStatusMsg('Agency branding theme saved & CDN cache purged!');
      setTimeout(() => setStatusMsg(null), 3000);
    } catch (e) {
      console.error('Error saving branding:', e);
    } finally {
      setIsSavingBranding(false);
    }
  };

  const handleVerifyDomain = async () => {
    setIsVerifyingDomain(true);
    try {
      const res = await fetch('/api/agency/domain/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agencyId, customDomain })
      });
      const data = await res.json();

      if (data.success) {
        setDomainVerificationStatus('verified');
        setSslStatus('active');

        // Firestore sync
        await setDoc(doc(db, 'agencies', agencyId), {
          customDomain,
          domainVerificationStatus: 'verified',
          sslStatus: 'active'
        }, { merge: true });

        setStatusMsg(`DNS CNAME verified & SSL Active for ${customDomain}`);
        setTimeout(() => setStatusMsg(null), 3000);
      }
    } catch (e) {
      console.error('Domain verification error:', e);
    } finally {
      setIsVerifyingDomain(false);
    }
  };

  const expectedCnameTarget = 'cname.eccigrowth.com';
  const expectedTxtRecord = `_ecci-challenge.${customDomain || 'domain.com'}`;
  const expectedTxtValue = `ecci-verify-${agencyId.substring(0, 8)}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-400 border border-purple-500/30">
                MODULE 14 • AGENCY BRANDING & DOMAINS
              </span>
              <span className="text-zinc-500 font-mono text-xs">White-Label Customization Engine</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Agency Settings & Custom Branding Console
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Configure agency brand identity, primary/accent colors, custom domain mapping, and preview the client portal in real time.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSaveBranding}
              disabled={isSavingBranding}
              className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-500 transition-all flex items-center space-x-2 shadow-lg shadow-purple-600/20 disabled:opacity-50"
            >
              <Save className={`w-4 h-4 ${isSavingBranding ? 'animate-spin' : ''}`} />
              <span>{isSavingBranding ? 'SAVING...' : 'PUBLISH BRANDING'}</span>
            </button>
          </div>
        </div>

        {statusMsg && (
          <div className="mt-4 p-3 bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-xl text-xs text-[#00D26A] font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Configurator + Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Branding Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Dynamic Branding Configurator */}
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-400" />
              Dynamic Agency Theme & Logo Configurator
            </h3>

            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1">Company / Agency Name</label>
                  <input
                    type="text"
                    value={branding.companyName}
                    onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Support Email</label>
                  <input
                    type="email"
                    value={branding.supportEmail}
                    onChange={(e) => setBranding({ ...branding, supportEmail: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Logo Image URL</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={branding.logoUrl}
                    onChange={(e) => setBranding({ ...branding, logoUrl: e.target.value })}
                    className="flex-1 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3.5 py-2 text-zinc-300 focus:outline-none focus:border-purple-500"
                  />
                  <img
                    src={branding.logoUrl}
                    alt="Logo Preview"
                    className="w-10 h-10 object-cover rounded-xl border border-[#1F1F1F] bg-black shrink-0"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/logo.png';
                    }}
                  />
                </div>
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl space-y-2">
                  <label className="text-zinc-400 block font-bold">Primary Brand Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={branding.primaryColor || '#7C3AED'}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="w-full bg-[#111111] border border-[#1F1F1F] rounded px-2.5 py-1 text-white font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="p-3 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl space-y-2">
                  <label className="text-zinc-400 block font-bold">Accent Highlight Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={branding.accentColor || '#10B981'}
                      onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                      className="w-8 h-8 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <input
                      type="text"
                      value={branding.accentColor}
                      onChange={(e) => setBranding({ ...branding, accentColor: e.target.value })}
                      className="w-full bg-[#111111] border border-[#1F1F1F] rounded px-2.5 py-1 text-white font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Custom CSS */}
              <div>
                <label className="text-zinc-400 block mb-1 flex items-center justify-between">
                  <span>Custom Agency CSS Injector</span>
                  <Code2 className="w-3.5 h-3.5 text-zinc-500" />
                </label>
                <textarea
                  rows={3}
                  value={branding.customCss || ''}
                  onChange={(e) => setBranding({ ...branding, customCss: e.target.value })}
                  placeholder="/* CSS overrides for client portal */"
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-3 text-zinc-300 font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Custom Domain Setup Wizard */}
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#00D26A]" />
                Custom Subdomain Mapping & SSL Wizard
              </h3>

              <div className="flex items-center space-x-2">
                {domainVerificationStatus === 'verified' ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> VERIFIED
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> PENDING
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Agency Subdomain Host</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customDomain}
                    onChange={(e) => setCustomDomain(e.target.value)}
                    placeholder="growth.myagency.com"
                    className="flex-1 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl px-3.5 py-2 text-blue-400 font-bold focus:outline-none focus:border-[#00D26A]"
                  />
                  <button
                    onClick={handleVerifyDomain}
                    disabled={isVerifyingDomain}
                    className="px-4 py-2 rounded-xl bg-[#00D26A] text-black font-bold hover:bg-[#00D26A]/90 transition-all flex items-center space-x-1 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingDomain ? 'animate-spin' : ''}`} />
                    <span>{isVerifyingDomain ? 'VERIFYING...' : 'VERIFY DNS'}</span>
                  </button>
                </div>
              </div>

              {/* DNS Instruction Card */}
              <div className="p-4 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl space-y-3">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-zinc-300">
                  Required DNS CNAME & TXT Verification Records
                </h4>

                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-[#111111] border border-[#1F1F1F] rounded-xl">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">TYPE: CNAME</span>
                      <span className="text-white font-bold">{customDomain}</span>
                      <span className="text-zinc-500 mx-2">→</span>
                      <span className="text-[#00D26A] font-bold">{expectedCnameTarget}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(expectedCnameTarget);
                        setCopiedCname(true);
                        setTimeout(() => setCopiedCname(false), 2000);
                      }}
                      className="p-1.5 rounded bg-[#1F1F1F] text-zinc-300 hover:text-white"
                    >
                      {copiedCname ? <Check className="w-3.5 h-3.5 text-[#00D26A]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#111111] border border-[#1F1F1F] rounded-xl">
                    <div>
                      <span className="text-zinc-500 text-[10px] block">TYPE: TXT (Verification Challenge)</span>
                      <span className="text-white font-bold">{expectedTxtRecord}</span>
                      <span className="text-zinc-500 mx-2">→</span>
                      <span className="text-purple-400 font-bold">{expectedTxtValue}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(expectedTxtValue);
                        setCopiedTxt(true);
                        setTimeout(() => setCopiedTxt(false), 2000);
                      }}
                      className="p-1.5 rounded bg-[#1F1F1F] text-zinc-300 hover:text-white"
                    >
                      {copiedTxt ? <Check className="w-3.5 h-3.5 text-[#00D26A]" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live UI Interactive Preview */}
        <div className="lg:col-span-5">
          <div className="sticky top-6 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="font-mono text-xs font-bold text-zinc-400 flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-400" />
                LIVE CLIENT PORTAL THEME PREVIEW
              </span>
              <span className="text-[10px] font-mono text-zinc-500">Real-time Custom Domain Rendering</span>
            </div>

            {/* Simulated Client Portal Window */}
            <div className="bg-[#0A0A0A] border-2 border-[#1F1F1F] rounded-2xl overflow-hidden shadow-2xl space-y-0">
              {/* Browser Bar */}
              <div className="bg-[#111111] px-4 py-3 border-b border-[#1F1F1F] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80"></div>
                </div>
                <div className="px-3 py-1 rounded-lg bg-[#0A0A0A] border border-[#1F1F1F] text-[10px] font-mono text-blue-400 font-bold flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-[#00D26A]" />
                  <span>https://{customDomain || 'portal.agency.com'}</span>
                </div>
                <div className="w-4"></div>
              </div>

              {/* Simulated Client Header */}
              <div className="p-4 bg-[#111111] border-b border-[#1F1F1F] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-8 h-8 rounded-lg p-1 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${branding.primaryColor}20` }}
                  >
                    <img
                      src={branding.logoUrl}
                      alt="Logo"
                      className="w-6 h-6 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/logo.png';
                      }}
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-xs">{branding.companyName}</h5>
                    <span className="text-[9px] text-zinc-500 font-mono">White-Label Client Workspace</span>
                  </div>
                </div>

                <button
                  className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-white"
                  style={{ backgroundColor: branding.primaryColor || '#7C3AED' }}
                >
                  ACTIVE
                </button>
              </div>

              {/* Simulated Client Dashboard Content */}
              <div className="p-5 space-y-4 bg-[#0A0A0A]">
                <div className="p-4 rounded-xl border border-[#1F1F1F] bg-[#111111] space-y-2">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase block">Campaign Intelligence</span>
                  <div className="text-xl font-bold text-white font-mono">
                    1,420 <span className="text-xs text-zinc-500">Leads Generated</span>
                  </div>
                  <div className="w-full bg-[#1F1F1F] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: '70%', backgroundColor: branding.primaryColor || '#7C3AED' }}
                    ></div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-[#1F1F1F] bg-[#111111] flex justify-between items-center font-mono">
                  <div>
                    <span className="text-[10px] text-zinc-400 block">SaaS Management Retainer</span>
                    <span className="text-xs font-bold text-white">Scale Growth Tier</span>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded text-[10px] font-bold"
                    style={{
                      backgroundColor: `${branding.accentColor}20`,
                      color: branding.accentColor || '#10B981',
                      borderColor: `${branding.accentColor}40`
                    }}
                  >
                    $3,999 / mo
                  </span>
                </div>

                <div className="text-[10px] font-mono text-zinc-500 text-center pt-2">
                  Powered by {branding.companyName} • Support: {branding.supportEmail}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
