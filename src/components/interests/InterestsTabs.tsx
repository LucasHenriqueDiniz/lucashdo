'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import LyftaProfile from '@/components/fitness/LyftaProfile';
import SteamProfile from '@/components/gaming/SteamProfile';
import { LastFmProfile, LastFmStats, LastFmTopArtists } from '@/components/lastfm';

export default function InterestsTabs() {
  const interestTabs = [
    {
      id: 'music',
      label: 'Música',
      icon: <span className="material-icons">music_note</span>,
    },
    {
      id: 'fitness',
      label: 'Fitness',
      icon: <span className="material-icons">fitness_center</span>,
    },
    {
      id: 'gaming',
      label: 'Gaming',
      icon: <span className="material-icons">videogame_asset</span>,
    },
  ];

  const [activeTab, setActiveTab] = useState('music');

  return (
    <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-6">
      {/* Tabs */}
      <div className="flex overflow-x-auto mb-6 gap-1 pb-1">
        {interestTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-white shadow-md'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activePill"
                className="absolute inset-0 bg-primary rounded-lg -z-10"
                transition={{ type: 'spring', duration: 0.5 }}
              />
            )}
          </button>
        ))}
      </div>
      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'music' && (
            <div className="space-y-8">
              <LastFmProfile username="Amayacrab" />
              <hr className="border-t border-gray-200 dark:border-gray-700 my-8" />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <LastFmTopArtists username="Amayacrab" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-4">Estatísticas</h3>
                  <LastFmStats username="Amayacrab" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'fitness' && (
            <div className="py-4">
              <LyftaProfile />
            </div>
          )}

          {activeTab === 'gaming' && (
            <div className="py-4">
              <SteamProfile />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
