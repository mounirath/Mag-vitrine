import React, { useState } from 'react';
import { ArrowLeft, MapPin, Search, Navigation, Users, ChevronDown, CheckCircle, Package, Store } from 'lucide-react';

export function LocalConnectView({
  products,
  stores,
  isOpen,
  onClose,
  onSelectProduct,
  lang,
  t
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('Alger');
  const [remiseMode, setRemiseMode] = useState('hand'); // hand or express
  const [trocModalOpen, setTrocModalOpen] = useState(false);

  if (!isOpen) return null;
  const isAr = lang === 'ar';

  return (
    <div className="screen-modal-overlay">
      <div className="modal-screen-header">
        <button className="btn-back-header" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <span className="modal-header-title">
          {isAr ? 'الاتصال المحلي والموقع' : 'Local-Connect'}
        </span>
        <div style={{ width: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Navigation size={18} color="#38bdf8" />
        </div>
      </div>

      <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
        {/* Search & Wilaya bar */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '0.6rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem', boxShadow: 'var(--shadow-card)' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder={isAr ? 'البحث عن سلع ومتاجر بالقرب مني...' : 'Rechercher des objets et boutiques proches...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '0.88rem', color: 'var(--text-main)' }}
          />
          <span style={{ fontSize: '0.75rem', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '700' }}>
            58 Wilayas
          </span>
        </div>

        {/* Map Simulation Container */}
        <div className="map-container-mockup" style={{ height: '320px', position: 'relative' }}>
          {/* Stylized vector map background representation */}
          <svg style={{ position: 'absolute', width: '100%', height: '100%', background: '#e5eedb' }}>
            {/* Roads & River paths */}
            <path d="M-20 60 Q 150 80, 260 40 T 500 120" stroke="#ffffff" strokeWidth="14" fill="none" />
            <path d="M120 -20 Q 160 140, 180 340" stroke="#ffffff" strokeWidth="12" fill="none" />
            <path d="M40 240 Q 220 200, 380 290" stroke="#ffffff" strokeWidth="10" fill="none" />
            <path d="M260 -10 Q 280 180, 420 340" stroke="#ffffff" strokeWidth="8" fill="none" />
            <path d="M-10 180 Q 80 140, 200 170 T 450 160" stroke="#dbe7d0" strokeWidth="24" fill="none" />
            {/* River */}
            <path d="M-20 290 Q 160 270, 320 300 T 520 280" stroke="#bae6fd" strokeWidth="16" fill="none" />
          </svg>

          {/* User Location Radar */}
          <div style={{ position: 'absolute', top: '50%', left: '48%', transform: 'translate(-50%, -50%)', zIndex: 4 }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(2, 132, 199, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#0284c7', border: '2px solid #ffffff' }} />
            </div>
          </div>

          {/* Interactive Item Pins matching screenshot */}
          {products.slice(0, 4).map((prod, idx) => {
            const coords = prod.coords || { x: 25 + idx * 22, y: 30 + idx * 15 };
            return (
              <div
                key={prod.id}
                className="map-pin-marker"
                style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                onClick={() => onSelectProduct(prod)}
              >
                <div className="map-pin-card-preview">
                  <img src={prod.image} alt={prod.name} />
                  <span style={{ maxWidth: '64px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '2px' }}>
                    {prod.name}
                  </span>
                  <span style={{ color: 'var(--orange-hover)', fontWeight: '800' }}>
                    {prod.priceEur ? `${prod.priceEur} €` : `${Math.round(prod.price / 1000)}k`}
                  </span>
                </div>
                <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '7px solid var(--primary)', margin: '0 auto' }} />
              </div>
            );
          })}

          {/* GPS Recenter Pill Button */}
          <button
            style={{ position: 'absolute', bottom: '12px', right: '12px', background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)', cursor: 'pointer', zIndex: 10 }}
            onClick={() => alert(isAr ? 'تم تحديد موقعك بدقة في الجزائر' : 'Position GPS actualisée (Alger Centre)')}
          >
            <Navigation size={18} color="#0284c7" />
          </button>
        </div>

        {/* Hand delivery dropdown card */}
        <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '1rem', border: '1px solid var(--border-light)', marginBottom: '1rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Package size={20} color="#0284c7" />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: '800' }}>
                  {isAr ? 'خيارات التسليم باليد' : 'Remise en main propre'}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {isAr ? 'لقاء آمن في الأماكن العامة المعتمدة' : 'Point de rendez-vous public vérifié (Centres commerciaux, places)'}
                </p>
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', background: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '9999px', fontWeight: '700' }}>
              Gratuit 0 DZD
            </span>
          </div>
        </div>

        {/* Groupe de Troc local */}
        <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '1.1rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', marginLeft: '-6px' }}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff' }} alt="User" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-10px' }} alt="User" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #fff', marginLeft: '-10px' }} alt="User" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '800' }}>
                {isAr ? 'مجموعة التبادل والمقايضة المحلية' : 'Groupe de Troc local'}
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {isAr ? 'تبادل الأجهزة والأثاث دون دفع أموال' : 'Échangez sans argent : troquez vos objets directement'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setTrocModalOpen(true)}
            style={{ width: '100%', background: '#f1f5f9', border: '1px solid var(--border-light)', borderRadius: '12px', padding: '0.6rem', fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', cursor: 'pointer' }}
          >
            {isAr ? 'عرض عروض التبادل (14 اقتراح)' : 'Explorer les échanges de troc (14 annonces)'}
          </button>
        </div>

        {trocModalOpen && (
          <div style={{ marginTop: '1rem', background: '#fef3c7', borderRadius: '14px', padding: '0.9rem', border: '1px solid #fde68a' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#92400e' }}>Offre de troc en cours</span>
              <button onClick={() => setTrocModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <p style={{ fontSize: '0.78rem', color: '#92400e' }}>
              Propose d'échanger "TV LED 50''" contre "Console PS4 Pro + 2 manettes". Contactez via le Chatbot de Négociation !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
