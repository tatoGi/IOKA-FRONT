import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./contactForm.module.css";
import { CONTACT_SUBMISSION_API } from "../../routes/apiRoutes";

const ContactForm = ({ pageTitle = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-hide status after 2 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status]);

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
    setError(null);
    
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    try {
      const currentPageUrl = typeof window !== 'undefined' ? window.location.href : '';
      
      const formSubmissionData = {
        ...formData,
        page_title: pageTitle,
        page_url: currentPageUrl
      };
     
      const response = await axios.post(CONTACT_SUBMISSION_API, formSubmissionData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      setStatus({
        success: true,
        message: response.data.message || 'Form submitted successfully!',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    } catch (error) {
      setStatus({
        success: false,
        message: error.response?.data?.message || error.message || 'Network error. Please try again.',
      });
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const placeholderStyle = {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: isMobile ? '16px' : '16px', // Prevent zoom on iOS
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#8B9DA8'
  };

  return (
    <div className={styles.formContainer}>
      <p className={styles.toptitle}>Send us Email</p>
      <h2 className={styles.title}>Feel free to write</h2>
      
      {/* Modal-style status message */}
      {status && (
        <div className={`${styles.statusModal} ${status.success ? styles.success : styles.error}`}>
          <div className={styles.modalContent}>
            <p>{status.message}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          className={styles.input}
          required
          style={placeholderStyle}
          autoComplete="name"
          aria-label="Your Name"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email Address"
          className={styles.input}
          required
          style={placeholderStyle}
          autoComplete="email"
          aria-label="Email Address"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className={styles.input}
          required
          style={placeholderStyle}
          autoComplete="tel"
          aria-label="Phone Number"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Write a Message"
          className={styles.textarea}
          required
          style={placeholderStyle}
          aria-label="Write a Message"
          rows={isMobile ? 4 : 6}
        />
        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={isSubmitting}
          aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
        >
          {isSubmitting ? 'Sending...' : 'Send a Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;