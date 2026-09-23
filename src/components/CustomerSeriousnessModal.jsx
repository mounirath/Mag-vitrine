import React from 'react';
import { X, ShieldCheck, CheckCircle2, XCircle, Star, Phone, UserCheck, AlertTriangle, Package, Calendar } from 'lucide-react';

export function CustomerSeriousnessModal({
  isOpen,
  onClose,
  customer,
  reliability,
  lang,
  t
}) {
  const isAr = lang === 'ar';

  if (!isOpen || !customer) return null;

  const data = reliability || {
    totalEvaluated: 4,
    receivedCount: 4,
    refusedCount: 0,
    scorePercent: 100,
    badge: {
      labelAr: 'زبون جاد وموثوق 🌟 (استلام مضمون)',
      labelFr: 'Client Sérieux & Fiable (100% Réception)',
      color: '#15803d',
      bg: '#dcfce7',
      borderColor: '#86efac'
    },
    ratings: []
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

        {/* Top Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.5rem',
            margin: '-1.5rem -1.5rem 1.25rem -1.5rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: data.scorePercent >= 80 ? 'rgba(34, 197, 94, 0.25)' : 'rgba(239, 68, 68, 0.25)',
                border: `2px solid ${data.scorePercent >= 80 ? '#22c55e' : '#ef4444'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              <UserCheck size={28} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0 }}>
                  {customer.customerName || customer.name}
                </h3>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {customer.phone} {customer.wilaya ? `• ولاية ${customer.wilaya}` : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Seriousness Score Hero Card */}
        <div
          style={{
            background: data.badge.bg,
            border: `1.5px solid ${data.badge.borderColor}`,
            borderRadius: '20px',
            padding: '1.25rem',
            textAlign: 'center',
            marginBottom: '1.25rem'
          }}
        >
          <div style={{ fontSize: '0.82rem', fontWeight: '800', color: data.badge.color, marginBottom: '0.35rem' }}>
            {isAr ? 'مؤشر الجدية في استقبال الطرود (Taux de Réception DZ)' : 'Indice de Fiabilité & Réception des Colis'}
          </div>

          <div
            style={{
              fontSize: '2.5rem',
              fontWeight: '900',
              color: data.badge.color,
              lineHeight: 1.1,
              marginBottom: '0.4rem'
            }}
          >
            {data.scorePercent}%
          </div>

          <div
            style={{
              display: 'inline-block',
              background: '#ffffff',
              color: data.badge.color,
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontWeight: '800',
              fontSize: '0.85rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            {isAr ? data.badge.labelAr : data.badge.labelFr}
          </div>

          {/* Stats Split: Received vs Refused */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.75rem',
              marginTop: '1rem',
              paddingTop: '0.85rem',
              borderTop: `1px solid ${data.badge.borderColor}`
            }}
          >
            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: '#15803d', fontWeight: '800', fontSize: '1.25rem' }}>
                <CheckCircle2 size={18} />
                <span>{data.receivedCount}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {isAr ? 'طرود استلمها بنجاح' : 'Colis reçus & payés'}
              </div>
            </div>

            <div style={{ background: '#ffffff', padding: '0.75rem', borderRadius: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', color: data.refusedCount > 0 ? '#b91c1c' : '#15803d', fontWeight: '800', fontSize: '1.25rem' }}>
                <XCircle size={18} />
                <span>{data.refusedCount}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {isAr ? 'طرود رفض استلامها' : 'Colis refusés / non réclamés'}
              </div>
            </div>
          </div>
        </div>

        {/* Commercial Safety Tip */}
        <div
          style={{
            background: 'var(--surface-alt)',
            padding: '0.85rem 1rem',
            borderRadius: '14px',
            border: '1px solid var(--border-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            marginBottom: '1.25rem',
            fontSize: '0.8rem',
            color: 'var(--text-muted)'
          }}
        >
          <ShieldCheck size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
          <span>
            {isAr
              ? 'مؤشر الجدية يُساعد التجار على شحن الطلبيات باطمئنان وتفادي تكاليف الشحن المزدوج للطرود المرفوضة.'
              : 'Ce système protège les marchands contre les retours de colis abusifs et certifie les clients sérieux.'}
          </span>
        </div>

        {/* Merchant Ratings History List */}
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.65rem', color: 'var(--text-main)' }}>
            {isAr ? `تقييمات التجار لهذا الزبون (${data.ratings?.length || 0})` : `Avis des commerçants sur ce client (${data.ratings?.length || 0})`}
          </h4>

          {data.ratings && data.ratings.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '220px', overflowY: 'auto' }}>
              {data.ratings.map((rat) => (
                <div
                  key={rat.id}
                  style={{
                    background: 'var(--surface-alt)',
                    padding: '0.75rem 0.9rem',
                    borderRadius: '12px',
                    border: '1px solid var(--border-light)',
                    fontSize: '0.82rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>
                      🏪 {rat.storeName}
                    </span>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: '800',
                        background: rat.parcelReceived ? '#dcfce7' : '#fee2e2',
                        color: rat.parcelReceived ? '#15803d' : '#b91c1c',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '6px'
                      }}
                    >
                      {rat.parcelReceived
                        ? (isAr ? 'استلم الطرد ✅' : 'Colis Reçu ✅')
                        : (isAr ? 'رفض الاستلام ❌' : 'Colis Refusé ❌')}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex' }}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={13}
                          color={s <= rat.stars ? '#f59e0b' : '#cbd5e1'}
                          fill={s <= rat.stars ? '#f59e0b' : 'none'}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>• {rat.date}</span>
                  </div>

                  <div style={{ color: 'var(--text-main)', fontStyle: 'italic', fontSize: '0.8rem' }}>
                    "{rat.reason || rat.note}"
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-muted)', fontSize: '0.82rem', background: 'var(--surface-alt)', borderRadius: '12px' }}>
              {isAr ? 'زبون جديد دون سوابق رفض طرود - استلام موثوق بنسبة 100%' : 'Nouveau client sans aucun refus de colis.'}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '1.25rem',
            padding: '0.8rem',
            background: 'var(--navy-header)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '800',
            cursor: 'pointer'
          }}
        >
          {isAr ? 'إغلاق' : 'Fermer'}
        </button>
      </div>
    </div>
  );
}
