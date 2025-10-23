import React, { useEffect, useState } from 'react';

function Loading({ size = 'small', type = 'spinner', className = '', show = true }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      // Add a small delay for fade out animation
      const timer = setTimeout(() => setIsVisible(false), 200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  const getLoadingContent = () => {
    switch (type) {
      case 'dots':
        return (
          <div className="loading-dots">
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
            <div className="loading-dot"></div>
          </div>
        );
      case 'text':
        return (
          <div className="loading-text">
            Loading<span className="loading-ellipsis"></span>
          </div>
        );
      case 'spinner':
      default:
        return (
          <div className={`loading-spinner loading-spinner--${size}`}></div>
        );
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`loading-container ${className} ${show ? 'loading-fade-in' : 'loading-fade-out'}`}>
      {getLoadingContent()}
    </div>
  );
}

export default Loading;
