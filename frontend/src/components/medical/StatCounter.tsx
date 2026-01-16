import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface StatCounterProps {
  end: number;
  duration?: number;
  label: string;
  suffix?: string;
  prefix?: string;
}

const StatCounter = ({ end, duration = 2, label, suffix = '', prefix = '' }: StatCounterProps) => {
  const [count, setCount] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onViewportEnter={() => setIsInView(true)}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
        {prefix}{count}{suffix}
      </div>
      <div className="text-gray-600 font-medium">{label}</div>
    </motion.div>
  );
};

export default StatCounter;
