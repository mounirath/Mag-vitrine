import React from 'react';
import { Store, ShieldCheck, Heart, MapPin, Truck } from 'lucide-react';

export function Footer({ lang, t }) {
  const isAr = lang === 'ar';

  return (
    <footer>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <img
            src="/assets/ic_mag_vitrine_icon.jpg"
            alt="MAG VITRINE"
            style={{ width: '32px', height: '32px', borderRadius: '8px' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <span style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>
            MAG VITRINE ALGÉRIE
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '600px', margin: '0 auto 1.5rem' }}>
          {isAr
            ? 'المنصة الوطنية الرائدة لربط المستهلكين الجزائريين بأفضل المحلات والفترينات التجارية عبر الـ 58 ولاية مع خدمة الدفع عند الاستلام.'
            : 'Plateforme nationale de référence pour connecter les consommateurs algériens aux meilleures vitrines de commerçants à travers les 58 Wilayas avec paiement à la livraison.'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="var(--primary)" />
            <span>58 Wilayas d Algérie</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Truck size={14} color="var(--primary)" />
            <span>Paiement à la livraison (COD)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={14} color="var(--primary)" />
            <span>Commerces réels & vérifiés</span>
          </div>
        </div>

        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          © {new Date().getFullYear()} MAG VITRINE • Fait avec passion pour le commerce local en Algérie 🇩🇿
        </div>
      </div>
    </footer>
  );
}
