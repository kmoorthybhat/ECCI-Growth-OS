import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db, seedInitialDataIfEmpty } from './lib/firebase';
import { DEFAULT_INNOVATOR_SESSION, UserSession, canAccessInnovator } from './lib/roles';
import { Client, Campaign, Creative, Lead, PromptItem, IntelligenceEngine } from './types';

// Component Imports for all 19 Modules
import { Header } from './components/Header';
import { InnovatorDashboard } from './components/InnovatorDashboard';
import { OnboardingScanner } from './components/OnboardingScanner';
import { ServiceConfigurator } from './components/ServiceConfigurator';
import { PromptLibrary } from './components/PromptLibrary';
import { CampaignApprovals } from './components/CampaignApprovals';
import { IntelligenceEngineView } from './components/IntelligenceEngineView';
import { CreativeStudioText } from './components/CreativeStudioText';
import { CreativeStudioVisual } from './components/CreativeStudioVisual';
import { VideoStudioView } from './components/VideoStudioView';
import { BudgetOptimizerView } from './components/BudgetOptimizerView';
import { LeadPipelineView } from './components/LeadPipelineView';
import { ClientProfileView } from './components/ClientProfileView';
import { ClientGrowthDashboard } from './components/ClientGrowthDashboard';
import { ContentCalendarView } from './components/ContentCalendarView';
import { ClientCampaignTracker } from './components/ClientCampaignTracker';
import { ClientBudgetControl } from './components/ClientBudgetControl';
import { ClientReportGenerator } from './components/ClientReportGenerator';

// v2.0 Expansion Modules Imports
import { TelemetryEngineView } from './components/TelemetryEngineView';
import { AutonomousBudgetView } from './components/AutonomousBudgetView';
import { GeoCitationEngineView } from './components/GeoCitationEngineView';
import { AppsScriptAgentView } from './components/AppsScriptAgentView';
import { SecurityGatewayView } from './components/SecurityGatewayView';
import { WhiteLabelEngineView } from './components/WhiteLabelEngineView';
import { AiMaturityModelView } from './components/AiMaturityModelView';
import { EdgeOptimizationView } from './components/EdgeOptimizationView';

// Module 3 B: Billing Imports
import { InnovatorBillingView } from './components/InnovatorBillingView';
import { ClientBillingHubView } from './components/ClientBillingHubView';

// Module 14: White-Label Agency Sub-Tenancy Manager
import { WhiteLabelAgencyView } from './components/WhiteLabelAgencyView';

// Cloudflare Pages Deployment Manager
import { CloudflarePagesView } from './components/CloudflarePagesView';

