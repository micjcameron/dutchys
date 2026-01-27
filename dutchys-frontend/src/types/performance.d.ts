interface PerformanceEntry {
  entryType: string;
  name: string;
  startTime: number;
  duration: number;
  processingStart?: number;
  hadRecentInput?: boolean;
  value?: number;
}

interface PerformanceTiming {
  navigationStart: number;
  requestStart: number;
  responseStart: number;
  responseEnd: number;
  domLoading: number;
  domInteractive: number;
  domContentLoadedEventStart: number;
  domContentLoadedEventEnd: number;
  domComplete: number;
  loadEventStart: number;
  loadEventEnd: number;
}

interface Performance {
  timing: PerformanceTiming;
  memory?: {
    usedJSHeapSize: number;
    jsHeapSizeLimit: number;
  };
}

declare global {
  interface Window {
    performance: Performance;
  }
}

export {}; 