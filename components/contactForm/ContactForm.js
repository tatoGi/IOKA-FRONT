import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./contactForm.module.css";
import { CONTACT_SUBMISSION_API } from "../../routes/apiRoutes";

const ContactForm = ({ pageTitle = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    message: ""
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

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
    try {
      const response = await axios.post(CONTACT_SUBMISSION_API, {
        ...formData,
        page_title: pageTitle // Add page title to submission data
      }, {
        withCredentials: true,
      });
      setStatus({
        success: true,
        message: response.data.message || 'Form submitted successfully!',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        country: '',
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
    fontSize: '16px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#0A273B'
  };

  return (
    <div className={styles.formContainer}>
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
        />
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className={styles.input}
          required
          style={placeholderStyle}
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Write a Message"
          className={styles.textarea}
          required
          style={placeholderStyle}
        />
        <button 
          type="submit" 
          className={styles.submitButton} 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send a Message'}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;