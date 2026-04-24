import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { SiteSettings } from '../types';

const defaultSettings: SiteSettings = {
  heroTitle: '믿을 수 있는 폐차 서비스',
  heroSubtitle: '공단폐차장',
  companyName: '공단폐차장',
  address: '강원특별자치도 강릉시 강변로 670번길 4',
  phone: '010-8784-9173',
  hours: '24시간 연중무휴',
  primaryColor: '#FFD000',
  metaTitle: '공단폐차장 | 믿을 수 있는 자동차 폐차 서비스',
  metaDescription: '신속하고 안전한 폐차 서비스. 일반폐차, 조기폐차, 사고차량, 압류차량 등 모든 폐차 업무를 전문적으로 처리합니다.'
};

interface SettingsContextType {
  settings: SiteSettings;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'global');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as SiteSettings;
        // Migration: If the phone number is the old one, force use the new one in the UI
        // and try to update the database if permissions allow.
        const updatedData = { ...data };
        if (data.phone === '010-8794-8484') {
          updatedData.phone = '010-8784-9173';
          setDoc(docRef, { phone: '010-8784-9173' }, { merge: true }).catch(() => {
            // Silently fail if not admin, but the UI will still show the correct number
          });
        }
        setSettings({ ...defaultSettings, ...updatedData });
      } else {
        // We only allow admins to initialize settings to prevent permission errors for visitors
        // The first visit by an admin will trigger the rules-based bootstrap if needed
        console.log('Settings document not found. If you are an admin, please initialize settings.');
      }
      setLoading(false);
    }, (error) => {
      console.error('Error fetching settings:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Apply primary color to CSS variables
  useEffect(() => {
    document.documentElement.style.setProperty('--color-primary', settings.primaryColor);
  }, [settings.primaryColor]);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
