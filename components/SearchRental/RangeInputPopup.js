import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchRental.module.css';

const RangeInputPopup = ({ isOpen, onClose, onApply, title, unit }) => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const popupRef = useRef(null);
  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the min input when modal opens
      if (minInputRef.current) {
        minInputRef.current.focus();
      }

      // Add event listener for escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);

      // Add event listener for click outside
      const handleClickOutside = (e) => {
        if (popupRef.current && !popupRef.current.contains(e.target)) {
          onClose();
        }
      };
      document.addEventListener('mousedown', handleClickOutside);

      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);

  const handleApply = () => {
    if (min && max) {
      onApply(`${min}-${max}`);
    } else if (min) {
      onApply(`${min}-`);
    } else if (max) {
      onApply(`-${max}`);
    } else {
      onApply('');
    }
    onClose();
  };

  const formatInput = (value) => {
    if (!value) return '';
    return value.replace(/\D/g, '');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent} ref={popupRef}>
        <h3>{title}</h3>
        <div className={styles.rangeInputs}>
          <div className={styles.inputGroup}>
            <input
              ref={minInputRef}
              type="text"
              value={min}
              onChange={(e) => setMin(formatInput(e.target.value))}
              placeholder={`Min ${unit}`}
              className={styles.rangeInput}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
            <span className={styles.rangeSeparator}>-</span>
            <input
              ref={maxInputRef}
              type="text"
              value={max}
              onChange={(e) => setMax(formatInput(e.target.value))}
              placeholder={`Max ${unit}`}
              className={styles.rangeInput}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
            />
          </div>
        </div>
        <div className={styles.popupButtons}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleApply} className={styles.applyButton}>
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default RangeInputPopup; 