import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';
import { db } from '../firebase';
import { collection, addDoc, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { Inquiry, Post, Review } from '../types';
import { Car, Wrench, FileText, AlertTriangle, CheckCircle, Clock, MapPin, Phone, Star } from 'lucide-react';

export function Home() {
  const { settings } = useSettings();
  const [posts, setPosts] = useState<Post[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    carType: '',
    carYear: '',
    location: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Fetch latest posts
    const qPosts = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(3));
    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    });

    // Fetch latest reviews
    const qReviews = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'), limit(5));
    const unsubReviews = onSnapshot(qReviews, (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    });

    return () => {
      unsubPosts();
      unsubReviews();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('submitting');
    try {
      // Send data to Formspree
      const response = await fetch('https://formspree.io/f/meerpwbk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Formspree submission failed');
      }

      // Save to Firestore for admin dashboard
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        status: 'pending',
        createdAt: new Date()
      });
      setSubmitStatus('success');
      setFormData({ name: '', contact: '', carType: '', carYear: '', location: '', message: '' });
      setTimeout(() => setSubmitStatus('idle'), 3000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-dark text-light">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2000&auto=format&fit=crop"
            alt="Scrap yard"
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 text-balance"
          >
            {settings.heroTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-10 font-medium"
          >
            {settings.heroSubtitle}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#contact" className="w-full sm:w-auto px-8 py-4 bg-primary text-dark font-bold rounded-full text-lg hover:bg-primary/90 transition-colors">
              폐차 상담 신청
            </a>
            <a href={`tel:${settings.phone}`} className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-full text-lg hover:bg-white/20 transition-colors border border-white/10">
              전화 문의
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">전문 폐차 서비스</h2>
            <p className="text-gray-400">고객님의 상황에 맞는 최적의 폐차 솔루션을 제공합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '일반 폐차', desc: '가장 빠르고 간편한 일반적인 폐차 절차', icon: Car },
              { title: '조기 폐차', desc: '노후 경유차 정부 지원금 혜택 안내 및 대행', icon: CheckCircle },
              { title: '사고 차량 폐차', desc: '수리 불가 사고 차량 최고가 매입 및 폐차', icon: AlertTriangle },
              { title: '압류 차량 폐차', desc: '차령초과말소 제도를 통한 합법적 폐차', icon: FileText },
              { title: '차량 말소 대행', desc: '복잡한 행정 절차를 완벽하게 대행', icon: Wrench },
            ].map((service, idx) => {
              const Icon = service.icon;
              return (
                <div key={idx} className="bg-dark p-8 rounded-2xl border border-white/5 hover:border-primary/50 transition-colors group cursor-pointer">
                  <div className="w-14 h-14 bg-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-dark transition-colors">
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-400">{service.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">폐차 진행 절차</h2>
            <p className="text-gray-400">복잡한 폐차, 공단폐차장에서 쉽고 빠르게 해결하세요.</p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
              {[
                { step: '01', title: '상담 신청', desc: '온라인 또는 전화 상담' },
                { step: '02', title: '차량 확인', desc: '원부 조회 및 상태 확인' },
                { step: '03', title: '견적 안내', desc: '최고가 보상금 산정' },
                { step: '04', title: '폐차 진행', desc: '무료 견인 및 폐차장 입고' },
                { step: '05', title: '차량 말소', desc: '말소증 발급 및 보험 해지' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-secondary border-2 border-primary rounded-full flex items-center justify-center text-xl font-black mb-6 shadow-[0_0_20px_rgba(255,208,0,0.2)]">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">고객 후기</h2>
            <p className="text-gray-400">공단폐차장을 이용하신 고객님들의 생생한 후기입니다.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: '김*철', rating: 5, content: '사고차량이라 막막했는데, 친절하게 상담해주시고 최고가로 매입해주셔서 정말 감사했습니다. 처리도 엄청 빠르네요!', date: '2023.10.15' },
              { name: '이*영', rating: 5, content: '조기폐차 지원금 알아보다가 연락드렸는데, 서류 준비부터 말소까지 알아서 다 해주셔서 너무 편했습니다.', date: '2023.09.28' },
              { name: '박*민', rating: 5, content: '견인 기사님도 친절하시고, 전화 한 통으로 모든 게 해결되니 직장인에게 최고입니다. 추천합니다!', date: '2023.09.10' },
            ].map((review, idx) => (
              <div key={idx} className="bg-secondary p-8 rounded-2xl border border-white/5">
                <div className="flex items-center gap-1 mb-4 text-primary">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">"{review.content}"</p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span className="font-bold text-white">{review.name} 고객님</span>
                  <span>{review.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">빠른 상담 문의</h2>
              <p className="text-gray-400 mb-10 text-lg">
                차량 정보와 연락처를 남겨주시면, 전문 상담원이 신속하게 연락드리겠습니다.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center shrink-0">
                    <Phone className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">고객센터</h4>
                    <p className="text-2xl font-black text-primary">{settings.phone}</p>
                    <p className="text-gray-400 text-sm mt-1">{settings.hours}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-dark rounded-full flex items-center justify-center shrink-0">
                    <MapPin className="text-primary" size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1">오시는 길</h4>
                    <p className="text-gray-300 mb-4">{settings.address}</p>
                    <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10">
                      <iframe 
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Map"
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-dark p-8 rounded-3xl border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">이름</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="홍길동" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">연락처</label>
                    <input required type="tel" name="contact" value={formData.contact} onChange={handleChange} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="010-0000-0000" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">차량 종류</label>
                    <input required type="text" name="carType" value={formData.carType} onChange={handleChange} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="소나타" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">차량 연식</label>
                    <input required type="text" name="carYear" value={formData.carYear} onChange={handleChange} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="2010년식" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">차량 위치</label>
                  <input required type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors" placeholder="서울시 강남구" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">문의 내용 (선택)</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none" placeholder="추가 문의사항을 입력해주세요." />
                </div>
                <button 
                  type="submit" 
                  disabled={submitStatus === 'submitting'}
                  className="w-full bg-primary text-dark font-bold text-lg py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {submitStatus === 'submitting' ? '접수 중...' : submitStatus === 'success' ? '접수 완료!' : '상담 요청하기'}
                </button>
                {submitStatus === 'error' && <p className="text-red-500 text-sm text-center mt-2">오류가 발생했습니다. 다시 시도해주세요.</p>}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Notice & Blog Section */}
      <section className="py-24 bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">공지사항 및 블로그</h2>
              <p className="text-gray-400">폐차 관련 유용한 정보와 소식을 확인하세요.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div key={post.id} className="bg-secondary rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors cursor-pointer group">
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-48 bg-dark flex items-center justify-center">
                    <FileText size={48} className="text-white/10" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${post.category === 'notice' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                      {post.category === 'notice' ? '공지사항' : '블로그'}
                    </span>
                    <span className="text-gray-500 text-xs">
                      {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : '최근'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-3">{post.summary}</p>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-500">
                등록된 게시글이 없습니다.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
