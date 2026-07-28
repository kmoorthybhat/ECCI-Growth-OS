import React, { useState } from 'react';
import {
  Cloud,
  Terminal,
  GitBranch,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Play,
  Cpu,
  Layers,
  FileCode,
  Globe,
  Settings,
  ShieldCheck,
  Server
} from 'lucide-react';

export const CloudflarePagesView: React.FC = () => {
  const [copiedWrangler, setCopiedWrangler] = useState(false);
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<any>(null);

  const wranglerTomlContent = `name = "ecci-growth-os"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "dist"

[vars]
NEXT_PUBLIC_APP_NAME = "ECCI Growth OS"
NEXT_PUBLIC_APP_ENV = "production"
NEXT_PUBLIC_FIREBASE_PROJECT_ID = "ai-studio-eccigrowthos"

# Edge Functions / Service Binding Configurations
[[kv_namespaces]]
binding = "CACHE_KV"
id = "<YOUR_CLOUDFLARE_KV_NAMESPACE_ID>"

[[kv_namespaces]]
binding = "SESSION_KV"
id = "<YOUR_SESSION_KV_NAMESPACE_ID>"

[env.preview]
name = "ecci-growth-os-preview"

[env.preview.vars]
NEXT_PUBLIC_APP_ENV = "preview"`;

  const githubWorkflowContent = `name: Deploy ECCI Growth OS to Cloudflare Pages

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: \${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: \${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: 'ecci-growth-os'
          directory: 'dist'
          gitHubToken: \${{ secrets.GITHUB_TOKEN }}`;

  const handleCopyWrangler = () => {
    navigator.clipboard.writeText(wranglerTomlContent);
    setCopiedWrangler(true);
    setTimeout(() => setCopiedWrangler(false), 2000);
  };

  const handleCopyWorkflow = () => {
    navigator.clipboard.writeText(githubWorkflowContent);
    setCopiedWorkflow(true);
    setTimeout(() => setCopiedWorkflow(false), 2000);
  };

  const handleTriggerDeploy = async () => {
    setIsDeploying(true);
    try {
      const res = await fetch('/api/cloudflare/deploy-trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setDeployResult(data);
    } catch (e) {
      console.error('Trigger deployment error:', e);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30">
                CLOUDFLARE PAGES SPEC
              </span>
              <span className="text-zinc-500 font-mono text-xs">Edge Runtime & Jamstack Deployment</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Cloud className="w-6 h-6 text-[#FF4D00]" />
              Cloudflare Pages & GitHub Actions CI/CD Manager
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-3xl">
              Production-ready deployment spec for ECCI Growth OS utilizing Next.js App Router on Cloudflare Pages with Edge KV bindings, Wrangler CLI setup, and automated GitHub CI/CD workflows.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleTriggerDeploy}
              disabled={isDeploying}
              className="px-4 py-2.5 rounded-xl bg-[#FF4D00] text-white font-bold text-xs hover:bg-[#FF4D00]/90 transition-all flex items-center space-x-2 shadow-lg shadow-[#FF4D00]/20 disabled:opacity-50 font-mono"
            >
              <Play className={`w-4 h-4 ${isDeploying ? 'animate-spin' : ''}`} />
              <span>{isDeploying ? 'TRIGGERING DEPLOYMENT...' : 'SIMULATE DEPLOY BUILD'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Build Settings Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <span className="text-zinc-500 text-[10px] uppercase">Framework Preset</span>
          <div className="text-white font-bold text-sm">Vite + React (Vite SPA)</div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <span className="text-zinc-500 text-[10px] uppercase">Build Command</span>
          <div className="text-[#00D26A] font-bold text-sm truncate">npm run build</div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <span className="text-zinc-500 text-[10px] uppercase">Output Directory</span>
          <div className="text-blue-400 font-bold text-sm truncate">dist</div>
        </div>

        <div className="bg-[#111111] border border-[#1F1F1F] p-4 rounded-xl space-y-1">
          <span className="text-zinc-500 text-[10px] uppercase">Node.js Engine</span>
          <div className="text-purple-400 font-bold text-sm">v20.10.0 (nodejs_compat)</div>
        </div>
      </div>

      {/* Deployment Execution Terminal Output */}
      {deployResult && (
        <div className="bg-black border border-[#00D26A]/30 rounded-2xl p-5 font-mono text-xs space-y-3 shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-3">
            <span className="text-[#00D26A] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> CLOUDFLARE PAGES DEPLOYMENT BUILD COMPLETED
            </span>
            <span className="text-zinc-500 text-[10px]">DEPLOYMENT ID: {deployResult.deploymentId}</span>
          </div>

          <div className="space-y-1 text-zinc-300">
            {deployResult.logs?.map((log: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="text-zinc-600">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-[#1F1F1F] flex items-center justify-between text-xs">
            <span className="text-zinc-400">Production URL:</span>
            <a
              href={deployResult.productionUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[#00D26A] font-bold hover:underline flex items-center gap-1"
            >
              <span>{deployResult.productionUrl}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Configuration File Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* wrangler.toml */}
        <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-5 space-y-3 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
            <span className="text-white font-bold text-xs flex items-center gap-2">
              <FileCode className="w-4 h-4 text-[#FF4D00]" />
              wrangler.toml (Root Config)
            </span>
            <button
              onClick={handleCopyWrangler}
              className="px-2.5 py-1 rounded bg-[#1F1F1F] text-zinc-300 hover:text-white text-[10px] font-bold flex items-center space-x-1"
            >
              {copiedWrangler ? <Check className="w-3.5 h-3.5 text-[#00D26A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWrangler ? 'COPIED' : 'COPY TOML'}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#0A0A0A] rounded-xl text-zinc-300 text-xs overflow-x-auto border border-[#1F1F1F]">
            <code>{wranglerTomlContent}</code>
          </pre>
        </div>

        {/* .github/workflows/deploy.yml */}
        <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-5 space-y-3 font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
            <span className="text-white font-bold text-xs flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-purple-400" />
              .github/workflows/deploy.yml
            </span>
            <button
              onClick={handleCopyWorkflow}
              className="px-2.5 py-1 rounded bg-[#1F1F1F] text-zinc-300 hover:text-white text-[10px] font-bold flex items-center space-x-1"
            >
              {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-[#00D26A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWorkflow ? 'COPIED' : 'COPY WORKFLOW'}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#0A0A0A] rounded-xl text-zinc-300 text-xs overflow-x-auto border border-[#1F1F1F]">
            <code>{githubWorkflowContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
