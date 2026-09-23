import React from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, Star, Video, FileText, Lock, UserCheck, AlertCircle } from 'lucide-react';

export function TrustSafetyPortal({ isOpen, onClose, store, lang, t }) {
  if (!isOpen) return null;
  const isAr = lang === 'ar';

  return (
    <div className="screen-modal-overlay">
      <div className="modal-screen-header">
        <button className="btn-back-header" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <span className="modal-header-title">
          {isAr ? 'بوابة الأمان والموثوقية' : 'Trust & Safety Portal'}
        </span>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '1.25rem' }}>
        {/* Shield Certificate Card */}
        <div className="trust-shield-badge">
          <div className="shield-icon-circle">
            <ShieldCheck size={38} color="#6366f1" />
          </div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.25rem', color: '#1e1b4b' }}>
            {isAr ? 'حساب معتمد وموثق بالفيديو' : 'Compte Vérifié par Vidéo'}
          </h2>
          <span style={{ fontSize: '0.85rem', color: '#6366f1', fontWeight: '700', background: '#ede9fe', padding: '0.2rem 0.65rem', borderRadius: '9999px' }}>
            {isAr ? 'حساب موثق رسمي' : 'Compte vérifié'}
          </span>

          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontWeight: '800', color: '#d97706', fontSize: '1.1rem' }}>
            <Star size={18} fill="#f59e0b" />
            <span>{isAr ? 'سمعة البائع: 4.8 ★' : 'Réputation du Vendeur: 4.8 ★'}</span>
          </div>
        </div>

        {/* Verification Rows */}
        <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '1.1rem', border: '1px solid var(--border-light)', marginBottom: '1.25rem', boxShadow: 'var(--shadow-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video size={22} color="#4f46e5" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '800' }}>
                {isAr ? 'توثيق هوية البائع بالفيديو' : 'Comptes du Vendeur'}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'تم التحقق من الوجه والهاتف والوثائق التجارية' : 'Compte Vérification au Vidéo'}
              </p>
            </div>
            <CheckCircle2 size={20} color="#10b981" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={22} color="#059669" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: '800' }}>
                {isAr ? 'سجل تجاري / بطاقة حرفي معتمدة' : 'Registre de Commerce / Artisan'}
              </h4>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {isAr ? 'البيانات الجبائية والتجارية مطابقة' : 'Identité juridique et localisation validées'}
              </p>
            </div>
            <CheckCircle2 size={20} color="#10b981" />
          </div>
        </div>

        {/* User reputation section */}
        <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '1.1rem', border: '1px solid var(--border-light)', marginBottom: '1.25rem', boxShadow: 'var(--shadow-card)' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-main)' }}>
            {isAr ? 'تقييمات وآراء المشترين' : 'Avis & Réputation'}
          </h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
              alt="Avatar"
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '800' }}>Sarah M. (Alger)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Transaction remise en main propre sécurisée</div>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#f59e0b' }}>5.0 ★</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
              alt="Avatar"
              style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: '800' }}>Khaled B. (Oran)</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Article conforme et emballage très soigné</div>
            </div>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', color: '#f59e0b' }}>4.9 ★</span>
          </div>
        </div>

        {/* Buyer Protection Guarantee */}
        <div style={{ background: '#f8fafc', borderRadius: '18px', padding: '1rem', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <Lock size={20} color="#0284c7" style={{ marginTop: '0.15rem' }} />
          <div>
            <h5 style={{ fontSize: '0.88rem', fontWeight: '800', marginBottom: '0.2rem' }}>
              {isAr ? 'حماية MAG VITRINE للمشتري' : 'Protection Acheteur MAG VITRINE'}
            </h5>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
              {isAr
                ? 'دفع عند الاستلام مع إمكانية فتح الطرد وفحص المنتج قبل تسليم المبلغ للناقل.'
                : 'Paiement à la livraison avec possibilité d inspecter l objet avant encaissement. Droit de rétractation garanti.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
