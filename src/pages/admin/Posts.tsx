import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Post } from '../../types';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';

export function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'notice',
    thumbnail: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post)));
    });
    return () => unsubscribe();
  }, []);

  const handleOpenModal = (post?: Post) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        summary: post.summary || '',
        content: post.content,
        category: post.category,
        thumbnail: post.thumbnail || ''
      });
    } else {
      setEditingPost(null);
      setFormData({ title: '', summary: '', content: '', category: 'notice', thumbnail: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPost) {
        await updateDoc(doc(db, 'posts', editingPost.id!), { ...formData });
      } else {
        await addDoc(collection(db, 'posts'), { ...formData, createdAt: new Date() });
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteDoc(doc(db, 'posts', id));
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">게시글 관리</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary text-dark font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          <span>새 게시글 작성</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-secondary rounded-2xl border border-white/5 overflow-hidden flex flex-col">
            {post.thumbnail ? (
              <img src={post.thumbnail} alt={post.title} className="w-full h-48 object-cover" referrerPolicy="no-referrer" />
            ) : (
              <div className="w-full h-48 bg-dark flex items-center justify-center">
                <ImageIcon size={48} className="text-white/10" />
              </div>
            )}
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${post.category === 'notice' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                  {post.category === 'notice' ? '공지사항' : '블로그'}
                </span>
                <span className="text-gray-500 text-xs">
                  {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ''}
                </span>
              </div>
              <h3 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h3>
              <p className="text-gray-400 text-sm line-clamp-3 mb-6 flex-1">{post.summary}</p>
              
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                <button onClick={() => handleOpenModal(post)} className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(post.id!)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 bg-secondary rounded-2xl border border-white/5">
            등록된 게시글이 없습니다.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-secondary w-full max-w-3xl rounded-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h2 className="text-2xl font-bold">{editingPost ? '게시글 수정' : '새 게시글 작성'}</h2>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">카테고리</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option value="notice">공지사항</option>
                    <option value="blog">블로그</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">썸네일 이미지 URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">제목</label>
                <input
                  required
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="게시글 제목을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">요약 (선택)</label>
                <input
                  type="text"
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                  placeholder="목록에 표시될 짧은 요약을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">본문 내용</label>
                <textarea
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={10}
                  className="w-full bg-dark border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none font-mono text-sm"
                  placeholder="게시글 본문을 입력하세요 (Markdown 지원 안됨, 일반 텍스트)"
                />
              </div>

              <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-3 rounded-xl font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-primary text-dark font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  {editingPost ? '수정하기' : '등록하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
