import React, { useState, useEffect, useRef } from 'react';
import styles from './SearchSection.module.css';

const RangeInputPopup = ({ isOpen, onClose, onApply, title, unit, initialValue }) => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');
  const popupRef = useRef(null);
  const minInputRef = useRef(null);
  const maxInputRef = useRef(null);

  // Update local state when initialValue changes
  useEffect(() => {
    if (initialValue) {
      const [minVal, maxVal] = initialValue.split('-');
      setMin(minVal || '');
      setMax(maxVal || '');
    } else {
      setMin('');
      setMax('');
    }
  }, [initialValue, isOpen]);

  useEffect(() => {
    if (isOpen) {
      // Focus the min input when popup opens
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

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  const handleApply = () => {
    let value = '';
    if (min && max) {
      value = `${min}-${max}`;
    } else if (min) {
      value = `${min}-`;
    } else if (max) {
      value = `-${max}`;
    }
    onApply(value);
    onClose();
  };

  const formatInput = (value) => {
    if (!value) return '';
    // Remove any non-digit characters
    return value.replace(/\D/g, '');
  };

  const handleMinChange = (e) => {
    const formattedValue = formatInput(e.target.value);
    setMin(formattedValue);
  };

  const handleMaxChange = (e) => {
    const formattedValue = formatInput(e.target.value);
    setMax(formattedValue);
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
              onChange={handleMinChange}
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
              onChange={handleMaxChange}
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