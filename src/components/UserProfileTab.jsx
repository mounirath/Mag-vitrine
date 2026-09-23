import React, { useState } from 'react';
import { ArrowLeft, User, Store, ShieldCheck, Video, Package, Truck, LayoutDashboard, LogOut, LogIn, UserPlus, Phone, MapPin, CheckCircle2, ChevronRight } from 'lucide-react';

export function UserProfileTab({
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenDashboard,
  onOpenTracking,
  onOpenTrustPortal,
  stores,
  lang,
  t
}) {
  const isAr = lang === 'ar';

  return (
    <div style={{ padding: '1rem', paddingBottom: '6rem' }}>
      {/* Header title */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
          {isAr ? 'حسابي والملف الشخصي' : 'Mon Compte & Profil'}
        </h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {isAr ? 'إدارة المبيعات، الفترينات المعتمدة والطلبات' : 'Espace vendeur certifié, vitrine commerciale et commandes'}
        </p>
      </div>

      {currentUser ? (
        <div>
          {/* User / Store Card */}
          <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '1.25rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: currentUser.role === 'store' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(2, 132, 199, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {currentUser.role === 'store' ? <Store size={28} color="#6366f1" /> : <User size={28} color="#0284c7" />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{currentUser.name}</h3>
                  {currentUser.role === 'store' && <ShieldCheck size={18} color="#6366f1" />}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                <div style={{ marginTop: '0.3rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', background: currentUser.role === 'store' ? '#ede9fe' : '#e0f2fe', color: currentUser.role === 'store' ? '#6366f1' : '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    {currentUser.role === 'store' ? '🏪 Vendeur Magasin Vérifié' : '👤 Compte Client'}
                  </span>
                  {currentUser.role === 'store' && (
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Video size={12} />
                      <span>Vérifié par Vidéo</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Wilaya and Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', background: 'var(--surface-alt)', padding: '0.75rem', borderRadius: '12px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <MapPin size={15} color="var(--text-muted)" />
                <span>{currentUser.wilaya || 'Alger'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={15} color="var(--text-muted)" />
                <span>{currentUser.phone || '+213 555 00 11 22'}</span>
              </div>
            </div>
          </div>

          {/* Quick Links Menu */}
          <div style={{ background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
            {currentUser.role === 'store' && (
              <button
                onClick={onOpenDashboard}
                style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <LayoutDashboard size={20} color="var(--primary)" />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>Tableau de Bord Vitrine</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gérer mon stock, prix et quota de 50 annonces</div>
                  </div>
                </div>
                <ChevronRight size={18} color="var(--text-muted)" />
              </button>
            )}

            <button
              onClick={onOpenTracking}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Truck size={20} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>Suivi des Commandes</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>État d'expédition dans les 58 Wilayas</div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>

            <button
              onClick={onOpenTrustPortal}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="#6366f1" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>Trust & Safety Portal</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Badge vidéo, garanties et réputation vendeur</div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>

            <button
              onClick={onLogout}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#ef4444', textAlign: 'left' }}
            >
              <LogOut size={20} />
              <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>Se déconnecter</div>
            </button>
          </div>
        </div>
      ) : (
        /* Not logged in: Show Registration / Login Cards */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Card 1: Création Compte Magasin (50 annonces gratuites) */}
          <div style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fff7ed 100%)', borderRadius: '22px', padding: '1.25rem', border: '1px solid #fed7aa', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <Store size={22} color="var(--orange-action)" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#9a3412' }}>
                  {isAr ? 'فتح حساب متجر وفترينة معتمدة' : 'Créer un Compte Magasin'}
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'var(--orange-action)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                  {isAr ? '50 إعلان مجاني' : '50 Annonces Gratuites'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#7c2d12', margin: '0.75rem 0 1rem', lineHeight: '1.4' }}>
              {isAr
                ? 'انضم إلى شبكة التجار المعتمدين في الجزائر، احصل على شارة التحقق بالفيديو ولوحة تحكم متكاملة لإدارة مبيعاتك ونشر حتى 50 إعلاناً مجاناً.'
                : 'Bénéficiez du badge officiel "Vérifié par Vidéo", publiez jusqu à 50 produits sans frais et recevez les commandes directement.'}
            </p>

            <button
              onClick={() => onOpenAuth('register_store')}
              style={{ width: '100%', padding: '0.85rem', background: 'var(--orange-gradient)', color: '#ffffff', border: 'none', borderRadius: '14px', fontSize: '0.92rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', boxShadow: 'var(--shadow-floating)' }}
            >
              <Store size={18} />
              <span>{isAr ? 'تسجيل متجر جديد مجاناً' : 'Ouvrir ma Vitrine Gratuite'}</span>
            </button>
          </div>

          {/* Card 2: Compte Particulier / Client */}
          <div style={{ background: 'var(--surface)', borderRadius: '22px', padding: '1.25rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={22} color="#0284c7" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800' }}>
                  {isAr ? 'حساب زبون ومشتري' : 'Compte Acheteur & Vendeur'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {isAr ? 'طلب مباشر وتتبع في 58 ولاية' : 'Commandes en 1 clic & messagerie'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.75rem 0 1rem' }}>
              {isAr
                ? 'سجل حساب زبون لطلب المنتجات مباشرة من المحلات المعتمدة وتتبع طلبيتك عبر كافة ولايات الوطن.'
                : 'Suivez vos colis dans les 58 Wilayas et commandez directement auprès des magasins vérifiés.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              <button
                onClick={() => onOpenAuth('register_client')}
                style={{
                  padding: '0.75rem',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <UserPlus size={15} />
                <span>{isAr ? 'إنشاء حساب زبون' : 'Créer un compte'}</span>
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                style={{
                  padding: '0.75rem',
                  background: 'var(--navy-header)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.85rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <LogIn size={15} />
                <span>{isAr ? 'تسجيل الدخول' : 'Se connecter'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
