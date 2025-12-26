import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Heart, Stars, Music, Gift, Camera, MessageCircle, ChevronDown, X } from 'lucide-react';
import { CONFIG } from '../config';

const HeartParticle = ({ delay }) => (
    <motion.div
        initial={{ y: '100vh', x: `${Math.random() * 100}vw`, opacity: 0, scale: 0 }}
        animate={{
            y: '-10vh',
            x: `${Math.random() * 100}vw`,
            opacity: [0, 1, 1, 0],
            scale: [0.5, 1.2, 1.2, 0.8],
            rotate: Math.random() * 360
        }}
        transition={{ duration: 10 + Math.random() * 5, repeat: Infinity, delay }}
        className="fixed pointer-events-none z-0 text-pink-400 opacity-20"
    >
        <Heart size={24 + Math.random() * 32} fill="currentColor" />
    </motion.div>
);

const FloatingGift = ({ src, id, onRemove }) => {
    // Dynamic base path for both local dev and GitHub Pages
    const baseUrl = import.meta.env.BASE_URL || '/';
    const finalSrc = src.startsWith('assets') ? `${baseUrl}${src}` : src;

    // Random starting position near center
    const initialX = (Math.random() - 0.5) * 60;

    return (
        <motion.div
            drag
            dragConstraints={{ left: -1000, right: 1000, top: -1000, bottom: 1000 }}
            initial={{
                scale: 0,
                opacity: 0,
                y: 100,
                x: initialX,
                rotate: -45
            }}
            animate={{
                scale: 1,
                opacity: 1,
                y: 0,
                rotate: 0
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
                scale: { type: "spring", stiffness: 300, damping: 20 },
                y: { type: "spring", stiffness: 200, damping: 25 }
            }}
            whileHover={{ scale: 1.1, zIndex: 100 }}
            whileDrag={{ scale: 1.1, zIndex: 100 }}
            className="absolute bottom-32 left-1/2 -ml-16 z-[100] cursor-grab active:cursor-grabbing group"
            style={{ width: '120px', height: '240px' }}
        >
            <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full"
            >
                <div className="w-full h-full bg-white rounded-2xl shadow-2xl border-4 border-pink-100 p-2 overflow-hidden relative">
                    <img
                        src={finalSrc}
                        alt="Gift"
                        className="w-full h-full object-contain pointer-events-none"
                        onError={(e) => {
                            console.warn("Gift image failed:", finalSrc);
                            // Fallback to relative path if absolute fails
                            if (finalSrc.startsWith('/')) e.target.src = src;
                        }}
                    />
                    <button
                        onClick={(e) => { e.stopPropagation(); onRemove(id); }}
                        className="absolute top-2 right-2 bg-pink-500/80 hover:bg-pink-600 text-white rounded-full p-1 z-50 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

const BirthdayContent = () => {
    const [floatingGifts, setFloatingGifts] = useState([]);
    const [giftIndex, setGiftIndex] = useState(0);
    const [reasonIndex, setReasonIndex] = useState(0);
    const doodleImages = CONFIG.DOODLES;

    useEffect(() => {
        const duration = 15 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    const stars = React.useMemo(() => (
        [...Array(40)].map((_, i) => (
            <div
                key={i}
                className="star"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 2 + 1}px`,
                    height: `${Math.random() * 2 + 1}px`,
                    backgroundColor: '#ffb3c1',
                    '--duration': `${Math.random() * 3 + 2}s`,
                }}
            />
        ))
    ), []);

    const handleGiftClick = () => {
        if (doodleImages.length > 0) {
            const nextDoodle = doodleImages[giftIndex % doodleImages.length];
            const newGift = {
                id: Date.now(),
                src: nextDoodle
            };
            setFloatingGifts(prev => [...prev, newGift]);
            setGiftIndex(prev => prev + 1);

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.8 }
            });
        }
    };

    const removeGift = (id) => {
        setFloatingGifts(prev => prev.filter(g => g.id !== id));
    };

    return (
        <div className="min-h-screen bg-pink-50 text-gray-800 selection:bg-pink-200 relative overflow-hidden">
            {/* Moving Background with Stars inside */}
            <div className="starry-background" style={{ background: 'radial-gradient(ellipse at bottom, #fff0f3 0%, #fdf2f8 100%)', opacity: 0.5 }}>
                <div className="absolute inset-0 pointer-events-none z-0">
                    {stars}
                </div>
            </div>

            {/* Floating Hearts Layer */}
            {[...Array(20)].map((_, i) => (
                <HeartParticle key={i} delay={i * 1.5} />
            ))}

            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-4 relative">
                <div className="doodle-bg-layer bg-hero-doodle" />
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="z-10"
                >
                    <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="inline-block mb-6"
                    >
                        <Heart size={64} className="text-pink-500 fill-pink-500" />
                    </motion.div>
                    <h1 className="text-5xl md:text-8xl font-bold mb-6 text-pink-600">
                        Happy Birthday, <br />
                        <span className="italic font-serif">{CONFIG.ROYAL_TITLE}</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-pink-400 font-light max-w-2xl mx-auto italic">
                        "You are the best thing that ever happened to me. Today is all about you."
                    </p>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10"
                >
                    <ChevronDown size={32} className="text-pink-300" />
                </motion.div>
            </section>

            {/* Memories Section */}
            <section className="py-24 px-4 max-w-6xl mx-auto relative">
                <div className="doodle-bg-layer bg-memories-doodle" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] bg-pink-200 rounded-3xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img src={CONFIG.MEMORY_IMAGE} alt="Birthday" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
                            <Camera size={48} className="text-yellow-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-6 text-pink-600">{CONFIG.MEMORY_TITLE}</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            {CONFIG.MEMORY_SHORT_STORY}
                        </p>
                        <div className="flex gap-4">
                            <Stars className="text-yellow-400" />
                            <span className="font-semibold text-pink-500 tracking-wider">EST. {CONFIG.EST_DATE}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Royal Proclamation Section */}
            <section className="py-24 px-4 bg-white relative">
                <div className="doodle-bg-layer bg-royal-doodle" />
                <motion.div
                    initial={{ opacity: 0, scaleY: 0 }}
                    whileInView={{ opacity: 1, scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="max-w-3xl mx-auto parchment p-12 md:p-20 text-center scroll-unfurl"
                >
                    <div className="mb-8">
                        <span className="royal-heading text-sm md:text-lg">By Royal Decree</span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-serif mb-8 text-[#5d4037]">
                        The Proclamation of Celebration
                    </h2>

                    <div className="space-y-6 text-lg md:text-xl font-serif italic text-[#3e2723] leading-relaxed">
                        <p>
                            "Know ye that on this day, the <span className="font-bold">27th of December</span>,
                            we gather in digital spirit to honor the birth of Her Royal Highness,
                            <span className="font-bold block text-2xl mt-2">{CONFIG.FORMAL_TITLE}</span>"
                        </p>
                        <p>
                            "As the stars align in her favor, the Chancellor of Hearts hereby declares
                            the commencement of her Birthday festivities. Be it resolved that the
                            following Royal Offerings shall be bestowed upon her:"
                        </p>
                    </div>

                    <div className="my-12 space-y-8">
                        {CONFIG.GIFTS.map((gift, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1 + (i * 0.3) }}
                                className="border-b border-[#d4af37]/30 pb-4"
                            >
                                <h3 className="text-xl font-bold text-[#8b4513] uppercase tracking-widest">{gift.title}</h3>
                                <p className="text-[#5d4037] italic mt-1">{gift.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-[#3e2723] font-serif italic">
                        <p>"Given under our hand and seal this day of revelry."</p>
                        <div className="seal"></div>
                        <p className="mt-4 font-bold uppercase tracking-tighter">Chancellor of Hearts</p>
                    </div>
                </motion.div>
            </section>

            {/* Reasons Section */}
            <section className="py-24 text-gray-800 overflow-hidden relative paper-grid min-h-[700px] flex flex-col items-center justify-center">
                <div className="doodle-bg-layer bg-reasons-doodle opacity-20" />
                <div className="max-w-4xl mx-auto px-4 relative z-10 w-full flex flex-col items-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center italic text-pink-600">
                        Reasons Why You're Special
                    </h2>

                    <div className="relative w-full max-w-sm h-[400px] flex items-center justify-center">
                        <AnimatePresence mode='wait'>
                            {CONFIG.REASONS.map((reason, index) => {
                                const isCurrent = index === reasonIndex % CONFIG.REASONS.length;
                                if (!isCurrent) return null;

                                return (
                                    <motion.div
                                        key={index}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        onDragEnd={(e, info) => {
                                            if (Math.abs(info.offset.x) > 100) {
                                                setReasonIndex(prev => prev + 1);
                                            }
                                        }}
                                        initial={{ scale: 0.8, opacity: 0, rotate: -10, y: 50 }}
                                        animate={{ scale: 1, opacity: 1, rotate: index % 2 === 0 ? -2 : 2, y: 0 }}
                                        exit={{
                                            x: info => info?.offset?.x > 0 ? 500 : -500,
                                            opacity: 0,
                                            rotate: 20,
                                            transition: { duration: 0.3 }
                                        }}
                                        className="sticky-note group absolute w-full cursor-grab active:cursor-grabbing shadow-2xl"
                                    >
                                        <div className="washi-tape" />
                                        <div className="text-pink-300 font-bold mb-4 font-serif text-2xl">0{index + 1}</div>
                                        <p className="text-2xl font-light text-gray-700 italic text-center py-8 px-4">
                                            "{reason}"
                                        </p>

                                        {/* Royal Miniature Stamp */}
                                        <div className="royal-stamp">
                                            <img
                                                src={CONFIG.DOODLES[index % CONFIG.DOODLES.length]}
                                                alt="Royal Stamp"
                                            />
                                        </div>

                                        <div className="mt-8 text-center text-pink-300 text-sm animate-pulse font-medium">
                                            Swipe left/right or click next...
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    <div className="mt-12 flex gap-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setReasonIndex(prev => prev + 1)}
                            className="bg-white border-2 border-pink-200 text-pink-500 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all font-bold flex items-center gap-2"
                        >
                            Next Reason <ChevronDown size={20} className="-rotate-90" />
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* Final Message */}
            <section className="py-24 text-center px-4 relative">
                <div className="doodle-bg-layer bg-final-doodle opacity-5" />
                <h2 className="text-3xl font-bold text-pink-600 mb-12">Tap to reveal her magic</h2>

                {/* The "Box" */}
                <div className="flex justify-center">
                    <div className="relative">
                        <AnimatePresence>
                            {floatingGifts.map(gift => (
                                <FloatingGift
                                    key={gift.id}
                                    id={gift.id}
                                    src={gift.src}
                                    onRemove={removeGift}
                                />
                            ))}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleGiftClick}
                            className="bg-pink-500 hover:bg-pink-600 text-white w-32 h-32 rounded-full flex items-center justify-center shadow-2xl z-10 relative"
                        >
                            <Camera size={48} />
                        </motion.button>
                    </div>
                </div>

                <p className="mt-16 text-pink-300 font-light max-w-xl mx-auto italic">
                    "A glimpse into the beautiful world you create. Every doodle is a masterpiece."
                </p>
            </section>

            <footer className="py-8 text-center text-pink-300 text-sm">
                Made with ❤️ for {CONFIG.BIRTHDAY_NAME}
            </footer>
        </div>
    );
};

export default BirthdayContent;
