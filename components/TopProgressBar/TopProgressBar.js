import { useEffect } from 'react';
import { useRouter } from 'next/router';
import NProgress from 'nprogress';

// Configure NProgress
NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 500,
  showSpinner: false,
  trickleSpeed: 200,
});

let timer;
let activeRequests = 0;
const delay = 250;

function TopProgressBar() {
  const router = useRouter();

  // Add styles when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      #nprogress {
        pointer-events: none;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
      }
      #nprogress .bar {
        background: #22c55e !important;
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 4px;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px #22c55e, 0 0 5px #22c55e;
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const handleStart = () => {
      if (timer) return;
      
      timer = setTimeout(() => {
        NProgress.start();
      }, delay);
    };

    const handleStop = () => {
      if (activeRequests > 0) return;
      
      clearTimeout(timer);
      timer = null;
      NProgress.done();
    };

    // Handle route changes
    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleStop);
    router.events.on('routeChangeError', handleStop);

    // Handle fetch requests
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      if (activeRequests === 0) {
        handleStart();
      }

      activeRequests++;

      try {
        const response = await originalFetch(...args);
        return response;
      } catch (error) {
        return Promise.reject(error);
      } finally {
        activeRequests--;
        if (activeRequests === 0) {
          handleStop();
        }
      }
    };

    // Cleanup function
    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleStop);
      router.events.off('routeChangeError', handleStop);
      window.fetch = originalFetch;
      clearTimeout(timer);
    };
  }, [router]);

  return null;
}

export default TopProgressBar;