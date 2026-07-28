import { BrandKit, IntelligenceEngine, Campaign } from '../types';

export async function scanWebsite(websiteUrl: string): Promise<BrandKit> {
  const res = await fetch('/api/scan-website', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ websiteUrl })
  });

  if (!res.ok) {
    throw new Error('Failed to scan website');
  }

  const data = await res.json();
  return data.brand_kit;
}

export async function generateIntelligence(brandKit: BrandKit): Promise<IntelligenceEngine> {
  const res = await fetch('/api/generate-intelligence', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ brand_kit: brandKit })
  });

  if (!res.ok) {
    throw new Error('Failed to generate business intelligence');
  }

  const data = await res.json();
  return data.bi_engine;
}

export async function generateTextCreative(params: { personaName?: string; adAngle?: string; brandKit?: BrandKit }) {
  const res = await fetch('/api/generate-text-creative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    throw new Error('Failed to generate text creative');
  }

  const data = await res.json();
  return data.content;
}

export async function generateVisualCreative(params: { title: string; primaryColor?: string }) {
  const res = await fetch('/api/generate-visual-creative', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    throw new Error('Failed to generate visual creative');
  }

  const data = await res.json();
  return data.visuals;
}

export async function generateVideoScript(params: { adAngle?: string; personaName?: string }) {
  const res = await fetch('/api/generate-video-script', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    throw new Error('Failed to generate video script');
  }

  const data = await res.json();
  return data.video;
}

export async function optimizeBudget(campaigns: Campaign[]) {
  const res = await fetch('/api/optimize-budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ campaigns })
  });

  if (!res.ok) {
    throw new Error('Failed to optimize budget');
  }

  const data = await res.json();
  return data.suggestions;
}

export async function generateWeeklyReport(params: { clientName: string; spend: number; leads: number; cpl: number; roas: number }) {
  const res = await fetch('/api/generate-report', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    throw new Error('Failed to generate weekly report');
  }

  const data = await res.json();
  return data.report;
}
