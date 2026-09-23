import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Truck, Star } from 'lucide-react';

export function StoreCard({ store, onSelectStore, onOpenStoreReviews, t }) {
  const handleCall = (e) => {
    e.stopPropagation();
    window.location.href = `tel:${store.phone}`;
  };

  const handleWhatsApp = (e) => {
    e.stopPropagation();
    const text = encodeURIComponent(`Bonjour ${store.name}, je vous contacte depuis la plateforme MAG VITRINE Algérie.`);
    window.open(`https://wa.me/${store.whatsapp}?text=${text}`, '_blank');
  };

  const handleOpenReviews = (e) => {
    e.stopPropagation();
    if (onOpenStoreReviews) {
      onOpenStoreReviews(store);
    } else {
      onSelectStore(store.id);
    }
  };

  return (
    <div className="store-card" onClick={() => onSelectStore(store.id)}>
      <img
        src={store.banner}
        alt={store.name}
        className="store-banner"
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500'; }}
      />
      <div className="store-body">
        <div className="store-header">
          <img
            src={store.logo}
            alt={store.name}
            className="store-logo"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100'; }}
          />
          <div style={{ flex: 1 }}>
            <h3 className="store-name">{store.name}</h3>
            {/* Clickable Star Rating */}
            <button
              type="button"
              onClick={handleOpenReviews}
              style={{
                background: 'rgba(245, 158, 11, 0.12)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '8px',
                padding: '0.15rem 0.45rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: '#b45309',
                fontSize: '0.78rem',
                fontWeight: '800',
                cursor: 'pointer',
                marginTop: '0.15rem'
              }}
              title="Consulter les avis et l'évaluation du magasin"
            >
              <Star size={13} fill="#f59e0b" color="#f59e0b" />
              <span>{store.rating} ({store.reviewsCount || 42})</span>
              <span style={{ fontSize: '0.7rem', textDecoration: 'underline', opacity: 0.85 }}>• تقييمات</span>
            </button>
          </div>
        </div>

        <div className="store-wilaya-badge">
          <MapPin size={12} />
          <span>{store.commune}, {store.wilaya}</span>
        </div>

        <p className="store-desc">{store.description}</p>

        <div className="store-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Clock size={13} />
            <span>{store.openingHours}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Truck size={13} color="var(--primary)" />
            <span>Livraison {store.estimatedDeliveryTime}</span>
          </div>
        </div>

        <div className="store-actions">
          <button className="btn-store-call" onClick={handleCall} title="Appeler le magasin">
            <Phone size={15} />
            <span>{t.callMerchant}</span>
          </button>
          <button className="btn-store-wa" onClick={handleWhatsApp} title="Contacter sur WhatsApp">
            <MessageCircle size={15} />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
