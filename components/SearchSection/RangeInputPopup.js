import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchSection.module.css';

const RangeInputPopup = ({ isOpen, onClose, onApply, title, unit }) => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const popupRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
      // Focus the first input when popup opens
      if (popupRef.current) {
        const firstInput = popupRef.current.querySelector('input');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 100);
        }
      }
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

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
    <div className={styles.popupContainer} onClick={handleBackdropClick}>
      <div className={styles.popupContent} ref={popupRef}>
        <h3>{title}</h3>
        <div className={styles.rangeInputs}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={min}
              onChange={(e) => setMin(formatInput(e.target.value))}
              placeholder={`Min ${unit}`}
              className={styles.rangeInput}
              inputMode="numeric"
              pattern="[0-9]*"
            />
            <span className={styles.rangeSeparator}>-</span>
            <input
              type="text"
              value={max}
              onChange={(e) => setMax(formatInput(e.target.value))}
              placeholder={`Max ${unit}`}
              className={styles.rangeInput}
              inputMode="numeric"
              pattern="[0-9]*"
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