import { BrowserDetection, PerformanceMonitor } from './utils/browserDetection.js';

console.group('🌐 Browser Detection Tests');
const capabilities = BrowserDetection.getCapabilities();
console.log('Browser:', capabilities.browser, capabilities.version);
console.log('Platform:', capabilities.platform);
console.log('Features:', capabilities.features);
console.groupEnd();

console.group('✅ Feature Support Tests');
const criticalFeatures = [
  'grid',
  'flexbox',
  'customProperties',
  'transforms3d',
  'transitions',
  'animations'
];

criticalFeatures.forEach(feature => {
  const supported = BrowserDetection.supportsFeature(feature);
  console.log(`${feature}:`, supported ? '✅ Supported' : '❌ Not Supported');
});
console.groupEnd();

console.group('🎬 Animation Tests');
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
  console.log('Transform transition duration:', `${duration.toFixed(2)}ms`);
  console.log('Performance:', duration < 150 ? '✅ Excellent' : duration < 300 ? '⚠️ Good' : '❌ Poor');
  document.body.removeChild(testElement);
});

requestAnimationFrame(() => {
  testElement.style.transform = 'translateX(100px)';
});
console.groupEnd();

console.group('📱 Responsive Design Tests');
const viewportWidth = window.innerWidth;
const viewportHeight = window.innerHeight;
const devicePixelRatio = window.devicePixelRatio || 1;

console.log('Viewport:', `${viewportWidth} × ${viewportHeight}`);
console.log('Device Pixel Ratio:', devicePixelRatio);
console.log('Screen Category:', 
  viewportWidth < 480 ? '📱 Mobile Small' :
  viewportWidth < 768 ? '📱 Mobile Large' :
  viewportWidth < 1024 ? '📱 Tablet' :
  viewportWidth < 1200 ? '💻 Desktop' :
  '🖥️ Large Desktop'
);
console.groupEnd();

console.group('👆 Touch Tests');
const hasTouchEvents = 'ontouchstart' in window;
const hasPointerEvents = 'onpointerdown' in window;
const maxTouchPoints = navigator.maxTouchPoints || 0;

console.log('Touch Events:', hasTouchEvents ? '✅ Supported' : '❌ Not Supported');
console.log('Pointer Events:', hasPointerEvents ? '✅ Supported' : '❌ Not Supported');
console.log('Max Touch Points:', maxTouchPoints);
console.log('Touch Device:', maxTouchPoints > 0 ? '✅ Yes' : '❌ No');
console.groupEnd();

console.group('♿ Accessibility Tests');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;

console.log('Prefers Reduced Motion:', prefersReducedMotion ? '✅ Yes' : '❌ No');
console.log('Prefers High Contrast:', prefersHighContrast ? '✅ Yes' : '❌ No');
console.log('Prefers Dark Mode:', prefersColorScheme ? '✅ Yes' : '❌ No');
console.groupEnd();

if (BrowserDetection.supportsFeature('performanceObserver')) {
  console.group('⚡ Performance Monitoring');
  PerformanceMonitor.monitorLayoutShifts();
  console.log('Layout shift monitoring enabled');
  console.groupEnd();
}

console.group('📊 Compatibility Summary');
const totalFeatures = Object.keys(capabilities.features).length;
const supportedFeatures = Object.values(capabilities.features).filter(Boolean).length;
const compatibilityScore = Math.round((supportedFeatures / totalFeatures) * 100);

console.log(`Compatibility Score: ${compatibilityScore}% (${supportedFeatures}/${totalFeatures} features)`);
console.log('Browser Grade:', 
  compatibilityScore >= 90 ? '🏆 Excellent (A+)' :
  compatibilityScore >= 80 ? '✅ Good (A)' :
  compatibilityScore >= 70 ? '⚠️ Fair (B)' :
  compatibilityScore >= 60 ? '⚠️ Poor (C)' :
  '❌ Unsupported (F)'
);
console.groupEnd();

export { capabilities, compatibilityScore };