import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Truck, CheckCircle2, MessageCircle } from 'lucide-react';
import { WILAYAS } from '../data/initialData';

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onCreateOrder,
  t
}) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('Alger');
  const [address, setAddress] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 10000 || subtotal === 0 ? 0 : 400;
  const total = subtotal + deliveryFee;

  const handleCheckout = (e) => {
    e.preventDefault();
    if (!customerName || !phone) {
      alert('Veuillez remplir votre nom et numéro de téléphone');
      return;
    }

    const orderData = {
      customerName,
      phone,
      wilaya,
      address,
      items: cart.map(i => ({ name: i.product.name, qty: i.quantity, price: i.product.price })),
      totalAmount: total,
      storeName: cart[0]?.product?.storeId || 'Magasin Partenaire'
    };

    const created = onCreateOrder(orderData);
    setOrderPlaced(created);
  };

  const handleWhatsAppOrder = () => {
    if (!orderPlaced) return;
    const itemsList = orderPlaced.items.map(i => `- ${i.qty}x ${i.name} (${(i.price * i.qty).toLocaleString()} DZD)`).join('\n');
    const msg = encodeURIComponent(
      `*NOUVELLE COMMANDE MAG VITRINE*\n\n` +
      `*Code Commande:* ${orderPlaced.id}\n` +
      `*Client:* ${orderPlaced.customerName}\n` +
      `*Téléphone:* ${orderPlaced.phone}\n` +
      `*Wilaya:* ${orderPlaced.wilaya} (${orderPlaced.address})\n\n` +
      `*Articles:*\n${itemsList}\n\n` +
      `*Total:* ${orderPlaced.totalAmount.toLocaleString()} DZD (Paiement à la livraison)`
    );
    window.open(`https://wa.me/213661223344?text=${msg}`, '_blank');
  };

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800', fontSize: '1.2rem' }}>
            <ShoppingBag size={22} color="var(--primary)" />
            <span>{t.cartTitle}</span>
          </div>
          <button className="close-btn" style={{ position: 'static' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {orderPlaced ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <CheckCircle2 size={54} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '0.5rem' }}>Commande Confirmée !</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Votre commande <strong>#{orderPlaced.id}</strong> a été enregistrée avec succès. Vous serez contacté pour confirmation de livraison.
            </p>

            <button
              className="btn-store-wa"
              style={{ width: '100%', padding: '0.85rem', marginBottom: '1rem' }}
              onClick={handleWhatsAppOrder}
            >
              <MessageCircle size={18} />
              <span>{t.orderOnWhatsApp}</span>
            </button>

            <button
              className="btn-store-call"
              style={{ width: '100%', padding: '0.75rem' }}
              onClick={() => {
                setOrderPlaced(null);
                onClose();
              }}
            >
              Retour aux achats
            </button>
          </div>
        ) : cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ opacity: 0.4, margin: '0 auto 1rem' }} />
            <p style={{ fontSize: '1rem' }}>{t.emptyCart}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Items list */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {cart.map(item => (
                <div key={item.product.id} className="cart-item">
                  <img src={item.product.image} alt={item.product.name} className="cart-item-img" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.product.name}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--primary)', fontWeight: '800', margin: '0.2rem 0' }}>
                      {(item.product.price * item.quantity).toLocaleString()} {t.currency}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="cart-qty-ctrl">
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => onUpdateQty(item.product.id, item.quantity + 1)}>+</button>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t.subtotal}</span>
                <span style={{ fontWeight: '700' }}>{subtotal.toLocaleString()} {t.currency}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{t.deliveryFee}</span>
                <span style={{ fontWeight: '700', color: deliveryFee === 0 ? 'var(--primary)' : 'inherit' }}>
                  {deliveryFee === 0 ? t.freeDeliveryBadge : `${deliveryFee} ${t.currency}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: '800', borderTop: '1px dashed var(--border)', paddingTop: '0.5rem', marginBottom: '1.25rem' }}>
                <span>{t.total}</span>
                <span style={{ color: 'var(--primary)' }}>{total.toLocaleString()} {t.currency}</span>
              </div>

              {/* Checkout Form */}
              <form onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <input
                  type="text"
                  placeholder="Nom et prénom"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
                <input
                  type="tel"
                  placeholder="Numéro de téléphone (05/06/07...)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />
                <select
                  value={wilaya}
                  onChange={(e) => setWilaya(e.target.value)}
                  style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                >
                  {WILAYAS.map(w => (
                    <option key={w.code} value={w.name}>{w.code} - {w.name} ({w.nameAr})</option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Adresse de livraison"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--text)' }}
                />

                <button type="submit" className="btn-add-cart" style={{ padding: '0.85rem', marginTop: '0.5rem' }}>
                  <Truck size={18} />
                  <span>{t.checkout}</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