export default function App() {
  const [session, setSession] = useState<UserSession>(DEFAULT_INNOVATOR_SESSION);
  const [currentModule, setCurrentModule] = useState<string>('innovator-dashboard');

  // Firestore collections state
  const [clients, setClients] = useState<Client[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [prompts, setPrompts] = useState<PromptItem[]>([]);
  const [deploymentLogs, setDeploymentLogs] = useState<string[]>([]);

  // Seed data on first load and subscribe to real-time updates
  useEffect(() => {
    async function init() {
      await seedInitialDataIfEmpty();

      // Listen to clients collection
      const unsubClients = onSnapshot(collection(db, 'clients'), (snap) => {
        const docs = snap.docs.map((d) => d.data() as Client);
        setClients(docs);
      });

      // Listen to campaigns
      const unsubCampaigns = onSnapshot(collection(db, 'campaigns'), (snap) => {
        const docs = snap.docs.map((d) => d.data() as Campaign);
        setCampaigns(docs);
      });

      // Listen to leads
      const unsubLeads = onSnapshot(collection(db, 'leads'), (snap) => {
        const docs = snap.docs.map((d) => d.data() as Lead);
        setLeads(docs);
      });

      // Listen to prompts
      const unsubPrompts = onSnapshot(collection(db, 'prompts'), (snap) => {
        const docs = snap.docs.map((d) => d.data() as PromptItem);
        setPrompts(docs);
      });

      return () => {
        unsubClients();
        unsubCampaigns();
        unsubLeads();
        unsubPrompts();
      };
    }

    init();
  }, []);

  const activeClient =
    clients.find((c) => c.id === session.activeClientId) || clients[0] || {
      id: 'client_ecc_cafe',
      businessName: 'Energize Cult Cafe Inc',
      websiteUrl: 'https://energizecultcafe.com',
      industry: 'Hospitality / Cafe Hub',
      tier: 'Enterprise',
      status: 'campaigns_live',
      ownerId: 'kmoorthy.bhat@gmail.com',
      healthScore: 96,
      killSwitch: false,
      spendToday: 485.50,
      leadsToday: 18,
      activeCampaignsCount: 4,
      maxMonthlyBudget: 15000,
      createdAt: new Date().toISOString()
    };

  // Handlers for Firestore updates
  const handleToggleKillSwitch = async (clientId: string) => {
    const target = clients.find((c) => c.id === clientId);
    if (!target) return;

    const updatedKill = !target.killSwitch;
    await updateDoc(doc(db, 'clients', clientId), { killSwitch: updatedKill });
  };

  const handleWorkspaceCreated = async (newClient: Client) => {
    await setDoc(doc(db, 'clients', newClient.id), newClient);
    setSession({ ...session, activeClientId: newClient.id });
    setCurrentModule('intelligence');
  };

  const handleUpdateIntelligence = async (clientId: string, bi: IntelligenceEngine) => {
    await updateDoc(doc(db, 'clients', clientId), { bi_engine: bi });
  };

  const handleSaveCreative = async (creative: Creative) => {
    await setDoc(doc(db, 'creatives', creative.id), creative);
    // Add to local state if missing
    setCreatives((prev) => [creative, ...prev.filter((c) => c.id !== creative.id)]);
    setCurrentModule('approvals');
  };

  const handleApproveCampaign = async (campaignId: string) => {
    const camp = campaigns.find((c) => c.id === campaignId);
    if (!camp) return;

    await updateDoc(doc(db, 'campaigns', campaignId), { status: 'live' });

    // Module 10 Auto-Deployer Log Simulation
    const log = `[${new Date().toLocaleTimeString()}] MODULE 10 DEPLOYER: Handshake with ${camp.platform} Ads API -> Campaign ID ${camp.id} Status set to LIVE.`;
    setDeploymentLogs((prev) => [log, ...prev]);
  };

  const handleRejectCampaign = async (campaignId: string, feedback: string) => {
    await updateDoc(doc(db, 'campaigns', campaignId), { status: 'rejected' });
    const log = `[${new Date().toLocaleTimeString()}] REJECTED: Campaign ${campaignId} sent back to Studio with feedback: "${feedback}".`;
    setDeploymentLogs((prev) => [log, ...prev]);
  };

  const handleUpdateLeadStatus = async (leadId: string, status: Lead['status']) => {
    await updateDoc(doc(db, 'leads', leadId), { status });
  };

  const handleAddNewLead = async (leadData: Partial<Lead>) => {
    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      clientId: activeClient.id,
      name: leadData.name || 'New Incoming Lead',
      email: leadData.email || 'lead@example.com',
      phone: leadData.phone || '+1 (555) 019-2834',
      score: leadData.score || 88,
      personaMatch: leadData.personaMatch || 'Biohacking Tech Founder Alex',
      source: leadData.source || 'Web Form',
      status: 'new',
      value: leadData.value || 588,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'leads', newLead.id), newLead);
  };

  const handleSavePrompt = async (updatedPrompt: PromptItem) => {
    await setDoc(doc(db, 'prompts', updatedPrompt.id), updatedPrompt);
  };

  const pendingCampaigns = campaigns.filter((c) => c.status === 'pending_approval');

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased selection:bg-[#FF4D00] selection:text-white">
      {/* Global Header & Nav Bar */}
      <Header
        session={session}
        setSession={setSession}
        clients={clients}
        currentModule={currentModule}
        setCurrentModule={setCurrentModule}
      />

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* INNOVATOR LAYER MODULES */}
        {currentModule === 'innovator-dashboard' && (
          <InnovatorDashboard
            clients={clients}
            onSelectClient={(id) => {
              setSession({ ...session, activeClientId: id });
              setCurrentModule('intelligence');
            }}
            onToggleKillSwitch={handleToggleKillSwitch}
            onOpenOnboarding={() => setCurrentModule('onboarding')}
          />
        )}

        {currentModule === 'onboarding' && (
          <OnboardingScanner onWorkspaceCreated={handleWorkspaceCreated} />
        )}

        {currentModule === 'services' && <ServiceConfigurator />}

        {currentModule === 'prompts' && (
          <PromptLibrary prompts={prompts} onSavePrompt={handleSavePrompt} />
        )}

        {currentModule === 'approvals' && (
          <CampaignApprovals
            pendingCampaigns={pendingCampaigns}
            onApproveCampaign={handleApproveCampaign}
            onRejectCampaign={handleRejectCampaign}
            deploymentLogs={deploymentLogs}
          />
        )}

        {/* SYSTEM LAYER MODULES */}
        {currentModule === 'intelligence' && (
          <IntelligenceEngineView
            client={activeClient}
            onUpdateIntelligence={handleUpdateIntelligence}
          />
        )}

        {currentModule === 'studio-text' && (
          <CreativeStudioText
            client={activeClient}
            onSaveCreative={handleSaveCreative}
          />
        )}

        {currentModule === 'studio-visual' && (
          <CreativeStudioVisual
            client={activeClient}
            onSaveCreative={handleSaveCreative}
          />
        )}

        {currentModule === 'studio-video' && (
          <VideoStudioView
            client={activeClient}
            onSaveCreative={handleSaveCreative}
          />
        )}

        {currentModule === 'budget-opt' && (
          <BudgetOptimizerView
            campaigns={campaigns.filter((c) => c.clientId === activeClient.id)}
            onApplyOptimization={async (sugId, campId, newBudget) => {
              await updateDoc(doc(db, 'campaigns', campId), { dailyBudget: newBudget });
            }}
          />
        )}

        {currentModule === 'leads' && (
          <LeadPipelineView
            leads={leads.filter((l) => l.clientId === activeClient.id)}
            role={session.role}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onAddNewLead={handleAddNewLead}
          />
        )}

        {/* USER CLIENT LAYER MODULES */}
        {currentModule === 'client-profile' && <ClientProfileView client={activeClient} />}

        {currentModule === 'client-dashboard' && (
          <ClientGrowthDashboard client={activeClient} />
        )}

        {currentModule === 'client-content' && (
          <ContentCalendarView
            creatives={creatives.filter((c) => c.clientId === activeClient.id)}
            onApproveCreative={async (id) => {
              await updateDoc(doc(db, 'creatives', id), { status: 'approved' });
            }}
            onRequestEdit={async (id, comment) => {
              await updateDoc(doc(db, 'creatives', id), { feedback: comment, status: 'rejected' });
            }}
          />
        )}

        {currentModule === 'client-campaigns' && (
          <ClientCampaignTracker campaigns={campaigns.filter((c) => c.clientId === activeClient.id)} />
        )}

        {currentModule === 'client-leads' && (
          <LeadPipelineView
            leads={leads.filter((l) => l.clientId === activeClient.id)}
            role="client"
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onAddNewLead={handleAddNewLead}
          />
        )}

        {currentModule === 'client-budget' && (
          <ClientBudgetControl
            client={activeClient}
            onUpdateMaxBudget={async (val) => {
              await updateDoc(doc(db, 'clients', activeClient.id), { maxMonthlyBudget: val });
            }}
            onTogglePause={() => handleToggleKillSwitch(activeClient.id)}
          />
        )}

        {currentModule === 'client-reports' && (
          <ClientReportGenerator client={activeClient} />
        )}

        {/* v2.0 EXPANSION MODULES (20 - 25) & 14-L AI MATURITY MODEL */}
        {currentModule === 'telemetry' && (
          <TelemetryEngineView client={activeClient} />
        )}

        {currentModule === 'autonomous-budget' && (
          <AutonomousBudgetView
            client={activeClient}
            campaigns={campaigns.filter((c) => c.clientId === activeClient.id)}
            onApplyBudgetChange={async (campId, newBudget) => {
              await updateDoc(doc(db, 'campaigns', campId), { dailyBudget: newBudget });
            }}
          />
        )}

        {currentModule === 'geo-citation' && (
          <GeoCitationEngineView client={activeClient} />
        )}

        {currentModule === 'apps-script' && (
          <AppsScriptAgentView client={activeClient} />
        )}

        {currentModule === 'security-gateway' && (
          <SecurityGatewayView client={activeClient} />
        )}

        {currentModule === 'white-label' && (
          <WhiteLabelEngineView client={activeClient} />
        )}

        {currentModule === 'ai-maturity-model' && (
          <AiMaturityModelView client={activeClient} />
        )}

        {currentModule === 'edge-optimization' && (
          <EdgeOptimizationView client={activeClient} />
        )}

        {/* MODULE 3 B: BILLING & PAYMENT ENGINES */}
        {currentModule === 'innovator-billing' && (
          <InnovatorBillingView clients={clients} />
        )}

        {currentModule === 'client-billing' && (
          <ClientBillingHubView client={activeClient} />
        )}

        {/* MODULE 14: WHITE-LABEL AGENCY & CUSTOM DOMAIN SUB-TENANCY MANAGER */}
        {(currentModule === 'agency-management' || currentModule === 'innovator-agency' || currentModule === 'agency-settings') && (
          <WhiteLabelAgencyView
            session={session}
            clients={clients}
          />
        )}

        {/* CLOUDFLARE PAGES DEPLOYMENT MANAGER */}
        {currentModule === 'cloudflare-pages' && (
          <CloudflarePagesView />
        )}
      </main>
    </div>
  );
}
