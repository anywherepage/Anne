import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

const CountdownTimer = ({ targetDate, onComplete }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    } else {
      onComplete();
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    timerComponents.push(
      <div key={interval} className="flex flex-col items-center mx-4">
        <motion.span
          key={timeLeft[interval]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-5xl md:text-7xl font-bold gold-text"
        >
          {String(timeLeft[interval]).padStart(2, '0')}
        </motion.span>
        <span className="text-xs md:text-sm uppercase tracking-widest text-gray-400 mt-2">
          {interval}
        </span>
      </div>
    );
  });

  const stars = React.useMemo(() => (
    [...Array(80)].map((_, i) => (
      <div
        key={i}
        className="star"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${Math.random() * 2 + 1}px`,
          height: `${Math.random() * 2 + 1}px`,
          '--duration': `${Math.random() * 3 + 2}s`,
        }}
      />
    ))
  ), []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="starry-background">
        {/* Stars move with the background */}
        <div className="absolute inset-0 pointer-events-none">
          {stars}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="glass-morphism p-12 md:p-20 flex flex-col items-center z-10 text-center"
      >
        <Clock className="w-12 h-12 text-gold mb-6 animate-pulse" />
        <h1 className="text-3xl md:text-5xl mb-8 font-light tracking-tight">
          Something <span className="gold-text italic">magical</span> is coming...
        </h1>

        <div className="flex flex-row justify-center items-center">
          {timerComponents.length ? timerComponents : <span>Loading...</span>}
        </div>

        <p className="mt-12 text-gray-400 font-light italic">
          "The wait will be worth it."
        </p>
      </motion.div>
    </div>
  );
};

export default CountdownTimer;
