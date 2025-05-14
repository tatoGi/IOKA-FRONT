import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './SimpleGallery.module.css';

const SimpleGallery = ({ images, title, decodeImageUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const openGallery = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when gallery is open
  };

  const closeGallery = () => {
    setIsOpen(false);
    document.body.style.overflow = ''; // Restore scrolling
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;
    
    switch(e.key) {
      case 'Escape':
        closeGallery();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = ''; // Cleanup: ensure scrolling is restored
    };
  }, [isOpen]);

  if (!isClient || !images || images.length === 0) return null;

  const getImageUrl = (image) => {
    if (!image) return null;
    try {
      const decodedUrl = decodeImageUrl ? decodeImageUrl(image) : image;
      return `${process.env.NEXT_PUBLIC_API_URL}/storage/${decodedUrl}`;
    } catch (error) {
      console.error('Error decoding image URL:', error);
      return null;
    }
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={styles.galleryGrid}>
        {images.map((image, index) => {
          const imageUrl = getImageUrl(image);
          if (!imageUrl) return null;

          return (
            <div 
              key={index} 
              className={styles.galleryItem}
              onClick={() => openGallery(index)}
            >
              <Image
                src={imageUrl}
                alt={`${title || ''} - Image ${index + 1}`}
                width={300}
                height={200}
                className={styles.thumbnail}
                priority={index < 4}
                loading={index < 4 ? "eager" : "lazy"}
                quality={90}
              />
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {isOpen && (
        <div className={styles.lightbox} onClick={closeGallery}>
          <button 
            className={`${styles.navButton} ${styles.closeButton}`}
            onClick={closeGallery}
            aria-label="Close gallery"
          >
            ×
          </button>
          
          <button 
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            aria-label="Previous image"
          >
            ‹
          </button>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <Image
              src={getImageUrl(images[currentIndex])}
              alt={`${title || ''} - Image ${currentIndex + 1}`}
              fill
              className={styles.lightboxImage}
              priority
              quality={100}
              sizes="100vw"
            />
            <div className={styles.caption}>
              {title && <span className={styles.title}>{title}</span>}
              <span className={styles.counter}>
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>

          <button 
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
};

export default SimpleGallery; 