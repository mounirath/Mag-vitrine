import React from 'react';
import { X, Star, Video, ShieldCheck, Truck, MessageSquare, PlusCircle, CheckCircle2 } from 'lucide-react';

export function StoreReviewsModal({
  isOpen,
  onClose,
  store,
  reviews,
  onOpenRateStore,
  lang,
  t
}) {
  const isAr = lang === 'ar';

  if (!isOpen || !store) return null;

  const storeReviewsList = (reviews || []).filter(r => r.storeId === store.id);
  const avgRating = store.rating || 4.8;
  const count = storeReviewsList.length || store.reviewsCount || 1;

  // Calculate criteria averages if available
  const avgSpeed = storeReviewsList.length > 0
    ? (storeReviewsList.reduce((acc, r) => acc + (r.criteria?.deliverySpeed || 5), 0) / storeReviewsList.length).toFixed(1)
    : '4.9';
  const avgConformity = storeReviewsList.length > 0
    ? (storeReviewsList.reduce((acc, r) => acc + (r.criteria?.conformity || 5), 0) / storeReviewsList.length).toFixed(1)
    : '5.0';
  const avgService = storeReviewsList.length > 0
    ? (storeReviewsList.reduce((acc, r) => acc + (r.criteria?.communication || 5), 0) / storeReviewsList.length).toFixed(1)
    : '4.8';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', borderRadius: '24px', overflow: 'hidden' }}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Store Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.5rem',
            margin: '-1.5rem -1.5rem 1.25rem -1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <img
              src={store.logo || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=100'}
              alt={store.name}
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                objectFit: 'cover',
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>{store.name}</h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '800',
                    background: '#15803d',
                    color: '#ffffff',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  <Video size={10} />
                  <span>{isAr ? 'موثق بالفيديو' : 'Vérifié'}</span>
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {store.wilaya} • {isAr ? `إجمالي ${count} تقييم تجربة` : `${count} avis certifiés`}
              </div>
            </div>
          </div>
        </div>

        {/* Rating Hero Card */}
        <div
          style={{
            background: 'var(--surface-alt)',
            borderRadius: '20px',
            padding: '1.25rem',
            border: '1px solid var(--border-light)',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#f59e0b', lineHeight: 1 }}>
                {avgRating}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginTop: '0.3rem' }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    color={s <= Math.round(avgRating) ? '#f59e0b' : '#cbd5e1'}
                    fill={s <= Math.round(avgRating) ? '#f59e0b' : 'none'}
                  />
                ))}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                {isAr ? `من 5 نجوم (${count})` : `sur 5 (${count} avis)`}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={14} color="var(--primary)" />
                <span>{isAr ? 'سرعة التوصيل:' : 'Livraison :'}</span>
                <strong style={{ color: '#f59e0b' }}>{avgSpeed}/5 ⭐</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Video size={14} color="#059669" />
                <span>{isAr ? 'مطابقة الفيديو:' : 'Conformité vidéo :'}</span>
                <strong style={{ color: '#f59e0b' }}>{avgConformity}/5 ⭐</strong>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MessageSquare size={14} color="#6366f1" />
                <span>{isAr ? 'جودة المعاملة:' : 'Accueil & Réactivité :'}</span>
                <strong style={{ color: '#f59e0b' }}>{avgService}/5 ⭐</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenRateStore(store);
            }}
            style={{
              padding: '0.75rem 1.1rem',
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '800',
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              boxShadow: '0 4px 12px rgba(217, 119, 6, 0.25)'
            }}
          >
            <Star size={16} fill="#ffffff" />
            <span>{isAr ? 'تقييم تجربتي ⭐' : 'Évaluer ce magasin'}</span>
          </button>
        </div>

        {/* Reviews List */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.65rem', color: 'var(--text-main)' }}>
            {isAr ? `تجارب الزبائن (${storeReviewsList.length})` : `Avis certifiés (${storeReviewsList.length})`}
          </h4>

          {storeReviewsList.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '260px', overflowY: 'auto' }}>
              {storeReviewsList.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: 'var(--surface-alt)',
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontWeight: '800', fontSize: '0.88rem' }}>{rev.customerName}</span>
                      {rev.verifiedOrder && (
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '6px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.2rem'
                          }}
                        >
                          <CheckCircle2 size={10} />
                          <span>{isAr ? 'شراء موثق' : 'Achat vérifié'}</span>
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.4rem' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        color={s <= rev.rating ? '#f59e0b' : '#cbd5e1'}
                        fill={s <= rev.rating ? '#f59e0b' : 'none'}
                      />
                    ))}
                    <span style={{ fontSize: '0.78rem', fontWeight: '800', color: '#f59e0b', marginInlineStart: '0.25rem' }}>
                      {rev.rating}/5
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: 1.5, margin: 0 }}>
                    {isAr ? rev.comment : (rev.commentFr || rev.comment)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'var(--surface-alt)', borderRadius: '14px', color: 'var(--text-muted)' }}>
              <Star size={32} color="#f59e0b" style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.88rem', margin: 0 }}>
                {isAr ? 'لا توجد تقييمات مكتوبة حتى الآن. كن أول من يشارك تجربته مع هذا المتجر!' : 'Aucun avis écrit pour l\'instant. Soyez le premier à évaluer ce magasin !'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
