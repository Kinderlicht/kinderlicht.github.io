import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from './money_adder';

export interface Activity {
  title: string;
  description: string;
  donation: number;
  date: string; // ISO date string (or Date if preferred)
}

interface CarouselProps {
  activities: Activity[];
  onIndexChange?: (index: number) => void;
}

const ActivityCarousel: React.FC<CarouselProps> = ({ activities, onIndexChange }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Detect mobile width.
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (onIndexChange) {
      onIndexChange(currentIndex);
    }
  }, [currentIndex, onIndexChange]);

  const progressPercentage = ((currentIndex + 1) / activities.length) * 100;

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < activities.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Variants for card animation (used only on non-mobile).
  const cardVariants = {
    prev: {
      x: -180,
      scale: 0.9,
      rotateY: "10deg",
      opacity: 0.7,
      zIndex: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    current: {
      x: 0,
      scale: 1,
      rotateY: "0deg",
      opacity: 1,
      zIndex: 2,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    next: {
      x: 180,
      scale: 0.9,
      rotateY: "-10deg",
      opacity: 0.7,
      zIndex: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  // For mobile, use a responsive center style that is 90% width and centered.
  const centerCardStyle = {
    ...styles.cardWrapper,
    width: "90%",
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div style={styles.container}>
      {/* Integrated header */}
      <div style={styles.header}>Unsere Spenden (anonymisiert)</div>

      <div style={styles.carouselWrapper}>
        {/* Render side cards only on non-mobile */}
        {!isMobile && currentIndex > 0 && (
          <motion.div
            key={`card-${currentIndex - 1}`}
            style={styles.cardWrapper}
            animate="prev"
            variants={cardVariants}
            initial={false}
          >
            <ActivityCard activity={activities[currentIndex - 1]} />
          </motion.div>
        )}

        {/* Render center card differently based on device */}
        {isMobile ? (
          <div key={`card-${currentIndex}`} style={centerCardStyle}>
            <ActivityCard activity={activities[currentIndex]} isActive />
          </div>
        ) : (
          <motion.div
            key={`card-${currentIndex}`}
            style={styles.cardWrapper}
            animate="current"
            variants={cardVariants}
            initial={false}
          >
            <ActivityCard activity={activities[currentIndex]} isActive />
          </motion.div>
        )}

        {!isMobile && currentIndex < activities.length - 1 && (
          <motion.div
            key={`card-${currentIndex + 1}`}
            style={styles.cardWrapper}
            animate="next"
            variants={cardVariants}
            initial={false}
          >
            <ActivityCard activity={activities[currentIndex + 1]} />
          </motion.div>
        )}
      </div>

      <div style={styles.navigation}>
        <button onClick={handlePrev} style={styles.navButton} disabled={currentIndex === 0}>
          &#8249;
        </button>
        <div style={styles.progressContainer}>
          <div style={{ ...styles.progressBarFill, width: `${progressPercentage}%` }} />
        </div>
        <button onClick={handleNext} style={styles.navButton} disabled={currentIndex === activities.length - 1}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

interface ActivityCardProps {
  activity: Activity;
  isActive?: boolean;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, isActive = false }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.cardTitle}>{activity.title}</h3>
      <p style={styles.cardDescription}>{activity.description}</p>
      <p style={styles.cardDonation}>{formatCurrency(activity.donation)}</p>
      <p style={styles.cardDate}>{new Date(activity.date).toLocaleDateString()}</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: "white",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "1rem",
    maxWidth: "800px",
    margin: "2rem auto",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  header: {
    fontSize: "1.5rem",
    color: "#333",
    textAlign: "center",
    marginBottom: "1rem",
    fontWeight: 500,
  },
  carouselWrapper: {
    perspective: "1200px",
    position: "relative",
    height: "140px",
    marginBottom: "1.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  cardWrapper: {
    position: "absolute",
    width: "320px",
    height: "120px",
  },
  card: {
    width: "100%",
    height: "100%",
    backgroundColor: "white",
    border: "1px solid #eee",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    padding: "0.75rem",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: "1.1rem",
    marginBottom: "0.25rem",
    color: "#333",
  },
  cardDescription: {
    fontSize: "0.85rem",
    marginBottom: "0.25rem",
    color: "#555",
    textAlign: "center",
  },
  cardDonation: {
    fontSize: "1rem",
    marginBottom: "0.25rem",
    color: "orange",
    fontWeight: 600,
  },
  cardDate: {
    fontSize: "0.75rem",
    color: "#777",
  },
  navigation: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    zIndex: 10,
  },
  navButton: {
    background: "linear-gradient(135deg, #FFA500, #FF7F50)",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "50px",
    height: "50px",
    fontSize: "1.8rem",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    transition: "transform 0.2s ease-in-out, background 0.3s ease",
    position: "relative",
    zIndex: 10,
  },
  progressContainer: {
    flexGrow: 1,
    margin: "0 1rem",
    height: "12px",
    backgroundColor: "#f0f0f0",
    borderRadius: "6px",
    overflow: "hidden",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.2)",
  },
  progressBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #FFA500, #FF7F50)",
    borderRadius: "6px",
    transition: "width 0.3s ease-in-out",
  },
};

export default ActivityCarousel;
