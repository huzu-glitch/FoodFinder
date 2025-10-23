import { useState, useEffect } from 'react';
import { BrowserDetection, PerformanceMonitor } from '../utils/browserDetection';

function BrowserCompatibilityTest() {
  const [capabilities, setCapabilities] = useState(null);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const caps = BrowserDetection.getCapabilities();
    setCapabilities(caps);

    runCompatibilityTests();

    if (import.meta.env?.DEV) {
      PerformanceMonitor.monitorLayoutShifts();
    }
  }, []);

  const runCompatibilityTests = () => {
    const tests = {
      gridSupport: () => {
        const testElement = document.createElement('div');
        testElement.style.display = 'grid';
        return testElement.style.display === 'grid';
      },

      flexboxSupport: () => {
        const testElement = document.createElement('div');
        testElement.style.display = 'flex';
        return testElement.style.display === 'flex';
      },

      customPropertiesSupport: () => {
        const testElement = document.createElement('div');
        testElement.style.setProperty('--test-prop', 'test');
        return testElement.style.getPropertyValue('--test-prop') === 'test';
      },

      transform3dSupport: () => {
        const testElement = document.createElement('div');
        testElement.style.transform = 'translate3d(0, 0, 0)';
        return testElement.style.transform.includes('translate3d');
      },

      animationSupport: () => {
        const testElement = document.createElement('div');
        testElement.style.animation = 'test 1s';
        return testElement.style.animation.includes('test');
      },

      touchSupport: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      },

      intersectionObserverSupport: () => {
        return 'IntersectionObserver' in window;
      },

      backdropFilterSupport: () => {
        return CSS.supports('backdrop-filter', 'blur(10px)') || 
               CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
      }
    };

    const results = {};
    Object.entries(tests).forEach(([testName, testFn]) => {
      try {
        results[testName] = testFn();
      } catch (error) {
        results[testName] = false;
        console.warn(`Test ${testName} failed:`, error);
      }
    });

    setTestResults(results);
  };

  const getStatusIcon = (supported) => {
    return supported ? '✅' : '❌';
  };

  const getStatusColor = (supported) => {
    return supported ? '#10b981' : '#ef4444';
  };

  if (!capabilities) {
    return <div>Loading browser compatibility test...</div>;
  }

  return (
    <div style={{ 
      padding: '2rem', 
      fontFamily: 'monospace', 
      backgroundColor: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      margin: '1rem'
    }}>
      <h2 style={{ marginBottom: '1rem', color: '#374151' }}>
        🌐 Browser Compatibility Report
      </h2>
      
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: '#6b7280' }}>Browser Information</h3>
        <p><strong>Browser:</strong> {capabilities.browser} {capabilities.version}</p>
        <p><strong>Platform:</strong> {capabilities.platform.isMobile ? 'Mobile' : capabilities.platform.isTablet ? 'Tablet' : 'Desktop'}</p>
        <p><strong>Touch Device:</strong> {capabilities.platform.isTouchDevice ? 'Yes' : 'No'}</p>
        <p><strong>Viewport:</strong> {capabilities.viewport.width} × {capabilities.viewport.height}</p>
        <p><strong>Device Pixel Ratio:</strong> {capabilities.viewport.devicePixelRatio}</p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: '#6b7280' }}>Feature Support</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.5rem' }}>
          {Object.entries(testResults).map(([feature, supported]) => (
            <div key={feature} style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '0.5rem',
              backgroundColor: supported ? '#f0fdf4' : '#fef2f2',
              borderRadius: '0.25rem',
              border: `1px solid ${supported ? '#bbf7d0' : '#fecaca'}`
            }}>
              <span>{feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              <span style={{ color: getStatusColor(supported) }}>
                {getStatusIcon(supported)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '0.5rem', color: '#6b7280' }}>Recommendations</h3>
        <ul style={{ paddingLeft: '1.5rem', color: '#374151' }}>
          {!testResults.gridSupport && (
            <li>CSS Grid not supported - using flexbox fallback</li>
          )}
          {!testResults.customPropertiesSupport && (
            <li>CSS Custom Properties not supported - using static values</li>
          )}
          {!testResults.backdropFilterSupport && (
            <li>Backdrop Filter not supported - using solid background</li>
          )}
          {!testResults.intersectionObserverSupport && (
            <li>Intersection Observer not supported - using scroll events</li>
          )}
          {capabilities.platform.isTouchDevice && (
            <li>Touch device detected - using touch-optimized interactions</li>
          )}
          {capabilities.viewport.width < 768 && (
            <li>Small screen detected - using mobile-optimized layout</li>
          )}
        </ul>
      </div>
    </div>
  );
}

export default BrowserCompatibilityTest;