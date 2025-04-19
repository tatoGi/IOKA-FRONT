import React, { useState } from 'react';
import styles from './SearchSection.module.css';

const RangeInputPopup = ({ isOpen, onClose, onApply, title, unit }) => {
  const [min, setMin] = useState('');
  const [max, setMax] = useState('');

  if (!isOpen) return null;

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

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
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
            />
            <span className={styles.rangeSeparator}>-</span>
            <input
              type="text"
              value={max}
              onChange={(e) => setMax(formatInput(e.target.value))}
              placeholder={`Max ${unit}`}
              className={styles.rangeInput}
              inputMode="numeric"
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