import React, { useState } from 'react';
import { Video, Play, Pause, Sparkles, Send, Volume2, Film, Loader2 } from 'lucide-react';
import { Client, Creative } from '../types';
import { generateVideoScript } from '../lib/gemini';

interface VideoStudioViewProps {
  client: Client;
  onSaveCreative: (creative: Creative) => void;
}

export const VideoStudioView: React.FC<VideoStudioViewProps> = ({ client, onSaveCreative }) => {
  const adAngles = client.bi_engine?.ad_angles || [];
  const [selectedAngle, setSelectedAngle] = useState(adAngles[0] || 'Upgrade Your Focus with Nitro Cold Brew');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoData, setVideoData] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    try {
      const res = await generateVideoScript({
        adAngle: selectedAngle,
        personaName: 'Biohacking Tech Founder'
      });
      setVideoData(res);
    } catch (err) {
      console.error('Failed to generate video script:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveAndSubmit = () => {
    if (!videoData) return;

    const newCreative: Creative = {
      id: `cr_vid_${Date.now()}`,
      clientId: client.id,
      type: 'video',
      title: `Short Video Script - ${selectedAngle.substring(0, 25)}...`,
      adAngle: selectedAngle,
      status: 'pending_approval',
      content: {
        videoScript: videoData.videoScript,
        voiceoverText: videoData.voiceoverText,
        storyboardFrames: videoData.storyboardFrames,
        captions: videoData.captions
      },
      createdAt: new Date().toISOString()
    };

    onSaveCreative(newCreative);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF4D00]/20 text-[#FF4D00] border border-[#FF4D00]/30 inline-flex items-center">
            <Video className="w-3 h-3 mr-1" />
            MODULE 9: AI VIDEO PRODUCTION MODULE [LITE]
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white font-mono mt-2">
            Short-Form Reels & TikTok <span className="text-[#FF4D00]">Script Generator</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-xl">
            Generates high-energy 30s video scripts, voiceover narration text, 3 storyboard frames, and trending caption overlays.
          </p>
        </div>

        <button
          onClick={handleGenerateScript}
          disabled={isGenerating}
          className="bg-[#FF4D00] hover:bg-[#E64500] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#FF4D00]/25 flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 fill-current" />}
          <span>{isGenerating ? 'Synthesizing Video Script...' : 'Generate Video Script'}</span>
        </button>
      </div>

      <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
        <label className="block text-xs font-semibold text-zinc-400">Select Core Ad Angle</label>
        <select
          value={selectedAngle}
          onChange={(e) => setSelectedAngle(e.target.value)}
          className="w-full bg-[#0A0A0A] border border-[#1F1F1F] text-white text-xs rounded-xl p-3 focus:outline-none focus:border-[#FF4D00]"
        >
          {adAngles.map((angle, i) => (
            <option key={i} value={angle}>{angle}</option>
          ))}
          {adAngles.length === 0 && <option value="Upgrade Your Focus">Upgrade Your Focus</option>}
        </select>
      </div>

      {videoData && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <button
              onClick={handleSaveAndSubmit}
              className="bg-[#00D26A] hover:bg-[#00D26A]/90 text-black px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-[#00D26A]/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>SUBMIT VIDEO SCRIPT TO MODULE 5</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Player Preview Card */}
            <div className="bg-[#111111] border border-[#1F1F1F] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center mb-3">
                  <Film className="w-4 h-4 mr-2 text-[#FF4D00]" />
                  9:16 Reels Video Preview Player
                </h3>

                <div className="relative w-full h-80 bg-[#0A0A0A] rounded-xl border border-[#1F1F1F] overflow-hidden flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80"
                    alt="Video Thumbnail"
                    className="w-full h-full object-cover opacity-60"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40 p-4 flex flex-col justify-between">
                    <span className="bg-[#FF4D00] text-white text-[9px] font-bold px-2 py-0.5 rounded w-fit uppercase font-mono">
                      REELS PREVIEW (30s)
                    </span>

                    <div className="space-y-2">
                      <p className="text-white text-xs font-bold bg-black/60 p-2 rounded-lg backdrop-blur border border-white/10 text-center">
                        "{videoData.captions}"
                      </p>

                      <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-12 h-12 rounded-full bg-[#FF4D00] text-white flex items-center justify-center mx-auto shadow-xl hover:scale-110 transition-transform"
                      >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0A0A0A] p-3 rounded-xl border border-[#1F1F1F] text-xs space-y-1">
                <span className="text-zinc-500 font-mono text-[10px] uppercase flex items-center">
                  <Volume2 className="w-3 h-3 mr-1 text-[#00D26A]" /> Voiceover Audio Script
                </span>
                <p className="text-zinc-300 italic">{videoData.voiceoverText}</p>
              </div>
            </div>

            {/* Script Breakdown & Storyboard */}
            <div className="lg:col-span-2 space-y-4">
              {/* Hook, Body, CTA */}
              <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-4">
                <h3 className="text-sm font-bold text-white font-mono">Video Timeline Breakdown</h3>

                <div className="space-y-3 text-xs">
                  <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl space-y-1">
                    <span className="text-[#FF4D00] font-bold font-mono text-[10px] uppercase">Hook (0-3 Seconds)</span>
                    <p className="text-white font-medium">{videoData.videoScript?.hook}</p>
                  </div>

                  <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl space-y-1">
                    <span className="text-[#00D26A] font-bold font-mono text-[10px] uppercase">Core Offer Pitch (3-22 Seconds)</span>
                    <p className="text-zinc-300">{videoData.videoScript?.body}</p>
                  </div>

                  <div className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl space-y-1">
                    <span className="text-cyan-400 font-bold font-mono text-[10px] uppercase">Call To Action (22-30 Seconds)</span>
                    <p className="text-white font-bold">{videoData.videoScript?.cta}</p>
                  </div>
                </div>
              </div>

              {/* Storyboard Frames */}
              <div className="bg-[#111111] border border-[#1F1F1F] p-6 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-white font-mono">3 Storyboard Frame Scene Concepts</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {videoData.storyboardFrames?.map((frame: string, idx: number) => (
                    <div key={idx} className="bg-[#0A0A0A] border border-[#1F1F1F] p-3 rounded-xl text-xs space-y-2">
                      <span className="text-zinc-500 font-mono text-[10px] font-bold uppercase block">
                        Scene #{idx + 1} Frame
                      </span>
                      <p className="text-zinc-300 leading-relaxed">{frame}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
