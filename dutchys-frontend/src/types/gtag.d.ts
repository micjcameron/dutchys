declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'set' | 'get',
      targetId: string,
      config?: {
        page_path?: string;
        event_category?: string;
        event_label?: string;
        value?: number;
        send_to?: string;
        currency?: string;
        name?: string;
        event_category?: string;
        event_label?: string;
      }
    ) => void;
  }
}

export {}; 