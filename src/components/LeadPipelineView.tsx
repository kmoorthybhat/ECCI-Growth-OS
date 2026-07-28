import React, { useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  CheckCircle2,
  DollarSign,
  UserCheck,
  Zap,
  Plus,
  ExternalLink,
  Award
} from 'lucide-react';
import { Lead, UserRole } from '../types';

interface LeadPipelineViewProps {
  leads: Lead[];
  role: UserRole;
  onUpdateLeadStatus: (leadId: string, status: Lead['status']) => void;
  onAddNewLead: (lead: Partial<Lead>) => void;
}

export const LeadPipelineView: React.FC<LeadPipelineViewProps> = ({
  leads,
  role,
  onUpdateLeadStatus,
  onAddNewLead,
}) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');

  const statuses: Lead['status'][] = role === 'client'
    ? ['new', 'qualified', 'meeting', 'won']
    : ['new', 'qualified', 'meeting', 'won', 'lost'];

  const columns = {
    new: leads.filter((l) => l.status === 'new'),
    qualified: leads.filter((l) => l.status === 'qualified'),
    meeting: leads.filter((l) => l.status === 'meeting'),
    won: leads.filter((l) => l.status === 'won'),
    lost: leads.filter((l) => l.status === 'lost'),
  };

  const handleCreateLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    onAddNewLead({
      name: newName,
      email: newEmail,
      phone: newPhone || '+1 (555) 019-2834',
      score: Math.floor(Math.random() * 20) + 80,
      personaMatch: 'Biohacking Tech Founder Alex',
      source: 'Direct Webhook / Web Form',
      status: 'new',
      value: 588,
      notes: 'Inquired about Unlimited Energize Pass & Executive Meeting Lounge.'
    });

    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setShowAddModal(false);
  };

  const totalWonValue = leads
    .filter((l) => l.status === 'won')
    .reduce((acc, l) => acc + (l.value || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
            <MessageSquare className="w-3 h-3 mr-1" />
            {role === 'innovator' ? 'MODULE 12: UNIFIED LEAD PIPELINE & AI SCORING' : 'MODULE 17: LEAD INBOX & ACTION CENTER'}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            AI Scored <span className="text-[#00D26A]">Lead Kanban</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Real-time incoming lead inbox scored 0-100 by Gemini based on Module 6 ICP persona alignment.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-[#0A0A0A] border border-[#1F1F1F] px-4 py-2 rounded-xl text-xs font-mono">
            <span className="text-zinc-500 block text-[10px]">TOTAL WON PIPELINE VALUE</span>
            <span className="text-lg font-bold text-[#00D26A]">${totalWonValue.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-1.5 shadow-lg shadow-[#00D26A]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Lead</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
        {statuses.map((statusKey) => {
          const colLeads = columns[statusKey] || [];
          const statusLabels: Record<string, string> = {
            new: '1. NEW LEADS',
            qualified: '2. QUALIFIED (ICP MATCH)',
            meeting: '3. MEETING / OFFER',
            won: '4. CLOSED WON 🏆',
            lost: '5. CLOSED LOST',
          };

          return (
            <div key={statusKey} className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-4 space-y-3 min-w-[260px]">
              <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
                <span className="font-bold text-xs font-mono text-zinc-300">{statusLabels[statusKey]}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#1F1F1F] text-zinc-400 text-[10px] font-mono font-bold">
                  {colLeads.length}
                </span>
              </div>

              <div className="space-y-3 min-h-[350px]">
                {colLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className="bg-[#0A0A0A] border border-[#1F1F1F] hover:border-[#FF4D00]/60 rounded-xl p-4 space-y-3 transition-all cursor-pointer shadow-lg group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-white text-xs group-hover:text-[#FF4D00] transition-colors">{lead.name}</h4>
                        <p className="text-[10px] text-zinc-500 font-mono">{lead.email}</p>
                      </div>

                      <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        lead.score >= 90
                          ? 'bg-[#00D26A]/20 text-[#00D26A] border border-[#00D26A]/30'
                          : 'bg-amber-400/20 text-amber-400 border border-amber-400/30'
                      }`}>
                        AI Score: {lead.score}/100
                      </div>
                    </div>

                    <div className="text-[11px] text-zinc-400 space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">Persona Match:</span>
                        <span className="text-white font-medium">{lead.personaMatch || 'Alex (Founder)'}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-zinc-500">Est. Value:</span>
                        <span className="text-[#00D26A] font-mono font-bold">${lead.value || 588}</span>
                      </div>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F] text-[10px]">
                      <div className="flex items-center space-x-2">
                        <a
                          href={`tel:${lead.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#FF4D00] text-zinc-300 hover:text-white transition-colors"
                          title="Call Lead"
                        >
                          <Phone className="w-3 h-3" />
                        </a>
                        <a
                          href={`https://wa.me/${lead.phone?.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-[#1F1F1F] hover:bg-[#00D26A] text-zinc-300 hover:text-black transition-colors"
                          title="WhatsApp Chat"
                        >
                          <MessageSquare className="w-3 h-3" />
                        </a>
                      </div>

                      {statusKey !== 'won' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onUpdateLeadStatus(lead.id, 'won');
                          }}
                          className="px-2 py-1 rounded bg-[#00D26A]/20 text-[#00D26A] hover:bg-[#00D26A] hover:text-black font-bold transition-all text-[10px]"
                        >
                          Mark Won 🏆
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Lead Simulation Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-white font-mono">Simulate Incoming Web Lead</h3>
            <form onSubmit={handleCreateLeadSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Lead Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Alex Mercer"
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-3 text-white focus:outline-none focus:border-[#FF4D00]"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Email Address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="alex@startup.io"
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-3 text-white focus:outline-none focus:border-[#FF4D00]"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+1 (555) 234-8901"
                  className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded-xl p-3 text-white focus:outline-none focus:border-[#FF4D00]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#00D26A] text-black hover:bg-[#00D26A]/90 transition-all font-mono"
                >
                  INJECT & SCORE LEAD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
