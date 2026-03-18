import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Users, FileText, MessageSquare, Activity } from 'lucide-react';

export function Dashboard() {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    pendingInquiries: 0,
    totalPosts: 0,
    totalReviews: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const inquiriesSnap = await getDocs(collection(db, 'inquiries'));
        const pendingSnap = await getDocs(query(collection(db, 'inquiries'), where('status', '==', 'pending')));
        const postsSnap = await getDocs(collection(db, 'posts'));
        const reviewsSnap = await getDocs(collection(db, 'reviews'));

        setStats({
          totalInquiries: inquiriesSnap.size,
          pendingInquiries: pendingSnap.size,
          totalPosts: postsSnap.size,
          totalReviews: reviewsSnap.size
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: '총 문의 수', value: stats.totalInquiries, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: '대기 중인 문의', value: stats.pendingInquiries, icon: Activity, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { title: '등록된 게시글', value: stats.totalPosts, icon: FileText, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: '고객 후기', value: stats.totalReviews, icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-secondary p-6 rounded-2xl border border-white/5 flex items-center gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                <p className="text-3xl font-black">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-secondary p-8 rounded-2xl border border-white/5">
        <h2 className="text-xl font-bold mb-4">환영합니다!</h2>
        <p className="text-gray-400">
          왼쪽 메뉴를 통해 고객 문의를 관리하고, 게시글을 작성하며, 사이트 설정을 변경할 수 있습니다.
        </p>
      </div>
    </div>
  );
}
