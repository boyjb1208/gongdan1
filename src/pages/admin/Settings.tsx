import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useSettings } from '../../contexts/SettingsContext';
import { SiteSettings } from '../../types';
import { Save, AlertCircle } from 'lucide-react';

export function Settings() {
  const { settings: currentSettings } = useSettings();
  const [formData, setFormData] = useState<SiteSettings>(currentSettings);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  useEffect(() => {
    setFormData(currentSettings);
  }, [currentSettings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    try {
      await setDoc(doc(db, 'settings', 'global'), formData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">사이트 설정</h1>
        <button
          onClick={handleSubmit}
          disabled={saveStatus === 'saving'}
          className="flex items-center gap-2 bg-primary text-dark font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save size={20} />
          <span>{saveStatus === 'saving' ? '저장 중...' : saveStatus === 'success' ? '저장 완료!' : '변경사항 저장'}</span>
        </button>
      </div>

      {saveStatus === 'error' && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
          <AlertCircle size={20} />
          <span>설정 저장 중 오류가 발생했습니다. 다시 시도해주세요.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-secondary p-8 rounded-2xl border border-white/5">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-sm" />
            기본 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">회사명</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">대표 전화번호</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">주소</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-400 mb-2">운영시간</label>
              <input type="text" name="hours" value={formData.hours} onChange={handleChange} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
        </section>

        {/* Hero Section Content */}
        <section className="bg-secondary p-8 rounded-2xl border border-white/5">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-sm" />
            메인 화면 (Hero) 문구
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">메인 타이틀</label>
              <input type="text" name="heroTitle" value={formData.heroTitle} onChange={handleChange} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-2xl font-bold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">서브 타이틀</label>
              <input type="text" name="heroSubtitle" value={formData.heroSubtitle} onChange={handleChange} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
          </div>
        </section>

        {/* Design Settings */}
        <section className="bg-secondary p-8 rounded-2xl border border-white/5">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-sm" />
            디자인 설정
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">포인트 컬러 (Primary Color)</label>
              <div className="flex items-center gap-4">
                <input type="color" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="w-14 h-14 rounded-xl cursor-pointer bg-dark border border-white/10 p-1" />
                <input type="text" name="primaryColor" value={formData.primaryColor} onChange={handleChange} className="flex-1 bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono" />
              </div>
              <p className="text-xs text-gray-500 mt-2">기본값: #FFD000 (Industrial Yellow)</p>
            </div>
          </div>
        </section>

        {/* SEO Settings */}
        <section className="bg-secondary p-8 rounded-2xl border border-white/5">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <div className="w-2 h-6 bg-primary rounded-sm" />
            검색엔진 최적화 (SEO)
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Meta Title (브라우저 탭 제목)</label>
              <input type="text" name="metaTitle" value={formData.metaTitle} onChange={handleChange} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Meta Description (검색 결과 설명)</label>
              <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} rows={3} className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
