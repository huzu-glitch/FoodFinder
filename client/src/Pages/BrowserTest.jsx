import { useState, useEffect } from 'react';
import CrossBrowserTestSuite from '../components/CrossBrowserTestSuite';
import BrowserCompatibilityTest from '../components/BrowserCompatibilityTest';
import { BrowserDetection } from '../utils/browserDetection';

function BrowserTest() {
  const [activeTab, setActiveTab] = useState('comprehensive');
  const [browserInfo, setBrowserInfo] = useState(null);

  useEffect(() => {
    // Get browser information
    const info = BrowserDetection.getCapabilities();
    setBrowserInfo(info);
    
    // Apply browser-specific classes for testing
    BrowserDetection.applyBrowserClasses();
  }, []);

  const tabs = [
    { id: 'comprehensive', label: 'Comprehensive Tests', component: CrossBrowserTestSuite },
    { id: 'basic', label: 'Basic Compatibility', component: BrowserCompatibilityTest }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="browser-test-page">
      <div className="page-header">
        <h1>🌐 Cross-Browser Compatibility Testing</h1>
        <p className="page-description">
          Test and verify that all UI components work correctly across different browsers and devices.
          This page helps identify browser-specific issues and provides recommendations for fixes.
        </p>
        
        {browserInfo && (
          <div className="current-browser-info">
            <h2>Current Browser</h2>
            <div className="browser-details">
              <span className="browser-name">
                {browserInfo.browser} {browserInfo.version}
              </span>
              <span className="browser-platform">
                {browserInfo.platform.isMobile ? '📱 Mobile' : 
                 browserInfo.platform.isTablet ? '📱 Tablet' : 
                 '💻 Desktop'}
              </span>
              <span className="browser-viewport">
                {browserInfo.viewport.width} × {browserInfo.viewport.height}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="test-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`test-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="test-content">
        {ActiveComponent && <ActiveComponent />}
      </div>

      <div className="testing-instructions">
        <h2>Testing Instructions</h2>
        <div className="instructions-grid">
          <div className="instruction-card">
            <h3>🔍 Manual Testing</h3>
            <ul>
              <li>Test in Chrome, Firefox, Safari, and Edge</li>
              <li>Verify animations work smoothly</li>
              <li>Check responsive design on different screen sizes</li>
              <li>Test touch interactions on mobile devices</li>
              <li>Verify keyboard navigation works</li>
            </ul>
          </div>
          
          <div className="instruction-card">
            <h3>⚡ Performance Testing</h3>
            <ul>
              <li>Monitor frame rates during animations</li>
              <li>Check for layout shifts</li>
              <li>Verify smooth scrolling</li>
              <li>Test loading performance</li>
              <li>Monitor memory usage</li>
            </ul>
          </div>
          
          <div className="instruction-card">
            <h3>♿ Accessibility Testing</h3>
            <ul>
              <li>Test with screen readers</li>
              <li>Verify keyboard-only navigation</li>
              <li>Check color contrast ratios</li>
              <li>Test with reduced motion preferences</li>
              <li>Verify focus indicators are visible</li>
            </ul>
          </div>
          
          <div className="instruction-card">
            <h3>🐛 Issue Reporting</h3>
            <ul>
              <li>Document browser version and OS</li>
              <li>Include screenshots or videos</li>
              <li>Note specific steps to reproduce</li>
              <li>Check console for errors</li>
              <li>Test on different devices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrowserTest;