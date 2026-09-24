import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  Store,
  UserCheck,
  AlertTriangle,
  Mail,
  Phone,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export function TermsAndConditionsModal({
  isOpen,
  onClose,
  lang = 'ar',
  t
}) {
  const [activeLang, setActiveLang] = useState(lang === 'fr' ? 'fr' : 'ar');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    general: true,
    stores: true,
    customers: true,
    disclaimer: true,
    contact: true
  });

  if (!isOpen) return null;

  const isAr = activeLang === 'ar';

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleCopy = () => {
    const fullText = isAr ? fullArabicTermsText : fullFrenchTermsText;
    navigator.clipboard?.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 99999 }}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '750px',
          width: '94%',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4)'
        }}
      >
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            padding: '1.25rem 1.5rem',
            position: 'relative',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FileText size={22} color="#38bdf8" />
              </div>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: '#ffffff' }}>
                  {isAr ? 'شروط وأحكام استخدام التطبيق' : 'Conditions Générales d’Utilisation'}
                </h2>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                  MAG-VITRINE DZ • {isAr ? 'النسخة الرسمية المعتمدة' : 'Version Officielle'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {/* Language toggle */}
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', padding: '0.15rem' }}>
                <button
                  type="button"
                  onClick={() => setActiveLang('ar')}
                  style={{
                    background: activeLang === 'ar' ? 'var(--orange-action)' : 'transparent',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  عربي
                </button>
                <button
                  type="button"
                  onClick={() => setActiveLang('fr')}
                  style={{
                    background: activeLang === 'fr' ? 'var(--orange-action)' : 'transparent',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.6rem',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer'
                  }}
                >
                  FR
                </button>
              </div>

              <button
                className="close-btn"
                onClick={onClose}
                style={{ position: 'static', color: '#ffffff', background: 'rgba(255,255,255,0.1)', width: '36px', height: '36px' }}
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick search input */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <div
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '12px',
                padding: '0.4rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Search size={16} color="#94a3b8" />
              <input
                type="text"
                placeholder={isAr ? 'بحث في بنود الشروط (مثال: الأسعار، الاسترجاع، النزاعات...)' : 'Rechercher un terme (ex: prix, litiges, annonces)...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.82rem',
                  width: '100%'
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 0 }}
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleCopy}
              title={isAr ? 'نسخ النص بالكامل' : 'Copier tout le texte'}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '0.4rem 0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              {copied ? <Check size={15} color="#4ade80" /> : <Copy size={15} />}
              <span>{copied ? (isAr ? 'تم النسخ' : 'Copié') : (isAr ? 'نسخ' : 'Copier')}</span>
            </button>
          </div>
        </div>

        {/* Scrollable Terms Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            direction: isAr ? 'rtl' : 'ltr',
            textAlign: isAr ? 'right' : 'left',
            lineHeight: '1.7',
            fontSize: '0.88rem'
          }}
        >
          {/* Welcome Banner */}
          <div
            style={{
              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
              border: '1px solid #bae6fd',
              borderRadius: '16px',
              padding: '1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <ShieldCheck size={24} color="#0284c7" style={{ flexShrink: 0, marginTop: '0.2rem' }} />
            <div>
              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '800', color: '#0369a1', marginBottom: '0.35rem' }}>
                {isAr ? 'أهلاً بك في تطبيق [MAG-VITRINE]' : 'Bienvenue sur l’application [MAG-VITRINE]'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                {isAr
                  ? 'يُرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام التطبيق. بإنشائك لحساب أو استخدامك للتطبيق، فإنك توافق على الالتزام الكامل بهذه الشروط.'
                  : 'Veuillez lire attentivement ces conditions générales avant d’utiliser l’application. En créant un compte ou en utilisant la plateforme, vous acceptez pleinement de vous conformer à l’ensemble de ces règles.'}
              </p>
            </div>
          </div>

          {/* Section 1: General Provisions */}
          <div className="terms-section" style={sectionCardStyle}>
            <div
              style={sectionHeaderStyle}
              onClick={() => toggleSection('general')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <FileText size={18} color="var(--primary)" />
                <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>
                  {isAr ? 'أولاً: أحكام عامة (تطبق على جميع المستخدمين)' : 'I. Dispositions Générales (Applicables à tous)'}
                </span>
              </div>
              {expandedSections.general ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSections.general && (
              <div style={{ padding: '0.85rem 1rem' }}>
                <ul style={{ margin: 0, paddingRight: isAr ? '1.2rem' : 0, paddingLeft: isAr ? 0 : '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <li>
                    <strong>{isAr ? 'التعريف بالخدمة:' : 'Définition du Service :'}</strong>{' '}
                    {isAr
                      ? 'تطبيق [MAG-VITRINE] هو منصة إلكترونية تجمع بين المحلات التجارية والزبائن لتسهيل عرض المنتجات والخدمات والعروض والترويج لها. التطبيق مجرد وسيط إعلاني ولا يُعتبر طرفاً في عملية البيع أو الشراء الفعلية إلا إذا أُشير إلى غير ذلك.'
                      : 'L’application [MAG-VITRINE] est une plateforme numérique reliant commerçants et consommateurs pour faciliter la mise en valeur des produits, services et offres promotionnelles. L’application agit en tant qu’intermédiaire de mise en relation et n’est pas partie prenante de la vente directe, sauf mention expresse.'}
                  </li>
                  <li>
                    <strong>{isAr ? 'الأهلية القانونية:' : 'Capacité Juridique :'}</strong>{' '}
                    {isAr
                      ? 'يجب أن لا يقل عمر المستخدم عن 18 عاماً لاستخدام التطبيق، أو يتم الاستخدام تحت إشراف ولي الأمر.'
                      : 'L’utilisateur doit être âgé d’au moins 18 ans pour utiliser l’application, ou agir sous la responsabilité légale d’un tuteur.'}
                  </li>
                  <li>
                    <strong>{isAr ? 'أمن الحساب:' : 'Sécurité du Compte :'}</strong>{' '}
                    {isAr
                      ? 'يتحمل المستخدم مسؤولية الحفاظ على سرية معلومات حسابه (اسم المستخدم وكلمة المرور) وكل الأنشطة التي تتم من خلال حسابه.'
                      : 'L’utilisateur est entièrement responsable du maintien de la confidentialité de ses identifiants (email et mot de passe) ainsi que de toutes les activités effectuées via son compte.'}
                  </li>
                  <li>
                    <strong>{isAr ? 'السلوك المحظور:' : 'Comportements Interdits :'}</strong>{' '}
                    {isAr
                      ? 'يُحظر استخدام التطبيق لنشر أي محتوى غير قانوني، أو مضلل، أو مسيء، أو ينتهك حقوق الملكية الفكرية للآخرين.'
                      : 'Il est strictement prohibé d’utiliser la plateforme pour diffuser du contenu illicite, frauduleux, mensonger, injurieux ou portant atteinte aux droits de propriété intellectuelle de tiers.'}
                  </li>
                  <li>
                    <strong>{isAr ? 'تعديل الشروط:' : 'Modification des Conditions :'}</strong>{' '}
                    {isAr
                      ? 'يحق للتطبيق تعديل هذه الشروط في أي وقت، ويصبح التعديل سارياً بمجرد نشره على التطبيق.'
                      : 'L’administration de l’application se réserve le droit d’amender ces conditions à tout moment. Les modifications prennent effet dès leur publication.'}
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 2: Store / Merchant Terms */}
          <div className="terms-section" style={sectionCardStyle}>
            <div
              style={sectionHeaderStyle}
              onClick={() => toggleSection('stores')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Store size={18} color="#d97706" />
                <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>
                  {isAr ? 'ثانياً: شروط وأحكام المحلات التجارية (التجار / المعلنين)' : 'II. Conditions des Boutiques & Commerçants (Vendeurs)'}
                </span>
              </div>
              {expandedSections.stores ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSections.stores && (
              <div style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <h5 style={subHeadingStyle}>1. {isAr ? 'التسجيل والتحقق' : 'Inscription et Vérification'}</h5>
                    <ul style={subListStyle(isAr)}>
                      <li>{isAr ? 'يجب تقديم معلومات صحيحة ودقيقة حول المحل (الاسم التجاري، السجل التجاري إن وجد، العنوان، وأرقام التواصل).' : 'Obligation de fournir des coordonnées exactes (Raison sociale, Registre de Commerce si applicable, adresse physique et téléphones).'}</li>
                      <li>{isAr ? 'يحق للتطبيق طلب وثائق إضافية لإثبات هوية صاحب المحل أو شرعية النشاط قبل أو بعد تفعيل الحساب.' : 'L’application peut exiger des justificatifs d’identité ou de registre commercial avant ou après validation de la vitrine.'}</li>
                    </ul>
                  </div>

                  <div>
                    <h5 style={subHeadingStyle}>2. {isAr ? 'محتوى الإعلانات والعروض' : 'Contenu des Annonces et Vitrines Vidéo'}</h5>
                    <ul style={subListStyle(isAr)}>
                      <li><strong>{isAr ? 'المصداقية:' : 'Authenticité :'}</strong> {isAr ? 'التزام المحل بالدقة التامة في وصف المنتجات/الخدمات والأسعار المعلنة والعروض الترويجية.' : 'Exactitude totale dans la description, les caractéristiques et les tarifs indiqués.'}</li>
                      <li><strong>{isAr ? 'جودة الصور والتصاميم:' : 'Qualité visuelle :'}</strong> {isAr ? 'يجب أن تكون الصور حقيقية وغير مضللة وخالية من حقوق الملكية لجهات أخرى دون إذن.' : 'Les visuels et vidéos doivent être authentiques, représentatifs du stock réel et libres de droits non autorisés.'}</li>
                      <li><strong>{isAr ? 'المنتجات المحظورة:' : 'Marchandises prohibées :'}</strong> {isAr ? 'يُمنع منعاً باتاً الإعلان عن أية منتجات أو خدمات مخالفة للقوانين المحلية أو للشريعة أو المنتجات المغشوشة والمقلدة.' : 'Interdiction absolue de publier des articles contrefaits, frauduleux, périmés ou non conformes aux lois algériennes.'}</li>
                    </ul>
                  </div>

                  <div>
                    <h5 style={subHeadingStyle}>3. {isAr ? 'المعاملات والأسعار' : 'Transactions et Tarifs'}</h5>
                    <ul style={subListStyle(isAr)}>
                      <li>{isAr ? 'التزام المحل بالأسعار المعلنة داخل التطبيق وقت العرض.' : 'Engagement ferme de respecter les prix affichés au moment de la passation de commande.'}</li>
                      <li>{isAr ? 'التطبيق غير مسؤول عن التحصيل المالي المباشر بين الزبون والمحل، إلا في حال تفعيل ميزة الدفع الإلكتروني عبر التطبيق وفق اتفاقية مستقلة.' : 'L’application décline toute responsabilité quant aux encaissements directs en espèces, sauf utilisation d’un service de paiement intégré dédié.'}</li>
                    </ul>
                  </div>

                  <div>
                    <h5 style={subHeadingStyle}>4. {isAr ? 'حظر الحساب والإلغاء' : 'Suspension et Clôture de Compte'}</h5>
                    <ul style={subListStyle(isAr)}>
                      <li>{isAr ? 'يحق للتطبيق تعليق أو إلغاء حساب أي محل في حال تلقت إدارة التطبيق شكاوى متكررة من الزبائن، أو في حال إثبات أي تلاعب أو تقديم معلومات كاذبة.' : 'Droit de suspendre ou supprimer tout compte commerçant faisant l’objet de réclamations répétées, de non-conformités avérées ou d’informations mensongères.'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Customer / Consumer Terms */}
          <div className="terms-section" style={sectionCardStyle}>
            <div
              style={sectionHeaderStyle}
              onClick={() => toggleSection('customers')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <UserCheck size={18} color="#059669" />
                <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>
                  {isAr ? 'ثالثاً: شروط وأحكام الزبائن (المستهلكين)' : 'III. Conditions des Acheteurs (Consommateurs)'}
                </span>
              </div>
              {expandedSections.customers ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSections.customers && (
              <div style={{ padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <h5 style={subHeadingStyle}>1. {isAr ? 'الاستخدام العادل والتقييمات' : 'Usage Loyal & Avis'}</h5>
                    <ul style={subListStyle(isAr)}>
                      <li>{isAr ? 'التزام الزبون بتقديم تقييمات وملاحظات موضوعية وأخلاقية تعكس تجربته الحقيقية مع المحل.' : 'Engagement à rédiger des évaluations constructives et véridiques fondées sur une expérience réelle.'}</li>
                      <li>{isAr ? 'يُحظر استخدام ميزة التعليقات أو التقييمات للإساءة الشخصية أو التشهير أو الترويج لخدمات منافسة.' : 'Interdiction formelle de diffamer, d’insulter ou d’utiliser les commentaires à des fins de concurrence déloyale.'}</li>
                    </ul>
                  </div>

                  <div>
                    <h5 style={subHeadingStyle}>2. {isAr ? 'التواصل مع المحلات' : 'Relation Directe avec les Commerçants'}</h5>
                    <ul style={subListStyle(isAr)}>
                      <li>{isAr ? 'يقر الزبون بأن التواصل والشراء المباشر مع المحل يتم بناءً على مسؤوليته الشخصية، وعلى الزبون التحقق من البضاعة قبل دفع قيمتها في حال الشراء المباشر.' : 'L’acheteur effectue ses échanges sous sa propre responsabilité et doit inspecter le colis/produit avant tout règlement.'}</li>
                      <li>{isAr ? 'أي اتفاق أو معاملة تتم خارج نطاق التطبيق تكون على مسؤولية الطرفين فقط.' : 'Tout accord conclu en dehors du cadre applicatif relève de la seule responsabilité des deux parties.'}</li>
                    </ul>
                  </div>

                  <div>
                    <h5 style={subHeadingStyle}>3. {isAr ? 'الطلبات والحجوزات (في حال وجود ميزة الطلب أو الحجز)' : 'Commandes, Livraisons et Colis'}</h5>
                    <ul style={subListStyle(isAr)}>
                      <li>{isAr ? 'في حال قام الزبون بتأكيد طلب أو حجز عبر التطبيق، فيجب عليه الالتزام بالاستلام أو الحضور، أو الإلغاء في الوقت المحدد وفق سياسة الإلغاء المعلنة.' : 'Lorsqu’une commande ou réservation est validée, le client s’engage à la réceptionner ou à annuler dans les délais impartis.'}</li>
                      <li>{isAr ? 'قد يؤدي تكرار إلغاء الطلبات أو عدم الاستجابة (رفض استلام الطرود دون عذر) إلى تقييد حساب الزبون وتصنيفه ضمن مؤشر الجدية.' : 'Les refus de livraison non motivés ou l’injoignabilité répétée peuvent entraîner la restriction du compte et l’abaissement de l’indice de sérieux.'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Disclaimer & Legal Liabilities */}
          <div className="terms-section" style={sectionCardStyle}>
            <div
              style={sectionHeaderStyle}
              onClick={() => toggleSection('disclaimer')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertTriangle size={18} color="#ef4444" />
                <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>
                  {isAr ? 'رابعاً: إخلاء المسؤولية وتحديد التبعات القانونية' : 'IV. Limitation de Responsabilité & Litiges'}
                </span>
              </div>
              {expandedSections.disclaimer ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSections.disclaimer && (
              <div style={{ padding: '0.85rem 1rem' }}>
                <ul style={{ margin: 0, paddingRight: isAr ? '1.2rem' : 0, paddingLeft: isAr ? 0 : '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <li>
                    <strong>{isAr ? 'دقة الإعلانات:' : 'Exactitude des annonces :'}</strong>{' '}
                    {isAr
                      ? 'يسعى التطبيق لضمان جودة المحتوى، ولكنه لا يتحمل المسؤولية المباشرة عن أي خطأ في الأسعار أو الوصف الصادر من المحلات التجارية.'
                      : 'La plateforme s’efforce de veiller à la qualité des fiches mais ne peut être tenue pour responsable des erreurs matérielles de prix ou descriptifs imputables aux vendeurs.'}
                  </li>
                  <li>
                    <strong>{isAr ? 'النزاعات:' : 'Règlement des différends :'}</strong>{' '}
                    {isAr
                      ? 'أي نزاع تجاري يقع بين المحل والزبون يتم حله مباشرة بين الطرفين وفق القوانين العرفية والتجارية السارية.'
                      : 'Tout litige commercial survenant entre l’acheteur et le commerçant doit être résolu à l’amiable ou selon les lois commerciales algériennes en vigueur.'}
                  </li>
                  <li>
                    <strong>{isAr ? 'انقطاع الخدمة:' : 'Continuité de service :'}</strong>{' '}
                    {isAr
                      ? 'يسعى التطبيق لاستمرارية الخدمة دون انقطاع، ولكنه لا يتحمل المسؤولية عن أي أعطال تقنية خارجة عن الإرادة أو أعمال صيانة دورية.'
                      : 'L’équipe veille au maintien permanent des services mais ne garantit pas l’absence d’interruptions techniques imprévues ou liées aux opérations de maintenance.'}
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Section 5: Contact & Support */}
          <div className="terms-section" style={{ ...sectionCardStyle, marginBottom: 0 }}>
            <div
              style={sectionHeaderStyle}
              onClick={() => toggleSection('contact')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={18} color="#0284c7" />
                <span style={{ fontWeight: '800', fontSize: '0.95rem' }}>
                  {isAr ? 'خامساً: التواصل والدعم الفني' : 'V. Support & Contact'}
                </span>
              </div>
              {expandedSections.contact ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>

            {expandedSections.contact && (
              <div style={{ padding: '0.85rem 1rem' }}>
                <p style={{ margin: 0, marginBottom: '0.75rem', fontSize: '0.85rem' }}>
                  {isAr
                    ? 'لأي استفسارات أو بلاغات بخصوص المحتوى أو الشروط، يمكن التواصل مع إدارة التطبيق عبر القنوات التالية:'
                    : 'Pour toute réclamation, signalement de contenu ou question sur ces conditions, contactez l’assistance MAG-VITRINE :'}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
                  <a
                    href="mailto:contact@magvitrine.dz"
                    style={contactCardStyle}
                  >
                    <Mail size={16} color="var(--primary)" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isAr ? 'البريد الإلكتروني' : 'Email'}</div>
                      <div style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--text-main)' }}>contact@magvitrine.dz</div>
                    </div>
                  </a>

                  <a
                    href="tel:+213555443322"
                    style={contactCardStyle}
                  >
                    <Phone size={16} color="#059669" />
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isAr ? 'الهاتف / واتساب' : 'Téléphone / WhatsApp'}</div>
                      <div style={{ fontWeight: '700', fontSize: '0.82rem', color: 'var(--text-main)', direction: 'ltr' }}>+213 555 44 33 22</div>
                    </div>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer with Acknowledge Button */}
        <div
          style={{
            background: 'var(--surface)',
            borderTop: '1px solid var(--border-light)',
            padding: '1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>{isAr ? 'ساري المفعول وفق القوانين والتشريعات الجزائرية' : 'En vigueur selon la législation algérienne'}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              onClick={handlePrint}
              style={{
                background: 'var(--surface-alt)',
                border: '1px solid var(--border-light)',
                borderRadius: '12px',
                padding: '0.6rem 0.85rem',
                fontSize: '0.82rem',
                fontWeight: '700',
                color: 'var(--text-main)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <Printer size={15} />
              <span>{isAr ? 'طباعة' : 'Imprimer'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '0.65rem 1.35rem',
                fontSize: '0.85rem',
                fontWeight: '800',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.35)'
              }}
            >
              <CheckCircle2 size={16} />
              <span>{isAr ? 'فهمت وأوافق على الشروط' : 'J’accepte les conditions'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const sectionCardStyle = {
  background: 'var(--surface-alt)',
  borderRadius: '16px',
  border: '1px solid var(--border-light)',
  marginBottom: '1rem',
  overflow: 'hidden'
};

const sectionHeaderStyle = {
  padding: '0.85rem 1rem',
  background: 'rgba(0,0,0,0.02)',
  borderBottom: '1px solid var(--border-light)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  userSelect: 'none'
};

const subHeadingStyle = {
  margin: 0,
  fontSize: '0.88rem',
  fontWeight: '800',
  color: 'var(--text-main)',
  marginBottom: '0.35rem'
};

const subListStyle = (isAr) => ({
  margin: 0,
  paddingRight: isAr ? '1.2rem' : 0,
  paddingLeft: isAr ? 0 : '1.2rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.35rem',
  fontSize: '0.82rem',
  color: 'var(--text-muted)'
});

const contactCardStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.65rem',
  background: 'var(--surface)',
  border: '1px solid var(--border-light)',
  padding: '0.65rem 0.85rem',
  borderRadius: '12px',
  textDecoration: 'none'
};

const fullArabicTermsText = `شروط وأحكام استخدام التطبيق
أهلاً بك في تطبيق [MAG-VITRINE]. يُرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام التطبيق. بإنشائك لحساب أو استخدامك للتطبيق، فإنك توافق على الالتزام الكامل بهذه الشروط.

أولاً: أحكام عامة (تطبق على جميع المستخدمين)
* التعريف بالخدمة: تطبيق [MAG-VITRINE] هو منصة إلكترونية تجمع بين المحلات التجارية والزبائن لتسهيل عرض المنتجات والخدمات والعروض والترويج لها. التطبيق مجرد وسيط إعلاني ولا يُعتبر طرفاً في عملية البيع أو الشراء الفعلية إلا إذا أُشير إلى غير ذلك.
* الأهلية القانونية: يجب أن لا يقل عمر المستخدم عن 18 عاماً لاستخدام التطبيق، أو يتم الاستخدام تحت إشراف ولي الأمر.
* أمن الحساب: يتحمل المستخدم مسؤولية الحفاظ على سرية معلومات حسابه (اسم المستخدم وكلمة المرور) وكل الأنشطة التي تتم من خلال حسابه.
* السلوك المحظور: يُحظر استخدام التطبيق لنشر أي محتوى غير قانوني، أو مضلل، أو مسيء، أو ينتهك حقوق الملكية الفكرية للآخرين.
* تعديل الشروط: يحق للتطبيق تعديل هذه الشروط في أي وقت، ويصبح التعديل سارياً بمجرد نشره على التطبيق.

ثانياً: شروط وأحكام المحلات التجارية (التجار / المعلنين)
1. التسجيل والتحقق
* يجب تقديم معلومات صحيحة ودقيقة حول المحل (الاسم التجاري، السجل التجاري إن وجد، العنوان، وأرقام التواصل).
* يحق للتطبيق طلب وثائق إضافية لإثبات هوية صاحب المحل أو شرعية النشاط قبل أو بعد تفعيل الحساب.
2. محتوى الإعلانات والعروض
* المصداقية: التزام المحل بالدقة التامة في وصف المنتجات/الخدمات والأسعار المعلنة والعروض الترويجية.
* جودة الصور والتصاميم: يجب أن تكون الصور حقيقية وغير مضللة وخالية من حقوق الملكية لجهات أخرى دون إذن.
* المنتجات المحظورة: يُمنع منعاً باتاً الإعلان عن أية منتجات أو خدمات مخالفة للقوانين المحلية أو للشريعة أو المنتجات المغشوشة والمقلدة.
3. المعاملات والأسعار
* التزام المحل بالأسعار المعلنة داخل التطبيق وقت العرض.
* التطبيق غير مسؤول عن التحصيل المالي المباشر بين الزبون والمحل، إلا في حال تفعيل ميزة الدفع الإلكتروني عبر التطبيق وفق اتفاقية مستقلة.
4. حظر الحساب والإلغاء
* يحق للتطبيق تعليق أو إلغاء حساب أي محل في حال تلقت إدارة التطبيق شكاوى متكررة من الزبائن، أو في حال إثبات أي تلاعب أو تقديم معلومات كاذبة.

ثالثاً: شروط وأحكام الزبائن (المستهلكين)
1. الاستخدام العادل والتقييمات
* التزام الزبون بتقديم تقييمات وملاحظات موضوعية وأخلاقية تعكس تجربته الحقيقية مع المحل.
* يُحظر استخدام ميزة التعليقات أو التقييمات للإساءة الشخصية أو التشهير أو الترويج لخدمات منافسة.
2. التواصل مع المحلات
* يقر الزبون بأن التواصل والشراء المباشر مع المحل يتم بناءً على مسؤوليته الشخصية، وعلى الزبون التحقق من البضاعة قبل دفع قيمتها في حال الشراء المباشر.
* أي اتفاق أو معاملة تتم خارج نطاق التطبيق تكون على مسؤولية الطرفين فقط.
3. الطلبات والحجوزات (في حال وجود ميزة الطلب أو الحجز)
* في حال قام الزبون بتأكيد طلب أو حجز عبر التطبيق، فيجب عليه الالتزام بالاستلام أو الحضور، أو الإلغاء في الوقت المحدد وفق سياسة الإلغاء المعلنة.
* قد يؤدي تكرار إلغاء الطلبات أو عدم الاستجابة إلى تقييد حساب الزبون.

رابعاً: إخلاء المسؤولية وتحديد التبعات القانونية
* دقة الإعلانات: يسعى التطبيق لضمان جودة المحتوى، ولكنه لا يتحمل المسؤولية المباشرة عن أي خطأ في الأسعار أو الوصف الصادر من المحلات التجارية.
* النزاعات: أي نزاع تجاري يقع بين المحل والزبون يتم حله مباشرة بين الطرفين وفق القوانين العرفية والتجارية السارية.
* انقطاع الخدمة: يسعى التطبيق لاستمرارية الخدمة دون انقطاع، ولكنه لا يتحمل المسؤولية عن أي أعطال تقنية خارجة عن الإرادة.

خامساً: التواصل والدعم الفني
لأي استفسارات أو بلاغات بخصوص المحتوى أو الشروط، يمكن التواصل مع إدارة التطبيق عبر:
* البريد الإلكتروني: contact@magvitrine.dz
* الهاتف / الواتساب: +213 555 44 33 22`;

const fullFrenchTermsText = `Conditions Générales d’Utilisation de l’application [MAG-VITRINE]
Bienvenue sur MAG-VITRINE. Veuillez lire attentivement ces conditions générales avant d’utiliser l’application. En créant un compte ou en utilisant la plateforme, vous acceptez pleinement de vous conformer à l’ensemble de ces règles.

I. Dispositions Générales (Applicables à tous les utilisateurs)
* Définition du Service : L’application MAG-VITRINE est une plateforme numérique reliant commerçants et consommateurs pour faciliter la mise en valeur des produits, services et offres promotionnelles. L’application agit en tant qu’intermédiaire de mise en relation et n’est pas partie prenante de la vente directe, sauf mention expresse.
* Capacité Juridique : L’utilisateur doit être âgé d’au moins 18 ans pour utiliser l’application, ou agir sous la responsabilité légale d’un tuteur.
* Sécurité du Compte : L’utilisateur est entièrement responsable du maintien de la confidentialité de ses identifiants (email et mot de passe) ainsi que de toutes les activités effectuées via son compte.
* Comportements Interdits : Il est strictement prohibé d’utiliser la plateforme pour diffuser du contenu illicite, frauduleux, mensonger, injurieux ou portant atteinte aux droits de propriété intellectuelle de tiers.
* Modification des Conditions : L’administration de l’application se réserve le droit d’amender ces conditions à tout moment. Les modifications prennent effet dès leur publication.

II. Conditions des Boutiques & Commerçants (Vendeurs)
1. Inscription et Vérification
* Obligation de fournir des coordonnées exactes (Raison sociale, Registre de Commerce si applicable, adresse physique et téléphones).
* L’application peut exiger des justificatifs d’identité ou de registre commercial avant ou après validation de la vitrine.
2. Contenu des Annonces et Vitrines Vidéo
* Authenticité : Exactitude totale dans la description, les caractéristiques et les tarifs indiqués.
* Qualité visuelle : Les visuels et vidéos doivent être authentiques, représentatifs du stock réel et libres de droits non autorisés.
* Marchandises prohibées : Interdiction absolue de publier des articles contrefaits, frauduleux, périmés ou non conformes aux lois algériennes.
3. Transactions et Tarifs
* Engagement ferme de respecter les prix affichés au moment de la passation de commande.
* L’application décline toute responsabilité quant aux encaissements directs en espèces, sauf utilisation d’un service de paiement intégré dédié.
4. Suspension et Clôture de Compte
* Droit de suspendre ou supprimer tout compte commerçant faisant l’objet de réclamations répétées, de non-conformités avérées ou d’informations mensongères.

III. Conditions des Acheteurs (Consommateurs)
1. Usage Loyal & Avis
* Engagement à rédiger des évaluations constructives et véridiques fondées sur une expérience réelle.
* Interdiction formelle de diffamer, d’insulter ou d’utiliser les commentaires à des fins de concurrence déloyale.
2. Relation Directe avec les Commerçants
* L’acheteur effectue ses échanges sous sa propre responsabilité et doit inspecter le colis/produit avant tout règlement.
* Tout accord conclu en dehors du cadre applicatif relève de la seule responsabilité des deux parties.
3. Commandes, Livraisons et Colis
* Lorsqu’une commande ou réservation est validée, le client s’engage à la réceptionner ou à annuler dans les délais impartis.
* Les refus de livraison non motivés ou l’injoignabilité répétée peuvent entraîner la restriction du compte et l’abaissement de l’indice de sérieux.

IV. Limitation de Responsabilité & Litiges
* Exactitude des annonces : La plateforme s’efforce de veiller à la qualité des fiches mais ne peut être tenue pour responsable des erreurs matérielles de prix ou descriptifs imputables aux vendeurs.
* Règlement des différends : Tout litige commercial survenant entre l’acheteur et le commerçant doit être résolu à l’amiable ou selon les lois commerciales algériennes en vigueur.
* Continuité de service : L’équipe veille au maintien permanent des services mais ne garantit pas l’absence d’interruptions techniques imprévues ou liées aux opérations de maintenance.

V. Support & Contact
Pour toute réclamation, signalement de contenu ou question sur ces conditions :
* Email : contact@magvitrine.dz
* Téléphone / WhatsApp : +213 555 44 33 22`;
