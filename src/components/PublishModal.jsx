import React, { useState } from 'react';
import { ArrowLeft, Upload, Plus, Camera, Video, DollarSign, MapPin, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { CATEGORIES, WILAYAS } from '../data/initialData';

export function PublishModal({
  isOpen,
  onClose,
  onPublishSuccess,
  currentUser,
  onOpenAuth,
  lang,
  t
}) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('cat_furniture');
  const [wilaya, setWilaya] = useState('Alger');
  const [condition, setCondition] = useState('Très bon état');
  const [description, setDescription] = useState('');
  const [hasVideoTour, setHasVideoTour] = useState(false);
  const [imagePreview, setImagePreview] = useState('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700');
  const [published, setPublished] = useState(false);

  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Veuillez remplir le titre et le prix');
      return;
    }

    const newProduct = {
      id: `prod_${Date.now()}`,
      storeId: currentUser?.storeId || 'store_user',
      categoryId,
      name: title,
      nameAr: title,
      description: description || `${title} en excellent état. Remise en main propre possible.`,
      price: Number(price),
      priceEur: Math.round(Number(price) / 200),
      location: `${wilaya}, Algérie`,
      locationShort: wilaya,
      condition,
      conditionStars: condition.includes('Très') || condition.includes('Neuf') ? 5 : 4,
      image: imagePreview,
      gallery: [imagePreview],
      hasVideoTour,
      historyAvailable: true,
      stock: 1,
      wilaya,
      sellerRating: 4.9,
      sellerReviews: 1,
      verifiedSeller: !!currentUser?.verifiedVideo,
      coords: { x: 45, y: 50 }
    };

    onPublishSuccess(newProduct);
    setPublished(true);
    setTimeout(() => {
      setPublished(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="screen-modal-overlay">
      {/* Header */}
      <div className="modal-screen-header">
        <button className="btn-back-header" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <span className="modal-header-title">
          {isAr ? 'نشر إعلان جديد (بيع)' : 'Publier une Annonce • Vendre (+)'}
        </span>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ padding: '1.25rem', paddingBottom: '6rem' }}>
        {published ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <CheckCircle2 size={36} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>
              {isAr ? 'تم نشر إعلانك بنجاح!' : 'Annonce Publiée avec Succès !'}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Votre objet est maintenant visible sur MAG VITRINE et Local-Connect.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Seller status notice */}
            {!currentUser ? (
              <div style={{ background: '#fef3c7', borderRadius: '14px', padding: '0.85rem', border: '1px solid #fde68a', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '0.8rem', color: '#92400e' }}>
                  <strong>Conseil :</strong> Créez un compte magasin gratuit pour obtenir le badge <strong>Vérifié par Vidéo</strong> et 50 annonces !
                </div>
                <button
                  type="button"
                  onClick={() => onOpenAuth('register_store')}
                  style={{ background: 'var(--orange-action)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 0.7rem', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  Ouvrir Vitrine
                </button>
              </div>
            ) : (
              <div style={{ background: '#f0fdf4', borderRadius: '14px', padding: '0.75rem', border: '1px solid #bbf7d0', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={18} color="#16a34a" />
                <span style={{ fontSize: '0.8rem', color: '#166534', fontWeight: '700' }}>
                  Publication en tant que : {currentUser.name} {currentUser.role === 'store' ? '(Boutique Vérifiée)' : '(Particulier)'}
                </span>
              </div>
            )}

            {/* Photo preview selector */}
            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block', marginBottom: '0.4rem' }}>
                Photo principale de l'objet
              </label>
              <div style={{ height: '180px', borderRadius: '16px', overflow: 'hidden', position: 'relative', border: '2px dashed var(--border-light)', background: 'var(--surface)' }}>
                <img src={imagePreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt("Entrez l'URL de la photo de votre objet :", imagePreview);
                      if (url) setImagePreview(url);
                    }}
                    style={{ background: 'rgba(15, 23, 42, 0.8)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem 0.75rem', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    <Camera size={14} />
                    <span>Modifier photo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Title */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block', marginBottom: '0.35rem' }}>
                Titre de l'annonce (ex: Sofa Design, TV LED 50"...)
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Sofa Design scandinave bleu"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--surface)', fontSize: '0.9rem' }}
              />
            </div>

            {/* Price & Wilaya Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block', marginBottom: '0.35rem' }}>
                  Prix (DZD)
                </label>
                <input
                  type="number"
                  required
                  placeholder="45000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--surface)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block', marginBottom: '0.35rem' }}>
                  Wilaya (58)
                </label>
                <select
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--surface)', fontSize: '0.88rem' }}
                >
                  {WILAYAS.map((w) => (
                    <option key={w.code} value={w.name}>{w.code} - {w.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category & Condition */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block', marginBottom: '0.35rem' }}>
                  Catégorie
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--surface)', fontSize: '0.88rem' }}
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.nameFr}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '800', display: 'block', marginBottom: '0.35rem' }}>
                  État de l'objet
                </label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem 0.9rem', borderRadius: '12px', border: '1px solid var(--border-light)', background: 'var(--surface)', fontSize: '0.88rem' }}
                >
                  <option value="Très bon état">Très bon état (★★★★★)</option>
                  <option value="Neuf avec étiquette">Neuf avec étiquette</option>
                  <option value="Neuf sous scellé">Neuf sous scellé</option>
                  <option value="Bon état">Bon état</option>
                </select>
              </div>
            </div>

            {/* Video-tour switch */}
            <div style={{ background: 'var(--surface)', borderRadius: '14px', padding: '0.85rem 1rem', border: '1px solid var(--border-light)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Video size={18} color="#0284c7" />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800' }}>Ajouter Video-tour 360°</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Multiplie par 3 les chances de vente rapide</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={hasVideoTour}
                onChange={(e) => setHasVideoTour(e.target.checked)}
                style={{ width: '20px', height: '20px', accentColor: 'var(--orange-action)' }}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{ width: '100%', padding: '0.95rem', background: 'var(--orange-gradient)', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', boxShadow: 'var(--shadow-floating)' }}
            >
              Publier l'annonce maintenant
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
