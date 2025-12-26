import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

const GiftReveal = ({ isOpen, onClose }) => {
    const giftImages = CONFIG.GIFTS.filter(g => g.image).map(g => g.image);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0, rotate: 180 }}
                        className="bg-white rounded-3xl p-8 max-w-4xl w-full relative overflow-hidden shadow-2xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-pink-600 mb-2">Your Majestic Gifts</h2>
                            <p className="text-gray-500 italic uppercase tracking-widest text-sm">Bestowed with Love</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center">
                            {giftImages.map((src, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ y: 50, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + idx * 0.2 }}
                                    className="relative group"
                                >
                                    <div className="aspect-[1/2] rounded-2xl overflow-hidden shadow-lg border-4 border-pink-100 group-hover:border-pink-300 transition-all duration-300 transform group-hover:scale-[1.02]">
                                        <img
                                            src={src.startsWith('assets') ? `/Anne/${src}` : src}
                                            alt={`Gift ${idx + 1}`}
                                            className="w-full h-full object-contain bg-gray-50 p-2"
                                            onError={(e) => {
                                                console.error("Image failed to load:", src);
                                                // Fallback if public path is different on local vs gh-pages
                                                if (src.startsWith('assets')) {
                                                    e.target.src = src;
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-8 text-center text-gray-400 italic font-light">
                            "A queen deserves only the finest talismans."
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const BirthdayContent = () => {
    const [isGiftOpen, setIsGiftOpen] = useState(false);

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
        setIsGiftOpen(true);
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    };

    return (
        <div className="min-h-screen bg-pink-50 text-gray-800 selection:bg-pink-200 relative overflow-hidden">
            <GiftReveal isOpen={isGiftOpen} onClose={() => setIsGiftOpen(false)} />

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
            <section className="py-24 px-4 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="aspect-[4/5] bg-pink-200 rounded-3xl overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                            <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800" alt="Birthday" className="w-full h-full object-cover" />
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
                        <h2 className="text-4xl font-bold mb-6 text-pink-600">To my favorite person...</h2>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                            Every day with you is a gift, but today is extra special.
                            Watching you grow, smile, and achieve your dreams is the greatest joy of my life.
                            You inspire me to be better every single day.
                        </p>
                        <div className="flex gap-4">
                            <Stars className="text-yellow-400" />
                            <span className="font-semibold text-pink-500 tracking-wider">EST. 2025</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Royal Proclamation Section */}
            <section className="py-24 px-4 bg-white relative">
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
            <section className="bg-pink-600 py-24 text-white overflow-hidden relative">
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center italic">
                        Reasons Why You're Special
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {CONFIG.REASONS.map((reason, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20 hover:bg-white/20 transition-colors"
                            >
                                <div className="text-pink-200 mb-4">0{index + 1}</div>
                                <p className="text-xl font-light">{reason}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final Message */}
            <section className="py-24 text-center px-4">
                <h2 className="text-3xl font-bold text-pink-600 mb-12">Click to open your gift</h2>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGiftClick}
                    className="bg-pink-500 hover:bg-pink-600 text-white w-32 h-32 rounded-full flex items-center justify-center shadow-2xl mx-auto"
                >
                    <Gift size={48} />
                </motion.button>

                <p className="mt-16 text-pink-300 font-light max-w-xl mx-auto italic">
                    "I love you more than words can say. Happy Birthday!"
                </p>
            </section>

            <footer className="py-8 text-center text-pink-300 text-sm">
                Made with ❤️ for {CONFIG.BIRTHDAY_NAME}
            </footer>
        </div>
    );
};

export default BirthdayContent;
