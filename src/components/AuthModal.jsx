import React, { useState, useEffect } from 'react';
import { X, User, Store, LogIn, UserPlus, CheckCircle2, ShieldCheck, Phone, Mail, MapPin, Lock, MessageCircle } from 'lucide-react';
import { WILAYAS } from '../data/initialData';

export function AuthModal({
  isOpen,
  onClose,
  initialTab = 'login', // 'login', 'login_customer', 'login_store', 'register_client', 'register_store'
  onLogin,
  onRegisterCustomer,
  onRegisterStore,
  lang,
  t
}) {
  // Normalize initialTab
  const getTabMode = (tab) => {
    if (tab === 'login_customer' || tab === 'login_store') return 'login';
    return tab || 'login';
  };

  const [activeTab, setActiveTab] = useState(getTabMode(initialTab));
  const [loginRoleIntent, setLoginRoleIntent] = useState(
    initialTab === 'login_store' ? 'store' : (initialTab === 'login_customer' ? 'customer' : 'all')
  );
  const isAr = lang === 'ar';

  // Synchronize state when modal opens or initialTab changes
  useEffect(() => {
    setActiveTab(getTabMode(initialTab));
    if (initialTab === 'login_store') {
      setLoginRoleIntent('store');
      setLoginEmail('contact@techzone.dz');
    } else if (initialTab === 'login_customer') {
      setLoginRoleIntent('customer');
      setLoginEmail('client@gmail.com');
    } else {
      setLoginRoleIntent('all');
    }
  }, [initialTab, isOpen]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Customer registration state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientWilaya, setClientWilaya] = useState('Alger');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPassword, setClientPassword] = useState('');

  // Store registration state
  const [storeName, setStoreName] = useState('');
  const [managerName, setManagerName] = useState('');
  const [storeEmail, setStoreEmail] = useState('');
  const [storePhone, setStorePhone] = useState('');
  const [storeWhatsApp, setStoreWhatsApp] = useState('');
  const [storeWilaya, setStoreWilaya] = useState('Alger');
  const [storeCommune, setStoreCommune] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeHours, setStoreHours] = useState('Sam - Jeu : 09h00 - 20h00');
  const [storeDesc, setStoreDesc] = useState('');
  const [storePassword, setStorePassword] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    onLogin(loginEmail);
    setSuccessMsg(isAr ? 'تم تسجيل الدخول بنجاح !' : 'Connexion réussie !');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) return;

    onRegisterCustomer({
      name: clientName,
      email: clientEmail,
      phone: clientPhone,
      wilaya: clientWilaya,
      address: clientAddress,
      password: clientPassword
    });

    setSuccessMsg(isAr ? 'تم إنشاء حساب الزبون بنجاح !' : 'Compte client créé avec succès !');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleStoreSubmit = (e) => {
    e.preventDefault();
    if (!storeName || !managerName || !storeEmail || !storePhone) return;

    onRegisterStore({
      storeName,
      managerName,
      email: storeEmail,
      phone: storePhone,
      whatsapp: storeWhatsApp || storePhone,
      wilaya: storeWilaya,
      commune: storeCommune,
      address: storeAddress,
      openingHours: storeHours,
      description: storeDesc || `Bienvenue dans la vitrine de ${storeName} à ${storeWilaya}.`,
      password: storePassword
    });

    setSuccessMsg(isAr ? 'تم فتح فترينة المتجر بنجاح ! مرحباً بك كتاجر معتمد' : 'Vitrine magasin créée avec succès ! Bienvenue commerçant partenaire.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Tab Headers */}
        <div style={{ display: 'flex', gap: '0.4rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '1.25rem', overflowX: 'auto' }}>
          <button
            className={`nav-item ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
            style={{ fontSize: '0.88rem' }}
          >
            <LogIn size={16} />
            <span>{t.authLogin}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'register_client' ? 'active' : ''}`}
            onClick={() => setActiveTab('register_client')}
            style={{ fontSize: '0.88rem' }}
          >
            <UserPlus size={16} />
            <span>{t.authRegisterClient}</span>
          </button>
          <button
            className={`nav-item ${activeTab === 'register_store' ? 'active' : ''}`}
            onClick={() => setActiveTab('register_store')}
            style={{ fontSize: '0.88rem', background: activeTab === 'register_store' ? 'var(--primary)' : 'transparent', color: activeTab === 'register_store' ? '#fff' : 'inherit' }}
          >
            <Store size={16} />
            <span>{t.authRegisterStore}</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div style={{ background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', color: 'var(--badge-text)', padding: '0.85rem', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontWeight: '700' }}>
            <CheckCircle2 size={18} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: loginRoleIntent === 'store' ? 'rgba(217, 119, 6, 0.15)' : 'var(--badge-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                {loginRoleIntent === 'store' ? <Store size={26} color="#d97706" /> : <User size={26} color="var(--primary)" />}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
                {loginRoleIntent === 'store'
                  ? (isAr ? 'دخول تاجر / صاحب متجر' : 'Connexion Commerçant / Magasin')
                  : (loginRoleIntent === 'customer'
                    ? (isAr ? 'دخول المستخدم / الزبون' : 'Connexion Client')
                    : t.authLogin)}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {loginRoleIntent === 'store'
                  ? (isAr ? 'إدارة فترينتك التجارية ومتابعة الطلبات وتعديل الأسعار' : 'Gérez votre vitrine, vos stocks et recevez vos commandes directes')
                  : (isAr ? 'متابعة مشترياتك وطلباتك السريعة والتواصل مع المتاجر' : 'Connectez-vous pour suivre vos commandes ou gérer votre vitrine')}
              </p>

              {/* Role Toggle Switch inside Login */}
              <div style={{ display: 'flex', background: 'var(--surface-alt)', padding: '0.25rem', borderRadius: '12px', marginTop: '0.75rem', gap: '0.25rem', border: '1px solid var(--border)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRoleIntent('customer');
                    setLoginEmail('client@gmail.com');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: loginRoleIntent === 'customer' ? 'var(--surface)' : 'transparent',
                    color: loginRoleIntent === 'customer' ? 'var(--primary)' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: loginRoleIntent === 'customer' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  <User size={14} />
                  <span>{isAr ? 'دخول مستخدم' : 'Espace Client'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRoleIntent('store');
                    setLoginEmail('contact@techzone.dz');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.45rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: loginRoleIntent === 'store' ? 'var(--surface)' : 'transparent',
                    color: loginRoleIntent === 'store' ? '#d97706' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: loginRoleIntent === 'store' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  <Store size={14} />
                  <span>{isAr ? 'دخول تاجر' : 'Espace Vendeur'}</span>
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Email</label>
              <input
                type="email"
                placeholder="votre-email@domaine.dz"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
              />
            </div>

            <button type="submit" className="btn-add-cart" style={{ padding: '0.8rem', marginTop: '0.5rem' }}>
              <LogIn size={17} />
              <span>{t.authLogin}</span>
            </button>

            {/* Demo Accounts Quick Login */}
            <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem', textAlign: 'center' }}>
                Comptes de démonstration rapide :
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-store-call"
                  onClick={() => {
                    setLoginEmail('client@gmail.com');
                    onLogin('client@gmail.com');
                    onClose();
                  }}
                >
                  <User size={14} />
                  <span>Client (Karim)</span>
                </button>
                <button
                  type="button"
                  className="btn-store-call"
                  onClick={() => {
                    setLoginEmail('contact@techzone.dz');
                    onLogin('contact@techzone.dz');
                    onClose();
                  }}
                >
                  <Store size={14} />
                  <span>Magasin TechZone</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* TAB 2: REGISTER CUSTOMER */}
        {activeTab === 'register_client' && (
          <form onSubmit={handleClientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{t.authRegisterClient}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Commandez facilement avec livraison à domicile sur tout le territoire national
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Nom et Prénom</label>
                <input
                  type="text"
                  placeholder="Mohamed Amine"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Téléphone</label>
                <input
                  type="tel"
                  placeholder="05 50 12 34 56"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Adresse Email</label>
              <input
                type="email"
                placeholder="client@domaine.dz"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Wilaya</label>
                <select
                  value={clientWilaya}
                  onChange={(e) => setClientWilaya(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                >
                  {WILAYAS.map(w => (
                    <option key={w.code} value={w.name}>{w.code} - {w.name} ({w.nameAr})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Adresse / Commune</label>
                <input
                  type="text"
                  placeholder="Quartier ou Cité..."
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={clientPassword}
                onChange={(e) => setClientPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
              />
            </div>

            <button type="submit" className="btn-add-cart" style={{ padding: '0.8rem', marginTop: '0.5rem' }}>
              <UserPlus size={17} />
              <span>{t.authRegisterClient}</span>
            </button>
          </form>
        )}

        {/* TAB 3: REGISTER STORE */}
        {activeTab === 'register_store' && (
          <form onSubmit={handleStoreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', maxHeight: '68vh', overflowY: 'auto', paddingRight: '0.25rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(4, 120, 87, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem' }}>
                <Store size={24} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>{t.authRegisterStore}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Ouvrez votre vitrine en ligne, publiez jusqu à 50 annonces et recevez des commandes directes sur WhatsApp
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Nom de la boutique / المتجر</label>
                <input
                  type="text"
                  placeholder="Ex: Élégance Mode Alger"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Nom du gérant / التاجر</label>
                <input
                  type="text"
                  placeholder="Ex: Yacine Bouzid"
                  value={managerName}
                  onChange={(e) => setManagerName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Numéro Téléphone</label>
                <input
                  type="tel"
                  placeholder="+213 661 00 00 00"
                  value={storePhone}
                  onChange={(e) => setStorePhone(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Numéro WhatsApp (pour commandes)</label>
                <input
                  type="tel"
                  placeholder="213661000000"
                  value={storeWhatsApp}
                  onChange={(e) => setStoreWhatsApp(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Wilaya</label>
                <select
                  value={storeWilaya}
                  onChange={(e) => setStoreWilaya(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                >
                  {WILAYAS.map(w => (
                    <option key={w.code} value={w.name}>{w.code} - {w.name} ({w.nameAr})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Commune</label>
                <input
                  type="text"
                  placeholder="Ex: Hydra, Es Senia..."
                  value={storeCommune}
                  onChange={(e) => setStoreCommune(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Adresse exacte du local commercial</label>
              <input
                type="text"
                placeholder="Ex: 14 Rue Didouche Mourad, en face de la poste"
                value={storeAddress}
                onChange={(e) => setStoreAddress(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Email professionnel</label>
                <input
                  type="email"
                  placeholder="boutique@domaine.dz"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Horaires d ouverture</label>
                <input
                  type="text"
                  placeholder="Sam - Jeu : 09h00 - 20h00"
                  value={storeHours}
                  onChange={(e) => setStoreHours(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Description de votre activité</label>
              <textarea
                rows={2}
                placeholder="Décrivez vos produits et marques proposées..."
                value={storeDesc}
                onChange={(e) => setStoreDesc(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: '700', marginBottom: '0.3rem', display: 'block' }}>Mot de passe d administration vitrine</label>
              <input
                type="password"
                placeholder="••••••••"
                value={storePassword}
                onChange={(e) => setStorePassword(e.target.value)}
                required
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
              />
            </div>

            <button type="submit" className="btn-add-cart" style={{ padding: '0.85rem', marginTop: '0.5rem', background: 'var(--primary)' }}>
              <Store size={18} />
              <span>Créer ma Vitrine Magasin (50 annonces gratuites)</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
