import React, { useState } from 'react';
import { X, Star, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, UserCheck, UserX, Phone, MapPin, Package, FileText } from 'lucide-react';

export function RateCustomerModal({
  isOpen,
  onClose,
  order,
  onSubmitRating,
  lang,
  t
}) {
  const isAr = lang === 'ar';

  const [parcelReceived, setParcelReceived] = useState(order?.parcelReceived ?? true);
  const [stars, setStars] = useState(order?.customerStars || (order?.parcelReceived === false ? 1 : 5));
  const [hoverStars, setHoverStars] = useState(0);
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !order) return null;

  const quickReasonsReceivedAr = [
    'استلم الطرد فوراً وكان في الموعد ومحترماً جداً',
    'تواصل ممتاز ودفع كاش عند باب المنزل دون أي تردد',
    'رد سريع على موزع التوصيل وتأكيد مرن',
    'زبون جاد ومثالي يُنصح بالتعامل معه في كافة الولايات'
  ];

  const quickReasonsRefusedAr = [
    'رفض فتح الباب أو استلام الطرد بعد وصول الموزع للعنوان',
    'الهاتف مغلق طيلة يومين وتم إرجاع الطرد (Retour)',
    'ألغى الطلبية فجأة بعد شحنها وتكليف التاجر مصاريف التوصيل',
    'تماطل وتهرب من الرد على اتصالات شركة التوصيل'
  ];

  const quickReasonsReceivedFr = [
    'A récupéré le colis sans délai, très courtois et sérieux',
    'Communication fluide, paiement cash à la livraison sans hésiter',
    'Réponse immédiate au livreur et ponctualité exemplaire',
    'Client exemplaire recommandé à tous les commerçants DZ'
  ];

  const quickReasonsRefusedFr = [
    'A refusé le colis à l\'arrivée du livreur sans motif valable',
    'Téléphone injoignable pendant 48h, retour aux frais du magasin',
    'Annulation abusive après expédition par le transporteur',
    'Multiples faux rendez-vous avec le livreur'
  ];

  const handleSelectStatus = (isReceived) => {
    setParcelReceived(isReceived);
    if (isReceived) {
      setStars(5);
      setReason(quickReasonsReceivedAr[0]);
    } else {
      setStars(1);
      setReason(quickReasonsRefusedAr[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmitRating) {
      onSubmitRating({
        orderId: order.id,
        customerPhone: order.phone,
        customerName: order.customerName,
        storeId: order.storeId,
        storeName: order.storeName,
        parcelReceived,
        stars,
        reason: reason || (parcelReceived ? 'تم استلام الطرد بنجاح والدفع' : 'عدم استلام / رفض الطرد'),
        note
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
        style={{ maxWidth: '580px', borderRadius: '24px', overflow: 'hidden' }}
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
                background: parcelReceived ? '#dcfce7' : '#fee2e2',
                color: parcelReceived ? '#16a34a' : '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                boxShadow: parcelReceived ? '0 4px 15px rgba(22, 163, 74, 0.25)' : '0 4px 15px rgba(220, 38, 38, 0.25)'
              }}
            >
              {parcelReceived ? <CheckCircle2 size={40} /> : <XCircle size={40} />}
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem', color: parcelReceived ? '#15803d' : '#b91c1c' }}>
              {isAr ? 'تم تحديث تقييم جدية الزبون بنجاح' : 'Évaluation de fiabilité client enregistrée'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              {isAr
                ? 'تم تحديث مؤشر جدية استلام الطرود للزبون لحماية شبكة التجار المعتمدين في الجزائر من الطرود الراجعة.'
                : 'L\'indice de réception et sérieux du client a été mis à jour dans le réseau anti-retour DZ.'}
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Package size={20} color="#f59e0b" />
                  <span style={{ fontWeight: '800', fontSize: '1.05rem' }}>
                    {isAr ? `تقييم زبون الطلبية #${order.id}` : `Évaluation Client #${order.id}`}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', background: 'rgba(255,255,255,0.15)', padding: '0.2rem 0.6rem', borderRadius: '8px' }}>
                  {order.totalAmount?.toLocaleString()} DZD
                </span>
              </div>

              {/* Customer info pill */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.08)', padding: '0.65rem 0.85rem', borderRadius: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UserCheck size={20} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>{order.customerName}</div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', gap: '0.7rem' }}>
                    <span>{order.phone}</span>
                    <span>• {order.wilaya} {order.commune ? `(${order.commune})` : ''}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Question 1: Did the customer receive the parcel? (استقبال الطرد أم رفض الطرد) */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: '800', marginBottom: '0.6rem', color: 'var(--text-main)' }}>
                  {isAr ? '1. هل استلم الزبون الطرد ودفع المستحقات؟' : '1. Le client a-t-il réceptionné le colis ?'}
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {/* Option Received */}
                  <button
                    type="button"
                    onClick={() => handleSelectStatus(true)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '14px',
                      border: parcelReceived ? '2px solid #16a34a' : '1.5px solid var(--border)',
                      background: parcelReceived ? 'rgba(22, 163, 74, 0.08)' : 'var(--surface-alt)',
                      color: parcelReceived ? '#15803d' : 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <CheckCircle2 size={24} color={parcelReceived ? '#16a34a' : '#94a3b8'} />
                    <span style={{ fontWeight: '800', fontSize: '0.88rem' }}>
                      {isAr ? 'نعم، استلم الطرد بنجاح ✅' : 'Oui, Colis Récupéré ✅'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {isAr ? 'دفع كاش والتقى بالموزع' : 'Paiement effectué au livreur'}
                    </span>
                  </button>

                  {/* Option Refused */}
                  <button
                    type="button"
                    onClick={() => handleSelectStatus(false)}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '14px',
                      border: !parcelReceived ? '2px solid #dc2626' : '1.5px solid var(--border)',
                      background: !parcelReceived ? 'rgba(220, 38, 38, 0.08)' : 'var(--surface-alt)',
                      color: !parcelReceived ? '#b91c1c' : 'var(--text-main)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.4rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <XCircle size={24} color={!parcelReceived ? '#dc2626' : '#94a3b8'} />
                    <span style={{ fontWeight: '800', fontSize: '0.88rem' }}>
                      {isAr ? 'لا، رفض / لم يستلم الطرد ❌' : 'Non, Colis Refusé ❌'}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {isAr ? 'تهرب / هاتف مغلق / إرجاع' : 'Non réclamé / Colis retour'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Question 2: Seriousness Stars Rating (1 to 5 Stars) */}
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
                <div style={{ fontSize: '0.85rem', fontWeight: '800', marginBottom: '0.4rem', color: 'var(--text-main)' }}>
                  {isAr ? '2. تقييم جدية ومسؤولية الزبون (1 إلى 5 نجوم):' : '2. Degré de sérieux du client (1 à 5 étoiles) :'}
                </div>

                <div style={{ display: 'inline-flex', gap: '0.35rem', justifyContent: 'center', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const activeVal = hoverStars || stars;
                    const isFilled = starVal <= activeVal;
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setStars(starVal)}
                        onMouseEnter={() => setHoverStars(starVal)}
                        onMouseLeave={() => setHoverStars(0)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <Star
                          size={32}
                          color={isFilled ? (parcelReceived ? '#f59e0b' : '#ef4444') : '#cbd5e1'}
                          fill={isFilled ? (parcelReceived ? '#f59e0b' : '#ef4444') : 'none'}
                        />
                      </button>
                    );
                  })}
                </div>

                <div style={{ fontSize: '0.82rem', fontWeight: '800', marginTop: '0.5rem', color: parcelReceived ? '#15803d' : '#b91c1c' }}>
                  {stars === 5 && (isAr ? 'زبون ممتاز وجاد 100% ⭐⭐⭐⭐⭐' : 'Client exemplaire et très sérieux')}
                  {stars === 4 && (isAr ? 'زبون جيد جداً وملتزم' : 'Très bon client')}
                  {stars === 3 && (isAr ? 'زبون متوسط (استلم بعد تأخير)' : 'Client moyen')}
                  {stars === 2 && (isAr ? 'زبون متردد ومماطل' : 'Client hésitant')}
                  {stars === 1 && (isAr ? 'زبون غير جاد تسبب في إرجاع الطرد ⚠️' : 'Client non sérieux - Colis retourné')}
                </div>
              </div>

              {/* Question 3: Quick Reasons / Motif */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', marginBottom: '0.4rem' }}>
                  {isAr ? '3. سبب التقييم أو تعليق التاجر:' : '3. Motif de l\'évaluation :'}
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '0.6rem' }}>
                  {(parcelReceived
                    ? (isAr ? quickReasonsReceivedAr : quickReasonsReceivedFr)
                    : (isAr ? quickReasonsRefusedAr : quickReasonsRefusedFr)
                  ).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setReason(preset)}
                      style={{
                        padding: '0.55rem 0.75rem',
                        borderRadius: '10px',
                        border: reason === preset ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                        background: reason === preset ? 'rgba(99, 102, 241, 0.08)' : 'var(--surface)',
                        color: reason === preset ? 'var(--primary)' : 'var(--text-main)',
                        fontSize: '0.8rem',
                        fontWeight: reason === preset ? '700' : '500',
                        cursor: 'pointer',
                        textAlign: isAr ? 'right' : 'left'
                      }}
                    >
                      • {preset}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder={isAr ? 'أو اكتب سبباً مخصصاً...' : 'Ou saisissez un motif personnalisé...'}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.75rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface-alt)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              {/* Anti-Retour Info Notice */}
              <div
                style={{
                  background: 'rgba(217, 119, 6, 0.08)',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '12px',
                  border: '1px solid rgba(217, 119, 6, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.6rem',
                  fontSize: '0.78rem',
                  color: '#92400e',
                  marginBottom: '1.25rem',
                  lineHeight: '1.4'
                }}
              >
                <ShieldCheck size={18} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  {isAr
                    ? 'نظام حماية التجار (Anti-Retour DZ): تقييمك يُحدث مؤشر الجدية في ملف الزبون ليظهر لكافة التجار قبل تأكيد وشحن الطلبيات القادمة.'
                    : 'Système Anti-Retour DZ : Votre évaluation ajuste l\'indice de confiance du client pour avertir les autres commerçants.'}
                </span>
              </div>

              {/* Buttons */}
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
                    background: parcelReceived ? 'linear-gradient(135deg, #16a34a, #15803d)' : 'linear-gradient(135deg, #dc2626, #b91c1c)',
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
                    boxShadow: parcelReceived ? '0 4px 12px rgba(22, 163, 74, 0.3)' : '0 4px 12px rgba(220, 38, 38, 0.3)'
                  }}
                >
                  {parcelReceived ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  <span>
                    {isAr
                      ? parcelReceived
                        ? 'تسجيل استلام الطرد بنجاح ✅'
                        : 'تسجيل عدم استلام / رفض الطرد ❌'
                      : parcelReceived
                        ? 'Valider Colis Récupéré ✅'
                        : 'Enregistrer Colis Refusé ❌'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
