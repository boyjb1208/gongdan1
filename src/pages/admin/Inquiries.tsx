import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Inquiry } from '../../types';
import { Search, Filter, MoreVertical, Check, Trash2, Edit3, X } from 'lucide-react';

export function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'contacted' | 'completed'>('all');
  const [editingMemo, setEditingMemo] = useState<string | null>(null);
  const [memoText, setMemoText] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setInquiries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry)));
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'inquiries', id));
      } catch (error) {
        console.error('Error deleting inquiry:', error);
      }
    }
  };

  const handleSaveMemo = async (id: string) => {
    try {
      await updateDoc(doc(db, 'inquiries', id), { memo: memoText });
      setEditingMemo(null);
    } catch (error) {
      console.error('Error saving memo:', error);
    }
  };

  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.name.includes(searchTerm) || inq.contact.includes(searchTerm) || inq.carType.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || inq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">고객 문의 관리</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="이름, 연락처, 차종 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-secondary border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-secondary border border-white/10 rounded-xl focus:outline-none focus:border-primary transition-colors appearance-none"
          >
            <option value="all">전체 상태</option>
            <option value="pending">대기 중</option>
            <option value="contacted">연락 완료</option>
            <option value="completed">처리 완료</option>
          </select>
        </div>
      </div>

      <div className="bg-secondary rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/5 text-sm font-medium text-gray-400">
              <th className="p-4">등록일</th>
              <th className="p-4">고객명</th>
              <th className="p-4">연락처</th>
              <th className="p-4">차량 정보</th>
              <th className="p-4">위치</th>
              <th className="p-4">상태</th>
              <th className="p-4">메모</th>
              <th className="p-4 text-right">관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredInquiries.map((inq) => (
              <tr key={inq.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="p-4 text-sm text-gray-400">
                  {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : ''}
                </td>
                <td className="p-4 font-bold">{inq.name}</td>
                <td className="p-4 text-sm">{inq.contact}</td>
                <td className="p-4 text-sm">
                  {inq.carType} <span className="text-gray-500">({inq.carYear})</span>
                </td>
                <td className="p-4 text-sm text-gray-400">{inq.location}</td>
                <td className="p-4">
                  <select
                    value={inq.status}
                    onChange={(e) => handleStatusChange(inq.id!, e.target.value)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full outline-none appearance-none cursor-pointer ${
                      inq.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' :
                      inq.status === 'contacted' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-green-500/20 text-green-400'
                    }`}
                  >
                    <option value="pending">대기 중</option>
                    <option value="contacted">연락 완료</option>
                    <option value="completed">처리 완료</option>
                  </select>
                </td>
                <td className="p-4">
                  {editingMemo === inq.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={memoText}
                        onChange={(e) => setMemoText(e.target.value)}
                        className="bg-dark border border-white/10 rounded px-2 py-1 text-sm w-32"
                      />
                      <button onClick={() => handleSaveMemo(inq.id!)} className="text-green-500 hover:text-green-400"><Check size={16} /></button>
                      <button onClick={() => setEditingMemo(null)} className="text-red-500 hover:text-red-400"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 group cursor-pointer" onClick={() => { setEditingMemo(inq.id!); setMemoText(inq.memo || ''); }}>
                      <span className="text-sm text-gray-400 truncate max-w-[150px]">{inq.memo || '메모 없음'}</span>
                      <Edit3 size={14} className="text-gray-600 group-hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  )}
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => handleDelete(inq.id!)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredInquiries.length === 0 && (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500">
                  문의 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
