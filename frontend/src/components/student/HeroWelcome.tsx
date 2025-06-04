import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

import {
  Cloud,
  CloudRain,
  Sun,
  Moon,
  Sunrise,
  Sunset,
  CloudSnow,
  Wind
} from 'lucide-react';
import { useDesignSystem } from '../../design-system/theme-context';
import { ParticleSystem } from '../../design-system/components/ParticleSystem';

interface WeatherData {
  temp: number; condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy' | 'windy';
  description: string;
  studySuggestion: string
}

interface HeroWelcomeProps {
  userName: string;
  streak: number
}

const HeroWelcome: React.FC<HeroWelcomeProps> = ({ userName, streak }) => {
  const { timePeriod, palette } = useDesignSystem();
  const colors = palette;
  const { scrollY } = useScroll();
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22, condition: 'sunny', description: 'Clear skies', studySuggestion: 'Perfect weather for focused learning!'
  });
  // Parallax transforms
  const cloud1Y = useTransform(scrollY, [0, 300], [0, -50]);
  const cloud2Y = useTransform(scrollY, [0, 300], [0, -30]);
  const cloud3Y = useTransform(scrollY, [0, 300], [0, -70]
  );
  const heroOpacity = useTransform(scrollY, [0, 200], [1, 0.3]);

  // Get personalized greeting
  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const isWeekend = day === 0 || day === 6; if (hour >= 5 && hour < 12) { return { primary: `Rise and shine, ${userName}!`, secondary: streak > 7 ? "Your dedication is inspiring! Ready to conquer today's challenges?" : "Ready to conquer today's challenges?", icon: Sunrise } } else if (hour >= 12 && hour < 17) {
      return { primary: `Welcome back, ${userName}!`, secondary: isWeekend ? "Weekend warrior mode activated! Let's keep the momentum going!" : "Let's keep the momentum going!", icon: Sun }
    } else if (hour >= 17 && hour < 22) { return { primary: `Good evening, ${userName}!`, secondary: streak > 0 ? `${streak} days strong! Perfect time for focused learning` : "Perfect time for focused learning", icon: Sunset } } else {
      return { primary: `Burning the midnight oil, ${userName}?`, secondary: hour < 3 ? "Night owl mode activated! Let's make it count!" : "Early bird gets the worm! Let's make today count!", icon: Moon }
    }
  }

  // Weather icon component
  const WeatherIcon = () => {
    const iconProps = { className: "h-12 w-12" };
    const weatherIcons = { sunny: <Sun {...iconProps} className="h-12 w-12 text-yellow-400 animate-pulse" />, cloudy: <Cloud {...iconProps} className="h-12 w-12 text-gray-400" />, rainy: <CloudRain {...iconProps} className="h-12 w-12 text-blue-400" />, snowy: <CloudSnow {...iconProps} className="h-12 w-12 text-blue-200" />, windy: <Wind {...iconProps} className="h-12 w-12 text-gray-500 animate-spin-slow" /> };

    return (
      <motion.div animate={{
        y: weather.condition === 'rainy' ? [0,
          5,
          0] : [0,
          -5,
          0], rotate: weather.condition === 'windy' ? [0,
            10,
            -10,
            0] : 0
      }} transition={{
        duration: weather.condition === 'windy' ? 2 : 3,
        repeat: Infinity, ease: "easeInOut"
      }} >
        {weatherIcons[weather.condition]}
      </motion.div>
    )
  }

  // Floating shapes
  const FloatingShape = ({ delay, duration, size, color, position }: any) => (<motion.div className={`absolute ${size} ${color} rounded-full opacity-20 blur-xl`} style={position} animate={{
    x: [0,
      30,
      -20,
      0],
    y: [0,
      -40,
      20,
      0],
    scale: [1,
      1.2,
      0.9,
      1],

  }} transition={{
    duration,
    delay,
    repeat: Infinity, ease: "easeInOut"
  }} />
  );
  const greeting = getPersonalizedGreeting();

  const GreetingIcon = greeting.icon;

  // Simulate weather changes
  useEffect(() => {
    const weatherConditions: WeatherData[] = [{
      temp: 25, condition: 'sunny', description: 'Clear skies', studySuggestion: 'Perfect weather for focused learning!'
    }, {
      temp: 20, condition: 'cloudy', description: 'Partly cloudy', studySuggestion: 'Cozy weather for deep study sessions!'
    }, {
      temp: 18, condition: 'rainy', description: 'Light rain', studySuggestion: 'Rainy day = perfect for practice!'
    }, {
      temp: 22, condition: 'windy', description: 'Breezy', studySuggestion: 'Fresh air, fresh mind for learning!'
    }];
    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    setWeather(randomWeather);
  }, []);
  return (<motion.div className="relative h-[400px] overflow-hidden rounded-3xl" style={{ opacity: heroOpacity }} >
    {
      /* Dynamic gradient background */
    }<div className="absolute inset-0 transition-all duration-1000" style={{ background: `linear-gradient(135deg, ${colors.primary.solid} 0%, ${colors.primary.dark} 50%, ${colors.accent.primary} 100%)`, }} />
    {
      /* Animated clouds */
    }<motion.div className="absolute top-10 left-20 w-32 h-20 bg-white/20 rounded-full blur-2xl" style={{ y: cloud1Y }} animate={{ x: [0, 20, 0] }} transition={{ duration: 20, repeat: Infinity }} /><motion.div className="absolute top-20 right-40 w-40 h-24 bg-white/15 rounded-full blur-3xl" style={{ y: cloud2Y }} animate={{ x: [0, -30, 0] }} transition={{ duration: 25, repeat: Infinity }} /><motion.div className="absolute bottom-20 left-1/3 w-48 h-28 bg-white/10 rounded-full blur-3xl" style={{ y: cloud3Y }} animate={{ x: [0, 40, 0] }} transition={{ duration: 30, repeat: Infinity }} />
    {
    /* Floating geometric shapes */}<FloatingShape delay={0} duration={15} size="w-20 h-20" color="bg-white" position={{ top: '20%', right: '10%' }} /><FloatingShape delay={5} duration={20} size="w-16 h-16" color="bg-yellow-300" position={{ bottom: '30%', left: '15%' }} /><FloatingShape delay={10} duration={18} size="w-24 h-24" color="bg-blue-300" position={{ top: '50%', right: '30%' }} />
    {/* Particle effects for special occasions */} {streak > 30 && (<ParticleSystem type="ambient" particleCount={30} colors={['#FFD700', '#FFA500', '#FF6347']} emojis={['✨', '🌟', '⭐']} />)} {
      /* Content */
    }<div className="relative z-10 h-full flex items-center justify-center p-6 md:p-8 lg:p-12"><div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8"><motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }} className="flex-1 max-w-2xl text-center lg:text-left" ><motion.div className="flex items-center justify-center lg:justify-start gap-3 mb-4" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} ><GreetingIcon className="h-8 w-8 text-white/80" /><h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg">
      {greeting.primary}
    </h1>
    </motion.div><p className="text-lg md:text-xl text-white/90 mb-6 drop-shadow">
        {greeting.secondary}
      </p>
      {
    /* Streak celebration */} {streak > 0 && (<div className="flex justify-center lg:justify-start"><motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.5 }} className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2" ><span className="text-2xl">🔥</span><span className="text-white font-semibold">
        {streak} day streak!</span>{streak % 7 === 0 && <span className="text-yellow-300">Weekly milestone! 🎉</span>}
      </motion.div>
      </div>)}
    </motion.div>
      {
        /* Weather widget */
      }<motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.5 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 min-w-[250px] flex-shrink-0" ><div className="flex items-center gap-4 mb-3">
        <WeatherIcon />
        <div><div className="text-3xl font-bold text-white">
          {weather.temp}°C</div><div className="text-sm text-white/80">
            {weather.description}
          </div>
        </div>
      </div><motion.div className="text-sm text-white/90 bg-white/10 rounded-lg p-3" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} > 💡 {weather.studySuggestion}
        </motion.div>
      </motion.div>
    </div>
    </div>
    {/* Rain effect for rainy weather */} {weather.condition === 'rainy' && (<div className="absolute inset-0 pointer-events-none">{[...Array(20)].map((_, i) => (<motion.div key={i} className="absolute w-0.5 h-8 bg-blue-200/30" style={{ left: `${Math.random() * 100}%` }} animate={{
      y: [-20,
      window.innerHeight + 20],
      opacity: [0,
        1,
        0]
    }} transition={{
      duration: Math.random() * 2 + 1,
      repeat: Infinity,
      delay: Math.random() * 2, ease: "linear"
    }} />))}
    </div>)}
  </motion.div>
  )
}

export default HeroWelcome;
