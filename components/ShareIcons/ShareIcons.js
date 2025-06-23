import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faFacebookF, 
  faTwitter, 
  faLinkedinIn, 
  faWhatsapp 
} from '@fortawesome/free-brands-svg-icons';
import { faLink, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import styles from './ShareIcons.module.css';
import shareIcon from '../../assets/img/share.png';
import Image from 'next/image';

const ShareIcons = ({ url, title }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const shareContainerRef = useRef(null);
  
  // Use the provided URL or current URL if not provided
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  // Use the provided title or document title if not provided
  const shareTitle = title || (typeof document !== 'undefined' ? document.title : 'Check this out!');
  
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  
  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setShowTooltip(true);
          setTimeout(() => {
            setShowTooltip(false);
          }, 2000);
        })
        .catch(err => {
          console.error('Failed to copy: ', err);
        });
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Close share icons when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareContainerRef.current && !shareContainerRef.current.contains(event.target) && isExpanded) {
        setIsExpanded(false);
      }
    };

    // Add event listener when the component is expanded
    if (isExpanded) {
      document.addEventListener('click', handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isExpanded]);

  return (
    <div className={styles.shareContainer} ref={shareContainerRef}>
      <button 
        onClick={toggleExpand} 
        className={`${styles.shareToggleButton} ${isExpanded ? styles.active : ''}`}
        aria-label="Toggle share options"
      >
        <Image src={shareIcon} alt="blogicon" width={20} height={20} />
      </button>
      
      <div className={`${styles.shareIconsWrapper} ${isExpanded ? styles.expanded : ''}`}>
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareIcon}
          aria-label="Share on Facebook"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareIcon}
          aria-label="Share on Twitter"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        
        <a 
          href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareIcon}
          aria-label="Share on LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
        
        <a 
          href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.shareIcon}
          aria-label="Share on WhatsApp"
        >
          <FontAwesomeIcon icon={faWhatsapp} />
        </a>
        
        <button 
          onClick={copyToClipboard}
          className={`${styles.shareIcon} ${styles.copyButton}`}
          aria-label="Copy link to clipboard"
        >
          <FontAwesomeIcon icon={faLink} />
          {showTooltip && <span className={styles.tooltip}>Copied!</span>}
        </button>
      </div>
    </div>
  );
};

export default ShareIcons;
