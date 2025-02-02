import { useEffect, useState, createContext, useContext } from 'react';
import { fetchSettingsData } from './request';

const SettingContext = createContext();

export function SettingProvider({ children }) {
  const [settings, setSettings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchSettingsData();
      setSettings(data?.settings);
    };

    fetchData();
  }, []);

  return (
    <SettingContext.Provider value={settings}>
      {children}
    </SettingContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingContext);
}