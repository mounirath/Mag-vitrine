import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, Package, MapPin } from 'lucide-react';

const TRACKING_STEPS = [
  { step: 1, titleFr: 'Commande reçue', titleAr: 'تم استلام الطلب', desc: 'Enregistrée sur la plateforme' },
  { step: 2, titleFr: 'Confirmée par le magasin', titleAr: 'تأكيد المتجر', desc: 'Disponibilité du stock validée' },
  { step: 3, titleFr: 'En cours de préparation', titleAr: 'قيد التحضير والتغليف', desc: 'Emballage sécurisé de votre colis' },
  { step: 4, titleFr: 'Prête pour expédition', titleAr: 'جاهزة للشحن', desc: 'Remise au transporteur express' },
  { step: 5, titleFr: 'En cours d acheminement', titleAr: 'مع مندوب التوصيل', desc: 'En route vers votre ville' },
  { step: 6, titleFr: 'Arrivée à destination', titleAr: 'وصلت إلى ولايتك', desc: 'Le livreur vous contacte' },
  { step: 7, titleFr: 'Livrée & Encaissée', titleAr: 'تم التسليم والدفع بنجاح', desc: 'Paiement en espèces effectué' }
];

export function OrderTrackingModal({ isOpen, onClose, orders, lang, t }) {
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

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Truck size={36} color="var(--primary)" style={{ margin: '0 auto 0.5rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{t.trackingTitle}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            Suivez l avancée en temps réel de votre colis à travers les 58 Wilayas
          </p>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder={t.enterOrderNumber}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, padding: '0.65rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
          />
          <button type="submit" className="btn-add-cart" style={{ width: 'auto', padding: '0.65rem 1.2rem' }}>
            <Search size={16} />
            <span>{t.trackBtn}</span>
          </button>
        </form>

        {foundOrder ? (
          <div>
            <div style={{ background: 'var(--surface-alt)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem', color: 'var(--primary)' }}>Commande #{foundOrder.id}</span>
                <span style={{ fontSize: '0.8rem', background: 'var(--badge-bg)', color: 'var(--badge-text)', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '700' }}>
                  {foundOrder.date}
                </span>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Destinataire: <strong>{foundOrder.customerName}</strong> ({foundOrder.wilaya}) • Total: <strong>{foundOrder.totalAmount?.toLocaleString()} DZD</strong>
              </div>
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
                      <div style={{ fontWeight: '700', fontSize: '0.92rem', color: isActive ? 'var(--accent)' : 'var(--text)' }}>
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
            <p>Aucune commande trouvée avec ces coordonnées. Veuillez vérifier votre code de commande.</p>
          </div>
        )}
      </div>
    </div>
  );
}
