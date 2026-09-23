import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, MapPin, Star, ShieldCheck } from 'lucide-react';

const TRACKING_STEPS = [
  { step: 1, titleFr: 'Commande reçue', titleAr: 'تم استلام الطلب', desc: 'Enregistrée sur la plateforme' },
  { step: 2, titleFr: 'Confirmée par le magasin', titleAr: 'تأكيد المتجر', desc: 'Disponibilité du stock validée' },
  { step: 3, titleFr: 'En cours de préparation', titleAr: 'قيد التحضير والتغليف', desc: 'Emballage sécurisé de votre colis' },
  { step: 4, titleFr: 'Prête pour expédition', titleAr: 'جاهزة للشحن', desc: 'Remise au transporteur express' },
  { step: 5, titleFr: 'En cours d acheminement', titleAr: 'مع مندوب التوصيل', desc: 'En route vers votre ville' },
  { step: 6, titleFr: 'Arrivée à destination', titleAr: 'وصلت إلى ولايتك', desc: 'Le livreur vous contacte' },
  { step: 7, titleFr: 'Livrée & Encaissée', titleAr: 'تم التسليم والدفع بنجاح', desc: 'Paiement en espèces effectué' }
];

export function OrderTrackingModal({ isOpen, onClose, orders, stores = [], onOpenRateStore, lang, t }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [foundOrder, setFoundOrder] = useState(() => orders[0] || null);
  const isAr = lang === 'ar';

  if (!isOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    const match = orders.find(
      o => o.id.toLowerCase() === query || (o.phone && o.phone.includes(query))
    );
    setFoundOrder(match || null);
  };

  const currentStore = foundOrder
    ? stores.find(s => s.id === foundOrder.storeId || s.name === foundOrder.storeName) || stores[0]
    : null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '620px', borderRadius: '24px', maxHeight: '90vh', overflowY: 'auto' }}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'var(--badge-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
            <Truck size={28} color="var(--primary)" />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', margin: '0 0 0.25rem' }}>{t.trackingTitle}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
            {isAr
              ? 'تتبع تقدم طلبيتك في الوقت الفعلي وتقييم تجربة المتجر بعد الاستلام'
              : 'Suivez l\'avancée en temps réel de votre colis à travers les 58 Wilayas'}
          </p>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <input
            type="text"
            placeholder={t.enterOrderNumber}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text-main)', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn-add-cart" style={{ width: 'auto', padding: '0.65rem 1.2rem', borderRadius: '12px' }}>
            <Search size={16} />
            <span>{t.trackBtn}</span>
          </button>
        </form>

        {foundOrder ? (
          <div>
            {/* Order summary card */}
            <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border-light)', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', color: 'var(--primary)' }}>
                  {isAr ? `الطلبية #${foundOrder.id}` : `Commande #${foundOrder.id}`}
                </span>
                <span style={{ fontSize: '0.75rem', background: 'var(--badge-bg)', color: 'var(--badge-text)', padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: '700' }}>
                  {foundOrder.date}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {isAr ? 'المتجر البائع:' : 'Magasin :'} <strong>{foundOrder.storeName}</strong> • {isAr ? 'الزبون:' : 'Client :'} <strong>{foundOrder.customerName}</strong> ({foundOrder.wilaya}) • {isAr ? 'المجموع:' : 'Total :'} <strong>{foundOrder.totalAmount?.toLocaleString()} DZD</strong>
              </div>
            </div>

            {/* Merchant Experience Rating Banner */}
            <div
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
                border: '1.5px solid #fde68a',
                borderRadius: '16px',
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#92400e', fontWeight: '800', fontSize: '0.9rem' }}>
                  <Star size={17} color="#f59e0b" fill="#f59e0b" />
                  <span>{isAr ? 'تقييم تجربة المتجر (1 إلى 5 نجوم)' : 'Évaluation de l\'Expérience Vendeur'}</span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#78350f', marginTop: '0.2rem' }}>
                  {foundOrder.isStoreRated
                    ? (isAr ? '✅ شكراً لك! لقد قمت بتقييم تجربتك مع هذا المتجر سابقاً.' : '✅ Vous avez déjà évalué ce magasin. Merci !')
                    : (isAr ? 'شارك رأيك حول سرعة التوصيل ومطابقة السلعة للفيديو الموثق.' : 'Partagez votre avis sur les délais et la conformité du produit.')}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenRateStore && onOpenRateStore(currentStore, foundOrder);
                }}
                style={{
                  padding: '0.65rem 1rem',
                  background: foundOrder.isStoreRated ? '#ffffff' : 'linear-gradient(135deg, #d97706, #b45309)',
                  color: foundOrder.isStoreRated ? '#92400e' : '#ffffff',
                  border: foundOrder.isStoreRated ? '1px solid #fde68a' : 'none',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  boxShadow: foundOrder.isStoreRated ? 'none' : '0 3px 10px rgba(217, 119, 6, 0.25)'
                }}
              >
                <Star size={15} fill={foundOrder.isStoreRated ? '#f59e0b' : '#ffffff'} color={foundOrder.isStoreRated ? '#f59e0b' : '#ffffff'} />
                <span>
                  {foundOrder.isStoreRated
                    ? (isAr ? 'تحديث تقييم المتجر ⭐' : 'Modifier mon avis ⭐')
                    : (isAr ? 'تقييم المتجر (1-5 نجوم) ⭐' : 'Évaluer ce magasin ⭐')}
                </span>
              </button>
            </div>

            {/* Timeline */}
            <div className="timeline">
              {TRACKING_STEPS.map((stepItem) => {
                const isCompleted = stepItem.step < (foundOrder.statusStep || 1);
                const isActive = stepItem.step === (foundOrder.statusStep || 1);
                const title = isAr ? stepItem.titleAr : stepItem.titleFr;

                return (
                  <div
                    key={stepItem.step}
                    className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <div className="step-circle">
                      {isCompleted ? <CheckCircle2 size={18} /> : stepItem.step}
                    </div>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: isActive ? 'var(--accent)' : 'var(--text-main)' }}>
                        {title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {stepItem.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
            <p>{isAr ? 'لم يتم العثور على طلبية بهذا الرقم. يرجى التأكد من الرمز والمحاولة ثانية.' : 'Aucune commande trouvée avec ces coordonnées.'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
