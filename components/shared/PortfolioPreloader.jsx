import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import '../../styles/PortfolioPreloader.css';
import profileImage from '../../images/fahmida.png';

// Critical Drift Wall assets visible in the initial hero viewport
const CRITICAL_HERO_IMAGES = [
  profileImage,
  '/wall/fahmida_with_lal_background.jpeg',
  '/wall/fahmida_with_purdue.jpeg',
  '/wall/fahmida_with_robot.jpeg',
  '/wall/fahmida_with_show_pice.jpeg',
  '/wall/fahmida_with_car.jpeg',
  '/wall/fahmida_with_ddn.jpeg'
];

/**
 * Native browser image preloader helper
 * Reuses browser cache so subsequent renders do not re-request the image.
 * Guarantees resolution even on failure so the site is never blocked.
 */
const preloadSingleImage = (src) => {
  return new Promise((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    if (img.complete) {
      return resolve();
    }
    img.onload = () => resolve();
    img.onerror = () => resolve(); // Skip failed images without breaking flow
    img.src = src;
  });
};

const PortfolioPreloader = ({ onRevealHero, onComplete }) => {
  const shouldReduceMotion = useReducedMotion();
  
  // Animation state machine: 'enter' -> 'hold' -> 'exit' -> 'done'
  const [animState, setAnimState] = useState('enter');
  const [isAssetsReady, setIsAssetsReady] = useState(false);
  const [isContainerExiting, setIsContainerExiting] = useState(false);
  
  const holdCompletedRef = useRef(false);
  const assetsReadyRef = useRef(false);
  const revealHeroTriggeredRef = useRef(false);
  const safetyTimeoutRef = useRef(null);

  // 1. Body scroll locking
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, []);

  // 2. Trigger hero reveal exactly once during exit
  const triggerHeroReveal = useCallback(() => {
    if (!revealHeroTriggeredRef.current) {
      revealHeroTriggeredRef.current = true;
      if (typeof onRevealHero === 'function') {
        onRevealHero();
      }
    }
  }, [onRevealHero]);

  // 3. Asset Loading Engine with Safety Race
  useEffect(() => {
    let isMounted = true;

    // Safety timeout: Maximum 3200ms wait so slow network or broken assets never block the user
    safetyTimeoutRef.current = setTimeout(() => {
      if (isMounted && !assetsReadyRef.current) {
        assetsReadyRef.current = true;
        setIsAssetsReady(true);
      }
    }, 3200);

    const checkReadiness = async () => {
      try {
        const imagePromises = CRITICAL_HERO_IMAGES.map(preloadSingleImage);
        const fontsPromise = (typeof document !== 'undefined' && document.fonts && document.fonts.ready)
          ? document.fonts.ready
          : Promise.resolve();

        await Promise.all([...imagePromises, fontsPromise]);
      } catch (e) {
        // Continue gracefully on any unexpected error
      } finally {
        if (isMounted) {
          assetsReadyRef.current = true;
          setIsAssetsReady(true);
        }
      }
    };

    checkReadiness();

    return () => {
      isMounted = false;
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
    };
  }, []);

  // 4. Reduced Motion immediate path
  useEffect(() => {
    if (shouldReduceMotion) {
      const timer = setTimeout(() => {
        triggerHeroReveal();
        if (typeof onComplete === 'function') onComplete();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [shouldReduceMotion, triggerHeroReveal, onComplete]);

  // 5. Sequence Handlers
  const handleEnterComplete = () => {
    setAnimState('hold');
  };

  // When holding, evaluate if both the minimum hold timer (~800ms) and asset readiness have been met
  useEffect(() => {
    if (animState === 'hold') {
      const holdTimer = setTimeout(() => {
        holdCompletedRef.current = true;
        // If assets are already ready or timeout fired, transition to exit immediately
        if (assetsReadyRef.current) {
          setAnimState('exit');
        }
      }, 800);

      return () => clearTimeout(holdTimer);
    }
  }, [animState]);

  // If assets finish loading while holding, proceed to exit if min hold was met
  useEffect(() => {
    if (isAssetsReady && animState === 'hold' && holdCompletedRef.current) {
      setAnimState('exit');
    }
  }, [isAssetsReady, animState]);

  // Handle exit state
  useEffect(() => {
    if (animState === 'exit') {
      // Start container exit fade slightly into the text exit animation (~350ms)
      const containerExitTimer = setTimeout(() => {
        setIsContainerExiting(true);
        triggerHeroReveal();
      }, 350);

      // Finish preloader and clean up
      const finishTimer = setTimeout(() => {
        setAnimState('done');
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 850);

      return () => {
        clearTimeout(containerExitTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [animState, triggerHeroReveal, onComplete]);

  if (animState === 'done') {
    return null;
  }

  // Motion variants for text travel: from 110vh below -> center -> -110vh above
  const textVariants = {
    initial: {
      y: '110vh',
      opacity: 0,
      scale: 0.98
    },
    enter: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1] // Calm, elegant cinematic deceleration
      }
    },
    hold: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2
      }
    },
    exit: {
      y: '-110vh',
      opacity: 0,
      scale: 1.02,
      transition: {
        duration: 0.75,
        ease: [0.65, 0, 0.35, 1] // Smooth cinematic acceleration upward
      }
    }
  };

  return (
    <div 
      className={`portfolio-preloader ${isContainerExiting ? 'preloader-exiting' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
    >
      <div className="preloader-backdrop-glow" />
      
      <div className="preloader-center-stage">
        <motion.div
          className="preloader-identity-wrapper"
          variants={textVariants}
          initial="initial"
          animate={animState}
          onAnimationComplete={(definition) => {
            if (definition === 'enter') {
              handleEnterComplete();
            }
          }}
        >
          {/* Subtle Accent Intro */}
          <div className="preloader-kicker">
            <span className="preloader-dot" />
            <span className="preloader-kicker-text">HI, I AM</span>
            <span className="preloader-line" />
          </div>

          {/* Full Name Typographic Statement */}
          <h1 className="preloader-name-display">
            <span className="preloader-name-gradient">Mst. Fahmida</span>
            <span className="preloader-name-break"> </span>
            <span className="preloader-name-gradient">Sultana Naznin.</span>
          </h1>

          {/* Subtle identity tag */}
          <div className="preloader-meta-tag">
            <span className="preloader-meta-subtext">PORTFOLIO & RESEARCH</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PortfolioPreloader;
