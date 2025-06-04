import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { blobVariants } from '../motion';

  interface BlobProps { color: string;
  size: number;
    position: { x: string;
  y: string };

  delay?: number;
  blur?: number
}

  const Blob: React.FC<BlobProps> = ({ color, size, position, delay = 0, blur = 40 }) => {
  const randomDuration = useMemo(() => 15 + Math.random() * 10, []

  );
  return (
    <motion.div className="absolute pointer-events-none" style={{ left: position.x, top: position.y, width: size, height: size, filter: `blur(${blur}px)`, }} initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ duration: 2, delay }} ><motion.div className="w-full h-full" style={{
      background: color,borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',

        }} animate={{
      scale: [1,
      1.2,
      1],
      rotate: [0,
      180,
      360],borderRadius: [ '40% 60% 70% 30% / 40% 50% 60% 50%','60% 40% 30% 70% / 50% 60% 30% 60%','40% 60% 70% 30% / 40% 50% 60% 50%',
      ],

        }} transition={{
      duration: randomDuration,ease: 'linear',
      repeat: Infinity,

    }} />
  </motion.div>
  )
}

  interface AnimatedBlobsProps { count?: number;
  colors?: string[];
  className?: string
}

export const AnimatedBlobs: React.FC<AnimatedBlobsProps> = ({
  count = 3,colors = ['#8B5CF6','#3B82F6','#10B981'],className = '',

    }) => {
    const blobs = useMemo(() => {
      return Array.from({ length: count }, (_, i) => ({
        id: i,
        color: colors[i % colors.length],
        size: 200 + Math.random() * 300,
        position: {
          x: `${Math.random() * 80}%`,
          y: `${Math.random() * 80}%`,
        },
        delay: i * 0.2,
      }));
    }, [count, colors]);
  return (<div className={`absolute inset-0 overflow-hidden ${className}`}><div className="absolute inset-0" style={{ filter: 'blur(40px)' }}>
      {blobs.map((blob) => ( <Blob key={blob.id} {...blob} /> ))}
    </div>
      {
    /* Gooey effect */
    }<svg className="absolute inset-0 pointer-events-none">
  <defs><filter id="gooey"><feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" /><feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 20 -10" />
  </filter>
  </defs>
  </svg>
  </div>
  )
}
