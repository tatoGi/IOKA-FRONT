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

  return (
    <div className={styles.popupContainer}>
      <div className={styles.popupContent}>
        <div className={styles.rangeInputs}>
          <div className={styles.inputGroup}>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              placeholder={`Min`}
              className={styles.rangeInput}
            />
            <span className={styles.rangeSeparator}>-</span>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              placeholder={`Max `}
              className={styles.rangeInput}
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