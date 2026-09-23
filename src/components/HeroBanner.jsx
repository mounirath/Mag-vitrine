import React from 'react';
import { Sparkles, ShieldCheck, MapPin, Truck, Store, UserPlus } from 'lucide-react';

export function HeroBanner({ lang, onExploreStores, onExploreCatalog, onOpenStoreRegistration, t }) {
  const isAr = lang === 'ar';

  return (
    <section className="hero-box">
      <div className="hero-card">
        <div className="hero-text-side">
          <div className="hero-pill">
            <Sparkles size={15} />
            <span>58 Wilayas • Vitrines Vérifiées • IA Recherche</span>
          </div>

          <h1 className="hero-h1">
            {isAr ? (
              <>
                منصة الفترينات الذكية و <span>التجارة المحلية في الجزائر</span>
              </>
            ) : (
              <>
                Vitrines Virtuelles & <span>Commerce Local en Algérie</span>
              </>
            )}
          </h1>

          <p className="hero-p">
            {isAr
              ? 'تصفح أفضل المتاجر، اطلب بأسعار حقيقية مع الدفع عند الاستلام، وتواصل مباشرة مع أصحاب المحلات عبر الهاتف وواتساب.'
              : 'Découvrez les meilleures boutiques des 58 Wilayas, commandez en paiement à la livraison et contactez directement les commerçants par téléphone et WhatsApp.'}
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={onExploreStores}
              className="btn-add-cart"
              style={{ width: 'auto', padding: '0.75rem 1.4rem', borderRadius: '9999px', fontSize: '0.95rem' }}
            >
              <Store size={18} />
              <span>{t.navStores}</span>
            </button>
            <button
              onClick={onExploreCatalog}
              className="btn-store-call"
              style={{ width: 'auto', padding: '0.75rem 1.4rem', borderRadius: '9999px', fontSize: '0.95rem' }}
            >
              <Truck size={18} />
              <span>{t.navCatalog}</span>
            </button>
            <button
              onClick={onOpenStoreRegistration}
              className="btn-store-call"
              style={{ width: 'auto', padding: '0.75rem 1.4rem', borderRadius: '9999px', fontSize: '0.95rem', background: 'var(--badge-bg)', color: 'var(--badge-text)', borderColor: 'var(--badge-border)', fontWeight: '800' }}
            >
              <UserPlus size={18} />
              <span>{isAr ? 'فتح فترينة مجاناً (50 إعلان)' : 'Ouvrir ma Vitrine (Gratuit)'}</span>
            </button>
          </div>
        </div>

        <div className="hero-img-wrap">
          <img
            src="/assets/img_promo_banner.jpg"
            alt="MAG VITRINE Hero"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=700'; }}
          />
        </div>
      </div>
    </section>
  );
}
