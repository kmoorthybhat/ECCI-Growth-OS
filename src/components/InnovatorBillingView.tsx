import React, { useState, useEffect } from 'react';
import {
  DollarSign,
  CreditCard,
  ShieldAlert,
  Save,
  Send,
  RefreshCw,
  Check,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Key,
  Layers,
  Settings,
  Sliders,
  Sparkles,
  ExternalLink,
  Copy,
  Lock,
  ArrowUpRight
} from 'lucide-react';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client, PricingTiersMap, PaymentGatewayConfig, BillingTransaction, Tier } from '../types';

interface InnovatorBillingViewProps {
  clients: Client[];
  onRefreshClients?: () => void;
}

const DEFAULT_TIERS: PricingTiersMap = {
  Starter: { onboardingFee: 499, monthlyRetainer: 999, currency: 'USD' },
  Growth: { onboardingFee: 999, monthlyRetainer: 1999, currency: 'USD' },
  Scale: { onboardingFee: 1999, monthlyRetainer: 3999, currency: 'USD' },
  Enterprise: { onboardingFee: 4999, monthlyRetainer: 8999, currency: 'USD' },
};

const DEFAULT_GATEWAY_CONFIG: PaymentGatewayConfig = {
  paypal: {
    enabled: true,
    mode: 'sandbox',
    clientId: 'sb-client-id-ecci-growth-os-2026',
    clientSecret: '••••••••••••••••••••••••••••••••'
  },
  paytm: {
    enabled: true,
    mode: 'staging',
    mid: 'ECCI_PAYTM_MID_98271',
    merchantKey: '••••••••••••••••',
    website: 'DEFAULT',
    channelId: 'WEB'
  }
};

