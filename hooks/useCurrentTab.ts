import { useEffect, useState } from 'react';

export type CurrentTab = {
  url: string;
  title: string;
};

export function useCurrentTab(): CurrentTab | null {
  const [tab, setTab] = useState<CurrentTab | null>(null);

  useEffect(() => {
    let active = true;
    void browser.tabs
      .query({ active: true, currentWindow: true })
      .then((tabs) => {
        if (!active) return;
        const current = tabs[0];
        setTab({
          url: current?.url ?? '',
          title: current?.title ?? '',
        });
      })
      .catch(() => {
        if (active) setTab({ url: '', title: '' });
      });
    return () => {
      active = false;
    };
  }, []);

  return tab;
}
