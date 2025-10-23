import { useState, useEffect, useRef } from 'react';
import { BrowserDetection } from '../utils/browserDetection';
import '../styles/components/cross-browser-test.css';

function CrossBrowserTestSuite() {
  const [testResults, setTestResults] = useState({});
  const [animationTests, setAnimationTests] = useState({});
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [isRunning, setIsRunning] = useState(false);
  const testContainerRef = useRef(null);

  useEffect(() => {
    runAllTests();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const runAllTests = async () => {
    setIsRunning(true);
    
    // Run feature detection tests
    const featureTests = runFeatureTests();
    
    // Run animation performance tests
    const animTests = await runAnimationTests();
    
    // Run layout and rendering tests
    const layoutTests = runLayoutTests();
    
    // Run performance tests
    const perfTests = runPerformanceTests();
    
    setTestResults({ ...featureTests, ...layoutTests });
    setAnimationTests(animTests);
    setPerformanceMetrics(perfTests);
    setIsRunning(false);
  };

  const runFeatureTests = () => {
    const tests = {
      // CSS Feature Tests
      cssGrid: () => CSS.supports('display', 'grid'),
      flexbox: () => CSS.supports('display', 'flex'),
      flexboxGap: () => CSS.supports('gap', '1rem'),
      customProperties: () => CSS.supports('--custom-property', 'value'),
      backdropFilter: () => CSS.supports('backdrop-filter', 'blur(10px)') || 
                           CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
      stickyPosition: () => CSS.supports('position', 'sticky') || 
                           CSS.supports('position', '-webkit-sticky'),
      transforms3d: () => CSS.supports('transform', 'translate3d(0, 0, 0)'),
      transitions: () => CSS.supports('transition', 'all 0.3s ease'),
      animations: () => CSS.supports('animation', 'test 1s'),
      borderRadius: () => CSS.supports('border-radius', '10px'),
      boxShadow: () => CSS.supports('box-shadow', '0 0 10px rgba(0,0,0,0.1)'),
      
      // JavaScript API Tests
      intersectionObserver: () => 'IntersectionObserver' in window,
      resizeObserver: () => 'ResizeObserver' in window,
      mutationObserver: () => 'MutationObserver' in window,
      webAnimations: () => 'animate' in document.createElement('div'),
      requestAnimationFrame: () => 'requestAnimationFrame' in window,
      requestIdleCallback: () => 'requestIdleCallback' in window,
      performanceObserver: () => 'PerformanceObserver' in window,
      
      // Input and Touch Tests
      touchEvents: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      pointerEvents: () => 'onpointerdown' in window,
      gestureEvents: () => 'ongesturestart' in window,
      
      // Media Query Tests
      prefersReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      prefersColorScheme: () => window.matchMedia('(prefers-color-scheme: dark)').matches,
      prefersContrast: () => window.matchMedia('(prefers-contrast: high)').matches,
      
      // Storage Tests
      localStorage: () => {
        try {
          localStorage.setItem('test', 'test');
          localStorage.removeItem('test');
          return true;
        } catch {
          return false;
        }
      },
      sessionStorage: () => {
        try {
          sessionStorage.setItem('test', 'test');
          sessionStorage.removeItem('test');
          return true;
        } catch {
          return false;
        }
      },
      
      // Network Tests
      fetch: () => 'fetch' in window,
      serviceWorker: () => 'serviceWorker' in navigator,
      
      // Modern JavaScript Features
      es6Modules: () => 'noModule' in document.createElement('script'),
      asyncAwait: () => {
        try {
          eval('(async () => {})');
          return true;
        } catch {
          return false;
        }
      },
      arrowFunctions: () => {
        try {
          eval('(() => {})');
          return true;
        } catch {
          return false;
        }
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

    return results;
  };

  const runAnimationTests = async () => {
    const results = {};
    
    // Test CSS Animation Performance
    results.cssAnimationSupport = await testCSSAnimations();
    
    // Test Transform Performance
    results.transformPerformance = await testTransformPerformance();
    
    // Test Transition Performance
    results.transitionPerformance = await testTransitionPerformance();
    
    // Test Web Animations API
    results.webAnimationsAPI = testWebAnimationsAPI();
    
    return results;
  };

  const testCSSAnimations = () => {
    return new Promise((resolve) => {
      const testElement = document.createElement('div');
      testElement.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        width: 10px;
        height: 10px;
        animation: test-animation 0.1s ease;
      `;
      
      const style = document.createElement('style');
      style.textContent = `
        @keyframes test-animation {
          0% { transform: translateX(0); }
          100% { transform: translateX(10px); }
        }
      `;
      
      document.head.appendChild(style);
      document.body.appendChild(testElement);
      
      const startTime = performance.now();
      
      testElement.addEventListener('animationend', () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        document.head.removeChild(style);
        document.body.removeChild(testElement);
        
        resolve({
          supported: true,
          duration: duration,
          performance: duration < 200 ? 'good' : duration < 500 ? 'fair' : 'poor'
        });
      });
      
      // Fallback timeout
      setTimeout(() => {
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
        if (document.body.contains(testElement)) {
          document.body.removeChild(testElement);
        }
        resolve({ supported: false, duration: null, performance: 'unsupported' });
      }, 1000);
    });
  };

  const testTransformPerformance = () => {
    return new Promise((resolve) => {
      const testElement = document.createElement('div');
      testElement.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        width: 10px;
        height: 10px;
        transition: transform 0.1s ease;
      `;
      
      document.body.appendChild(testElement);
      
      const startTime = performance.now();
      
      testElement.addEventListener('transitionend', () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        document.body.removeChild(testElement);
        
        resolve({
          supported: true,
          duration: duration,
          performance: duration < 150 ? 'excellent' : duration < 300 ? 'good' : 'fair'
        });
      });
      
      // Trigger transform
      requestAnimationFrame(() => {
        testElement.style.transform = 'translateX(100px)';
      });
      
      // Fallback timeout
      setTimeout(() => {
        if (document.body.contains(testElement)) {
          document.body.removeChild(testElement);
        }
        resolve({ supported: false, duration: null, performance: 'unsupported' });
      }, 1000);
    });
  };

  const testTransitionPerformance = () => {
    return new Promise((resolve) => {
      const testElement = document.createElement('div');
      testElement.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        width: 10px;
        height: 10px;
        background-color: red;
        transition: background-color 0.1s ease;
      `;
      
      document.body.appendChild(testElement);
      
      const startTime = performance.now();
      
      testElement.addEventListener('transitionend', () => {
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        document.body.removeChild(testElement);
        
        resolve({
          supported: true,
          duration: duration,
          performance: duration < 150 ? 'excellent' : duration < 300 ? 'good' : 'fair'
        });
      });
      
      // Trigger transition
      requestAnimationFrame(() => {
        testElement.style.backgroundColor = 'blue';
      });
      
      // Fallback timeout
      setTimeout(() => {
        if (document.body.contains(testElement)) {
          document.body.removeChild(testElement);
        }
        resolve({ supported: false, duration: null, performance: 'unsupported' });
      }, 1000);
    });
  };

  const testWebAnimationsAPI = () => {
    try {
      const testElement = document.createElement('div');
      const animation = testElement.animate([
        { transform: 'translateX(0px)' },
        { transform: 'translateX(100px)' }
      ], {
        duration: 100,
        easing: 'ease-in-out'
      });
      
      return {
        supported: true,
        hasPlaybackControl: typeof animation.pause === 'function',
        hasFinishedPromise: 'finished' in animation
      };
    } catch (error) {
      return { supported: false, error: error.message };
    }
  };

  const runLayoutTests = () => {
    const results = {};
    
    // Test Flexbox Layout
    results.flexboxLayout = testFlexboxLayout();
    
    // Test Grid Layout
    results.gridLayout = testGridLayout();
    
    // Test Sticky Positioning
    results.stickyPositioning = testStickyPositioning();
    
    // Test Viewport Units
    results.viewportUnits = testViewportUnits();
    
    return results;
  };

  const testFlexboxLayout = () => {
    try {
      const container = document.createElement('div');
      const child = document.createElement('div');
      
      container.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        display: flex;
        width: 100px;
        height: 50px;
      `;
      
      child.style.cssText = `
        flex: 1;
        min-width: 0;
      `;
      
      container.appendChild(child);
      document.body.appendChild(container);
      
      const computedStyle = window.getComputedStyle(container);
      const childComputedStyle = window.getComputedStyle(child);
      
      const isFlexContainer = computedStyle.display === 'flex';
      const childHasFlexGrow = childComputedStyle.flexGrow === '1';
      
      document.body.removeChild(container);
      
      return {
        supported: isFlexContainer && childHasFlexGrow,
        containerDisplay: computedStyle.display,
        childFlexGrow: childComputedStyle.flexGrow
      };
    } catch (error) {
      return { supported: false, error: error.message };
    }
  };

  const testGridLayout = () => {
    try {
      const container = document.createElement('div');
      container.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        width: 100px;
        height: 50px;
      `;
      
      document.body.appendChild(container);
      
      const computedStyle = window.getComputedStyle(container);
      const isGridContainer = computedStyle.display === 'grid';
      
      document.body.removeChild(container);
      
      return {
        supported: isGridContainer,
        containerDisplay: computedStyle.display
      };
    } catch (error) {
      return { supported: false, error: error.message };
    }
  };

  const testStickyPositioning = () => {
    try {
      const element = document.createElement('div');
      element.style.cssText = `
        position: sticky;
        top: 0;
      `;
      
      document.body.appendChild(element);
      
      const computedStyle = window.getComputedStyle(element);
      const isSticky = computedStyle.position === 'sticky' || 
                      computedStyle.position === '-webkit-sticky';
      
      document.body.removeChild(element);
      
      return {
        supported: isSticky,
        position: computedStyle.position
      };
    } catch (error) {
      return { supported: false, error: error.message };
    }
  };

  const testViewportUnits = () => {
    try {
      const element = document.createElement('div');
      element.style.cssText = `
        position: absolute;
        top: -1000px;
        left: -1000px;
        width: 50vw;
        height: 50vh;
      `;
      
      document.body.appendChild(element);
      
      const computedStyle = window.getComputedStyle(element);
      const expectedWidth = window.innerWidth * 0.5;
      const expectedHeight = window.innerHeight * 0.5;
      
      const actualWidth = parseFloat(computedStyle.width);
      const actualHeight = parseFloat(computedStyle.height);
      
      const widthMatches = Math.abs(actualWidth - expectedWidth) < 1;
      const heightMatches = Math.abs(actualHeight - expectedHeight) < 1;
      
      document.body.removeChild(element);
      
      return {
        supported: widthMatches && heightMatches,
        vwSupported: widthMatches,
        vhSupported: heightMatches,
        expectedWidth,
        actualWidth,
        expectedHeight,
        actualHeight
      };
    } catch (error) {
      return { supported: false, error: error.message };
    }
  };

  const runPerformanceTests = () => {
    const results = {};
    
    // Test rendering performance
    results.renderingPerformance = testRenderingPerformance();
    
    // Test memory usage
    results.memoryUsage = testMemoryUsage();
    
    // Test frame rate capability
    results.frameRate = testFrameRate();
    
    return results;
  };

  const testRenderingPerformance = () => {
    const startTime = performance.now();
    
    // Create and render multiple elements
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 100; i++) {
      const div = document.createElement('div');
      div.textContent = `Test element ${i}`;
      div.style.cssText = `
        width: 100px;
        height: 20px;
        background-color: #f0f0f0;
        margin: 1px;
        transform: translateZ(0);
      `;
      fragment.appendChild(div);
    }
    
    const container = document.createElement('div');
    container.style.cssText = `
      position: absolute;
      top: -2000px;
      left: -2000px;
    `;
    container.appendChild(fragment);
    document.body.appendChild(container);
    
    // Force layout
    container.offsetHeight;
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    document.body.removeChild(container);
    
    return {
      duration: duration,
      performance: duration < 10 ? 'excellent' : duration < 50 ? 'good' : 'poor',
      elementsPerMs: 100 / duration
    };
  };

  const testMemoryUsage = () => {
    if ('memory' in performance) {
      return {
        supported: true,
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
      };
    }
    
    return { supported: false };
  };

  const testFrameRate = () => {
    return new Promise((resolve) => {
      let frames = 0;
      const startTime = performance.now();
      
      function countFrame() {
        frames++;
        const currentTime = performance.now();
        
        if (currentTime - startTime < 1000) {
          requestAnimationFrame(countFrame);
        } else {
          const fps = frames;
          resolve({
            fps: fps,
            performance: fps >= 55 ? 'excellent' : fps >= 30 ? 'good' : 'poor',
            canMaintain60fps: fps >= 55
          });
        }
      }
      
      requestAnimationFrame(countFrame);
    });
  };

  const getStatusIcon = (result) => {
    if (typeof result === 'boolean') {
      return result ? '✅' : '❌';
    }
    if (result && typeof result === 'object') {
      return result.supported ? '✅' : '❌';
    }
    return '❓';
  };

  const getStatusColor = (result) => {
    if (typeof result === 'boolean') {
      return result ? '#10b981' : '#ef4444';
    }
    if (result && typeof result === 'object') {
      return result.supported ? '#10b981' : '#ef4444';
    }
    return '#6b7280';
  };

  const formatTestName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/Api/g, 'API')
      .replace(/Css/g, 'CSS')
      .replace(/Html/g, 'HTML')
      .replace(/Js/g, 'JS');
  };

  const browserInfo = BrowserDetection.getCapabilities();

  if (isRunning) {
    return (
      <div className="cross-browser-test-suite">
        <div className="test-loading">
          <div className="test-spinner"></div>
          <p>Running cross-browser compatibility tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="cross-browser-test-suite" ref={testContainerRef}>
      <div className="test-header">
        <h2>🌐 Cross-Browser Compatibility Test Suite</h2>
        <button 
          className="test-refresh-button" 
          onClick={runAllTests}
          disabled={isRunning}
        >
          🔄 Refresh Tests
        </button>
      </div>

      <div className="test-section">
        <h3>Browser Information</h3>
        <div className="browser-info-grid">
          <div className="info-item">
            <strong>Browser:</strong> {browserInfo.browser} {browserInfo.version}
          </div>
          <div className="info-item">
            <strong>Platform:</strong> {browserInfo.platform.isMobile ? 'Mobile' : browserInfo.platform.isTablet ? 'Tablet' : 'Desktop'}
          </div>
          <div className="info-item">
            <strong>Touch Device:</strong> {browserInfo.platform.isTouchDevice ? 'Yes' : 'No'}
          </div>
          <div className="info-item">
            <strong>Viewport:</strong> {browserInfo.viewport.width} × {browserInfo.viewport.height}
          </div>
          <div className="info-item">
            <strong>Device Pixel Ratio:</strong> {browserInfo.viewport.devicePixelRatio}
          </div>
        </div>
      </div>

      <div className="test-section">
        <h3>Feature Support Tests</h3>
        <div className="test-results-grid">
          {Object.entries(testResults).map(([feature, result]) => (
            <div key={feature} className="test-result-item">
              <span className="test-name">{formatTestName(feature)}</span>
              <span 
                className="test-status"
                style={{ color: getStatusColor(result) }}
              >
                {getStatusIcon(result)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="test-section">
        <h3>Animation Performance Tests</h3>
        <div className="animation-results">
          {Object.entries(animationTests).map(([test, result]) => (
            <div key={test} className="animation-result-item">
              <h4>{formatTestName(test)}</h4>
              <div className="animation-details">
                {typeof result === 'object' && result !== null ? (
                  Object.entries(result).map(([key, value]) => (
                    <div key={key} className="detail-item">
                      <span className="detail-key">{formatTestName(key)}:</span>
                      <span className="detail-value">
                        {typeof value === 'number' ? `${value.toFixed(2)}ms` : String(value)}
                      </span>
                    </div>
                  ))
                ) : (
                  <span>{String(result)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="test-section">
        <h3>Performance Metrics</h3>
        <div className="performance-results">
          {Object.entries(performanceMetrics).map(([metric, result]) => (
            <div key={metric} className="performance-result-item">
              <h4>{formatTestName(metric)}</h4>
              <div className="performance-details">
                {typeof result === 'object' && result !== null ? (
                  Object.entries(result).map(([key, value]) => (
                    <div key={key} className="detail-item">
                      <span className="detail-key">{formatTestName(key)}:</span>
                      <span className="detail-value">
                        {typeof value === 'number' ? 
                          (key.includes('Size') || key.includes('Limit') ? 
                            `${(value / 1024 / 1024).toFixed(2)} MB` : 
                            value.toFixed(2)
                          ) : 
                          String(value)
                        }
                      </span>
                    </div>
                  ))
                ) : (
                  <span>{String(result)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="test-section">
        <h3>Recommendations</h3>
        <div className="recommendations">
          {!testResults.cssGrid && (
            <div className="recommendation-item warning">
              ⚠️ CSS Grid not supported - using flexbox fallback
            </div>
          )}
          {!testResults.flexboxGap && (
            <div className="recommendation-item warning">
              ⚠️ Flexbox gap not supported - using margin fallback
            </div>
          )}
          {!testResults.customProperties && (
            <div className="recommendation-item error">
              ❌ CSS Custom Properties not supported - using static values
            </div>
          )}
          {!testResults.backdropFilter && (
            <div className="recommendation-item info">
              ℹ️ Backdrop Filter not supported - using solid background
            </div>
          )}
          {!testResults.intersectionObserver && (
            <div className="recommendation-item warning">
              ⚠️ Intersection Observer not supported - using scroll events
            </div>
          )}
          {browserInfo.platform.isTouchDevice && (
            <div className="recommendation-item success">
              ✅ Touch device detected - using touch-optimized interactions
            </div>
          )}
          {browserInfo.viewport.width < 768 && (
            <div className="recommendation-item info">
              ℹ️ Small screen detected - using mobile-optimized layout
            </div>
          )}
          {testResults.prefersReducedMotion && (
            <div className="recommendation-item info">
              ℹ️ Reduced motion preference detected - animations disabled
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CrossBrowserTestSuite;