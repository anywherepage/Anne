import React, { useState, useEffect } from 'react';
import CountdownTimer from './components/CountdownTimer';
import BirthdayContent from './components/BirthdayContent';
import { CONFIG } from './config';
import './index.css';

function App() {
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const target = new Date(CONFIG.TARGET_DATE);
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
        <CountdownTimer targetDate={CONFIG.TARGET_DATE} onComplete={() => setIsRevealed(true)} />
      )}
    </div>
  );
}

export default App;
