import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldAlert,
  CheckCircle2,
  Clock,
  DollarSign,
  Info,
  ArrowRight,
  Download,
  ExternalLink,
  Sparkles,
  Lock,
  Layers,
  Check,
  RefreshCw,
  AlertTriangle,
  QrCode,
  FileText
} from 'lucide-react';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Client, Tier, PricingTiersMap, BillingTransaction } from '../types';

interface ClientBillingHubViewProps {
  client: Client;
  onRefreshClient?: () => void;
}

const DEFAULT_TIERS: PricingTiersMap = {
  Starter: { onboardingFee: 499, monthlyRetainer: 999, currency: 'USD' },
  Growth: { onboardingFee: 999, monthlyRetainer: 1999, currency: 'USD' },
  Scale: { onboardingFee: 1999, monthlyRetainer: 3999, currency: 'USD' },
  Enterprise: { onboardingFee: 4999, monthlyRetainer: 8999, currency: 'USD' },
};

export const ClientBillingHubView: React.FC<ClientBillingHubViewProps> = ({ client, onRefreshClient }) => {
  const [selectedTier, setSelectedTier] = useState<Tier>(client.tier || 'Growth');
  const [selectedGateway, setSelectedGateway] = useState<'paypal' | 'paytm'>('paypal');
  const [pricingTiers, setPricingTiers] = useState<PricingTiersMap>(DEFAULT_TIERS);
  const [transactions, setTransactions] = useState<BillingTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutSuccessMsg, setCheckoutSuccessMsg] = useState<string | null>(null);

  // Paytm Modal State
  const [paytmModalOpen, setPaytmModalOpen] = useState(false);
  const [paytmTxnData, setPaytmTxnData] = useState<any>(null);
  const [isProcessingPaytm, setIsProcessingPaytm] = useState(false);

  // Receipt Modal State
  const [activeReceiptTxn, setActiveReceiptTxn] = useState<BillingTransaction | null>(null);

  useEffect(() => {
    fetchPricingTiers();
    fetchTransactionHistory();
  }, [client.id]);

  const fetchPricingTiers = async () => {
    try {
      const snap = await getDoc(doc(db, 'billing_configs', 'pricing_tiers'));
      if (snap.exists() && snap.data().tiers) {
        setPricingTiers(snap.data().tiers);
      }
    } catch (e) {
      console.error('Error fetching tiers:', e);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      const q = query(collection(db, 'transactions'), where('clientId', '==', client.id));
      const querySnap = await getDocs(q);
      const list: BillingTransaction[] = [];
      querySnap.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as BillingTransaction);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (list.length === 0) {
        // Mock initial seed transaction if empty
        const initialTxn: BillingTransaction = {
          id: `txn_init_${client.id}`,
          clientId: client.id,
          clientName: client.businessName,
          userId: client.ownerId || 'user_1',
          provider: client.paymentProvider || 'paypal',
          type: client.onboardingFeePaid ? 'monthly_retainer' : 'onboarding',
          amount: pricingTiers[client.tier]?.monthlyRetainer || 1999,
          currency: 'USD',
          status: 'COMPLETED',
          paymentId: `PAYID-INIT-98218123`,
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        };
        setTransactions([initialTxn]);
      } else {
        setTransactions(list);
      }
    } catch (e) {
      console.error('Error fetching transactions:', e);
    }
  };

  const currentRate = pricingTiers[selectedTier] || DEFAULT_TIERS.Growth;
  const needOnboardingFee = !client.onboardingFeePaid;
  const paymentType = needOnboardingFee ? 'onboarding' : 'monthly_retainer';
  const checkoutAmount = needOnboardingFee ? currentRate.onboardingFee : currentRate.monthlyRetainer;

  // Handle PayPal Checkout Simulation / Direct Capture
  const handlePayPalCheckout = async () => {
    setIsLoading(true);
    try {
      // 1. Initiate order backend
      const initRes = await fetch('/api/billing/paypal/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          tier: selectedTier,
          paymentType
        })
      });
      const initData = await initRes.json();

      // 2. Capture payment backend
      const capRes = await fetch('/api/billing/paypal/capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          userId: client.ownerId,
          paymentId: `PAYID-PP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          orderId: initData.orderId || `ORDER-PP-${Date.now()}`,
          tier: selectedTier,
          paymentType,
          amount: checkoutAmount
        })
      });
      const capData = await capRes.json();

      if (capData.success) {
        // 3. Persist update in Firestore client doc
        const clientRef = doc(db, 'clients', client.id);
        await updateDoc(clientRef, {
          tier: selectedTier,
          onboardingFeePaid: true,
          retainerStatus: 'active',
          paymentProvider: 'paypal',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

        // 4. Record Transaction in Firestore
        const newTxnRef = doc(collection(db, 'transactions'));
        const txnDoc: BillingTransaction = {
          id: newTxnRef.id,
          clientId: client.id,
          clientName: client.businessName,
          userId: client.ownerId || 'user_1',
          provider: 'paypal',
          type: paymentType,
          amount: checkoutAmount,
          currency: 'USD',
          status: 'COMPLETED',
          paymentId: capData.transaction.paymentId,
          orderId: capData.transaction.orderId,
          createdAt: new Date().toISOString()
        };
        await setDoc(newTxnRef, txnDoc);

        setCheckoutSuccessMsg(`Payment of $${checkoutAmount} via PayPal successful! Retainer activated.`);
        setTimeout(() => setCheckoutSuccessMsg(null), 4000);
        fetchTransactionHistory();
        if (onRefreshClient) onRefreshClient();
      }
    } catch (err) {
      console.error('PayPal checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Paytm Initiate & Modal Launch
  const handleInitiatePaytm = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/billing/paytm/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientId: client.id,
          tier: selectedTier,
          amount: checkoutAmount * 83, // Convert USD to approximate INR
          paymentType
        })
      });
      const data = await res.json();
      if (data.success) {
        setPaytmTxnData(data);
        setPaytmModalOpen(true);
      }
    } catch (err) {
      console.error('Paytm initiate error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Complete Paytm Payment Callback Simulation
  const handleConfirmPaytmPayment = async () => {
    setIsProcessingPaytm(true);
    try {
      const res = await fetch('/api/billing/paytm/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ORDER_ID: paytmTxnData?.orderId,
          TXN_ID: `PTM_${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
          STATUS: 'TXN_SUCCESS',
          clientId: client.id,
          userId: client.ownerId,
          tier: selectedTier,
          paymentType,
          amount: checkoutAmount * 83
        })
      });
      const data = await res.json();

      if (data.success) {
        const clientRef = doc(db, 'clients', client.id);
        await updateDoc(clientRef, {
          tier: selectedTier,
          onboardingFeePaid: true,
          retainerStatus: 'active',
          paymentProvider: 'paytm',
          nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        });

        const newTxnRef = doc(collection(db, 'transactions'));
        const txnDoc: BillingTransaction = {
          id: newTxnRef.id,
          clientId: client.id,
          clientName: client.businessName,
          userId: client.ownerId || 'user_1',
          provider: 'paytm',
          type: paymentType,
          amount: checkoutAmount * 83,
          currency: 'INR',
          status: 'COMPLETED',
          paymentId: data.transaction.paymentId,
          orderId: paytmTxnData?.orderId,
          createdAt: new Date().toISOString()
        };
        await setDoc(newTxnRef, txnDoc);

        setCheckoutSuccessMsg(`Paytm Payment of ₹${(checkoutAmount * 83).toLocaleString()} verified! Retainer active.`);
        setPaytmModalOpen(false);
        setTimeout(() => setCheckoutSuccessMsg(null), 4000);
        fetchTransactionHistory();
        if (onRefreshClient) onRefreshClient();
      }
    } catch (err) {
      console.error('Paytm callback error:', err);
    } finally {
      setIsProcessingPaytm(false);
    }
  };

  const isOverdue = client.retainerStatus === 'overdue';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30">
                MODULE 3 B • CLIENT CHECKOUT & BILLING HUB
              </span>
              <span className="text-zinc-500 font-mono text-xs">SaaS Retainers & Invoicing</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Billing, Subscriptions & Retainer Hub
            </h1>
            <p className="text-zinc-400 text-sm mt-1">
              Manage your SaaS management retainer, select service tiers, and execute direct payments via PayPal or Paytm.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className="px-3 py-1.5 rounded-xl bg-[#0A0A0A] border border-[#1F1F1F] font-mono text-xs text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00D26A]"></span>
              Client: <strong className="text-[#FF4D00]">{client.businessName}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 1. Direct Ad Budget Separation Banner */}
      <div className="bg-gradient-to-r from-[#FF4D00]/15 via-[#111111] to-[#0A0A0A] border border-[#FF4D00]/40 rounded-2xl p-5 flex items-start space-x-4 shadow-xl">
        <div className="p-2.5 rounded-xl bg-[#FF4D00]/20 text-[#FF4D00] shrink-0">
          <Info className="w-6 h-6" />
        </div>
        <div className="space-y-1 font-sans">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Direct Ad Budget Separation Notice
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed">
            <strong className="text-[#00D26A]">100% of your Media Ad Budget is funded directly through linked ad networks</strong> (Google Ads, Meta Ads Manager, LinkedIn Ads). ECCI Growth OS charges only the SaaS management retainer and onboarding fees for autonomous AI strategy and execution.
          </p>
        </div>
      </div>

      {/* Account Access Gating Overdue Alert */}
      {isOverdue && (
        <div className="bg-red-500/10 border-2 border-red-500/50 rounded-2xl p-5 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-red-400 uppercase font-mono">
                Account Access Suspended / Overdue Retainer Alert
              </h4>
              <p className="text-xs text-zinc-300 mt-0.5">
                Campaign execution and automated ad launches are currently paused. Please settle your monthly retainer below to resume full system access.
              </p>
            </div>
          </div>
          <a
            href="#checkout-section"
            className="px-4 py-2 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-all font-mono whitespace-nowrap shrink-0 shadow-lg"
          >
            SETTLE NOW →
          </a>
        </div>
      )}

      {checkoutSuccessMsg && (
        <div className="p-4 bg-[#00D26A]/10 border border-[#00D26A]/30 rounded-2xl text-xs font-mono text-[#00D26A] flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-[#00D26A]" />
          <span className="font-bold">{checkoutSuccessMsg}</span>
        </div>
      )}

      {/* Current Tier & Status Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#111111] border border-[#1F1F1F] p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Assigned Tier</span>
          <div className="text-2xl font-bold font-mono text-white flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-sm bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30">
              {client.tier}
            </span>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Onboarding Fee Status</span>
          <div className="text-lg font-bold font-mono">
            {client.onboardingFeePaid ? (
              <span className="text-[#00D26A] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Settled
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Pending (${currentRate.onboardingFee})
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Retainer Status</span>
          <div className="text-lg font-bold font-mono">
            {client.retainerStatus === 'active' ? (
              <span className="text-[#00D26A] flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Active Subscriptions
              </span>
            ) : isOverdue ? (
              <span className="text-red-400 flex items-center gap-1.5 animate-pulse">
                <AlertTriangle className="w-4 h-4" /> Overdue
              </span>
            ) : (
              <span className="text-amber-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4" /> Pending
              </span>
            )}
          </div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-5 rounded-2xl space-y-1">
          <span className="text-[11px] font-mono text-zinc-500 uppercase">Next Renewal Date</span>
          <div className="text-base font-bold font-mono text-zinc-300">
            {client.nextBillingDate
              ? new Date(client.nextBillingDate).toLocaleDateString()
              : '30 Days post-activation'}
          </div>
        </div>
      </div>

      {/* Dynamic Checkout Section */}
      <div id="checkout-section" className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#FF4D00]" />
            Dynamic Retainer & Onboarding Fee Checkout
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Select or upgrade your growth tier, review fee breakdown, and complete payment via PayPal or Paytm.
          </p>
        </div>

        {/* Step 1: Select Tier */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase text-zinc-400 block">
            Step 1: Select / Confirm SaaS Tier
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['Starter', 'Growth', 'Scale', 'Enterprise'] as Tier[]).map((tKey) => {
              const rate = pricingTiers[tKey] || DEFAULT_TIERS[tKey];
              const isSelected = selectedTier === tKey;

              return (
                <button
                  key={tKey}
                  type="button"
                  onClick={() => setSelectedTier(tKey)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#FF4D00]/10 border-[#FF4D00] text-white shadow-lg shadow-[#FF4D00]/10'
                      : 'bg-[#0A0A0A] border-[#1F1F1F] text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono font-bold text-sm text-white">{tKey}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF4D00]" />}
                  </div>
                  <div className="text-lg font-bold font-mono text-white">
                    ${rate.monthlyRetainer} <span className="text-xs text-zinc-400 font-normal">/ mo</span>
                  </div>
                  <div className="text-[11px] font-mono text-zinc-500 mt-1">
                    Onboarding: ${rate.onboardingFee}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2 & 3: Fee Breakdown & Gateway Picker */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1F1F1F]">
          {/* Fee Breakdown Summary */}
          <div className="p-5 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl space-y-3 font-mono text-xs">
            <h4 className="font-bold text-white text-sm uppercase">
              Step 2: Payment Fee Summary ({selectedTier} Tier)
            </h4>

            {needOnboardingFee && (
              <div className="flex justify-between py-1.5 border-b border-[#1F1F1F]">
                <span className="text-zinc-400">One-Time Onboarding Fee</span>
                <span className="text-amber-400 font-bold">${currentRate.onboardingFee}</span>
              </div>
            )}

            <div className="flex justify-between py-1.5 border-b border-[#1F1F1F]">
              <span className="text-zinc-400">Monthly Management Retainer</span>
              <span className="text-[#00D26A] font-bold">${currentRate.monthlyRetainer} / mo</span>
            </div>

            <div className="flex justify-between py-2 text-sm font-bold text-white">
              <span>Total Payable Now</span>
              <span className="text-[#FF4D00]">${checkoutAmount} {selectedGateway === 'paytm' ? `(~₹${(checkoutAmount * 83).toLocaleString()})` : 'USD'}</span>
            </div>
          </div>

          {/* Gateway Picker */}
          <div className="p-5 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl space-y-4 font-mono text-xs">
            <h4 className="font-bold text-white text-sm uppercase">
              Step 3: Choose Payment Gateway
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedGateway('paypal')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center space-y-1 ${
                  selectedGateway === 'paypal'
                    ? 'bg-blue-500/15 border-blue-500 text-white font-bold'
                    : 'bg-[#111111] border-[#1F1F1F] text-zinc-400'
                }`}
              >
                <span className="text-blue-400 font-bold text-sm">PayPal</span>
                <span className="text-[10px] text-zinc-500">Subscriptions & USD</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedGateway('paytm')}
                className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center space-y-1 ${
                  selectedGateway === 'paytm'
                    ? 'bg-[#00D26A]/15 border-[#00D26A] text-white font-bold'
                    : 'bg-[#111111] border-[#1F1F1F] text-zinc-400'
                }`}
              >
                <span className="text-[#00D26A] font-bold text-sm">Paytm PG</span>
                <span className="text-[10px] text-zinc-500">UPI / QR & INR</span>
              </button>
            </div>

            {/* Gateway Action Buttons */}
            {selectedGateway === 'paypal' ? (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePayPalCheckout}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <CreditCard className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {isLoading ? 'PROCESSING PAYPAL...' : `PAY $${checkoutAmount} VIA PAYPAL SMART BUTTONS`}
                  </span>
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleInitiatePaytm}
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-xl bg-[#00D26A] text-black font-bold text-xs hover:bg-[#00D26A]/90 transition-all shadow-lg shadow-[#00D26A]/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <QrCode className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>
                    {isLoading ? 'INITIATING PAYTM...' : `PAY ₹${(checkoutAmount * 83).toLocaleString()} VIA PAYTM PG`}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#FF4D00]" />
            Transaction History Ledger & Downloadable Invoices
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Audit past retainer payments, transaction IDs, status verification, and generate PDF summaries.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1F1F1F] text-zinc-500 uppercase">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Provider</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F]">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-[#0A0A0A]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {txn.paymentId || txn.id}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-zinc-300">
                    {txn.type === 'onboarding' ? 'Onboarding Fee' : 'Monthly Retainer'}
                  </td>
                  <td className="py-3.5 px-4">
                    {txn.provider === 'paytm' ? (
                      <span className="px-2 py-0.5 rounded bg-[#00D26A]/20 text-[#00D26A] font-bold text-[10px]">
                        PAYTM
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold text-[10px]">
                        PAYPAL
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-white">
                    {txn.currency === 'INR' ? `₹${txn.amount.toLocaleString()}` : `$${txn.amount}`}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-[#00D26A]/20 text-[#00D26A] font-bold text-[10px]">
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-zinc-400">
                    {new Date(txn.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setActiveReceiptTxn(txn)}
                      className="px-2.5 py-1 rounded bg-[#1F1F1F] text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all font-bold text-[10px] flex items-center space-x-1 ml-auto"
                    >
                      <Download className="w-3 h-3 text-[#FF4D00]" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paytm Checkout Modal Simulation */}
      {paytmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <QrCode className="w-5 h-5 text-[#00D26A]" /> Paytm Gateway Web Checkout
              </span>
              <button
                onClick={() => setPaytmModalOpen(false)}
                className="text-zinc-500 hover:text-white font-mono text-xs"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-3 font-mono">
              <div className="p-4 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl inline-block">
                <QrCode className="w-28 h-28 text-[#00D26A] mx-auto" />
              </div>

              <div className="text-xl font-bold text-white">
                ₹{(checkoutAmount * 83).toLocaleString()} <span className="text-xs text-zinc-400">INR</span>
              </div>
              <p className="text-xs text-zinc-400">
                Order ID: <strong className="text-white">{paytmTxnData?.orderId}</strong>
              </p>
              <div className="p-2.5 bg-black/50 border border-[#1F1F1F] rounded-xl text-[10px] text-zinc-500 break-all">
                Checksum: {paytmTxnData?.paytmParams?.CHECKSUMHASH}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleConfirmPaytmPayment}
                disabled={isProcessingPaytm}
                className="w-full py-3 rounded-xl bg-[#00D26A] text-black font-bold text-xs hover:bg-[#00D26A]/90 transition-all flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className={`w-4 h-4 ${isProcessingPaytm ? 'animate-spin' : ''}`} />
                <span>{isProcessingPaytm ? 'VERIFYING CHECKSUM...' : 'SIMULATE SUCCESSFUL PAYTM PAYMENT'}</span>
              </button>

              <button
                onClick={() => setPaytmModalOpen(false)}
                className="w-full py-2 rounded-xl bg-[#1F1F1F] text-zinc-400 font-mono text-xs hover:text-white"
              >
                CANCEL CHECKOUT
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDF Receipt Summary Modal */}
      {activeReceiptTxn && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 max-w-lg w-full space-y-5 shadow-2xl font-mono">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#FF4D00]" /> ECCI Growth OS Official Receipt
              </span>
              <button
                onClick={() => setActiveReceiptTxn(null)}
                className="text-zinc-500 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="p-5 bg-[#0A0A0A] border border-[#1F1F1F] rounded-2xl space-y-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Receipt Number:</span>
                <span className="text-white font-bold">{activeReceiptTxn.paymentId}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Client Name:</span>
                <span className="text-white font-bold">{client.businessName}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Provider:</span>
                <span className="text-white uppercase font-bold">{activeReceiptTxn.provider}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Transaction Type:</span>
                <span className="text-white uppercase font-bold">{activeReceiptTxn.type}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Date:</span>
                <span className="text-white font-bold">{new Date(activeReceiptTxn.createdAt).toLocaleString()}</span>
              </div>
              <div className="border-t border-[#1F1F1F] pt-2 flex justify-between text-sm font-bold">
                <span className="text-white">Amount Paid:</span>
                <span className="text-[#00D26A]">
                  {activeReceiptTxn.currency === 'INR' ? `₹${activeReceiptTxn.amount.toLocaleString()}` : `$${activeReceiptTxn.amount}`}
                </span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-[#FF4D00] text-white font-bold text-xs hover:bg-[#FF4D00]/90 transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>PRINT / SAVE PDF RECEIPT</span>
              </button>

              <button
                onClick={() => setActiveReceiptTxn(null)}
                className="px-4 py-2.5 rounded-xl bg-[#1F1F1F] text-zinc-300 font-bold text-xs hover:bg-zinc-800"
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
