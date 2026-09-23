import React, { useState } from 'react';
import { X, Star, ShieldCheck, Video, CheckCircle2, MessageSquare, Truck, Package, ThumbsUp } from 'lucide-react';

export function RateStoreModal({ isOpen, onClose, store, order, onSubmitReview, lang, t }) {
  const isAr = lang === 'ar';

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [deliveryRating, setDeliveryRating] = useState(5);
  const [conformityRating, setConformityRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState(order?.customerName || '');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !store) return null;

  const starLabelsAr = {
    1: 'تجربة سيئة جداً وغير موفقة',
    2: 'تجربة دون المستوى المتوقع',
    3: 'تجربة مقبولة مع بعض الملاحظات',
    4: 'تجربة جيدة جداً ومرضية',
    5: 'تجربة ممتازة واحترافية للغاية ⭐⭐⭐⭐⭐'
  };

  const starLabelsFr = {
    1: 'Très mauvaise expérience',
    2: 'En dessous des attentes',
    3: 'Expérience correcte',
    4: 'Très bonne expérience',
    5: 'Excellente expérience d\'achat ⭐⭐⭐⭐⭐'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitReview) {
      onSubmitReview({
        storeId: store.id,
        rating,
        comment,
        criteria: {
          deliverySpeed: deliveryRating,
          conformity: conformityRating,
          communication: serviceRating
        },
        customerName: customerName.trim() || (isAr ? 'زبون معتمد' : 'Client Vérifié'),
        orderId: order?.id || null
      });
    }
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '560px', borderRadius: '24px', overflow: 'hidden' }}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.25)'
              }}
            >
              <CheckCircle2 size={40} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', color: '#15803d' }}>
              {isAr ? 'شكراً لك! تم تسجيل تقييمك بنجاح' : 'Merci ! Avis enregistré avec succès'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {isAr
                ? 'تقييمك يساعد في تعزيز الشفافية ومساعدة باقي الزبائن في الجزائر على اختيار المتاجر الأفضل.'
                : 'Votre avis contribue à valoriser les meilleurs commerçants vérifiés en Algérie.'}
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
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
                      <span>{isAr ? 'فترينة موثقة' : 'Vérifié'}</span>
                    </span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {order ? (
                      <span>
                        {isAr ? `طلبية رقم #${order.id}` : `Commande #${order.id}`} • {store.wilaya}
                      </span>
                    ) : (
                      <span>{store.commune ? `${store.commune}, ${store.wilaya}` : store.wilaya}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.35rem' }}>
                {isAr ? 'تقييم تجربة الشراء مع التاجر' : 'Évaluer votre Expérience d\'Achat'}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isAr
                  ? 'من 1 إلى 5 نجوم: قيّم جودة الخدمة، سرعة الشحن ومطابقة السلعة للفيديو'
                  : 'Notez la boutique de 1 à 5 étoiles selon la livraison, conformité et accueil'}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Primary 1-5 Star Selection */}
              <div
                style={{
                  background: 'var(--surface-alt)',
                  padding: '1rem',
                  borderRadius: '16px',
                  border: '1px solid var(--border-light)',
                  textAlign: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                  {isAr ? 'التقييم العام للتجربة:' : 'Note globale :'}
                </div>

                <div style={{ display: 'inline-flex', gap: '0.4rem', justifyContent: 'center', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const activeVal = hoverRating || rating;
                    const isFilled = starVal <= activeVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoverRating(starVal)}
                        onMouseLeave={() => setHoverRating(0)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.3rem',
                          transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform 0.15s ease'
                        }}
                        aria-label={`${starVal} étoiles`}
                      >
                        <Star
                          size={34}
                          color={isFilled ? '#f59e0b' : '#cbd5e1'}
                          fill={isFilled ? '#f59e0b' : 'none'}
                        />
                      </button>
                    );
                  })}
                </div>

                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: '800',
                    marginTop: '0.6rem',
                    color: rating >= 4 ? '#d97706' : rating === 3 ? '#b45309' : '#dc2626'
                  }}
                >
                  {isAr ? starLabelsAr[rating] : starLabelsFr[rating]} ({rating}/5)
                </div>
              </div>

              {/* Detailed Criteria Breakdown (1-5 stars each) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
                {/* 1. Délai et livraison */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--surface)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: '700' }}>
                    <Truck size={16} color="var(--primary)" />
                    <span>{isAr ? 'سرعة الشحن والتوصيل للولاية:' : 'Rapidité de livraison :'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setDeliveryRating(s)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.15rem' }}
                      >
                        <Star size={17} color={s <= deliveryRating ? '#f59e0b' : '#cbd5e1'} fill={s <= deliveryRating ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Conformité au vidéo */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--surface)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: '700' }}>
                    <Video size={16} color="#059669" />
                    <span>{isAr ? 'مطابقة السلعة للفيديو والوصف:' : 'Conformité vidéo & description :'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setConformityRating(s)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.15rem' }}
                      >
                        <Star size={17} color={s <= conformityRating ? '#f59e0b' : '#cbd5e1'} fill={s <= conformityRating ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Communication & Service */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--surface)',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.82rem', fontWeight: '700' }}>
                    <MessageSquare size={16} color="#6366f1" />
                    <span>{isAr ? 'المعاملة، التواصل والرد:' : 'Accueil & Réactivité :'}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.2rem' }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setServiceRating(s)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.15rem' }}
                      >
                        <Star size={17} color={s <= serviceRating ? '#f59e0b' : '#cbd5e1'} fill={s <= serviceRating ? '#f59e0b' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment text */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  {isAr ? 'ملاحظاتك وتعليقك حول التجربة:' : 'Votre commentaire d\'expérience :'}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    isAr
                      ? 'شاركنا رأيك حول جودة السلعة، التغليف، سرعة التوصيل وتعامل المحل...'
                      : 'Qualité du produit, emballage soigné, respect des délais...'
                  }
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    resize: 'vertical'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    fontWeight: '700',
                    fontSize: '0.88rem',
                    cursor: 'pointer'
                  }}
                >
                  {isAr ? 'إلغاء' : 'Annuler'}
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '0.85rem',
                    background: 'linear-gradient(135deg, #d97706, #b45309)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '14px',
                    fontWeight: '800',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 4px 12px rgba(217, 119, 6, 0.3)'
                  }}
                >
                  <Star size={18} fill="#ffffff" />
                  <span>{isAr ? 'تأكيد وإرسال التقييم ⭐' : 'Publier mon évaluation ⭐'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
