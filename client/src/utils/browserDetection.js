export const BrowserDetection = {
  getBrowser() {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      return 'Chrome';
    } else if (userAgent.includes('Firefox')) {
      return 'Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      return 'Safari';
    } else if (userAgent.includes('Edg')) {
      return 'Edge';
    } else if (userAgent.includes('Trident') || userAgent.includes('MSIE')) {
      return 'Internet Explorer';
    }
    
    return 'Unknown';
  },

  supportsFeature(feature) {
    const features = {
      grid: () => CSS.supports('display', 'grid'),
      flexbox: () => CSS.supports('display', 'flex'),
      gap: () => CSS.supports('gap', '1rem'),
      backdropFilter: () => CSS.supports('backdrop-filter', 'blur(10px)') || CSS.supports('-webkit-backdrop-filter', 'blur(10px)'),
      stickyPosition: () => CSS.supports('position', 'sticky') || CSS.supports('position', '-webkit-sticky'),
      customProperties: () => CSS.supports('--custom-property', 'value'),
      
      intersectionObserver: () => 'IntersectionObserver' in window,
      resizeObserver: () => 'ResizeObserver' in window,
      webAnimations: () => 'animate' in document.createElement('div'),
      
      touchEvents: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      pointerEvents: () => 'onpointerdown' in window,
      
      requestIdleCallback: () => 'requestIdleCallback' in window,
      performanceObserver: () => 'PerformanceObserver' in window,
    };

    return features[feature] ? features[feature]() : false;
  },

  getCapabilities() {
    return {
      browser: this.getBrowser(),
      version: this.getBrowserVersion(),
      features: {
        grid: this.supportsFeature('grid'),
        flexbox: this.supportsFeature('flexbox'),
        gap: this.supportsFeature('gap'),
        backdropFilter: this.supportsFeature('backdropFilter'),
        stickyPosition: this.supportsFeature('stickyPosition'),
        customProperties: this.supportsFeature('customProperties'),
        intersectionObserver: this.supportsFeature('intersectionObserver'),
        resizeObserver: this.supportsFeature('resizeObserver'),
        webAnimations: this.supportsFeature('webAnimations'),
        touchEvents: this.supportsFeature('touchEvents'),
        pointerEvents: this.supportsFeature('pointerEvents'),
        requestIdleCallback: this.supportsFeature('requestIdleCallback'),
        performanceObserver: this.supportsFeature('performanceObserver'),
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        devicePixelRatio: window.devicePixelRatio || 1,
      },
      platform: {
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTablet: /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
        isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
        isTouchDevice: this.supportsFeature('touchEvents'),
      }
    };
  },

  getBrowserVersion() {
    const userAgent = navigator.userAgent;
    const browser = this.getBrowser();
    
    let version = 'Unknown';
    
    switch (browser) {
      case 'Chrome':
        version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
        break;
      case 'Firefox':
        version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
        break;
      case 'Safari':
        version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
        break;
      case 'Edge':
        version = userAgent.match(/Edg\/(\d+)/)?.[1] || 'Unknown';
        break;
    }
    
    return version;
  },

  applyBrowserClasses() {
    const browser = this.getBrowser().toLowerCase();
    const capabilities = this.getCapabilities();
    
    document.documentElement.classList.add(`browser-${browser}`);
    
    Object.entries(capabilities.features).forEach(([feature, supported]) => {
      document.documentElement.classList.add(
        supported ? `supports-${feature}` : `no-${feature}`
      );
    });
    
    Object.entries(capabilities.platform).forEach(([platform, isTrue]) => {
      if (isTrue) {
        document.documentElement.classList.add(platform.toLowerCase());
      }
    });
  },

  logBrowserInfo() {
    const capabilities = this.getCapabilities();
    console.group('🌐 Browser Compatibility Report');
    console.log('Browser:', capabilities.browser, capabilities.version);
    console.log('Platform:', capabilities.platform);
    console.log('Viewport:', capabilities.viewport);
    console.log('Feature Support:', capabilities.features);
    console.groupEnd();
    
    return capabilities;
  }
};

export const PerformanceMonitor = {
  monitorAnimationPerformance(elementSelector, animationName) {
    if (!BrowserDetection.supportsFeature('performanceObserver')) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === animationName) {
          console.log(`Animation ${animationName} performance:`, {
            duration: entry.duration,
            startTime: entry.startTime,
            element: elementSelector
          });
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });
  },

  monitorLayoutShifts() {
    if (!BrowserDetection.supportsFeature('performanceObserver')) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.hadRecentInput) return;
        
        console.warn('Layout shift detected:', {
          value: entry.value,
          sources: entry.sources?.map(source => source.node)
        });
      });
    });

    observer.observe({ entryTypes: ['layout-shift'] });
  }
};

if (typeof window !== 'undefined') {
  BrowserDetection.applyBrowserClasses();
  
  if (import.meta.env?.DEV) {
    BrowserDetection.logBrowserInfo();
  }
}