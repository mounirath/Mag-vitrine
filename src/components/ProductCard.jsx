import React from 'react';
import { Heart, MapPin, Video, Star, Store, ShieldCheck } from 'lucide-react';

export function ProductCard({
  product,
  store,
  onSelect,
  isFavorite,
  onToggleFavorite,
  lang,
  t
}) {
  const isAr = lang === 'ar';
  const title = isAr && product.nameAr ? product.nameAr : product.name;
  const storeName = store ? store.name : (product.storeName || (isAr ? 'محل معتمد' : 'Boutique certifiée'));

  return (
    <div
      className="item-line-card"
      onClick={() => onSelect(product)}
    >
      {/* Photo Wrapper */}
      <div className="item-photo-wrapper">
        <img
          src={product.image}
          alt={title}
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500';
          }}
        />

        {/* Favorite Heart Button */}
        <button
          className={`fav-heart-btn ${isFavorite ? 'liked' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          aria-label="Ajouter aux favoris"
        >
          <Heart size={16} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>

        {/* Store / Shop Verified Badge on Photo */}
        <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(4px)', color: '#ffffff', padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid rgba(255,255,255,0.15)' }}>
          <Store size={11} color="#f59e0b" />
          <span>{isAr ? 'محل تجاري' : 'Magasin'}</span>
          <ShieldCheck size={11} color="#10b981" />
        </div>

        {/* Video tour small pill if available */}
        {product.hasVideoTour && (
          <div style={{ position: 'absolute', bottom: '6px', left: '6px', background: 'rgba(15, 23, 42, 0.75)', color: '#fff', padding: '0.15rem 0.45rem', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Video size={10} color="#38bdf8" />
            <span>360°</span>
          </div>
        )}
      </div>

      {/* Item info */}
      <div className="item-info-box">
        {/* Store name indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <Store size={12} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{storeName}</span>
        </div>

        <h3 className="item-name" title={title}>
          {title}
        </h3>

        <div className="item-price-tag">
          {product.price.toLocaleString()} DZD
          {product.priceEur && (
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginLeft: '0.35rem' }}>
              ({product.priceEur} €)
            </span>
          )}
        </div>

        <div className="item-location-tag">
          <MapPin size={12} color="var(--orange-action)" />
          <span>{product.locationShort || product.wilaya}</span>
        </div>
      </div>
    </div>
  );
}
