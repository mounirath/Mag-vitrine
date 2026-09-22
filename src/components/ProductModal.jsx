import React, { useState } from 'react';
import { X, ShoppingCart, Phone, MessageCircle, ShieldCheck, Truck, MapPin } from 'lucide-react';

export function ProductModal({ product, store, onClose, onAddToCart, lang, t }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isAr = lang === 'ar';
  const title = isAr && product.nameAr ? product.nameAr : product.name;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    if (!store) return;
    const msg = encodeURIComponent(`Bonjour, je suis intéressé par votre produit "${product.name}" (${product.price} DZD) sur MAG VITRINE.`);
    window.open(`https://wa.me/${store.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
          <div>
            <img
              src={product.image}
              alt={title}
              style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '14px', border: '1px solid var(--border)' }}
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'; }}
            />
            {store && (
              <div style={{ marginTop: '1rem', background: 'var(--surface-alt)', padding: '0.75rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
                <div style={{ fontWeight: '700', fontSize: '0.88rem', marginBottom: '0.25rem' }}>{store.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.5rem' }}>
                  <MapPin size={13} />
                  <span>{store.commune}, {store.wilaya}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn-store-call" style={{ flex: 1 }} onClick={() => window.location.href = `tel:${store.phone}`}>
                    <Phone size={14} />
                    <span>{t.callMerchant}</span>
                  </button>
                  <button className="btn-store-wa" style={{ flex: 1 }} onClick={handleWhatsApp}>
                    <MessageCircle size={14} />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', lineHeight: '1.3', marginBottom: '0.5rem' }}>{title}</h2>

            <div className="price-wrap" style={{ margin: '0.75rem 0' }}>
              <span className="current-price" style={{ fontSize: '1.5rem' }}>
                {product.price.toLocaleString()} {t.currency}
              </span>
              {product.oldPrice && (
                <span className="old-price" style={{ fontSize: '1rem' }}>
                  {product.oldPrice.toLocaleString()} {t.currency}
                </span>
              )}
            </div>

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              {product.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>Quantité:</span>
              <div className="cart-qty-ctrl">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span style={{ minWidth: '24px', textAlign: 'center', fontWeight: '700' }}>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Truck size={14} color="var(--primary)" />
                <span>Paiement à la livraison (Cash on Delivery) partout en Algérie</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={14} color="var(--primary)" />
                <span>Garantie vérifiée et conforme à la description</span>
              </div>
            </div>

            <button
              className="btn-add-cart"
              style={{ marginTop: 'auto', padding: '0.85rem' }}
              onClick={handleAdd}
            >
              <ShoppingCart size={18} />
              <span>{added ? t.addedToCart : t.addToCart}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
