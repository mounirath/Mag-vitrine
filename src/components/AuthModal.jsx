import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Store,
  LogIn,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Building,
  Clock,
  FileText
} from 'lucide-react';
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
  const isAr = lang === 'ar';

  // Normalize initial tab
  const resolveTab = (tab) => {
    if (tab === 'login_customer' || tab === 'login_store') return 'login';
    if (tab === 'register_client' || tab === 'register_store') return tab;
    return tab || 'login';
  };

  const [activeTab, setActiveTab] = useState(resolveTab(initialTab));
  const [loginRoleIntent, setLoginRoleIntent] = useState(
    initialTab === 'login_store' ? 'store' : (initialTab === 'login_customer' ? 'customer' : 'all')
  );

  // Sync state whenever initialTab changes or modal opens
  useEffect(() => {
    setActiveTab(resolveTab(initialTab));
    if (initialTab === 'login_store') {
      setLoginRoleIntent('store');
      setLoginEmail('contact@techzone.dz');
    } else if (initialTab === 'login_customer') {
      setLoginRoleIntent('customer');
      setLoginEmail('client@gmail.com');
    } else {
      setLoginRoleIntent('all');
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [initialTab, isOpen]);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Customer registration state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientWilaya, setClientWilaya] = useState('Alger');
  const [clientAddress, setClientAddress] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [showClientPassword, setShowClientPassword] = useState(false);

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
  const [showStorePassword, setShowStorePassword] = useState(false);

  // Status & Feedback
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  // Auto-fill helpers for testing
  const handleAutoFillClient = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setClientName(isAr ? `أمين بلحاج ${randomNum}` : `Amine Belhadj ${randomNum}`);
    setClientEmail(`client_${randomNum}@magvitrine.dz`);
    setClientPhone(`0550${randomNum}12`);
    setClientWilaya('Alger');
    setClientAddress(isAr ? 'الجزائر الوسطى، ديدوش مراد' : 'Alger Centre, Didouche Mourad');
    setClientPassword('123456');
    setErrorMsg('');
  };

  const handleAutoFillStore = () => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    setStoreName(isAr ? `متجر الأناقة DZ #${randomNum}` : `Boutique El-Anaka DZ #${randomNum}`);
    setManagerName(isAr ? 'ياسين بوزيد' : 'Yacine Bouzid');
    setStoreEmail(`magasin_${randomNum}@magvitrine.dz`);
    setStorePhone(`0661${randomNum}00`);
    setStoreWhatsApp(`0661${randomNum}00`);
    setStoreWilaya('Alger');
    setStoreCommune('Sidi M\'Hamed');
    setStoreAddress(isAr ? '14 شارع حسيبة بن بوعلي، الجزائر العاصمة' : '14 Rue Hassiba Ben Bouali, Alger');
    setStoreHours('09:00 - 20:00');
    setStoreDesc(isAr ? 'متجر متخصص في الألبسة والأحذية العصرية مع توصيل لـ 58 ولاية' : 'Boutique de prêt-à-porter moderne et accessoires.');
    setStorePassword('store123456');
    setErrorMsg('');
  };

  // Submit Handlers
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!loginEmail.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Veuillez saisir votre adresse email');
      return;
    }

    try {
      onLogin(loginEmail.trim());
      setSuccessMsg(isAr ? 'تم تسجيل الدخول بنجاح ! مرحباً بك' : 'Connexion réussie ! Bienvenue');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 900);
    } catch (err) {
      setErrorMsg(isAr ? 'فشل تسجيل الدخول، يرجى المحاولة ثانية' : 'Échec de la connexion, veuillez réessayer');
    }
  };

  const handleClientSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال الاسم واللقب' : 'Veuillez saisir votre nom et prénom');
      return;
    }
    if (!clientEmail.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال البريد الإلكتروني' : 'Veuillez saisir votre adresse email');
      return;
    }
    if (!clientPhone.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال رقم الهاتف' : 'Veuillez saisir votre numéro de téléphone');
      return;
    }

    try {
      onRegisterCustomer({
        name: clientName.trim(),
        email: clientEmail.trim(),
        phone: clientPhone.trim(),
        wilaya: clientWilaya,
        address: clientAddress.trim(),
        password: clientPassword || '123456'
      });

      setSuccessMsg(isAr ? 'تم إنشاء حساب الزبون بنجاح ! أهلاً بك في MAG VITRINE' : 'Compte client créé avec succès ! Bienvenue');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1000);
    } catch (err) {
      setErrorMsg(isAr ? 'حدث خطأ أثناء إنشاء الحساب' : 'Une erreur est survenue lors de l inscription');
    }
  };

  const handleStoreSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!storeName.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال اسم المحل أو المتجر' : 'Veuillez indiquer le nom de votre magasin');
      return;
    }
    if (!managerName.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال اسم المسير / التاجر' : 'Veuillez indiquer le nom du gérant');
      return;
    }
    if (!storeEmail.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال البريد الإلكتروني للمتجر' : 'Veuillez renseigner un email de contact');
      return;
    }
    if (!storePhone.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال رقم هاتف المتجر' : 'Veuillez renseigner un numéro de téléphone');
      return;
    }

    try {
      onRegisterStore({
        storeName: storeName.trim(),
        managerName: managerName.trim(),
        email: storeEmail.trim(),
        phone: storePhone.trim(),
        whatsapp: storeWhatsApp.trim() || storePhone.trim(),
        wilaya: storeWilaya,
        commune: storeCommune.trim() || storeWilaya,
        address: storeAddress.trim() || (isAr ? `ولاية ${storeWilaya}` : `Wilaya de ${storeWilaya}`),
        openingHours: storeHours,
        description: storeDesc.trim() || (isAr ? `فترينة معتمدة لـ ${storeName}` : `Vitrine vérifiée de ${storeName}`),
        password: storePassword || 'store123'
      });

      setSuccessMsg(isAr ? 'تم فتح فترينة المتجر بنجاح ! يمكنك الآن إضافة حتى 50 إعلاناً' : 'Vitrine magasin créée avec succès ! Vous pouvez publier jusqu à 50 annonces.');
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(isAr ? 'حدث خطأ أثناء تسجيل المتجر' : 'Une erreur est survenue lors de l inscription du magasin');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '540px',
          padding: '1.4rem',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Close button */}
        <button className="close-btn" onClick={onClose} aria-label={isAr ? 'إغلاق' : 'Fermer'}>
          <X size={20} />
        </button>

        {/* Top Header Badge */}
        <div style={{ textAlign: 'center', marginBottom: '1rem', marginTop: '0.2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.4rem' }}>
            <span>🇩🇿 MAG VITRINE DZ</span>
            <span>•</span>
            <span>{isAr ? 'المنصة التجارية المعتمدة' : 'Plateforme Commerciale'}</span>
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
            {activeTab === 'login' && (isAr ? 'تسجيل الدخول إلى حسابك' : 'Connexion à votre espace')}
            {activeTab === 'register_client' && (isAr ? 'إنشاء حساب زبون جديد' : 'Créer un Compte Client')}
            {activeTab === 'register_store' && (isAr ? 'فتح فترينة متجر تجاري' : 'Créer une Vitrine Magasin')}
          </h2>
        </div>

        {/* 3 Prominent Tabs */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            background: 'var(--surface-alt)',
            padding: '0.3rem',
            borderRadius: '16px',
            border: '1px solid var(--border-light)',
            gap: '0.25rem',
            marginBottom: '1rem'
          }}
        >
          {/* Tab 1: Login */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg('');
            }}
            style={{
              padding: '0.55rem 0.3rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'login' ? 'var(--navy-header)' : 'transparent',
              color: activeTab === 'login' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: activeTab === 'login' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            <LogIn size={15} />
            <span>{isAr ? 'دخول' : 'Connexion'}</span>
          </button>

          {/* Tab 2: Register Client */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('register_client');
              setErrorMsg('');
            }}
            style={{
              padding: '0.55rem 0.3rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'register_client' ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'transparent',
              color: activeTab === 'register_client' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: activeTab === 'register_client' ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            <UserPlus size={15} />
            <span>{isAr ? 'حساب زبون' : 'Client'}</span>
          </button>

          {/* Tab 3: Register Store */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('register_store');
              setErrorMsg('');
            }}
            style={{
              padding: '0.55rem 0.3rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === 'register_store' ? 'linear-gradient(135deg, #d97706, #b45309)' : 'transparent',
              color: activeTab === 'register_store' ? '#ffffff' : 'var(--text-muted)',
              fontSize: '0.8rem',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              boxShadow: activeTab === 'register_store' ? '0 2px 8px rgba(217, 119, 6, 0.25)' : 'none',
              transition: 'all 0.15s'
            }}
          >
            <Store size={15} />
            <span>{isAr ? 'فترينة متجر' : 'Magasin'}</span>
          </button>
        </div>

        {/* Alert / Notification Feedback */}
        {errorMsg && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#b91c1c',
              padding: '0.7rem 0.85rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.85rem',
              fontSize: '0.82rem',
              fontWeight: '700'
            }}
          >
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#047857',
              padding: '0.75rem 0.85rem',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.85rem',
              fontSize: '0.84rem',
              fontWeight: '800'
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Scrollable Form Body */}
        <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.2rem' }}>
          {/* ========================================================
              TAB 1: LOGIN (دخول)
             ======================================================== */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* Quick Sub-intent Toggle */}
              <div
                style={{
                  display: 'flex',
                  background: 'var(--surface-alt)',
                  padding: '0.25rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-light)',
                  gap: '0.25rem'
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setLoginRoleIntent('customer');
                    setLoginEmail('client@gmail.com');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: loginRoleIntent === 'customer' ? 'var(--surface)' : 'transparent',
                    color: loginRoleIntent === 'customer' ? '#0284c7' : 'var(--text-muted)',
                    fontWeight: '800',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: loginRoleIntent === 'customer' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  <User size={14} />
                  <span>{isAr ? 'دخول زبون / مشتري' : 'Compte Client'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginRoleIntent('store');
                    setLoginEmail('contact@techzone.dz');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.4rem',
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
                    boxShadow: loginRoleIntent === 'store' ? '0 1px 4px rgba(0,0,0,0.08)' : 'none'
                  }}
                >
                  <Store size={14} />
                  <span>{isAr ? 'دخول تاجر / متجر' : 'Espace Vendeur'}</span>
                </button>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Mail size={14} color="#0284c7" />
                  <span>{isAr ? 'البريد الإلكتروني' : 'Adresse Email'}</span>
                </label>
                <input
                  type="email"
                  placeholder="votre-email@domaine.dz"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-light)',
                    background: 'var(--surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Lock size={14} color="#0284c7" />
                  <span>{isAr ? 'كلمة المرور' : 'Mot de passe'}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 2.4rem 0.65rem 0.85rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      right: isAr ? 'auto' : '0.65rem',
                      left: isAr ? '0.65rem' : 'auto',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.2rem'
                    }}
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: 'var(--navy-header)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.3rem',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)'
                }}
              >
                <LogIn size={17} />
                <span>{isAr ? 'تسجيل الدخول الآن' : 'Se Connecter'}</span>
              </button>

              {/* Quick Demo Logins */}
              <div style={{ borderTop: '1px dashed var(--border-light)', paddingTop: '0.75rem', marginTop: '0.3rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.45rem', textAlign: 'center' }}>
                  {isAr ? '⚡ تجربة سريعة بدون كتابة :' : '⚡ Connexion rapide en 1 clic :'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('client@gmail.com');
                      onLogin('client@gmail.com');
                      onClose();
                    }}
                    style={{
                      padding: '0.5rem',
                      background: '#f0f9ff',
                      border: '1px solid #bae6fd',
                      color: '#0369a1',
                      borderRadius: '10px',
                      fontSize: '0.76rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <User size={13} />
                    <span>{isAr ? 'زبون (كريم)' : 'Client démo'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginEmail('contact@techzone.dz');
                      onLogin('contact@techzone.dz');
                      onClose();
                    }}
                    style={{
                      padding: '0.5rem',
                      background: '#fef3c7',
                      border: '1px solid #fde68a',
                      color: '#92400e',
                      borderRadius: '10px',
                      fontSize: '0.76rem',
                      fontWeight: '800',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    <Store size={13} />
                    <span>{isAr ? 'متجر TechZone' : 'Magasin démo'}</span>
                  </button>
                </div>
              </div>

              {/* Switch to Register footer */}
              <div
                style={{
                  background: 'var(--surface-alt)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  textAlign: 'center',
                  fontSize: '0.8rem',
                  marginTop: '0.3rem'
                }}
              >
                <div style={{ color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                  {isAr ? 'ليس لديك حساب حتى الآن؟' : 'Vous n\'avez pas encore de compte ?'}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setActiveTab('register_client')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#0284c7',
                      fontWeight: '800',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      textDecoration: 'underline'
                    }}
                  >
                    {isAr ? 'إنشاء حساب زبون مجاناً' : 'Créer un compte client'}
                  </button>
                  <span>|</span>
                  <button
                    type="button"
                    onClick={() => setActiveTab('register_store')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#d97706',
                      fontWeight: '800',
                      cursor: 'pointer',
                      fontSize: '0.82rem',
                      textDecoration: 'underline'
                    }}
                  >
                    {isAr ? 'فتح فترينة متجر' : 'Ouvrir ma vitrine'}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 2: REGISTER CUSTOMER (إنشاء حساب زبون)
             ======================================================== */}
          {activeTab === 'register_client' && (
            <form onSubmit={handleClientSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                  {isAr ? 'املأ المعلومات التالية لإنشاء حسابك :' : 'Remplissez vos coordonnées pour commander :'}
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillClient}
                  style={{
                    background: 'rgba(2, 132, 199, 0.12)',
                    color: '#0284c7',
                    border: 'none',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                  title={isAr ? 'تعبئة تجريبية تلقائية' : 'Remplissage test automatique'}
                >
                  <Sparkles size={12} />
                  <span>{isAr ? 'تعبئة تجريبية' : 'Test Auto'}</span>
                </button>
              </div>

              {/* Name & Phone in 2 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={13} color="#0284c7" />
                    <span>{isAr ? 'الاسم واللقب *' : 'Nom & Prénom *'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'محمد أمين' : 'Mohamed Amine'}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={13} color="#0284c7" />
                    <span>{isAr ? 'رقم الهاتف *' : 'Téléphone *'}</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="05 50 12 34 56"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Mail size={13} color="#0284c7" />
                  <span>{isAr ? 'البريد الإلكتروني *' : 'Adresse Email *'}</span>
                </label>
                <input
                  type="email"
                  placeholder="client@domaine.dz"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.75rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-light)',
                    background: 'var(--surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              {/* Wilaya & Commune */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} color="#0284c7" />
                    <span>{isAr ? 'الولاية' : 'Wilaya'}</span>
                  </label>
                  <select
                    value={clientWilaya}
                    onChange={(e) => setClientWilaya(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  >
                    {WILAYAS.map(w => (
                      <option key={w.code} value={w.name}>
                        {w.code} - {w.name} ({w.nameAr})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.25rem', display: 'block' }}>
                    {isAr ? 'البلدية / الحي' : 'Commune / Adresse'}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'مثال: حي النصر' : 'Ex: Centre ville'}
                    value={clientAddress}
                    onChange={(e) => setClientAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: '800', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Lock size={13} color="#0284c7" />
                  <span>{isAr ? 'كلمة المرور' : 'Mot de passe'}</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showClientPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={clientPassword}
                    onChange={(e) => setClientPassword(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 2.4rem 0.6rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowClientPassword(!showClientPassword)}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      right: isAr ? 'auto' : '0.65rem',
                      left: isAr ? '0.65rem' : 'auto',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      padding: '0.2rem'
                    }}
                  >
                    {showClientPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.4rem',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)'
                }}
              >
                <UserPlus size={18} />
                <span>{isAr ? 'تأكيد وإنشاء حساب الزبون' : 'Créer mon Compte Client'}</span>
              </button>

              {/* Switch links footer */}
              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                <span>{isAr ? 'لديك حساب مسجل بالفعل؟ ' : 'Vous avez déjà un compte ? '}</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0284c7',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {isAr ? 'سجل دخولك هنا' : 'Connectez-vous ici'}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================
              TAB 3: REGISTER STORE (إنشاء حساب متجر وفترينة)
             ======================================================== */}
          {activeTab === 'register_store' && (
            <form onSubmit={handleStoreSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Top Banner with quota announcement */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)',
                  border: '1px solid #fde68a',
                  borderRadius: '12px',
                  padding: '0.65rem 0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: '800', fontSize: '0.82rem', color: '#92400e' }}>
                    {isAr ? '🎉 ميزة خاصة للتجار: 50 إعلان مجاني' : '🎉 Quota Commerçant : 50 Annonces Gratuites'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#b45309' }}>
                    {isAr ? 'فترينة رقمية، شارة فيديو معتمدة، وتواصل مباشر على واتساب' : 'Vitrine certifiée, badge vidéo et commandes WhatsApp'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFillStore}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #fde68a',
                    color: '#b45309',
                    padding: '0.25rem 0.55rem',
                    borderRadius: '8px',
                    fontSize: '0.72rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  title={isAr ? 'تعبئة تجريبية تلقائية للمتجر' : 'Remplissage test automatique magasin'}
                >
                  <Sparkles size={12} />
                  <span>{isAr ? 'تعبئة تجريبية' : 'Test Auto'}</span>
                </button>
              </div>

              {/* Store Name & Manager Name in 2 columns */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Store size={13} color="#d97706" />
                    <span>{isAr ? 'اسم المحل / المتجر *' : 'Nom de la boutique *'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'مثال: متجر الأناقة' : 'Ex: Élégance Boutique'}
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={13} color="#d97706" />
                    <span>{isAr ? 'اسم التاجر / المسير *' : 'Nom du gérant *'}</span>
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'مثال: ياسين بوزيد' : 'Ex: Yacine Bouzid'}
                    value={managerName}
                    onChange={(e) => setManagerName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={13} color="#d97706" />
                    <span>{isAr ? 'رقم الهاتف *' : 'Téléphone appel *'}</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="06 61 00 00 00"
                    value={storePhone}
                    onChange={(e) => setStorePhone(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.2rem', display: 'block' }}>
                    {isAr ? 'رقم واتساب للطلبات' : 'WhatsApp commandes'}
                  </label>
                  <input
                    type="tel"
                    placeholder="06 61 00 00 00"
                    value={storeWhatsApp}
                    onChange={(e) => setStoreWhatsApp(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              </div>

              {/* Wilaya & Address */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} color="#d97706" />
                    <span>{isAr ? 'الولاية' : 'Wilaya'}</span>
                  </label>
                  <select
                    value={storeWilaya}
                    onChange={(e) => setStoreWilaya(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.84rem'
                    }}
                  >
                    {WILAYAS.map(w => (
                      <option key={w.code} value={w.name}>
                        {w.code} - {w.name} ({w.nameAr})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.2rem', display: 'block' }}>
                    {isAr ? 'البلدية' : 'Commune'}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? 'مثال: سيدي امحمد' : 'Ex: Sidi M\'Hamed'}
                    value={storeCommune}
                    onChange={(e) => setStoreCommune(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              </div>

              {/* Exact Address */}
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Building size={13} color="#d97706" />
                  <span>{isAr ? 'عنوان المحل التجاري بالتفصيل *' : 'Adresse physique du local *'}</span>
                </label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: 14 شارع ديدوش مراد، مقابل البريد المركزي' : 'Ex: 14 Rue Didouche Mourad, face à la grande poste'}
                  value={storeAddress}
                  onChange={(e) => setStoreAddress(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: '10px',
                    border: '1.5px solid var(--border-light)',
                    background: 'var(--surface)',
                    color: 'var(--text-main)',
                    fontSize: '0.86rem'
                  }}
                />
              </div>

              {/* Email & Password */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.65rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Mail size={13} color="#d97706" />
                    <span>{isAr ? 'البريد المهني للمتجر *' : 'Email professionnel *'}</span>
                  </label>
                  <input
                    type="email"
                    placeholder="boutique@domaine.dz"
                    value={storeEmail}
                    onChange={(e) => setStoreEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: '10px',
                      border: '1.5px solid var(--border-light)',
                      background: 'var(--surface)',
                      color: 'var(--text-main)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Lock size={13} color="#d97706" />
                    <span>{isAr ? 'كلمة المرور' : 'Mot de passe'}</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showStorePassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={storePassword}
                      onChange={(e) => setStorePassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 2.2rem 0.55rem 0.75rem',
                        borderRadius: '10px',
                        border: '1.5px solid var(--border-light)',
                        background: 'var(--surface)',
                        color: 'var(--text-main)',
                        fontSize: '0.86rem'
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowStorePassword(!showStorePassword)}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        right: isAr ? 'auto' : '0.55rem',
                        left: isAr ? '0.55rem' : 'auto',
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        padding: '0.2rem'
                      }}
                    >
                      {showStorePassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit Store Registration */}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '0.85rem',
                  background: 'linear-gradient(135deg, #d97706, #ea580c)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '0.92rem',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '0.3rem',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)'
                }}
              >
                <Store size={18} />
                <span>{isAr ? 'فتح وتأكيد فترينة المتجر (50 إعلان)' : 'Créer ma Vitrine (50 annonces gratuites)'}</span>
              </button>

              {/* Switch to login */}
              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                <span>{isAr ? 'لديك فترينة مسجلة مسبقاً؟ ' : 'Vous avez déjà une vitrine ? '}</span>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setLoginRoleIntent('store');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d97706',
                    fontWeight: '800',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  {isAr ? 'سجل دخول التاجر هنا' : 'Connectez-vous ici'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
