import React, { useEffect, useState, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import confetti from 'canvas-confetti';

// --- Types ---
interface DecisionCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface ResultData {
  city: string;
  tagline: string;
  desc: string;
  roast: string;
  imageUrl: string;
}

// --- Components: Counter ---
const Counter: React.FC<{ target: number }> = ({ target }) => {
  const spring = useSpring(0, { stiffness: 40, damping: 20 });
  const displayValue = useTransform(spring, (current) => Math.round(current));
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  useMotionValueEvent(displayValue, "change", (latest) => {
    setValue(latest as number);
  });

  return (
    <span className="text-5xl md:text-7xl font-tomorrow font-bold text-[#E60000] leading-none inline-block">
      {Math.floor(value).toLocaleString()}
    </span>
  );
};

// --- Components: DecisionCard ---
const DecisionCardComponent: React.FC<{ card: DecisionCard; onClick: () => void }> = ({ card, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={onClick}
      className="group relative bg-white rounded-[2.5rem] py-5 px-6 md:py-8 md:px-12 flex items-center justify-between overflow-hidden cursor-pointer shadow-[0_15px_45px_-10px_rgba(0,0,0,0.08)] border border-gray-100 h-full min-h-[160px] md:min-h-[200px]"
    >
      <div className="relative z-10 flex flex-col justify-center flex-1 pr-4">
        <h3 className="font-tomorrow font-semibold text-xl md:text-2xl text-gray-900 mb-1 md:mb-2 leading-tight">
          {card.title}
        </h3>
        <p className="text-xs md:text-sm lg:text-base text-gray-400 font-medium leading-relaxed">
          {card.description}
        </p>
      </div>

      <div className="relative z-10 w-24 h-24 md:w-48 md:h-40 flex-shrink-0 flex items-center justify-center">
        <img 
          src={card.imageUrl} 
          alt={card.title}
          className="max-w-full max-h-full object-contain transform group-hover:scale-110 transition-transform duration-500"
          style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.05))' }}
        />
      </div>
    </motion.div>
  );
};

// --- Data ---
const DETAILED_CONTENT: Record<string, { chinaSide: string; usSide: string; hook: string }> = {
  '1': {
    chinaSide: 'In China, the "9-9-6" lifestyle is a high-octane race where the office is your primary residence. It’s driven by a palpable sense of national momentum.',
    usSide: 'In the US, "Work-Life Balance" is a cultural goal. You have the freedom to set boundaries, but often experience career stagnation anxiety.',
    hook: 'Sacrificing your 20s for a tech empire vs. sacrificing your soul for a 401(k).'
  },
  '2': {
    chinaSide: 'China is a 24/7 culinary wonderland where a $3 bowl of hand-pulled noodles is a masterclass in flavor delivered in twelve minutes.',
    usSide: 'In the US, dining involves 25% mandatory tips for an "artisan" salad. Portions are massive, but culinary depth can be a gamble.',
    hook: 'Gourmet street noodles at 3 AM vs. the $20 salad that’s mostly water.'
  },
  '3': {
    chinaSide: 'Live in 2050. Teleport between megacities on silent, 350 km/h bullet trains. Car ownership is a choice, not a prison sentence.',
    usSide: 'In the US, life is often dictated by the traffic report and a high monthly payment for a depreciating asset in a car-centric sprawl.',
    hook: 'Gliding on a bullet train vs. paying $800 a month to sit in traffic.'
  },
  '4': {
    chinaSide: 'An academic gauntlet designed to produce human calculators. By age seven, kids have a math foundation that would make NASA sweat.',
    usSide: 'Focus on individual expression and critical thinking. It’s fantastic for creative producers, but academic quality is a zip code lottery.',
    hook: 'Mastering the test at age nine vs. mastering the "art of the pivot".'
  },
  '5': {
    chinaSide: 'Dating in China is often a family-sponsored merger. Your "Market Value" is calculated by property ownership and parents’ retirement plan.',
    usSide: 'In the US, dating is an endless "situationship" loop governed by algorithms that prioritize superficial matches over long-term clarity.',
    hook: 'Marriage like a real estate transaction vs. an endless cycle of ghosting.'
  },
  '6': {
    chinaSide: 'Healthcare built for speed. See a specialist the same day and get an IV drip for the price of a movie ticket.',
    usSide: 'The best doctors—if you’re wealthy. For everyone else, it’s a terrifying financial gamble with waitlists and surprise bills.',
    hook: 'A $20 IV drip vs. a $5,000 ambulance ride for a broken toe.'
  },
  '7': {
    chinaSide: 'Grandmas rule public spaces. Retirement is social and filial piety means three generations often live under one roof.',
    usSide: 'Retirement is the expensive luxury of a Florida village with golf carts and total isolation from the rest of society.',
    hook: 'Being the CEO of a three-generation household vs. a golf-cart community.'
  },
  '8': {
    chinaSide: 'Social Credit: a video game score for the state. Jaywalk too much and you might lose high-speed rail privileges.',
    usSide: 'FICO Score: a mysterious number that determines if you’re allowed to have a roof over your head.',
    hook: 'Losing points for jaywalking vs. losing your house over a credit card.'
  }
};

