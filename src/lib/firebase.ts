import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Client, Campaign, Creative, Lead, ServiceMatrixItem, PromptItem, UserProfile } from '../types';

// Initialize Firebase App
const app = getApps().length > 0 ? getApp() : initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId,
});

// Initialize Firestore targeting the specific databaseId if defined
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (err) {
    console.error('Google Sign-In Error:', err);
    throw err;
  }
}

export async function signOutUser() {
  await firebaseSignOut(auth);
}

// Seed Initial Data Helper
export async function seedInitialDataIfEmpty() {
  try {
    const clientSnap = await getDocs(collection(db, 'clients'));
    if (!clientSnap.empty) {
      return; // Already populated
    }

    console.log('Seeding initial ECCI Growth OS client data...');

    // Sample Client 1: Energize Cult Cafe Inc
    const sampleClient1: Client = {
      id: 'client_ecc_cafe',
      businessName: 'Energize Cult Cafe Inc',
      websiteUrl: 'https://energizecultcafe.com',
      industry: 'Food & Beverage / Specialty Coffee',
      tier: 'Enterprise',
      status: 'campaigns_live',
      ownerId: 'kmoorthy.bhat@gmail.com',
      healthScore: 96,
      killSwitch: false,
      spendToday: 485.50,
      leadsToday: 18,
      activeCampaignsCount: 4,
      maxMonthlyBudget: 15000,
      createdAt: new Date().toISOString(),
      brand_kit: {
        business_summary: 'Premium artisan cult cafe and high-vibe wellness social space serving ceremonial organic matcha, cold brew elixir blends, and gourmet sourdough toasts.',
        core_offer: 'Energize Subscription Pass: Unlimited Cold Brew & Matcha + 20% off all event tickets for $49/mo.',
        usps: [
          'Organic Ceremonial Grade Direct-Trade Matcha',
          'Bio-Optimized Nitro Elixir Brews with Functional Mushrooms',
          'Vibrant Creator & Tech Community Hub with Ultra-Fast Fiber Wi-Fi'
        ],
        target_audience: 'Gen-Z and Millennial founders, creators, tech professionals, and biohackers aged 21-42.',
        colors: ['#FF4D00', '#111111', '#00D26A'],
        tone: 'Energetic, High-Vibe, Bold, Aspirational, Modern',
        industry: 'Hospitality / Cafe & Lifestyle Hub'
      },
      bi_engine: {
        personas: [
          {
            id: 'p1',
            name: 'Biohacking Tech Founder Alex',
            role: 'Startup Founder & Engineer',
            demographics: 'Male / Female, Age 26-38, Income $120k+',
            psychographics: 'Loves high-productivity caffeine routines, biohacking, longevity, clean fuel, networking with ambitious peers.',
            fears: ['Mid-day sugar crashes', 'Low energy meetings', 'Generic crowded noise cafes'],
            desires: ['Clean sustained focus', 'Exclusive aesthetic community spot', 'VIP lounge access'],
            online_behavior: 'Active on Twitter/X, LinkedIn, listens to Huberman Lab, frequents tech meetups.',
            keywords: {
              google_high_intent: ['best organic cold brew near me', 'high speed wifi cafe downtown', 'matcha espresso bar'],
              meta_interests: ['Biohacking', 'Specialty Coffee', 'Y Combinator', 'Mindfulness'],
              linkedin_titles: ['Founder', 'CTO', 'Senior Software Engineer', 'Product Lead']
            },
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
          },
          {
            id: 'p2',
            name: 'Creator & Aesthetic Enthusiast Maya',
            role: 'Digital Nomad & Content Creator',
            demographics: 'Female, Age 22-34, Income $75k+',
            psychographics: 'Seeks visually stunning coffee art, Instagrammable interiors, uplifting community events, vegan oat milk matcha lattes.',
            fears: ['Boring sterile office spaces', 'Bad lighting for video calls', 'Low quality coffee beans'],
            desires: ['Inspiring aesthetic space', 'Trendy wellness drinks', 'Networking with influencers'],
            online_behavior: 'Instagram Reels, TikTok, Pinterest, YouTube lifestyle vlogs.',
            keywords: {
              google_high_intent: ['aesthetic matcha bar', 'dog friendly outdoor cafe', 'artisan bakery lounge'],
              meta_interests: ['Matcha', 'Aesthetic Interiors', 'Content Creation', 'Wellness Routine'],
              linkedin_titles: ['Creative Director', 'Brand Strategist', 'Influencer', 'UX Designer']
            },
            avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
          },
          {
            id: 'p3',
            name: 'Corporate Executive Bio-Optimizer David',
            role: 'VP of Growth & Strategy',
            demographics: 'Male, Age 35-50, Income $200k+',
            psychographics: 'Values premium quality, frictionless mobile ordering, seamless high-level 1-on-1 coffee meetings.',
            fears: ['Wasted time in long lines', 'Subpar coffee quality', 'Noisy chaotic seating'],
            desires: ['Reserved VIP meeting booth', 'Subscription speed lane', 'Consistently excellent roast'],
            online_behavior: 'LinkedIn, Wall Street Journal, Bloomberg, Forbes, Apple Podcasts.',
            keywords: {
              google_high_intent: ['executive coffee meeting spot', 'corporate coffee subscription', 'artisanal catering'],
              meta_interests: ['Venture Capital', 'Executive Leadership', 'Financial Times'],
              linkedin_titles: ['Managing Director', 'VP of Sales', 'Partner', 'Chief Executive Officer']
            },
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
          }
        ],
        ad_angles: [
          'Fuel Your Next Big Breakthrough: Clean Nitro Cold Brew with 0% Sugar Crash.',
          'The Unofficial HQ for Tech Founders & Aesthetic Creators in Town.',
          'Upgrade Your Morning Ritual: Ceremonial Grade Kyoto Matcha Nitro on Tap.',
          'Unlimited Specialty Brews for $49/mo — Your Daily Productivity Sanctuary.',
          'Skip the Line, Elevate the Vibe: The Energize VIP Cafe Pass is Here.'
        ],
        platform_strategy: {
          primary: 'Meta (Instagram Reels/Stories) + Google Search for Local Intent',
          budget_split: { Google: 35, Meta: 45, LinkedIn: 20 },
          notes: 'Meta drives emotional aesthetic impulse & subscription signups; Google Search captures high-intent local cafe searches.'
        },
        content_pillars: [
          'Behind the Beans & Sourcing Bio-Hacks',
          'Creator Spotlights & Founder Coffee Chats',
          'Specialty Recipe Guides (Matcha & Nitro Blends)',
          'Local Community VIP Events & Workshops'
        ],
        competitor_gap: 'Competitors offer standard commercial coffee with slow Wi-Fi. ECCI offers a high-vibe bio-optimized hub with custom subscription passes and founder networking.'
      }
    };

    // Sample Client 2: TechSphere AI SaaS
    const sampleClient2: Client = {
      id: 'client_techsphere',
      businessName: 'TechSphere AI SaaS',
      websiteUrl: 'https://techsphere.ai',
      industry: 'B2B Software / Enterprise AI',
      tier: 'Scale',
      status: 'campaigns_live',
      ownerId: 'sarah.tech@techsphere.ai',
      healthScore: 92,
      killSwitch: false,
      spendToday: 820.00,
      leadsToday: 24,
      activeCampaignsCount: 3,
      maxMonthlyBudget: 25000,
      createdAt: new Date().toISOString(),
      brand_kit: {
        business_summary: 'Autonomous AI workflow automation platform for B2B revenue teams.',
        core_offer: '14-Day Free Enterprise Trial + Free Workflow Audit',
        usps: ['Zero-code setup in 5 minutes', 'Native CRM & Slack sync', '99.4% accuracy guarantee'],
        target_audience: 'VP of Operations, CMOs, CTOs, Head of Sales at mid-market tech companies.',
        colors: ['#0066FF', '#111111', '#00D26A'],
        tone: 'Authoritative, Futuristic, Data-Driven, Efficient',
        industry: 'B2B Software'
      }
    };

    await setDoc(doc(db, 'clients', sampleClient1.id), sampleClient1);
    await setDoc(doc(db, 'clients', sampleClient2.id), sampleClient2);

    // Seed Sample Campaigns for ECCI
    const sampleCampaigns: Campaign[] = [
      {
        id: 'camp_ecci_meta_matcha',
        clientId: 'client_ecc_cafe',
        title: 'Meta - Ceremonial Matcha VIP Pass Lead Gen',
        platform: 'Meta',
        status: 'live',
        spend: 1840.00,
        dailyBudget: 150.00,
        impressions: 48200,
        ctr: 2.84,
        conversions: 86,
        cpl: 21.39,
        creativeIds: ['cr_1'],
        targetAudience: 'Biohackers, Creators, Tech Founders in 15mi radius',
        createdAt: new Date().toISOString()
      },
      {
        id: 'camp_ecci_google_search',
        clientId: 'client_ecc_cafe',
        title: 'Google - High Intent Cafe & WiFi Workspace Search',
        platform: 'Google',
        status: 'live',
        spend: 1420.50,
        dailyBudget: 120.00,
        impressions: 19400,
        ctr: 4.12,
        conversions: 64,
        cpl: 22.19,
        creativeIds: ['cr_2'],
        targetAudience: 'Search: best coffee with wifi, matcha bar near me',
        createdAt: new Date().toISOString()
      },
      {
        id: 'camp_ecci_linkedin_founders',
        clientId: 'client_ecc_cafe',
        title: 'LinkedIn - Founder Coffee & Workspace Pass',
        platform: 'LinkedIn',
        status: 'live',
        spend: 980.00,
        dailyBudget: 80.00,
        impressions: 11200,
        ctr: 1.95,
        conversions: 28,
        cpl: 35.00,
        creativeIds: ['cr_3'],
        targetAudience: 'Job Titles: Founder, CEO, VP Strategy in metro area',
        createdAt: new Date().toISOString()
      },
      {
        id: 'camp_ecci_tiktok_nitro',
        clientId: 'client_ecc_cafe',
        title: 'TikTok - Aesthetic Cold Brew & Viral Toast Drops',
        platform: 'TikTok',
        status: 'pending_approval',
        spend: 0,
        dailyBudget: 50.00,
        impressions: 0,
        ctr: 0,
        conversions: 0,
        cpl: 0,
        creativeIds: ['cr_4'],
        targetAudience: 'Gen-Z Foodies & Coffee Enthusiasts',
        createdAt: new Date().toISOString()
      }
    ];

    for (const c of sampleCampaigns) {
      await setDoc(doc(db, 'campaigns', c.id), c);
    }

    // Seed Sample Leads for ECCI
    const sampleLeads: Lead[] = [
      {
        id: 'lead_1',
        clientId: 'client_ecc_cafe',
        name: 'Marcus Vance',
        email: 'marcus.vance@apexcap.io',
        phone: '+1 (555) 234-8901',
        score: 94,
        personaMatch: 'Biohacking Tech Founder Alex',
        source: 'Google Search Ad - WiFi Cafe',
        status: 'qualified',
        value: 588,
        notes: 'Interested in $49/mo Unlimited Pass + reserving executive booth for 4 team members.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'lead_2',
        clientId: 'client_ecc_cafe',
        name: 'Elena Rostova',
        email: 'elena@vibehouse.media',
        phone: '+1 (555) 891-3421',
        score: 88,
        personaMatch: 'Creator & Aesthetic Enthusiast Maya',
        source: 'Instagram Reel Ad - Ceremonial Matcha',
        status: 'new',
        value: 294,
        notes: 'Requested creator collaboration and hosting monthly podcast recording session.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'lead_3',
        clientId: 'client_ecc_cafe',
        name: 'David Sterling',
        email: 'dsterling@horizonventures.com',
        phone: '+1 (555) 452-9900',
        score: 96,
        personaMatch: 'Corporate Executive Bio-Optimizer David',
        source: 'LinkedIn Founder Campaign',
        status: 'meeting',
        value: 2400,
        notes: 'Inquired about corporate catering for 50 person founder roundtable event next Thursday.',
        createdAt: new Date().toISOString()
      },
      {
        id: 'lead_4',
        clientId: 'client_ecc_cafe',
        name: 'Samantha Li',
        email: 'sam@growthlabs.co',
        phone: '+1 (555) 112-7844',
        score: 91,
        personaMatch: 'Biohacking Tech Founder Alex',
        source: 'Meta VIP Pass Ad',
        status: 'won',
        value: 1176,
        notes: 'Purchased 2x Annual Energize Passes ($588/yr each).',
        createdAt: new Date().toISOString()
      }
    ];

    for (const l of sampleLeads) {
      await setDoc(doc(db, 'leads', l.id), l);
    }

    // Seed Prompts Library
    const samplePrompts: PromptItem[] = [
      {
        id: 'prompt_persona_generator',
        name: 'Business Intelligence & Persona Engine Prompt',
        description: 'Analyzes brand kit and website structure to produce 3 ultra-targeted ICP buyer personas with keywords, ad angles, and platform strategy.',
        category: 'Intelligence',
        model: 'gemini-1.5-pro',
        version: 'v2.4',
        updatedAt: new Date().toISOString(),
        promptText: `You are the Lead Growth Architect for Energize Cult Cafe Inc. Given a Client Brand Kit, perform deep market research and return a structured JSON with:
1. 3 Highly Detailed Customer Personas (demographics, psychographics, fears, desires, online behavior, keywords).
2. 5 High-Converting Viral Ad Angles.
3. Platform Budget Split & Media Strategy.
4. 4 Content Pillars.
5. Competitor Gap Analysis.`
      },
      {
        id: 'prompt_ad_copy',
        name: 'High-ROAS Multi-Platform Ad Copy Generator',
        description: 'Generates 5 headlines, primary texts, and descriptions tailored specifically for Google, Meta, and LinkedIn ad formats.',
        category: 'Creative Studio',
        model: 'gemini-2.0-flash',
        version: 'v1.8',
        updatedAt: new Date().toISOString(),
        promptText: `Act as a Direct Response Copywriter. Given persona and brand angle:
Generate 5 headlines (under 40 chars), 5 primary texts (hook + story + offer + call-to-action), and 5 descriptions for Meta, Google Ads, and LinkedIn.`
      },
      {
        id: 'prompt_video_script',
        name: 'Short-Form Video Script & Storyboard Generator',
        description: 'Produces a viral 30-second TikTok/Reels script with hook, body, CTA, voiceover audio text, and 3 storyboard frame concepts.',
        category: 'Creative Studio',
        model: 'gemini-2.0-flash',
        version: 'v1.5',
        updatedAt: new Date().toISOString(),
        promptText: `Create a high-energy short form video ad script (30s) including Hook (0-3s), Core Pitch (3-20s), and Strong CTA (20-30s) along with voiceover script and 3 visual frame descriptions.`
      }
    ];

    for (const p of samplePrompts) {
      await setDoc(doc(db, 'prompts', p.id), p);
    }

    console.log('ECCI Growth OS initial data successfully seeded!');
  } catch (err) {
    console.error('Error seeding initial Firestore data:', err);
  }
}
