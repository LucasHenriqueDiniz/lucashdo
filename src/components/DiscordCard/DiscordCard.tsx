'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Activity, Monitor, Smartphone, Globe } from 'lucide-react';

type DiscordStatus = 'online' | 'idle' | 'dnd' | 'offline';

type LanyardActivity = {
  application_id?: string;
  name: string;
  details?: string;
  state?: string;
  type: number;
  timestamps?: {
    start?: number;
    end?: number;
  };
  assets?: {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
  };
};

type LanyardData = {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    display_name: string | null;
    global_name: string | null;
  };
  discord_status: DiscordStatus;
  activities: LanyardActivity[];
  active_on_discord_desktop: boolean;
  active_on_discord_web: boolean;
  active_on_discord_mobile: boolean;
};

const STATUS_CONFIG = {
  online: { color: '#23a559', label: 'Online', banner: '#1e3a6e' },
  idle: { color: '#f0b232', label: 'Ausente', banner: '#2a1f10' },
  dnd: { color: '#f23f43', label: 'Não perturbe', banner: '#2a1010' },
  offline: { color: '#80848e', label: 'Offline', banner: '#111620' },
};

const PLATFORM_LABELS = {
  active_on_discord_desktop: 'desktop',
  active_on_discord_web: 'web',
  active_on_discord_mobile: 'mobile',
};

function resolveAsset(appId: string | undefined, assetKey: string | undefined): string {
  if (!assetKey) return '';
  
  if (assetKey.startsWith('mp:external/')) {
    const path = assetKey.replace('mp:external/', '');
    return `https://media.discordapp.net/external/${path}`;
  }
  
  if (assetKey.startsWith('mp:')) {
    return `https://media.discordapp.net/${assetKey.replace('mp:', '')}`;
  }
  
  if (appId) {
    return `https://cdn.discordapp.com/app-assets/${appId}/${assetKey}.png`;
  }
  
  return '';
}

function getElapsedTime(startMs: number): string {
  const secs = Math.floor((Date.now() - startMs) / 1000);
  const m = Math.floor(secs / 60);
  const h = Math.floor(m / 60);
  
  if (h > 0) return `há ${h}h ${m % 60}min`;
  if (m > 0) return `há ${m} min`;
  return 'há alguns segundos';
}

export default function DiscordCard() {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const userId = process.env.NEXT_PUBLIC_DISCORD_ID;

  useEffect(() => {
    if (!userId) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        const json = await res.json();
        
        if (json.success) {
          setData(json.data);
          setError(false);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className="w-full max-w-[340px] h-[420px] rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-900/20 backdrop-blur-xl flex items-center justify-center">
        <motion.div
          className="h-10 w-10 rounded-full border-3 border-[var(--primary)] border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-[340px] h-[420px] rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/40 to-slate-900/20 backdrop-blur-xl flex items-center justify-center p-6 text-center">
        <p className="text-sm text-slate-400">Discord status indisponível no momento</p>
      </div>
    );
  }

  const user = data.discord_user;
  const status = STATUS_CONFIG[data.discord_status] || STATUS_CONFIG.offline;
  const avatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=128`;
  const activity = data.activities.find(a => a.type === 0);
  
  const platforms = Object.entries(PLATFORM_LABELS)
    .filter(([key]) => data[key as keyof LanyardData])
    .map(([, value]) => value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-[340px] rounded-2xl border border-slate-800/50 bg-gradient-to-br from-slate-900/60 to-slate-900/40 backdrop-blur-xl overflow-hidden shadow-xl"
    >
      {/* Banner */}
      <motion.div 
        className="h-20 w-full relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div 
          className="absolute inset-0 transition-all duration-500"
          style={{ 
            background: `linear-gradient(135deg, ${status.banner}, ${status.banner}dd)` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/20" />
      </motion.div>

      {/* Avatar & Add Button */}
      <div className="px-5 -mt-14 flex items-center justify-between relative">
        <motion.div 
          className="relative mt-2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <div className="w-24 h-24 rounded-full border-4 border-slate-900/60 bg-slate-800 overflow-hidden shadow-xl">
            <img 
              src={avatarUrl} 
              alt={user.display_name || user.username}
              className="w-full h-full object-cover"
            />
          </div>
          <motion.div 
            className="absolute bottom-1 right-1 w-6 h-6 rounded-full border-4 border-slate-900/60 shadow-lg"
            style={{ background: status.color }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <motion.a
          href={`https://discord.com/users/${user.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-10 px-4 py-2.5 rounded-xl bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm font-semibold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-[#5865f2]/20"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <UserPlus className="w-4 h-4" />
          Adicionar
        </motion.a>
      </div>

      {/* User Info */}
      <div className="px-5 pt-4 pb-5">
        <motion.h3 
          className="text-xl font-bold text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {user.display_name || user.global_name || user.username}
        </motion.h3>
        <motion.p 
          className="text-sm text-slate-400 mt-0.5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          @{user.username}
        </motion.p>

        <div className="h-px bg-slate-700/50 my-4" />

        {/* Status */}
        <motion.div 
          className="mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</p>
          <div className="flex items-center gap-2.5">
            <div 
              className="w-3 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ 
                background: status.color,
                boxShadow: `0 0 12px ${status.color}80`
              }}
            />
            <span className="text-sm font-medium text-slate-200">{status.label}</span>
            {platforms.length > 0 && (
              <div className="ml-auto flex items-center gap-1.5">
                {platforms.map((platform) => {
                  const Icon = platform === 'desktop' ? Monitor : platform === 'mobile' ? Smartphone : Globe;
                  return (
                    <div
                      key={platform}
                      className="w-5 h-5 rounded-md bg-slate-800/60 border border-slate-700/50 flex items-center justify-center"
                      title={platform}
                    >
                      <Icon className="w-3 h-3 text-slate-400" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Activity */}
        {activity && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <div className="h-px bg-slate-700/50 mb-4" />
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5" />
                Atividade
              </p>
              <div className="flex gap-3.5">
                {activity.assets && (
                  <div className="relative w-14 h-14 flex-shrink-0">
                    {activity.assets.large_image && (
                      <img
                        src={resolveAsset(activity.application_id, activity.assets.large_image)}
                        alt={activity.assets.large_text || ''}
                        className="w-14 h-14 rounded-xl object-cover shadow-md"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                    {activity.assets.small_image && (
                      <img
                        src={resolveAsset(activity.application_id, activity.assets.small_image)}
                        alt={activity.assets.small_text || ''}
                        className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full border-3 border-slate-900/60 object-cover shadow-lg"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-200 truncate">{activity.name}</p>
                  {activity.details && (
                    <p className="text-xs text-slate-400 truncate mt-1">{activity.details}</p>
                  )}
                  {activity.state && (
                    <p className="text-xs text-slate-400 truncate">{activity.state}</p>
                  )}
                  {activity.timestamps?.start && (
                    <p className="text-xs text-slate-500 mt-1.5">
                      {getElapsedTime(activity.timestamps.start)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
