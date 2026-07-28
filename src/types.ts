export type UserRole = 'innovator' | 'client';

export type Tier = 'Starter' | 'Growth' | 'Scale' | 'Enterprise';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  tier: Tier;
  clientId?: string;
  createdAt: string;
}

export interface BrandKit {
  business_summary: string;
  core_offer: string;
  usps: string[];
  target_audience: string;
  colors: string[];
  tone: string;
  industry: string;
}

export interface Persona {
  id: string;
  name: string;
  role: string;
  demographics: string;
  psychographics: string;
  fears: string[];
  desires: string[];
  online_behavior: string;
  keywords: {
    google_high_intent: string[];
    meta_interests: string[];
    linkedin_titles: string[];
  };
  avatarUrl?: string;
}

export interface IntelligenceEngine {
  personas: Persona[];
  ad_angles: string[];
  platform_strategy: {
    primary: string;
    budget_split: Record<string, number>;
    notes: string;
  };
  content_pillars: string[];
  competitor_gap: string;
}

export interface Client {
  id: string;
  businessName: string;
  websiteUrl: string;
  industry: string;
  tier: Tier;
  status: 'onboarding' | 'scanning' | 'intelligence_ready' | 'campaigns_live';
  ownerId: string;
  healthScore: number;
  killSwitch: boolean;
  spendToday: number;
  leadsToday: number;
  activeCampaignsCount: number;
  maxMonthlyBudget: number;
  brand_kit?: BrandKit;
  bi_engine?: IntelligenceEngine;
  createdAt: string;
  // Module 3 B additions
  onboardingFeePaid?: boolean;
  retainerStatus?: 'active' | 'overdue' | 'pending';
  paymentProvider?: 'paypal' | 'paytm' | null;
  subscriptionId?: string;
  nextBillingDate?: string;
  // Module 14 additions
  agencyId?: string | null;
  domainHost?: string;
}

export interface Creative {
  id: string;
  clientId: string;
  type: 'text' | 'visual' | 'video';
  title: string;
  personaId?: string;
  adAngle?: string;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected';
  feedback?: string;
  scheduledDate?: string;
  content: {
    headlines?: string[];
    primaryTexts?: string[];
    descriptions?: string[];
    landingPageCopy?: string;
    imageUrls?: string[];
    videoScript?: {
      hook: string;
      body: string;
      cta: string;
    };
    voiceoverText?: string;
    storyboardFrames?: string[];
    captions?: string;
  };
  createdAt: string;
}

export interface Campaign {
  id: string;
  clientId: string;
  title: string;
  platform: 'Google' | 'Meta' | 'LinkedIn' | 'TikTok' | 'YouTube' | 'Pinterest';
  status: 'pending_approval' | 'approved' | 'draft' | 'live' | 'paused' | 'rejected';
  spend: number;
  dailyBudget: number;
  impressions: number;
  ctr: number;
  conversions: number;
  cpl: number;
  creativeIds: string[];
  targetAudience?: string;
  createdAt: string;
}

export interface Lead {
  id: string;
  clientId: string;
  name: string;
  email: string;
  phone?: string;
  score: number;
  personaMatch?: string;
  source: string;
  status: 'new' | 'qualified' | 'meeting' | 'won' | 'lost';
  value?: number;
  notes?: string;
  createdAt: string;
}

export interface ServiceLimit {
  enabled: boolean;
  limitText: string;
}

export interface ServiceMatrixItem {
  id: string;
  serviceName: string;
  description: string;
  limits: Record<Tier, ServiceLimit>;
}

export interface PromptItem {
  id: string;
  name: string;
  description: string;
  category: string;
  model: 'gemini-2.0-flash' | 'gemini-1.5-pro';
  promptText: string;
  version: string;
  updatedAt: string;
  history?: Array<{
    version: string;
    date: string;
    promptText: string;
  }>;
}

export interface BudgetSuggestion {
  id: string;
  campaignId: string;
  campaignName: string;
  platform: string;
  currentBudget: number;
  suggestedBudget: number;
  reason: string;
  actionType: 'increase' | 'decrease' | 'pause';
  applied: boolean;
}

export interface ReportData {
  id: string;
  clientId: string;
  weekEnding: string;
  summary: string;
  totalSpend: number;
  totalLeads: number;
  cpl: number;
  roas: number;
  topCampaign: string;
  nextWeekPlan: string[];
  generatedAt: string;
}

export interface InnovatorMetrics {
  totalClients: number;
  totalActiveSpendToday: number;
  totalLeadsToday: number;
  overallRoas: number;
  apiCostToday: number;
  pacingPercentageAverage: number;
}

// Module 20: Telemetry & EAG
export interface TelemetryEvent {
  id: string;
  clientId: string;
  timestamp: string;
  source: 'Google Ads' | 'Meta Webhook' | 'LinkedIn API' | 'CRM Event' | 'System Micro-Agent';
  eventType: 'conversion' | 'cpa_spike' | 'ctr_drop' | 'budget_threshold' | 'agent_action';
  metric: string;
  value: number;
  unit: string;
  latencyMs: number;
  details: string;
}

