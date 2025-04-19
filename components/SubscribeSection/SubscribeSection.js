import React, { useState } from "react";
import ConstrImage from "../../assets/img/constructions-dubai.svg";
import Image from "next/image";
import { SUBSCRIBE_API } from "@/routes/apiRoutes";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const showAlertMessage = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(SUBSCRIBE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        setEmail("");
        setTimeout(() => setShowSuccess(false), 2000);
      } else {
        if (data.errors && data.errors.email && data.errors.email.includes("The email has already been taken.")) {
          showAlertMessage("This email is already subscribed. Please use a different email address.");
        } else {
          showAlertMessage("Failed to subscribe. Please try again.");
        }
      }
    } catch (error) {
      showAlertMessage("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="subscribe-section">
      <div className="subscribe-box">
        <div className="left-s-text">
          <div className="s-t-0">GET FIRST UPDATE</div>
          <div className="s-t-1">
            <p> Get the news in front line by </p>
            <div className="s-t-2 d-flex">
              <span>subscribe</span>
              <p>our latest updates</p> 
            </div>
          </div>
        </div>
        <div className="middle-image-sub">
          <Image  
            src={ConstrImage}
            alt="Dubai skyline illustration"
            width={320}
            height={160}
            priority
          />
        </div>
        <div className="subscribe-form">
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Your email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
      {showSuccess && (
        <div className="success-message">
          Successfully subscribed! Thank you.
        </div>
      )}
      {showAlert && (
        <div className="alert-message">
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default SubscribeSection;
