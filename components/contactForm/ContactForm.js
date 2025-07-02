import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import styles from "./contactForm.module.css";
import { CONTACT_SUBMISSION_API } from "../../routes/apiRoutes";

const ContactForm = ({ pageTitle = "" }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    country: ""
  });
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

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
        message: response.data?.message || 'Form submitted successfully!',
      });
      
      // Reset form on successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        country: '',
      });
      
      // Redirect to thank you page after successful submission
      // Show status message briefly before redirecting
      setTimeout(() => {
        router.push('/thank-you');
      }, 1000);
    } catch (error) {
      console.error('Form submission error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data,
          headers: error.config?.headers,
        },
      });
      
      // Handle validation errors (422)
      if (error.response?.status === 422) {
        if (error.response?.data?.errors) {
          // Format validation errors into a user-friendly message
          const errorMessages = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          setError(`Validation errors:\n${errorMessages}`);
        } else {
          // If we don't have structured errors, show the raw response data
          setError(`Validation failed: ${JSON.stringify(error.response?.data || 'Unknown validation error')}`);
        }
      } else {
        // Handle other types of errors
        setError(error.response?.data?.message || 
                error.response?.data?.error || 
                error.message ||
                'An error occurred while submitting the form. Please try again.');
      }
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
      <h3 className={styles.title}>Feel free to write</h3>
      
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
        <input
          type="text"
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className={styles.input}
          required
          style={placeholderStyle}
          aria-label="Your Country"
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