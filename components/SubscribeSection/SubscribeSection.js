import React, { useState, useCallback } from "react";
import ConstrImage from "../../assets/img/constructions-dubai.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import { SUBSCRIBE_API } from "@/routes/apiRoutes";

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const router = useRouter();

  const showAlertMessage = useCallback((message) => {
    setAlertMessage(message);
    setShowAlert(true);
    // Use requestAnimationFrame for smoother animations
    requestAnimationFrame(() => {
      setTimeout(() => {
        requestAnimationFrame(() => {
          setShowAlert(false);
        });
      }, 2000);
    });
  }, []);

  const handleSubmit = useCallback(async (e) => {
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
        // Show success message briefly before redirecting
        requestAnimationFrame(() => {
          setTimeout(() => {
            // Redirect to thank-you page
            router.push('/thank-you');
          }, 1000);
        });
      } else {
        if (data.errors?.email?.includes("The email has already been taken.")) {
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
  }, [email, showAlertMessage, router]);

  return (
    <div className="subscribe-section" style={{ willChange: 'transform' }}>
      <div className="subscribe-box">
        <div className="left-s-text">
          <div className="s-t-0">GET FIRST UPDATE</div>
          <div className="s-t-1">
            <p>Get the news in front line by</p>
            <div className="s-t-2 d-flex">
              <span>subscribe</span>
              <p>our latest updates</p>
            </div>
          </div>
        </div>
        <div className="middle-image-sub" style={{ willChange: 'transform' }}>
          <Image
            src={ConstrImage}
            alt="Dubai skyline illustration"
            width={320}
            height={160}
            priority
            style={{ transform: 'translateZ(0)' }}
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
              style={{ willChange: 'transform' }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              style={{ willChange: 'transform' }}
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
      {showSuccess && (
        <div
          className="success-message"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            opacity: showSuccess ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          Successfully subscribed! Thank you.
        </div>
      )}
      {showAlert && (
        <div
          className="alert-message"
          style={{
            willChange: 'transform, opacity',
            transform: 'translateZ(0)',
            opacity: showAlert ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        >
          {alertMessage}
        </div>
      )}
    </div>
  );
};

export default React.memo(SubscribeSection);