// Module 21: Autonomous Budget Rule & Audit
export interface AutonomousBudgetRule {
  id: string;
  clientId: string;
  platform: 'Google' | 'Meta' | 'LinkedIn' | 'All';
  metricTrigger: 'cpa' | 'ctr' | 'roas' | 'lead_velocity';
  thresholdOperator: '>' | '<' | '>=';
  thresholdValue: number;
  action: 'reallocate' | 'pause_adset' | 'increase_budget' | 'trigger_alert';
  actionParameter: number; // e.g. +15% or -30%
  enabled: boolean;
}

export interface AuditTrailRecord {
  id: string;
  clientId: string;
  timestamp: string;
  agentName: string;
  layerExecuted: string; // e.g. "L08_Autonomous_Agentic_Looping"
  chmPhase: string; // e.g. "AGENTIC_EXECUTION"
  actionSummary: string;
  decisionReasoning: string;
  payload: Record<string, any>;
  status: 'executed' | 'blocked_by_guardrail' | 'pending_approval';
}

// Module 22: GEO & Citation Engine
export interface GeoCitationMetric {
  id: string;
  clientId: string;
  query: string;
  engine: 'Perplexity' | 'Gemini Search' | 'ChatGPT Search' | 'Claude' | 'SearchGPT';
  cited: boolean;
  position: number;
  shareOfVoiceScore: number; // 0-100
  sentiment: 'positive' | 'neutral' | 'negative';
  snippetCited: string;
  sourceDomain: string;
  lastScanned: string;
}

// Module 23: Apps Script Generator
export interface AppsScriptConfig {
  id: string;
  clientId: string;
  name: string;
  type: 'sheets_sync' | 'slides_reporting' | 'drive_archiver' | 'gmail-[#00D26A]';
  scriptCode: string;
  triggerFrequency: 'hourly' | 'daily' | 'realtime_webhook';
  status: 'active' | 'paused';
}

// Module 24: Ephemeral Security Session
export interface EphemeralToken {
  id: string;
  clientId: string;
  clientName: string;
  token: string;
  roleScope: string;
  expiresAt: string;
  ipRestriction?: string;
  maskedFields: string[];
}

// Module 25: White Label Config
export interface WhiteLabelConfig {
  clientId: string;
  agencyName: string;
  customDomain: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  customCss?: string;
  supportEmail: string;
  enabled: boolean;
}

// Module 26: Cloudflare Edge & AI Optimization Pipeline
export interface EdgeOptimizationConfig {
  clientId: string;
  isrRevalidateSeconds: number;
  openNextAdapterActive: boolean;
  modelRouting: {
    lowLatencyModel: 'gemini-2.0-flash';
    analyticalModel: 'gemini-1.5-pro';
    semanticCacheHitRatio: number;
  };
  ragContextPruning: {
    enabled: boolean;
    maxContextTokens: number;
    relevanceThreshold: number;
  };
  assetDelivery: {
    cloudflareR2Active: boolean;
    formatConversion: 'WebP' | 'AVIF';
    asyncQueueStatus: 'healthy' | 'processing' | 'idle';
  };
  securityGovernance: {
    rateLimitPerMin: number;
    circuitBreakerTripped: boolean;
    subTenantHeaderScoping: boolean;
  };
}

// Module 3 B: Billing, Payments & Retainer Engine
export interface TierRate {
  onboardingFee: number;
  monthlyRetainer: number;
  currency: 'USD' | 'INR';
}

export type PricingTiersMap = Record<Tier, TierRate>;

export interface BillingTransaction {
  id: string;
  clientId: string;
  clientName: string;
  userId: string;
  provider: 'paypal' | 'paytm';
  type: 'onboarding' | 'monthly_retainer';
  amount: number;
  currency: 'USD' | 'INR';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentId: string;
  orderId?: string;
  createdAt: string;
}

export interface PaymentGatewayConfig {
  paypal: {
    enabled: boolean;
    mode: 'sandbox' | 'live';
    clientId: string;
    clientSecret: string;
  };
  paytm: {
    enabled: boolean;
    mode: 'staging' | 'production';
    mid: string;
    merchantKey: string;
    website: string;
    channelId: string;
  };
}

// Module 14: White-Label Agency & Custom Domain Sub-Tenancy Manager
export interface AgencyBranding {
  logoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  accentColor: string;
  companyName: string;
  supportEmail: string;
  customCss?: string;
}

export interface Agency {
  id: string;
  ownerId: string;
  agencyName: string;
  customDomain: string;
  domainVerificationStatus: 'pending' | 'verified' | 'failed';
  sslStatus: 'active' | 'pending' | 'error';
  branding: AgencyBranding;
  assignedClients: string[];
  status: 'active' | 'disabled';
  createdAt: string;
}

export interface DomainRegistry {
  domainName: string;
  agencyId: string;
  status: 'active' | 'disabled';
  createdAt: string;
}