const QUESTIONS = [
  { id: 1, title: "The paycheck paradox", options: [{ value: 'A', text: 'Global career, even if 50% goes to rent.' }, { value: 'B', text: 'Massive apartment and $2 street food.' }] },
  { id: 2, title: "The social battery", options: [{ value: 'C', text: 'International bars, English friends.' }, { value: 'D', text: 'Learn Mandarin by force, only foreigner.' }] },
  { id: 3, title: "The Saturday vibe", options: [{ value: 'E', text: 'Futuristic megacity with neon lights.' }, { value: 'F', text: 'Mountains, lakes, and "tea-drinking" pace.' }] }
];

// --- Modals ---
const InfoModal: React.FC<{ isOpen: boolean; onClose: () => void; card: DecisionCard | null }> = ({ isOpen, onClose, card }) => {
  if (!card) return null;
  const details = DETAILED_CONTENT[card.id] || { chinaSide: '...', usSide: '...', hook: '...' };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="relative w-full max-w-5xl h-auto max-h-[95vh] rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col" style={{ background: 'linear-gradient(135deg, #3b3a6e 0%, #443c68 30%, #b21e35 70%, #d90429 100%)' }}>
            {/* Header Row for Close Button */}
            <div className="flex justify-end p-4 md:p-6 pb-0">
               <button onClick={onClose} className="p-2 md:p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm transition-all active:scale-90 z-50">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
               </button>
            </div>
            
            <div className="flex-1 px-6 pb-6 md:px-16 md:pb-16 lg:px-20 lg:pb-20 overflow-y-auto custom-scrollbar">
              <div className="max-w-4xl mx-auto space-y-8 md:space-y-12 text-white">
                <header className="space-y-2 md:space-y-4 text-center">
                  <h2 className="font-tomorrow font-bold text-3xl md:text-7xl tracking-tighter leading-none">{card.title}</h2>
                  <p className="text-lg md:text-2xl text-white/60 font-tomorrow">{card.description}</p>
                </header>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-0 relative">
                  <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-left">
                    <h4 className="text-[#E60000] font-tomorrow font-semibold uppercase tracking-widest text-base md:text-lg">In China</h4>
                    <p className="text-lg md:text-2xl leading-relaxed md:leading-[1.78]">{details.chinaSide}</p>
                  </div>
                  <div className="flex items-center justify-center px-4 md:px-12 py-2 md:py-0 self-stretch">
                    <div className="font-tomorrow font-black italic text-3xl md:text-4xl text-white/10 select-none">VS</div>
                  </div>
                  <div className="flex-1 space-y-4 md:space-y-6 text-center md:text-right">
                    <h4 className="text-[#3b82f6] font-tomorrow font-semibold uppercase tracking-widest text-base md:text-lg">In the US</h4>
                    <p className="text-lg md:text-2xl leading-relaxed md:leading-[1.78]">{details.usSide}</p>
                  </div>
                </div>
                <div className="p-6 md:p-10 bg-black/30 rounded-[2rem] border border-white/10 text-center">
                  <p className="text-xl md:text-3xl font-bold italic leading-tight">"{details.hook}"</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CityMatchmakerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  isSharedResult?: boolean;
  sharedCity?: string;
  sharedScore?: number;
}> = ({ isOpen, onClose, isSharedResult = false, sharedCity, sharedScore }) => {
  const [step, setStep] = useState(isSharedResult ? QUESTIONS.length + 1 : 1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);
  const isFinished = step > QUESTIONS.length || isSharedResult;
  
  const result = useMemo((): ResultData => {
    // If viewing a shared result, use the shared city data
    if (isSharedResult && sharedCity) {
      const cityResults: Record<string, ResultData> = {
        "Shanghai": { city: "Shanghai", tagline: "The global elite.", desc: "Center of the universe.", roast: "Your VPN is your only personality trait.", imageUrl: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&q=80&w=1000" },
        "Chengdu": { city: "Chengdu", tagline: "The chill specialist.", desc: "Loophole to happiness.", roast: "The spicy oil will claim your soul eventually.", imageUrl: "https://images.unsplash.com/photo-1723210670026-fee99db90289?auto=format&fit=crop&q=80&w=1000" },
        "Guangzhou": { city: "Guangzhou", tagline: "The culinary master.", desc: "Eat and exist in peace.", roast: "You're just here for the Dim Sum.", imageUrl: "https://images.unsplash.com/photo-1636259584602-5a3c9c0d05ff?auto=format&fit=crop&q=80&w=1000" }
      };
      return cityResults[sharedCity] || cityResults["Guangzhou"];
    }

    // Otherwise, calculate from quiz answers
    const combo = Object.values(answers).join('');
    if (combo.includes('A') && combo.includes('C')) return { city: "Shanghai", tagline: "The global elite.", desc: "Center of the universe.", roast: "Your VPN is your only personality trait.", imageUrl: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&q=80&w=1000" };
    if (combo.includes('B') && combo.includes('D')) return { city: "Chengdu", tagline: "The chill specialist.", desc: "Loophole to happiness.", roast: "The spicy oil will claim your soul eventually.", imageUrl: "https://images.unsplash.com/photo-1723210670026-fee99db90289?auto=format&fit=crop&q=80&w=1000" };
    return { city: "Guangzhou", tagline: "The culinary master.", desc: "Eat and exist in peace.", roast: "You're just here for the Dim Sum.", imageUrl: "https://images.unsplash.com/photo-1636259584602-5a3c9c0d05ff?auto=format&fit=crop&q=80&w=1000" };
  }, [answers, isSharedResult, sharedCity]);

  const readinessScore = useMemo(() => {
    // If viewing a shared result, use the shared score
    if (isSharedResult && sharedScore) return sharedScore;
    // Otherwise, calculate from quiz answers
    return 84 + (Object.values(answers).join('').length % 15);
  }, [answers, isSharedResult, sharedScore]);

  const handleSelect = (qId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
    setTimeout(() => setStep(prev => prev + 1), 400);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleCopy = () => {
    // Generate shareable URL with result data
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?city=${encodeURIComponent(result.city)}&score=${readinessScore}`;

    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleTakeQuiz = () => {
    // Close modal and reload page to take quiz
    onClose();
    window.location.href = window.location.origin + window.location.pathname;
  };

  const reset = () => { setStep(1); setAnswers({}); onClose(); };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={reset} className="absolute inset-0 bg-[#0B0C10]/95 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-5xl h-auto max-h-[98vh] rounded-[2rem] md:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col" style={{ background: 'linear-gradient(135deg, #3b3a6e 0%, #443c68 30%, #b21e35 70%, #d90429 100%)' }}>
            
            {/* Dedicated Header for Close Button */}
            <div className="flex justify-end p-4 md:p-6 pb-0 z-[120]">
                <button onClick={reset} className="text-white/50 hover:text-white transition-colors p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>

            <AnimatePresence mode="wait">
              {!isFinished ? (
                <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex-1 flex flex-col px-6 pb-6 md:px-16 md:pb-16 overflow-hidden">
                  
                  {/* Navigation Header */}
                  <div className="flex justify-between items-center w-full mb-2 md:mb-4 relative shrink-0">
                    <div className="w-24">
                        {step > 1 && (
                            <button onClick={handleBack} className="text-white/50 hover:text-white transition-colors font-tomorrow text-sm tracking-widest uppercase flex items-center gap-2">
                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                               Back
                            </button>
                        )}
                    </div>
                    <div className="text-white/30 font-tomorrow font-bold text-xs md:text-sm tracking-widest text-center">
                       STEP {step} / {QUESTIONS.length}
                    </div>
                    <div className="w-24"></div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center space-y-6 md:space-y-12 overflow-y-auto custom-scrollbar">
                      <h2 className="text-3xl md:text-6xl font-tomorrow font-bold text-white text-center leading-tight">Which city should <br/> you move to?</h2>
                      <div className="max-w-2xl mx-auto space-y-4 md:space-y-6 w-full">
                        <p className="text-lg md:text-2xl text-white/60 font-tomorrow text-center">{QUESTIONS[step-1].title}</p>
                        <div className="grid gap-3 md:gap-4">
                          {QUESTIONS[step-1].options.map(opt => (
                            <button key={opt.value} onClick={() => handleSelect(step, opt.value)} className={`w-full p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border-2 transition-all text-left text-lg md:text-2xl font-medium ${answers[step] === opt.value ? 'bg-white text-[#E60000] border-white' : 'border-white/10 hover:border-white/40 hover:bg-white/10 text-white'}`}>{opt.text}</button>
                          ))}
                        </div>
                      </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex-1 flex flex-col px-6 pb-6 md:px-16 md:pb-16 text-center space-y-4 md:space-y-8 text-white justify-center overflow-y-auto custom-scrollbar">
                  {isSharedResult && (
                    <div className="flex justify-center -mb-2 md:-mb-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white/80 px-4 py-2 rounded-full text-xs md:text-sm font-tomorrow font-bold tracking-wider uppercase">
                        Shared Result
                      </span>
                    </div>
                  )}
                  <div className="relative h-48 md:h-96 w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shrink-0">
                    <img src={result.imageUrl} className="w-full h-full object-cover" alt={result.city}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col items-center justify-end p-6 md:p-8">
                      <h2 className="text-4xl md:text-8xl font-tomorrow font-bold tracking-tighter text-white">{result.city}</h2>
                    </div>
                  </div>
                  {/* Match Score Moved Here */}
                  <div className="flex justify-center -mt-8 md:-mt-4 relative z-10">
                    <div className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-2 md:px-8 md:py-3 rounded-full font-tomorrow font-bold text-lg md:text-2xl tracking-widest shadow-xl">
                       MATCH SCORE: <span className="text-white">{readinessScore}%</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:space-y-4 pt-2 md:pt-4">
                    <p className="text-xl md:text-3xl font-tomorrow font-bold text-white/80">{result.tagline}</p>
                    <div className="p-4 md:p-8 bg-black/40 rounded-[1.5rem] md:rounded-[2rem] border border-white/10">
                        <h4 className="text-[#E60000] uppercase font-bold text-xs md:text-sm tracking-widest mb-1 md:mb-2">The Real Talk</h4>
                        <p className="text-lg md:text-3xl italic font-bold leading-relaxed">"{result.roast}"</p>
                    </div>
                  </div>
                  {isSharedResult ? (
                    <button onClick={handleTakeQuiz} className="bg-white text-[#E60000] font-tomorrow font-bold px-8 py-4 md:px-12 md:py-6 rounded-full text-lg md:text-xl hover:bg-red-50 transition-all active:scale-95 shadow-lg mb-4">Should I move to China?</button>
                  ) : (
                    <button onClick={handleCopy} className="bg-white text-[#E60000] font-tomorrow font-bold px-8 py-4 md:px-12 md:py-6 rounded-full text-lg md:text-xl hover:bg-red-50 transition-all active:scale-95 shadow-lg mb-4">{copied ? "Copied!" : "Share Result"}</button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---
const CARDS_DATA: DecisionCard[] = [
  { id: '1', title: 'Work Culture', description: '9-9-6 Hustle vs. Harmony?', imageUrl: '/images/workculture.png' },
  { id: '2', title: 'Food', description: '$3 Masterpiece vs. $20 Disappointment', imageUrl: '/images/noodle.png' },
  { id: '3', title: 'Transit', description: 'Public Transit vs. "The Car Prison"', imageUrl: '/images/train.png' },
  { id: '4', title: 'K-12 Education', description: 'Fancy the "Unbeatable math foundation"?', imageUrl: '/images/education.png' },
  { id: '5', title: 'The Dating Market', description: 'Swipe right or left?', imageUrl: '/images/dating.png' },
  { id: '6', title: 'Healthcare', description: 'Who cares more?', imageUrl: '/images/healthcare.png' },
  { id: '7', title: 'Elder Care', description: 'Retirement life dilemma', imageUrl: '/images/elder.png' },
  { id: '8', title: 'Social Credit vs. FICO', description: "Who's got your number?", imageUrl: '/images/socialcredit.png' }
];

const MainApp: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasVoted, setHasVoted] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('china_voted');
      return stored === 'true';
    } catch {
      return false;
    }
  });
  const [peopleCount, setPeopleCount] = useState<number>(1248);
  const [selectedCard, setSelectedCard] = useState<DecisionCard | null>(null);
  const [isMatchmakerOpen, setIsMatchmakerOpen] = useState<boolean>(false);
  const [isHoveringBtn, setIsHoveringBtn] = useState<boolean>(false);
  const [siteShared, setSiteShared] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Shared result state
  const [isSharedResult, setIsSharedResult] = useState<boolean>(false);
  const [sharedCity, setSharedCity] = useState<string | undefined>(undefined);
  const [sharedScore, setSharedScore] = useState<number | undefined>(undefined);

  // Check for shared result in URL parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get('city');
    const score = urlParams.get('score');

    if (city && score) {
      setIsSharedResult(true);
      setSharedCity(city);
      setSharedScore(parseInt(score, 10));
      setIsMatchmakerOpen(true);
    }
  }, []);

  // Fetch initial vote count from API
  useEffect(() => {
    const fetchVoteCount = async () => {
      try {
        const response = await fetch('/api/votes');
        const data = await response.json();
        setPeopleCount(data.count);
      } catch (error) {
        console.error('Failed to fetch vote count:', error);
        // Fallback to default if API fails
        setPeopleCount(1248);
      }
    };

    fetchVoteCount();
  }, []);

  const handleCountIn = async () => {
    if (hasVoted || isLoading) return;

    setIsLoading(true);
    try {
      // Call API to increment vote
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        setPeopleCount(data.count);
        setHasVoted(true);
        localStorage.setItem('china_voted', 'true');
      } else {
        throw new Error(data.message || 'Failed to record vote');
      }
    } catch (error) {
      console.error('Failed to record vote:', error);
      alert('Failed to record your vote. Please try again!');
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
    
    // Explicitly use the custom canvas for confetti
    if (canvasRef.current) {
        const myConfetti = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true
        });
        
        myConfetti({
            particleCount: 200,
            spread: 120,
            startVelocity: 80,
            origin: { y: 1 }, // Bottom of the canvas
            colors: ['#E60000', '#FFD700', '#FFFFFF'],
            ticks: 300,
            gravity: 0.8,
            disableForReducedMotion: true
        });
    }

    // Wait for 800ms before opening the matchmaker
    setTimeout(() => setIsMatchmakerOpen(true), 800);
  };
  
  const handleShareSite = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        setSiteShared(true);
        setTimeout(() => setSiteShared(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-white relative">
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[9999] w-full h-full" />
      <header className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center">
        <span className="text-[#E60000] font-tomorrow font-bold text-xl italic tracking-tighter uppercase">Ready to China</span>
      </header>
      
      <section className="relative h-[320px] md:h-[480px] flex items-center px-6 md:px-20 overflow-hidden" style={{ background: 'linear-gradient(90deg, #3b3a6e 0%, #443c68 30%, #b21e35 70%, #d90429 100%)' }}>
        <div className="relative z-10 max-w-5xl">
          <motion.h1 initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="text-5xl md:text-7xl font-tomorrow font-bold text-white leading-[0.9] tracking-tighter">
            Ready to <br/> Move to China?
          </motion.h1>
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 1 }} className="mt-12 h-3 w-48 bg-white/20 origin-left" />
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 opacity-10 font-tomorrow font-bold text-[20vw] select-none flex items-center justify-center text-white pointer-events-none">CN</div>
      </section>

      <div className="max-w-5xl mx-auto -mt-24 md:-mt-40 px-6 relative z-20">
        <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.15)] border border-gray-50 p-6 md:p-20 text-center">
          <Counter target={peopleCount} />
          <h2 className="mt-6 text-2xl md:text-4xl font-tomorrow font-bold text-gray-900 tracking-tight">people have decided <br className="md:hidden"/> to move to China</h2>
          <div className="mt-8 md:mt-12 flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center">
            {hasVoted ? (
              <button onClick={() => { setHasVoted(false); try { localStorage.removeItem('china_voted'); } catch(e){} }} className="w-full md:w-80 px-6 py-4 md:px-10 md:py-6 border-2 border-gray-200 text-gray-400 font-tomorrow font-bold rounded-full transition-all hover:bg-gray-50 uppercase tracking-widest text-sm">Cancel my move</button>
            ) : (
              <button
                onMouseEnter={() => setIsHoveringBtn(true)}
                onMouseLeave={() => setIsHoveringBtn(false)}
                onClick={handleCountIn}
                disabled={isLoading}
                spellCheck={false}
                data-gramm="false"
                className="w-full md:w-96 px-6 py-4 md:px-10 md:py-6 bg-[#E60000] hover:bg-[#CC0000] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-tomorrow font-bold rounded-full shadow-2xl shadow-red-500/20 transition-all active:scale-95 text-base md:text-lg whitespace-nowrap overflow-hidden text-ellipsis outline-none ring-0 focus:ring-0"
              >
                {isLoading ? "Recording..." : (isHoveringBtn ? "Start drinking warm water 🥰" : "I'm Becoming Chinese")}
              </button>
            )}
            <button onClick={handleShareSite} className="w-full md:w-auto px-6 py-4 md:px-10 md:py-6 border-2 border-[#E60000] text-[#E60000] font-tomorrow font-bold rounded-full transition-all hover:bg-red-50 text-base md:text-lg">
                {siteShared ? "Link Copied!" : "Share the site"}
            </button>
          </div>
        </motion.div>
      </div>

      <section className="py-24 md:py-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20 text-center">
            <h2 className="text-4xl md:text-7xl font-tomorrow font-bold uppercase text-gray-900 tracking-tighter">Convince Me</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {CARDS_DATA.map((card, idx) => (
              <motion.div key={card.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                <DecisionCardComponent card={card} onClick={() => setSelectedCard(card)} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CityMatchmakerModal
        isOpen={isMatchmakerOpen}
        onClose={() => {
          setIsMatchmakerOpen(false);
          setIsSharedResult(false);
        }}
        isSharedResult={isSharedResult}
        sharedCity={sharedCity}
        sharedScore={sharedScore}
      />
      <InfoModal isOpen={!!selectedCard} onClose={() => setSelectedCard(null)} card={selectedCard} />
      
      <footer className="py-20 text-center text-gray-300 font-tomorrow font-bold text-xs border-t border-gray-50 tracking-[0.5em] uppercase">
        Ready to China &copy; {new Date().getFullYear()} — Made for the Bold
      </footer>
    </div>
  );
};

// --- Render ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<MainApp />);
}