export const InnovatorBillingView: React.FC<InnovatorBillingViewProps> = ({ clients, onRefreshClients }) => {
  const [pricingTiers, setPricingTiers] = useState<PricingTiersMap>(DEFAULT_TIERS);
  const [gatewayConfig, setGatewayConfig] = useState<PaymentGatewayConfig>(DEFAULT_GATEWAY_CONFIG);
  const [isSavingTiers, setIsSavingTiers] = useState(false);
  const [isSavingGateways, setIsSavingGateways] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Paytm Payment Link Modal State
  const [paymentLinkModal, setPaymentLinkModal] = useState<{ open: boolean; link: string; clientName: string } | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Manual status override state
  const [updatingClientId, setUpdatingClientId] = useState<string | null>(null);

  useEffect(() => {
    fetchBillingConfigs();
  }, []);

  const fetchBillingConfigs = async () => {
    try {
      const configRef = doc(db, 'billing_configs', 'pricing_tiers');
      const snap = await getDoc(configRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.tiers) setPricingTiers(data.tiers);
        if (data.paypal || data.paytm) {
          setGatewayConfig({
            paypal: data.paypal || DEFAULT_GATEWAY_CONFIG.paypal,
            paytm: data.paytm || DEFAULT_GATEWAY_CONFIG.paytm,
          });
        }
      }
    } catch (err) {
      console.error('Error loading billing configs:', err);
    }
  };

  const handleSaveTierRates = async () => {
    setIsSavingTiers(true);
    try {
      const configRef = doc(db, 'billing_configs', 'pricing_tiers');
      await setDoc(configRef, { tiers: pricingTiers }, { merge: true });
      setSaveSuccessMsg('Tier rates successfully updated and published!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error saving tier rates:', err);
    } finally {
      setIsSavingTiers(false);
    }
  };

  const handleSaveGateways = async () => {
    setIsSavingGateways(true);
    try {
      const configRef = doc(db, 'billing_configs', 'pricing_tiers');
      await setDoc(configRef, {
        paypal: gatewayConfig.paypal,
        paytm: gatewayConfig.paytm
      }, { merge: true });
      setSaveSuccessMsg('Payment Gateway credentials successfully saved!');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (err) {
      console.error('Error saving gateway credentials:', err);
    } finally {
      setIsSavingGateways(false);
    }
  };

  const handleSendPaytmLink = async (client: Client) => {
    try {
      const res = await fetch('/api/billing/paytm/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          tier: client.tier,
          amount: pricingTiers[client.tier]?.monthlyRetainer || 1999,
          paymentType: 'monthly_retainer'
        })
      });
      const data = await res.json();
      if (data.paymentLink) {
        setPaymentLinkModal({
          open: true,
          link: data.paymentLink,
          clientName: client.businessName
        });
      }
    } catch (e) {
      console.error('Error generating Paytm link:', e);
    }
  };

  const handleManualMarkPaid = async (client: Client) => {
    setUpdatingClientId(client.id);
    try {
      const clientRef = doc(db, 'clients', client.id);
      await updateDoc(clientRef, {
        retainerStatus: 'active',
        onboardingFeePaid: true,
        nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      // Record manual transaction
      const txnRef = doc(collection(db, 'transactions'));
      await setDoc(txnRef, {
        clientId: client.id,
        clientName: client.businessName,
        userId: client.ownerId || 'innovator',
        provider: client.paymentProvider || 'paypal',
        type: 'monthly_retainer',
        amount: pricingTiers[client.tier]?.monthlyRetainer || 1999,
        currency: 'USD',
        status: 'COMPLETED',
        paymentId: `MANUAL_OVERRIDE_${Date.now()}`,
        createdAt: new Date().toISOString()
      });

      if (onRefreshClients) onRefreshClients();
    } catch (err) {
      console.error('Error marking paid:', err);
    } finally {
      setUpdatingClientId(null);
    }
  };

  // Calculate Overview Metrics
  const totalMRR = clients.reduce((acc, c) => {
    if (c.retainerStatus === 'active') {
      const rate = pricingTiers[c.tier]?.monthlyRetainer || 1999;
      return acc + rate;
    }
    return acc;
  }, 0);

  const activePayPalCount = clients.filter((c) => c.retainerStatus === 'active' && (c.paymentProvider === 'paypal' || !c.paymentProvider)).length;
  const activePaytmCount = clients.filter((c) => c.retainerStatus === 'active' && c.paymentProvider === 'paytm').length;
  
  const pendingOnboardingCount = clients.filter((c) => !c.onboardingFeePaid).length;
  const pendingOnboardingValue = clients.filter((c) => !c.onboardingFeePaid).reduce((sum, c) => sum + (pricingTiers[c.tier]?.onboardingFee || 999), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30">
                MODULE 3 B • INNOVATOR BILLING & RETAINER ENGINE
              </span>
              <span className="text-zinc-500 font-mono text-xs">Multi-Provider Payments & Tier Management</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Billing, Payments & Retainer Command Hub
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Manage client tiers, onboarding fees, recurring monthly retainers, and multi-gateway credentials (PayPal & Paytm).
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchBillingConfigs}
              className="px-4 py-2.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] text-zinc-300 font-mono text-xs hover:border-zinc-700 transition-all flex items-center space-x-2"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#FF4D00]" />
              <span>REFRESH DATA</span>
            </button>
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="mt-4 p-3 bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-xl text-xs text-[#00D26A] font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}
      </div>

      {/* Top Cards: MRR, Paid Subscriptions, Pending Onboarding */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs">
            <span>Total Monthly Retainer Revenue (MRR)</span>
            <DollarSign className="w-4 h-4 text-[#00D26A]" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            ${totalMRR.toLocaleString()} <span className="text-xs text-[#00D26A] font-normal">/ mo</span>
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            Active retainers across {clients.filter((c) => c.retainerStatus === 'active').length} subscribed clients
          </p>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs">
            <span>Active Paid Subscriptions</span>
            <CreditCard className="w-4 h-4 text-[#FF4D00]" />
          </div>
          <div className="text-3xl font-bold font-mono text-white">
            {activePayPalCount + activePaytmCount}{' '}
            <span className="text-xs text-zinc-400 font-normal">Clients</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] font-mono mt-1">
            <span className="text-blue-400 font-bold">PayPal: {activePayPalCount}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-[#00D26A] font-bold">Paytm: {activePaytmCount}</span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-2">
          <div className="flex justify-between items-center text-zinc-400 font-mono text-xs">
            <span>Pending / Overdue Onboarding Fees</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-bold font-mono text-amber-400">
            ${pendingOnboardingValue.toLocaleString()}
          </div>
          <p className="text-[11px] text-zinc-500 font-mono">
            {pendingOnboardingCount} clients with pending onboarding fee settlement
          </p>
        </div>
      </div>

      {/* Tier Pricing Configurator Table */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#FF4D00]" />
              Tier Pricing & Retainer Rates Configurator
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Set default Onboarding Fees and Monthly SaaS Management Retainer Rates per tier.
            </p>
          </div>

          <button
            onClick={handleSaveTierRates}
            disabled={isSavingTiers}
            className="px-4 py-2 rounded-xl bg-[#FF4D00] text-white font-bold text-xs hover:bg-[#FF4D00]/90 transition-all flex items-center space-x-2 shadow-lg shadow-[#FF4D00]/20 disabled:opacity-50 self-start sm:self-auto"
          >
            <Save className={`w-4 h-4 ${isSavingTiers ? 'animate-spin' : ''}`} />
            <span>{isSavingTiers ? 'SAVING...' : 'SAVE TIER RATES'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1F1F1F] text-zinc-500 uppercase">
                <th className="py-3 px-4">Tier Category</th>
                <th className="py-3 px-4">One-Time Onboarding Fee ($)</th>
                <th className="py-3 px-4">Monthly Recurring Retainer ($)</th>
                <th className="py-3 px-4">Currency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {(['Starter', 'Growth', 'Scale', 'Enterprise'] as Tier[]).map((tierKey) => (
                <tr key={tierKey} className="hover:bg-[#0A0A0A]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                        tierKey === 'Enterprise'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : tierKey === 'Scale'
                          ? 'bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30'
                          : tierKey === 'Growth'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-zinc-800 text-zinc-300'
                      }`}
                    >
                      {tierKey}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative max-w-xs">
                      <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                      <input
                        type="number"
                        value={pricingTiers[tierKey]?.onboardingFee || 0}
                        onChange={(e) =>
                          setPricingTiers({
                            ...pricingTiers,
                            [tierKey]: {
                              ...pricingTiers[tierKey],
                              onboardingFee: Number(e.target.value)
                            }
                          })
                        }
                        className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl pl-7 pr-3 py-2 text-white font-bold focus:outline-none focus:border-[#FF4D00]"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="relative max-w-xs">
                      <span className="absolute left-3 top-2.5 text-zinc-500">$</span>
                      <input
                        type="number"
                        value={pricingTiers[tierKey]?.monthlyRetainer || 0}
                        onChange={(e) =>
                          setPricingTiers({
                            ...pricingTiers,
                            [tierKey]: {
                              ...pricingTiers[tierKey],
                              monthlyRetainer: Number(e.target.value)
                            }
                          })
                        }
                        className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl pl-7 pr-3 py-2 text-[#00D26A] font-bold focus:outline-none focus:border-[#FF4D00]"
                      />
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400 font-bold">
                    {pricingTiers[tierKey]?.currency || 'USD'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Gateway Credentials Configurator */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-[#00D26A]" />
              Payment Gateway Credentials Configurator
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Configure PayPal and Paytm API credentials for automated checkout, webhook processing, and payment link generation.
            </p>
          </div>

          <button
            onClick={handleSaveGateways}
            disabled={isSavingGateways}
            className="px-4 py-2 rounded-xl bg-[#00D26A] text-black font-bold text-xs hover:bg-[#00D26A]/90 transition-all flex items-center space-x-2 shadow-lg shadow-[#00D26A]/20 disabled:opacity-50 self-start sm:self-auto"
          >
            <Save className={`w-4 h-4 ${isSavingGateways ? 'animate-spin' : ''}`} />
            <span>{isSavingGateways ? 'SAVING...' : 'SAVE GATEWAY KEYS'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PayPal Config */}
          <div className="p-5 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
                <span className="font-bold text-white text-sm">PayPal Checkout & Subscriptions</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-zinc-500">Mode:</span>
                <select
                  value={gatewayConfig.paypal.mode}
                  onChange={(e) =>
                    setGatewayConfig({
                      ...gatewayConfig,
                      paypal: { ...gatewayConfig.paypal, mode: e.target.value as 'sandbox' | 'live' }
                    })
                  }
                  className="bg-[#111111] border border-[#1F1F1F] text-blue-400 font-bold rounded px-2 py-1 focus:outline-none"
                >
                  <option value="sandbox">Sandbox</option>
                  <option value="live">Live</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">PayPal Client ID</label>
                <input
                  type="text"
                  value={gatewayConfig.paypal.clientId}
                  onChange={(e) =>
                    setGatewayConfig({
                      ...gatewayConfig,
                      paypal: { ...gatewayConfig.paypal, clientId: e.target.value }
                    })
                  }
                  className="w-full bg-[#111111] border border-[#1F1F1F] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">PayPal Client Secret</label>
                <input
                  type="password"
                  value={gatewayConfig.paypal.clientSecret}
                  onChange={(e) =>
                    setGatewayConfig({
                      ...gatewayConfig,
                      paypal: { ...gatewayConfig.paypal, clientSecret: e.target.value }
                    })
                  }
                  className="w-full bg-[#111111] border border-[#1F1F1F] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Paytm Config */}
          <div className="p-5 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#00D26A] animate-pulse"></span>
                <span className="font-bold text-white text-sm">Paytm PG & Payment Links</span>
              </div>
              <div className="flex items-center space-x-2 font-mono text-xs">
                <span className="text-zinc-500">Mode:</span>
                <select
                  value={gatewayConfig.paytm.mode}
                  onChange={(e) =>
                    setGatewayConfig({
                      ...gatewayConfig,
                      paytm: { ...gatewayConfig.paytm, mode: e.target.value as 'staging' | 'production' }
                    })
                  }
                  className="bg-[#111111] border border-[#1F1F1F] text-[#00D26A] font-bold rounded px-2 py-1 focus:outline-none"
                >
                  <option value="staging">Staging</option>
                  <option value="production">Production</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Paytm MID</label>
                <input
                  type="text"
                  value={gatewayConfig.paytm.mid}
                  onChange={(e) =>
                    setGatewayConfig({
                      ...gatewayConfig,
                      paytm: { ...gatewayConfig.paytm, mid: e.target.value }
                    })
                  }
                  className="w-full bg-[#111111] border border-[#1F1F1F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Merchant Key</label>
                <input
                  type="password"
                  value={gatewayConfig.paytm.merchantKey}
                  onChange={(e) =>
                    setGatewayConfig({
                      ...gatewayConfig,
                      paytm: { ...gatewayConfig.paytm, merchantKey: e.target.value }
                    })
                  }
                  className="w-full bg-[#111111] border border-[#1F1F1F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Website Name</label>
                <input
                  type="text"
                  value={gatewayConfig.paytm.website}
                  onChange={(e) =>
                    setGatewayConfig({
                      ...gatewayConfig,
                      paytm: { ...gatewayConfig.paytm, website: e.target.value }
                    })
                  }
                  className="w-full bg-[#111111] border border-[#1F1F1F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Channel ID</label>
                <input
                  type="text"
                  value={gatewayConfig.paytm.channelId}
                  onChange={(e) =>
                    setGatewayConfig({
                      ...gatewayConfig,
                      paytm: { ...gatewayConfig.paytm, channelId: e.target.value }
                    })
                  }
                  className="w-full bg-[#111111] border border-[#1F1F1F] rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#00D26A]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Payment Status Ledger Table */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#FF4D00]" />
            Client Retainer Payment Status & Direct Actions
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Monitor client billing status, send Paytm payment links, or trigger manual retainer overrides.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1F1F1F] text-zinc-500 uppercase">
                <th className="py-3 px-4">Client Name</th>
                <th className="py-3 px-4">Tier</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Onboarding Fee</th>
                <th className="py-3 px-4">Retainer Status</th>
                <th className="py-3 px-4">Next Billing Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {clients.map((client) => {
                const isOverdue = client.retainerStatus === 'overdue';
                const isPaid = client.retainerStatus === 'active';

                return (
                  <tr key={client.id} className="hover:bg-[#0A0A0A]/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <div>{client.businessName}</div>
                      <div className="text-[10px] text-zinc-500 font-normal">{client.industry}</div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-zinc-300">
                      <span className="px-2 py-0.5 rounded bg-[#1F1F1F] text-white">
                        {client.tier}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {client.paymentProvider === 'paytm' ? (
                        <span className="px-2 py-0.5 rounded bg-[#00D26A]/20 text-[#00D26A] font-bold text-[10px]">
                          PAYTM
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                          PAYPAL
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {client.onboardingFeePaid ? (
                        <span className="text-[#00D26A] font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PAID
                        </span>
                      ) : (
                        <span className="text-amber-400 font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> PENDING (${pricingTiers[client.tier]?.onboardingFee || 999})
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {isPaid ? (
                        <span className="px-2.5 py-1 rounded bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30 font-bold text-[10px]">
                          ACTIVE
                        </span>
                      ) : isOverdue ? (
                        <span className="px-2.5 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 font-bold text-[10px] animate-pulse">
                          OVERDUE
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold text-[10px]">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      {client.nextBillingDate
                        ? new Date(client.nextBillingDate).toLocaleDateString()
                        : '30 Days from Activation'}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleSendPaytmLink(client)}
                        className="px-2.5 py-1 rounded-lg bg-[#00D26A]/10 text-[#00D26A] border border-[#00D26A]/30 hover:bg-[#00D26A]/20 transition-all font-bold text-[10px]"
                      >
                        SEND LINK (PAYTM)
                      </button>

                      <button
                        onClick={() => handleManualMarkPaid(client)}
                        disabled={updatingClientId === client.id}
                        className="px-2.5 py-1 rounded-lg bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30 hover:bg-[#FF4D00]/20 transition-all font-bold text-[10px]"
                      >
                        {updatingClientId === client.id ? 'SAVING...' : 'MARK PAID'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paytm Payment Link Modal */}
      {paymentLinkModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <Send className="w-4 h-4 text-[#00D26A]" /> Paytm Payment Link Generated
              </span>
              <button
                onClick={() => setPaymentLinkModal(null)}
                className="text-zinc-500 hover:text-white font-mono text-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-300 font-sans">
              Send this secure Paytm Payment Gateway link to <strong className="text-white">{paymentLinkModal.clientName}</strong> for instant retainer settlement:
            </p>

            <div className="p-3 bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl text-xs font-mono text-[#00D26A] break-all">
              {paymentLinkModal.link}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(paymentLinkModal.link);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                className="flex-1 py-2 rounded-xl bg-[#00D26A] text-black font-bold text-xs hover:bg-[#00D26A]/90 transition-all flex items-center justify-center space-x-2"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'LINK COPIED!' : 'COPY PAYMENT LINK'}</span>
              </button>

              <button
                onClick={() => setPaymentLinkModal(null)}
                className="px-4 py-2 rounded-xl bg-[#1F1F1F] text-zinc-300 font-bold text-xs hover:bg-zinc-800 transition-all"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
