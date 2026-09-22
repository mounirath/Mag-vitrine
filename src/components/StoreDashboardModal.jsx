import React, { useState } from 'react';
import { X, PlusCircle, Trash2, LayoutDashboard, Store, AlertCircle, CheckCircle2 } from 'lucide-react';
import { CATEGORIES, WILAYAS } from '../data/initialData';

export function StoreDashboardModal({ isOpen, onClose, store, products, onAddProduct, onDeleteProduct, lang, t }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('cat_electronics');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const currentStore = store || {
    name: 'Tech Zone Alger',
    quotaUsed: products.filter(p => p.storeId === 'store_techzone').length,
    quotaMax: 50
  };

  const storeProducts = products.filter(p => p.storeId === (store ? store.id : 'store_techzone'));
  const quotaPercent = Math.min(100, Math.round((storeProducts.length / 50) * 100));

  const handleCreate = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProd = {
      id: `prod_${Date.now()}`,
      storeId: store ? store.id : 'store_techzone',
      categoryId,
      name,
      nameAr: nameAr || name,
      price: parseFloat(price),
      oldPrice: null,
      discountPercent: 0,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      description: description || 'Produit de qualité supérieure disponible en magasin.',
      stock: 10,
      wilaya: store ? store.wilaya : 'Alger',
      rating: 5.0,
      salesCount: 0
    };

    onAddProduct(newProd);
    setName('');
    setNameAr('');
    setPrice('');
    setImage('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--badge-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={24} color="var(--primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{t.navDashboard}</h2>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{currentStore.name}</span>
          </div>
        </div>

        {/* Quota Gauge */}
        <div className="quota-box">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', fontWeight: '700' }}>
            <span>{t.vendorQuotaTitle}</span>
            <span style={{ color: quotaPercent >= 90 ? '#ef4444' : 'var(--primary)' }}>
              {storeProducts.length} / 50 annonces ({quotaPercent}%)
            </span>
          </div>
          <div className="quota-gauge">
            <div className="quota-fill" style={{ width: `${quotaPercent}%` }} />
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
            Offre standard Commerçant : 50 articles actifs gratuits simultanément avec fiche vitrine complète.
          </div>
        </div>

        {/* Action Button */}
        {!showAddForm ? (
          <button
            className="btn-add-cart"
            style={{ width: '100%', marginBottom: '1.5rem', padding: '0.75rem' }}
            onClick={() => setShowAddForm(true)}
            disabled={storeProducts.length >= 50}
          >
            <PlusCircle size={18} />
            <span>{t.addListingBtn}</span>
          </button>
        ) : (
          <form onSubmit={handleCreate} style={{ background: 'var(--surface-alt)', padding: '1.25rem', borderRadius: '14px', border: '1px solid var(--border)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>Ajouter un article à votre vitrine</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                placeholder="Nom du produit (FR)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
              />
              <input
                type="text"
                placeholder="اسم المنتج بالعربية"
                value={nameAr}
                onChange={(e) => setNameAr(e.target.value)}
                style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <input
                type="number"
                placeholder="Prix en DZD (د.ج)"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
              />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)' }}
              >
                {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nameFr} ({cat.nameAr})</option>
                ))}
              </select>
            </div>

            <input
              type="url"
              placeholder="URL de l image (https://...)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', marginBottom: '0.75rem' }}
            />

            <textarea
              placeholder="Description détaillée du produit..."
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text)', marginBottom: '1rem', resize: 'vertical' }}
            />

            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-store-call"
                style={{ padding: '0.5rem 1rem' }}
                onClick={() => setShowAddForm(false)}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-add-cart"
                style={{ width: 'auto', padding: '0.5rem 1.25rem' }}
              >
                Enregistrer l article
              </button>
            </div>
          </form>
        )}

        {/* Existing Products List */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '0.75rem' }}>Articles actuellement dans votre vitrine ({storeProducts.length})</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '280px', overflowY: 'auto' }}>
            {storeProducts.map(prod => (
              <div
                key={prod.id}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.85rem', background: 'var(--surface-alt)', borderRadius: '10px', border: '1px solid var(--border)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700' }}>{prod.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700' }}>{prod.price.toLocaleString()} DZD</div>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteProduct(prod.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.4rem' }}
                  title="Supprimer l article"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
