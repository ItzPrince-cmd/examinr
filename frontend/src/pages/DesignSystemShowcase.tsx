import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AnimatedBlobs } from '../design-system/components/AnimatedBlobs';
import { ParticleSystem } from '../design-system/components/ParticleSystem';

import {
  AnimatedIcon,
  SubjectMascot,
  LiquidProgress,
  AchievementBadge,
} from '../design-system/components/AnimatedIcons';
import { DelightfulButton } from '../design-system/components/DelightfulButton';
import { useDesignSystem } from '../design-system/theme-context';

import {
  fadeInVariants,
  staggerContainerVariants,
  staggerItemVariants,
} from '../design-system/motion';
import { Star, Heart, Zap, Trophy, Book, Sparkles } from 'lucide-react';

const DesignSystemShowcase: React.FC = () => {
  const { timePeriod, isTimeBasedEnabled, soundEnabled, toggleTimeBasedTheme, toggleSound } =
    useDesignSystem();
  const [celebrationTrigger, setCelebrationTrigger] = useState(false);
  const [progress, setProgress] = useState(65);
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBlobs count={5} className="z-0" />
      {/* Ambient Particles */}
      <ParticleSystem type="ambient" particleCount={15} />
      {/* Content */}
      <motion.div
        className="relative z-10 container mx-auto px-6 py-12"
        variants={staggerContainerVariants}
        initial="initial"
        animate="animate"
      >
        {/* Header */}
        <motion.div variants={fadeInVariants} className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {' '}
            Examinr Design System{' '}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {' '}
            Experience delightful interactions that adapt to your time of day{' '}
          </p>
          <p className="text-lg mt-2 font-special text-purple-600">
            {' '}
            Currently in {timePeriod} mode ✨{' '}
          </p>
        </motion.div>
        {/* Settings */}
        <motion.div variants={staggerItemVariants} className="flex justify-center gap-4 mb-12">
          <DelightfulButton onClick={toggleTimeBasedTheme} variant="secondary">
            {' '}
            Time-based Theme: {isTimeBasedEnabled ? 'ON' : 'OFF'}
          </DelightfulButton>
          <DelightfulButton onClick={toggleSound} variant="secondary">
            {' '}
            Sound Effects: {soundEnabled ? 'ON' : 'OFF'}
          </DelightfulButton>
        </motion.div>
        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Buttons Section */}
          <motion.div
            variants={staggerItemVariants}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-2xl font-semibold mb-4">Delightful Buttons</h3>
            <div className="space-y-4">
              <DelightfulButton variant="primary" icon={<Sparkles size={20} />}>
                {' '}
                Primary Action{' '}
              </DelightfulButton>
              <DelightfulButton variant="secondary" size="lg">
                {' '}
                Secondary Large{' '}
              </DelightfulButton>
              <DelightfulButton variant="success" glow>
                {' '}
                Success with Glow{' '}
              </DelightfulButton>
              <DelightfulButton variant="danger" size="sm">
                {' '}
                Danger Small{' '}
              </DelightfulButton>
              <DelightfulButton loading> Loading State </DelightfulButton>
            </div>
          </motion.div>
          {/* Animated Icons Section */}
          <motion.div
            variants={staggerItemVariants}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-2xl font-semibold mb-4">Animated Icons</h3>
            <div className="flex flex-wrap gap-4">
              <AnimatedIcon icon={Star} animationType="bounce" color="#F59E0B" />
              <AnimatedIcon icon={Heart} animationType="pulse" color="#EC4899" />
              <AnimatedIcon icon={Zap} animationType="rotate" color="#8B5CF6" />
              <AnimatedIcon icon={Trophy} animationType="float" color="#10B981" />
              <AnimatedIcon icon={Book} animationType="shake" color="#3B82F6" />
            </div>
          </motion.div>
          {/* Subject Mascots */}
          <motion.div
            variants={staggerItemVariants}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-2xl font-semibold mb-4">Subject Mascots</h3>
            <div className="flex flex-wrap gap-4">
              <SubjectMascot subject="math" mood="happy" />
              <SubjectMascot subject="science" mood="thinking" />
              <SubjectMascot subject="english" mood="celebrating" />
              <SubjectMascot subject="history" mood="happy" />
              <SubjectMascot subject="computer" mood="thinking" />
            </div>
          </motion.div>
          {/* Progress Indicators */}
          <motion.div
            variants={staggerItemVariants}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-2xl font-semibold mb-4">Liquid Progress</h3>
            <div className="flex items-center gap-4">
              <LiquidProgress progress={progress} color="#3B82F6" />
              <div className="space-y-2">
                <DelightfulButton
                  size="sm"
                  onClick={() => setProgress(Math.min(100, progress + 10))}
                >
                  {' '}
                  Increase{' '}
                </DelightfulButton>
                <DelightfulButton size="sm" onClick={() => setProgress(Math.max(0, progress - 10))}>
                  {' '}
                  Decrease{' '}
                </DelightfulButton>
              </div>
            </div>
          </motion.div>
          {/* Achievement Badges */}
          <motion.div
            variants={staggerItemVariants}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-2xl font-semibold mb-4">Achievement Badges</h3>
            <div className="flex flex-wrap gap-4">
              <AchievementBadge title="First Steps" icon="🎯" unlocked />
              <AchievementBadge title="Quiz Master" icon="🏆" unlocked />
              <AchievementBadge title="Perfect Score" icon="💯" />
              <AchievementBadge title="Study Streak" icon="🔥" />
            </div>
          </motion.div>
          {/* Celebration Demo */}
          <motion.div
            variants={staggerItemVariants}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6"
          >
            <h3 className="text-2xl font-semibold mb-4">Celebration Effects</h3>
            <DelightfulButton
              variant="success"
              onClick={() => setCelebrationTrigger(true)}
              icon={<Trophy size={20} />}
              glow
            >
              {' '}
              Trigger Celebration!{' '}
            </DelightfulButton>
            <p className="text-sm text-gray-600 mt-2">Click to see confetti animation</p>
          </motion.div>
        </div>
        {/* Interactive Particles */}
        <div className="fixed inset-0 pointer-events-none">
          <ParticleSystem type="interactive" followMouse />
        </div>
        {/* Celebration Effect */}{' '}
        {celebrationTrigger && (
          <ParticleSystem type="celebration" triggerAnimation={celebrationTrigger} />
        )}
      </motion.div>
    </div>
  );
};

export default DesignSystemShowcase;
