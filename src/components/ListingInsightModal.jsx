import React, { useState } from 'react';
import { ArrowLeft, Heart, Video, Star, MapPin, FileText, Phone, MessageCircle, Bot, ShoppingCart, ShieldCheck, Share2 } from 'lucide-react';

export function ListingInsightModal({
  product,
  store,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenNegotiation,
  onOpenTrustPortal,
  lang,
  t
}) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [historyRequested, setHistoryRequested] = useState(false);

  if (!isOpen || !product) return null;

  const isAr = lang === 'ar';
  const gallery = product.gallery || [product.image];
  const title = isAr && product.nameAr ? product.nameAr : product.name;

  const handleCall = () => {
    const phone = store ? store.phone : '0555443322';
    window.location.href = `tel:${phone}`;
  };

  const handleWhatsApp = () => {
    const wa = store ? store.whatsapp : '213661223344';
    const text = encodeURIComponent(`Bonjour, je vous contacte à propos de l'annonce "${product.name}" (${product.price.toLocaleString()} DZD) sur MAG VITRINE.`);
    window.open(`https://wa.me/${wa}?text=${text}`, '_blank');
  };

  return (
    <div className="screen-modal-overlay">
      {/* Header */}
      <div className="modal-screen-header">
        <button className="btn-back-header" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <span className="modal-header-title">
          {isAr ? 'تفاصيل الإعلان' : 'Listing Insight'}
        </span>
        <button
          className="btn-back-header"
          onClick={() => onToggleFavorite(product.id)}
          style={{ color: isFavorite ? '#ef4444' : '#ffffff' }}
        >
          <Heart size={20} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>
      </div>

      <div style={{ padding: '1rem', paddingBottom: '5rem' }}>
        {/* Main Photo Banner */}
        <div style={{ position: 'relative', borderRadius: '20px', overflow: 'hidden', height: '260px', background: '#000', marginBottom: '0.75rem', boxShadow: 'var(--shadow-card)' }}>
          <img
            src={gallery[activeImgIndex] || product.image}
            alt={title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {product.hasVideoTour && (
            <button
              onClick={() => setShowVideoModal(true)}
              style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(6px)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '0.45rem 0.85rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}
            >
              <Video size={16} color="#38bdf8" />
              <span>Video-tour</span>
            </button>
          )}
        </div>

        {/* Gallery Thumbnails */}
        {gallery.length > 1 && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.2rem', overflowX: 'auto' }}>
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImgIndex(idx)}
                style={{ width: '64px', height: '52px', borderRadius: '12px', overflow: 'hidden', border: idx === activeImgIndex ? '2px solid var(--orange-action)' : '2px solid transparent', padding: 0, cursor: 'pointer', flexShrink: 0 }}
              >
                <img src={img} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        )}

        {/* Video modal preview simulation */}
        {showVideoModal && (
          <div style={{ background: '#0f172a', color: '#fff', padding: '1rem', borderRadius: '16px', marginBottom: '1rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Visite Vidéo & 3D Tour</span>
              <button onClick={() => setShowVideoModal(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>✕</button>
            </div>
            <div style={{ height: '140px', background: '#1e293b', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Video size={32} color="#38bdf8" />
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Vidéo 360° certifiée MAG VITRINE</span>
            </div>
          </div>
        )}

        {/* Title, Price & Location */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                {title}
              </h2>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="var(--orange-action)" />
                <span>{product.location || `${product.wilaya}, Algérie`}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                {product.price.toLocaleString()} DZD
              </div>
              {product.priceEur && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  ≈ {product.priceEur} €
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section: Item Condition */}
        <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '1.1rem', border: '1px solid var(--border-light)', marginBottom: '1rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {isAr ? 'حالة المنتج' : 'Item condition'}
            </h4>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#059669', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
              {product.condition || 'Très bon état'}
            </span>
          </div>

          <div className="condition-stars-row">
            {[...Array(product.conditionStars || 5)].map((_, i) => (
              <Star key={i} size={16} fill="#f59e0b" />
            ))}
          </div>

          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5', marginTop: '0.4rem' }}>
            {product.description}
          </p>

          {/* Demander un Historique de l'Objet */}
          <div style={{ marginTop: '0.85rem', borderTop: '1px dashed var(--border-light)', paddingTop: '0.85rem' }}>
            <button
              onClick={() => setHistoryRequested(!historyRequested)}
              style={{ width: '100%', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', textAlign: 'left' }}
            >
              <FileText size={18} color="#0284c7" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  {isAr ? 'طلب سجل وشهادة فحص المنتج' : 'Demander un Historique de l\'Objet'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {historyRequested ? 'Rapport d inspection téléchargé (Zéro défaut)' : 'Certificat d authenticité & historique de maintenance'}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Section: Profil Vendeur & Trust Link */}
        <div
          onClick={onOpenTrustPortal}
          style={{ background: 'var(--surface)', borderRadius: '18px', padding: '1rem', border: '1px solid var(--border-light)', marginBottom: '1.25rem', boxShadow: 'var(--shadow-card)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={store ? store.logo : 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100'}
              alt="Vendor"
              style={{ width: '46px', height: '46px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.92rem', fontWeight: '800' }}>{store ? store.name : 'Vendeur Certifié'}</span>
                <ShieldCheck size={16} color="#6366f1" />
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Compte vérifié par vidéo • {product.sellerRating || 4.8} ★
              </div>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#6366f1', fontWeight: '700' }}>
            {isAr ? 'عرض الثقة >' : 'Vérifier >'}
          </span>
        </div>

        {/* Actions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            className="btn-store-call"
            onClick={handleCall}
            style={{ padding: '0.7rem 0.3rem', borderRadius: '12px', fontSize: '0.82rem' }}
          >
            <Phone size={16} />
            <span>Appeler</span>
          </button>
          <button
            className="btn-store-wa"
            onClick={handleWhatsApp}
            style={{ padding: '0.7rem 0.3rem', borderRadius: '12px', fontSize: '0.82rem' }}
          >
            <MessageCircle size={16} />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={() => onOpenNegotiation(product)}
            style={{ background: '#ede9fe', color: '#6366f1', border: '1px solid #c7d2fe', padding: '0.7rem 0.3rem', borderRadius: '12px', fontSize: '0.82rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', cursor: 'pointer' }}
          >
            <Bot size={16} />
            <span>Négocier</span>
          </button>
        </div>

        {/* Order / Add to Cart CTA */}
        <button
          className="btn-add-cart"
          onClick={() => onAddToCart(product)}
          style={{ width: '100%', padding: '0.9rem', borderRadius: '14px', fontSize: '0.95rem', background: 'var(--orange-gradient)' }}
        >
          <ShoppingCart size={18} />
          <span>{isAr ? 'طلب المنتج (الدفع عند الاستلام)' : 'Commander en Paiement à la Livraison'}</span>
        </button>
      </div>
    </div>
  );
}
