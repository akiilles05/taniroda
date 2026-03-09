'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import styles from './FlipBook.module.css';

export interface FlipBookPage {
  id: number;
  imageUrl: string;
  alt?: string;
}

interface FlipBookProps {
  pages: FlipBookPage[];
  width?: number;
  height?: number;
  className?: string;
}

export default function FlipBook({ 
  pages, 
  width = 800, 
  height = 600,
  className = '' 
}: FlipBookProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev' | null>(null);
  const [displayPage, setDisplayPage] = useState(0);
  
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = pages.length;

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1 && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
    }
  }, [currentPage, totalPages, isFlipping]);

  const goToPrevPage = useCallback(() => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('prev');
      setIsFlipping(true);
    }
  }, [currentPage, isFlipping]);

  // Handle flip animation
  useEffect(() => {
    if (isFlipping && flipDirection) {
      setDisplayPage(flipDirection === 'next' ? currentPage : currentPage);
      
      const timer = setTimeout(() => {
        setDisplayPage(flipDirection === 'next' ? currentPage + 1 : currentPage - 1);
        setCurrentPage(flipDirection === 'next' ? currentPage + 1 : currentPage - 1);
        
        setTimeout(() => {
          setIsFlipping(false);
          setFlipDirection(null);
        }, 50);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [isFlipping, flipDirection, currentPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevPage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  // Touch/swipe handling
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swipe left - next page
        goToNextPage();
      } else {
        // Swipe right - previous page
        goToPrevPage();
      }
    }
  };

  // Click on left/right side of image
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const halfWidth = rect.width / 2;
    
    if (clickX < halfWidth) {
      // Left side - previous page
      goToPrevPage();
    } else {
      // Right side - next page
      goToNextPage();
    }
  };

  return (
    <div 
      className={`${styles.container} ${className}`}
      style={{ width: '100%', maxWidth: width, height }}
      ref={containerRef}
    >
      <div className={styles.bookWrapper}>
        {/* Current page */}
        <div 
          className={`${styles.page} ${isFlipping ? styles.flipping : ''} ${flipDirection === 'next' ? styles.flipOutNext : flipDirection === 'prev' ? styles.flipOutPrev : ''}`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
        >
          <div className={styles.pageContent}>
            <img 
              src={pages[displayPage]?.imageUrl} 
              alt={pages[displayPage]?.alt || `Page ${displayPage + 1}`}
              className={styles.image}
              draggable={false}
            />
          </div>
          
          {/* Touch zones for mobile */}
          <div className={styles.touchZoneLeft} />
          <div className={styles.touchZoneRight} />
        </div>

        {/* Next page (visible during flip) */}
        {isFlipping && (
          <div 
            className={`${styles.page} ${styles.nextPage} ${flipDirection === 'next' ? styles.flipInNext : styles.flipInPrev}`}
          >
            <div className={styles.pageContent}>
              <img 
                src={pages[flipDirection === 'next' ? currentPage + 1 : currentPage - 1]?.imageUrl} 
                alt=""
                className={styles.image}
                draggable={false}
              />
            </div>
          </div>
        )}

        {/* Page shadow effect */}
        <div className={styles.shadow} />
      </div>

      {/* Navigation */}
      <div className={styles.controls}>
        <button 
          onClick={(e) => { e.stopPropagation(); goToPrevPage(); }}
          disabled={currentPage === 0 || isFlipping}
          className={styles.navButton}
          aria-label="Previous page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className={styles.pageInfo}>
          <span className={styles.pageNumber}>{currentPage + 1}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.total}>{totalPages}</span>
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); goToNextPage(); }}
          disabled={currentPage >= totalPages - 1 || isFlipping}
          className={styles.navButton}
          aria-label="Next page"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      <div className={styles.hint}>
        Swipe or click image to flip • Use <span>←</span> <span>→</span> keys
      </div>
    </div>
  );
}
