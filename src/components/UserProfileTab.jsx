import React from 'react';
import {
  User,
  Store,
  MapPin,
  Phone,
  LayoutDashboard,
  Truck,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
  PlusCircle,
  Video,
  ChevronRight,
  Star,
  Package,
  CheckCircle2,
  XCircle,
  Award,
  FileText,
  Database
} from 'lucide-react';

export function UserProfileTab({
  currentUser,
  stores = [],
  orders = [],
  onOpenDashboard,
  onOpenTracking,
  onOpenTrustPortal,
  onOpenAuth,
  onOpenPublish,
  onOpenRateStore,
  onOpenStoreReviews,
  onOpenCustomerSeriousness,
  getCustomerReliability,
  onOpenTerms,
  onOpenSupabaseConfig,
  onLogout,
  lang,
  t
}) {
  const isAr = lang === 'ar';

  // Find store profile if user is a merchant
  const currentStore = currentUser?.role === 'store'
    ? stores.find(s => s.id === currentUser.storeId || s.name === currentUser.name) || stores[0]
    : null;

  // Customer reliability stats if customer
  const customerReliability = (currentUser && getCustomerReliability)
    ? getCustomerReliability(currentUser.phone, currentUser.name)
    : { scorePercent: 100, receivedCount: 4, refusedCount: 0, badge: { labelAr: 'زبون جاد وموثوق 🌟 (استلام مؤكد)', labelFr: 'Client Sérieux & Fiable (100% Réception)', color: '#15803d', bg: '#dcfce7', borderColor: '#86efac' }, ratings: [] };

  // Customer's orders
  const myOrders = currentUser
    ? orders.filter(o => o.phone === currentUser.phone || o.customerName === currentUser.name)
    : [];

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', paddingBottom: '2.5rem' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 0.25rem' }}>
          {isAr ? 'الملف الشخصي والتقييمات' : 'Profil & Évaluations'}
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
          {isAr
            ? 'مؤشرات تقييم المتاجر وجدية الزبائن في استلام الطرود عبر كافة ولايات الجزائر'
            : 'Évaluations d\'expérience magasin et indice de réception client'}
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>{currentUser.name}</h3>
                  {currentUser.role === 'store' && <ShieldCheck size={18} color="#6366f1" />}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{currentUser.email}</div>
                <div style={{ marginTop: '0.35rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: '800', background: currentUser.role === 'store' ? '#ede9fe' : '#e0f2fe', color: currentUser.role === 'store' ? '#6366f1' : '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                    {currentUser.role === 'store' ? (isAr ? '🏪 تاجر فترينة معتمد' : '🏪 Vendeur Magasin Vérifié') : (isAr ? '👤 حساب زبون ومشتري' : '👤 Compte Client Acheteur')}
                  </span>
                  {currentUser.role === 'store' && (
                    <span style={{ fontSize: '0.72rem', fontWeight: '800', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Video size={12} />
                      <span>{isAr ? 'موثق بالفيديو' : 'Vérifié par Vidéo'}</span>
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
                <span>{currentUser.phone || '0555443322'}</span>
              </div>
            </div>
          </div>

          {/* IF CUSTOMER: Display Customer Seriousness & Parcel Reception Score Card */}
          {currentUser.role !== 'store' && (
            <div
              style={{
                background: customerReliability.badge.bg,
                border: `1.5px solid ${customerReliability.badge.borderColor}`,
                borderRadius: '20px',
                padding: '1.25rem',
                marginBottom: '1.25rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={20} color={customerReliability.badge.color} />
                  <span style={{ fontWeight: '800', fontSize: '0.92rem', color: customerReliability.badge.color }}>
                    {isAr ? 'مؤشر جدية استلام الطرود (Anti-Retour DZ)' : 'Indice de Réception des Colis (Fiabilité)'}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '1.1rem',
                    fontWeight: '900',
                    color: customerReliability.badge.color,
                    background: '#ffffff',
                    padding: '0.15rem 0.55rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.06)'
                  }}
                >
                  {customerReliability.scorePercent}%
                </span>
              </div>

              <div style={{ fontSize: '0.82rem', color: customerReliability.badge.color, fontWeight: '700', marginBottom: '0.75rem' }}>
                {isAr ? customerReliability.badge.labelAr : customerReliability.badge.labelFr}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.85rem' }}>
                <div style={{ background: '#ffffff', padding: '0.6rem', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '800', color: '#15803d', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <CheckCircle2 size={16} />
                    <span>{customerReliability.receivedCount}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'طرود مستلمة بنجاح' : 'Colis reçus'}
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '0.6rem', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontWeight: '800', color: customerReliability.refusedCount > 0 ? '#dc2626' : '#15803d', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                    <XCircle size={16} />
                    <span>{customerReliability.refusedCount}</span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'طرود مرفوضة' : 'Colis refusés'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenCustomerSeriousness && onOpenCustomerSeriousness(currentUser, customerReliability)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  background: '#ffffff',
                  color: customerReliability.badge.color,
                  border: `1px solid ${customerReliability.badge.borderColor}`,
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <ShieldCheck size={16} />
                <span>{isAr ? 'عرض بطاقة الجدية وتقييمات التجار لي' : 'Voir ma fiche de fiabilité complète'}</span>
              </button>
            </div>
          )}

          {/* IF STORE: Display Store Overall Rating (1 to 5 Stars) */}
          {currentUser.role === 'store' && currentStore && (
            <div
              style={{
                background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
                border: '1.5px solid #fde68a',
                borderRadius: '20px',
                padding: '1.25rem',
                marginBottom: '1.25rem',
                boxShadow: 'var(--shadow-card)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '800', color: '#92400e', fontSize: '0.92rem' }}>
                  {isAr ? 'تقييم تجربة المتجر (1 إلى 5 نجوم)' : 'Évaluation de votre Vitrine'}
                </span>
                <span style={{ fontSize: '0.75rem', background: '#d97706', color: '#ffffff', padding: '0.15rem 0.5rem', borderRadius: '6px', fontWeight: '800' }}>
                  {currentStore.rating || 4.8} / 5 ⭐
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: '#78350f', margin: '0 0 0.85rem' }}>
                {isAr
                  ? `حصل متجرك على ${currentStore.reviewsCount || 142} تقييم تجربة شراء من زبائن حقيقيين في الجزائر.`
                  : `Votre boutique cumule ${currentStore.reviewsCount || 142} avis vérifiés d'acheteurs en Algérie.`}
              </p>

              <button
                type="button"
                onClick={() => onOpenStoreReviews && onOpenStoreReviews(currentStore)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: 'linear-gradient(135deg, #d97706, #b45309)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.35rem'
                }}
              >
                <Star size={16} fill="#ffffff" />
                <span>{isAr ? 'عرض كافة تقييمات وتجارب الزبائن' : 'Consulter les avis certifiés'}</span>
              </button>
            </div>
          )}

          {/* Quick Links Menu */}
          <div style={{ background: 'var(--surface)', borderRadius: '20px', border: '1px solid var(--border-light)', overflow: 'hidden', boxShadow: 'var(--shadow-card)', marginBottom: '1.5rem' }}>
            {currentUser.role === 'store' && (
              <>
                <button
                  onClick={onOpenDashboard}
                  style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: isAr ? 'right' : 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <LayoutDashboard size={20} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>
                        {isAr ? 'لوحة تحكم المتجر وتقييم جدية الزبائن' : 'Tableau de Bord & Évaluation Clients'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {isAr ? 'إدارة الطلبيات، استلام الطرود وحصة 50 إعلاناً' : 'Gérer les commandes, réception colis et quota'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--text-muted)" />
                </button>

                <button
                  onClick={onOpenPublish}
                  style={{ width: '100%', padding: '1rem', background: 'rgba(217, 119, 6, 0.06)', border: 'none', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: isAr ? 'right' : 'left' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <PlusCircle size={20} color="#d97706" />
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#b45309' }}>
                        {isAr ? 'نشر إعلان جديد في الفترينة (+)' : 'Publier une nouvelle annonce (+)'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#92400e' }}>
                        {isAr ? 'إضافة سلعة مع شارة المتجر المعتمد والضمان' : 'Ajouter un produit certifié avec vidéo et garantie'}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="#d97706" />
                </button>
              </>
            )}

            <button
              onClick={onOpenTracking}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: isAr ? 'right' : 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Truck size={20} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>
                    {isAr ? 'تتبع الطلبيات وتقييم المتاجر' : 'Suivi des Commandes & Avis'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'حالة الشحن وتقييم تجربة الشراء بالنجوم (1-5)' : 'État d\'expédition et notation vendeur'}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </button>

            <button
              onClick={onOpenTrustPortal}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: isAr ? 'right' : 'left' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ShieldCheck size={20} color="#6366f1" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>Trust & Safety Portal</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'نظام التحقق بالفيديو، حماية الطرود وضمان المتاجر' : 'Badge vidéo, garanties et réputation vendeur'}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
            </button>

            {/* شروط وأحكام استخدام التطبيق */}
            <button
              onClick={onOpenTerms}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: isAr ? 'right' : 'left', color: 'var(--text-main)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileText size={20} color="var(--primary)" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>
                    {isAr ? 'شروط وأحكام استخدام التطبيق' : 'Conditions Générales d’Utilisation'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {isAr ? 'حقوق المستخدم، المعاملات، وإخلاء المسؤولية' : 'Droits, litiges, règles de vente et achats'}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
            </button>

            {/* إعدادات قاعدة البيانات السحابية Supabase */}
            <button
              onClick={onOpenSupabaseConfig}
              style={{ width: '100%', padding: '1rem', background: 'rgba(16, 185, 129, 0.05)', border: 'none', borderBottom: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', textAlign: isAr ? 'right' : 'left', color: 'var(--text-main)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Database size={20} color="#059669" />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#065f46' }}>
                    {isAr ? 'خادم وقاعدة بيانات Supabase (PostgreSQL)' : 'Serveur & Base Supabase Cloud'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#047857' }}>
                    {isAr ? 'ربط مفاتيح API، مزامنة البيانات، ومخطط SQL' : 'Connexion clés API, sync des tables & schéma SQL'}
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="#059669" style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
            </button>

            <button
              onClick={onLogout}
              style={{ width: '100%', padding: '1rem', background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', color: '#ef4444', textAlign: isAr ? 'right' : 'left' }}
            >
              <LogOut size={20} />
              <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>
                {isAr ? 'تسجيل الخروج' : 'Se déconnecter'}
              </div>
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
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#9a3412', margin: 0 }}>
                  {isAr ? 'فتح حساب متجر وفترينة معتمدة' : 'Créer un Compte Magasin'}
                </h3>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', background: 'var(--orange-action)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>
                  {isAr ? '50 إعلان مجاني' : '50 Annonces Gratuites'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: '#7c2d12', margin: '0.75rem 0 1rem', lineHeight: '1.4' }}>
              {isAr
                ? 'انضم إلى شبكة التجار المعتمدين في الجزائر، احصل على شارة التحقق بالفيديو ولوحة تحكم متكاملة لإدارة مبيعاتك ونشر حتى 50 إعلاناً مجاناً، مع نظام تقييم جدية الزبائن واستقبال الطرود.'
                : 'Bénéficiez du badge officiel "Vérifié par Vidéo", publiez jusqu\'à 50 produits sans frais et évaluez le sérieux des clients à la livraison.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '0.6rem' }}>
              <button
                onClick={() => onOpenAuth('register_store')}
                style={{ width: '100%', padding: '0.85rem', background: 'var(--orange-gradient)', color: '#ffffff', border: 'none', borderRadius: '14px', fontSize: '0.88rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem', boxShadow: 'var(--shadow-floating)' }}
              >
                <Store size={17} />
                <span>{isAr ? 'تسجيل متجر جديد' : 'Ouvrir Vitrine'}</span>
              </button>
              <button
                onClick={() => onOpenAuth('login_store')}
                style={{ width: '100%', padding: '0.85rem', background: '#ffffff', color: '#b45309', border: '1.5px solid #d97706', borderRadius: '14px', fontSize: '0.88rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <LogIn size={16} />
                <span>{isAr ? 'دخول تاجر' : 'Connexion'}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Compte Particulier / Client */}
          <div style={{ background: 'var(--surface)', borderRadius: '22px', padding: '1.25rem', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <User size={22} color="#0284c7" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', margin: 0 }}>
                  {isAr ? 'حساب زبون ومشتري' : 'Compte Acheteur & Vendeur'}
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {isAr ? 'طلب مباشر وتتبع في 58 ولاية' : 'Commandes en 1 clic & messagerie'}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.75rem 0 1rem' }}>
              {isAr
                ? 'سجل حساب زبون لطلب المنتجات مباشرة من المحلات المعتمدة وتتبع طلبيتك، تقييم تجربة المتاجر من 1 إلى 5 نجوم وبناء مؤشر الجدية في استلام الطرود.'
                : 'Suivez vos colis dans les 58 Wilayas, commandez directement auprès des magasins vérifiés et notez votre expérience de 1 à 5 étoiles.'}
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

          {/* Terms & Conditions card for guests */}
          <button
            onClick={onOpenTerms}
            style={{
              background: 'var(--surface)',
              borderRadius: '16px',
              padding: '0.9rem 1.15rem',
              border: '1px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'var(--text-main)',
              textAlign: isAr ? 'right' : 'left',
              width: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800' }}>
                  {isAr ? 'شروط وأحكام استخدام التطبيق' : 'Conditions Générales d’Utilisation'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {isAr ? 'إقرأ الشروط المنظمة لعمليات البيع والشراء والطلبيات' : 'Règles régissant les ventes, achats et livraisons'}
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
          </button>

          {/* Supabase backend config card for guests */}
          <button
            onClick={onOpenSupabaseConfig}
            style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
              borderRadius: '16px',
              padding: '0.9rem 1.15rem',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'var(--text-main)',
              textAlign: isAr ? 'right' : 'left',
              width: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={18} color="#059669" />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#065f46' }}>
                  {isAr ? 'إعداد خادم Supabase السحابي' : 'Configuration Backend Supabase'}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#047857' }}>
                  {isAr ? 'ربط مفاتيح المشروع وتشغيل قاعدة بيانات PostgreSQL' : 'Clés de projet, synchronisation et schéma SQL'}
                </div>
              </div>
            </div>
            <ChevronRight size={18} color="#059669" style={{ transform: isAr ? 'rotate(180deg)' : 'none' }} />
          </button>
        </div>
      )}
    </div>
  );
}
