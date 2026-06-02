import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from './money_adder';

export interface Activity {
  title: string;
  description: string;
  donation: number;
  date: string;
}

interface CarouselProps {
  activities: Activity[];
  onIndexChange?: (index: number) => void;
}

const ActivityCarousel: React.FC<CarouselProps> = ({ activities, onIndexChange }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  useEffect(() => {
    if (activities.length > 0 && currentIndex >= activities.length) {
      setCurrentIndex(activities.length - 1);
    }
  }, [activities.length, currentIndex]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < activities.length - 1) {
      setDirection(1);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, activities.length]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrev();
  };

  if (activities.length === 0) {
    return null;
  }

  const progressPercentage = ((currentIndex + 1) / activities.length) * 100;

  // Animation variants for the card
  const cardVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    }),
  };

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 md:p-6 w-full max-w-xl mx-auto"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Card container */}
      <div className="relative h-40 md:h-44 overflow-hidden mb-6">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0"
          >
            <ActivityCard 
              activity={activities[currentIndex]} 
              index={currentIndex + 1}
              total={activities.length}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 md:gap-4">
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Vorherige Spende"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="flex-1 flex flex-col gap-1">
          <div className="h-2 md:h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <motion.div 
              className="h-full bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <div className="text-center text-xs text-gray-400">
            {currentIndex + 1} von {activities.length}
          </div>
        </div>

        <button 
          onClick={handleNext} 
          disabled={currentIndex === activities.length - 1}
          className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 text-white flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Nächste Spende"
        >
          <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Dot indicators for mobile */}
      <div className="flex justify-center mt-4 gap-1.5 md:hidden">
        {activities.length <= 10 && activities.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentIndex ? 1 : -1);
              setCurrentIndex(idx);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'bg-orange-500 w-4' 
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Gehe zu Spende ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

interface ActivityCardProps {
  activity: Activity;
  index: number;
  total: number;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, index, total }) => {
  return (
    <div className="h-full bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 md:p-5 flex flex-col justify-between border border-orange-100">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 line-clamp-2 leading-tight">
            {activity.title}
          </h3>
          <span className="flex-shrink-0 text-lg md:text-xl font-bold text-orange-500">
            {formatCurrency(activity.donation)}
          </span>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {activity.description}
        </p>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-orange-100">
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(activity.date).toLocaleDateString('de-DE', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          })}
        </span>
        <span className="text-xs text-orange-400 font-medium">
          #{index}
        </span>
      </div>
    </div>
  );
};

export default ActivityCarousel;
