import React, { useState } from "react";
import axios from "axios";
import styles from "./contactForm.module.css";
import { CONTACT_SUBMISSION_API, CSRF_TOKEN_API } from "../../routes/apiRoutes";
const ContactForm = () => {
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
      // 1. Get CSRF cookie from Sanctum
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        withCredentials: true,
      });
      const tokenResponse = await axios.get(CSRF_TOKEN_API, {
        withCredentials: true,
      });
  
      const csrfToken = tokenResponse.data.csrf_token;
      console.log("CSRF Token:", csrfToken); // Log the CSRF token for debugging
     // Log the CSRF token for debugging
      // 2. Submit the form data
      const response = await axios.post(CONTACT_SUBMISSION_API, formData, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'csrf_token': csrfToken, // Send CSRF token manually
        },
      });
  
      setStatus({
        success: true,
        message: response.data.message || 'Form submitted successfully!',
      });
  
      // Reset form
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
  
  
  
  // Helper function to get cookies
 

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
      {error && <p className={styles.error}>{error}</p>}
      {status && (
        <p className={status.success ? styles.success : styles.error}>
          {status.message}
        </p>
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
          type="text"  // Changed from "tel" to "text" for country input
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