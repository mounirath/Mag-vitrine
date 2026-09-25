import React from 'react';
import { Home, Search, PlusCircle, MessageSquare, User, MapPin } from 'lucide-react';

export function BottomNavBar({ activeTab, setActiveTab, unreadMessages = 1, isStoreUser = false, onOpenPublish, lang, t }) {
  const isAr = lang === 'ar';

  return (
    <nav
      className="bottom-nav-bar"
      style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}
    >
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

      {/* 3. Publier / Vendre (+) matching Mockup */}
      <button
        className={`bottom-nav-item ${activeTab === 'publish' ? 'active' : ''}`}
        onClick={() => {
          if (onOpenPublish) onOpenPublish();
          else setActiveTab('publish');
        }}
        aria-label="Publier"
      >
        <PlusCircle size={24} color={activeTab === 'publish' ? 'var(--orange-action)' : 'var(--orange-action)'} />
        <span style={{ color: 'var(--orange-action)', fontWeight: '800' }}>{isAr ? 'نشر إعلان' : 'Publier'}</span>
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
          <span style={{ position: 'absolute', top: '2px', right: '16px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--orange-action)' }} />
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
