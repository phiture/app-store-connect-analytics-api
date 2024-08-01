'use client';

import { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import {MoonIcon, SunIcon} from "@heroicons/react/24/solid";

const ThemeToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    const initialTheme = root.classList.contains('dark');
    setEnabled(initialTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (enabled) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [enabled]);

  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? 'bg-indigo-600' : 'bg-gray-200'}
        relative inline-flex h-6 w-11 items-center rounded-full`}
    >
      <span className="sr-only">Enable dark mode</span>
      <span
        className={`${enabled ? 'translate-x-6' : 'translate-x-1'}
          inline-block h-4 w-4 transform rounded-full bg-white transition`}
      />
      {enabled ? <MoonIcon className="h-5 w-5 text-white absolute left-1" /> : <SunIcon className="h-5 w-5 text-yellow-500 absolute right-1" />}
    </Switch>
  );
};

export default ThemeToggle;
