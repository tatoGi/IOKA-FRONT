import React, { useState } from "react";
import axios from "axios"; // Add axios import
import styles from "./contactForm.module.css";
import { CONTACT_SUBMISSION_API } from "../../routes/apiRoutes"; // Import the routes

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [error, setError] = useState(null); // Add error state
  const [isSubmitting, setIsSubmitting] = useState(false); // Add isSubmitting state
  const [status, setStatus] = useState(null); // Add status state

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${CONTACT_SUBMISSION_API}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus({ success: true, message: data.message });
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setStatus({ success: false, message: data.errors || 'Submission failed' });
      }
    } catch (error) {
      setStatus({ success: false, message: 'Network error. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.title}>Feel free to write</h2>
      {error && <p className={styles.error}>{error}</p>} {/* Display error message */}
      {status && <p className={status.success ? styles.success : styles.error}>{status.message}</p>} {/* Display status message */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className={styles.input}
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className={styles.input}
          required
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className={styles.input}
          required
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Write a Message"
          className={styles.textarea}
          required
        />
        <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send a Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
