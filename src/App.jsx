import React, { useState, useEffect } from 'react';
import CountdownTimer from './components/CountdownTimer';
import BirthdayContent from './components/BirthdayContent';
import './index.css';

function App() {
  const [isRevealed, setIsRevealed] = useState(false);
  // Target: Dec 27, 2025 at 00:00:00 IST (GMT+5:30)
  const targetDate = "2025-12-27T00:00:00+05:30";

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const target = new Date(targetDate);
      if (now >= target) {
        setIsRevealed(true);
      }
    };

    checkTime();
    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      {isRevealed ? (
        <BirthdayContent />
      ) : (
        <CountdownTimer targetDate={targetDate} onComplete={() => setIsRevealed(true)} />
      )}
    </div>
  );
}

export default App;
