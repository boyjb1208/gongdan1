import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, MessageSquare, FileText, Settings, LogOut } from 'lucide-react';

export function AdminLayout() {
  const { user, isAdmin, isAuthReady, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAuthReady) {
    return <div className="min-h-screen flex items-center justify-center bg-dark text-light">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-light">
        <div className="bg-secondary p-8 rounded-2xl max-w-md w-full text-center border border-white/10">
          <div className="w-20 h-20 bg-black mx-auto flex items-center justify-center rounded-2xl mb-6 relative overflow-hidden border border-white/10 shrink-0">
            <span className="text-white font-black text-4xl tracking-tighter mt-[-4px]">GDC</span>
            <div className="absolute bottom-3.5 right-2.5 w-6 h-1.5 bg-primary"></div>
          </div>
          <h1 className="text-2xl font-bold mb-2">관리자 로그인</h1>
          <p className="text-gray-400 mb-8">공단폐차장 관리자 시스템에 접근하려면 로그인하세요.</p>
          <button
            onClick={login}
            className="w-full bg-primary text-dark font-bold py-4 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Google 계정으로 로그인
          </button>
        </div>
      </div>
    );
  }

  const navItems = [
    { path: '/admin', label: '대시보드', icon: LayoutDashboard },
    { path: '/admin/inquiries', label: '고객 문의 관리', icon: MessageSquare },
    { path: '/admin/posts', label: '게시글 관리', icon: FileText },
    { path: '/admin/settings', label: '사이트 설정', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-dark text-light font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-secondary border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center rounded-md relative overflow-hidden border border-white/10 shrink-0">
              <span className="text-white font-black text-xl tracking-tighter mt-[-2px]">GDC</span>
              <div className="absolute bottom-1.5 right-1 w-2.5 h-1 bg-primary"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg tracking-tight leading-none">관리자 시스템</span>
            </div>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? 'bg-primary text-dark font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-light'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
          >
            <LogOut size={20} />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-[#0a0a0a]">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
