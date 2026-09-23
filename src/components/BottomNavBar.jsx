import React from 'react';
import { Home, Search, PlusCircle, MessageSquare, User, MapPin } from 'lucide-react';

export function BottomNavBar({ activeTab, setActiveTab, unreadMessages = 1, lang, t }) {
  const isAr = lang === 'ar';

  return (
    <nav className="bottom-nav-bar">
      {/* 1. Home */}
      <button
        className={`bottom-nav-item ${activeTab === 'home' ? 'active' : ''}`}
        onClick={() => setActiveTab('home')}
        aria-label="Home"
      >
        <Home size={22} color={activeTab === 'home' ? 'var(--orange-action)' : 'currentColor'} />
        <span>{isAr ? 'الرئيسية' : 'Home'}</span>
      </button>

      {/* 2. Recherche / Local-Connect */}
      <button
        className={`bottom-nav-item ${activeTab === 'local_connect' ? 'active' : ''}`}
        onClick={() => setActiveTab('local_connect')}
        aria-label="Recherche"
      >
        <Search size={22} color={activeTab === 'local_connect' ? 'var(--orange-action)' : 'currentColor'} />
        <span>{isAr ? 'بحث وموقع' : 'Recherche'}</span>
      </button>

      {/* 3. Publier */}
      <button
        className={`bottom-nav-item ${activeTab === 'publish' ? 'active' : ''}`}
        onClick={() => setActiveTab('publish')}
        aria-label="Publier"
      >
        <PlusCircle size={24} color={activeTab === 'publish' ? 'var(--orange-action)' : 'currentColor'} />
        <span>{isAr ? 'نشر' : 'Publier'}</span>
      </button>

      {/* 4. Messages */}
      <button
        className={`bottom-nav-item ${activeTab === 'messages' ? 'active' : ''}`}
        onClick={() => setActiveTab('messages')}
        aria-label="Messages"
        style={{ position: 'relative' }}
      >
        <MessageSquare size={22} color={activeTab === 'messages' ? 'var(--orange-action)' : 'currentColor'} />
        <span>{isAr ? 'رسائل' : 'Messages'}</span>
        {unreadMessages > 0 && (
          <span style={{ position: 'absolute', top: '2px', right: '22px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange-action)' }} />
        )}
      </button>

      {/* 5. Profil */}
      <button
        className={`bottom-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
        onClick={() => setActiveTab('profile')}
        aria-label="Profil"
      >
        <User size={22} color={activeTab === 'profile' ? 'var(--orange-action)' : 'currentColor'} />
        <span>{isAr ? 'حسابي' : 'Profil'}</span>
      </button>
    </nav>
  );
}
