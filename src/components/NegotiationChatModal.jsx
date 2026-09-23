import React, { useState } from 'react';
import { ArrowLeft, Bot, Send, CheckCircle2, MessageSquare, Sparkles, Phone, MessageCircle } from 'lucide-react';

export function NegotiationChatModal({
  product,
  store,
  isOpen,
  onClose,
  currentUser,
  lang,
  t
}) {
  const [activeTab, setActiveTab] = useState('messages'); // 'messages' or 'refinement'
  const [offerPrice, setOfferPrice] = useState(product ? Math.round(product.price * 0.9) : 40000);
  const [chatLog, setChatLog] = useState([
    {
      sender: 'bot',
      text: `Bonjour ${currentUser ? currentUser.name : ''} ! Je suis votre Assistant de Négociation MAG VITRINE. Pour l'objet "${product ? product.name : 'cet objet'}" affiché à ${product ? product.price.toLocaleString() : ''} DZD, quelle proposition souhaitez-vous soumettre ?`
    }
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const handleSendOffer = () => {
    if (!product) return;
    const discountPercent = Math.round(((product.price - offerPrice) / product.price) * 100);

    let botResponse = '';
    if (discountPercent <= 15) {
      botResponse = `Excellente proposition ! Une remise de ${discountPercent}% (${offerPrice.toLocaleString()} DZD) est très courante et acceptée par 85% des vendeurs certifiés. Voici le message à copier ou envoyer directement via WhatsApp.`;
    } else if (discountPercent <= 25) {
      botResponse = `Remise de ${discountPercent}%. C'est une négociation dynamique. Nous vous suggérons d'inclure la remise en main propre immédiate pour convaincre le vendeur.`;
    } else {
      botResponse = `Attention : Une remise de ${discountPercent}% risque d'être refusée. Le prix moyen du marché selon notre Value Estimator est de ${Math.round(product.price * 0.88).toLocaleString()} DZD.`;
    }

    setChatLog((prev) => [
      ...prev,
      { sender: 'user', text: `Je propose d'acheter pour ${offerPrice.toLocaleString()} DZD (remise de ${discountPercent}%).` },
      { sender: 'bot', text: botResponse }
    ]);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const userMsg = inputText.trim();
    setInputText('');

    setChatLog((prev) => [...prev, { sender: 'user', text: userMsg }]);

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Bien reçu ! Je transmets cette information dans le fil de discussion. Le vendeur (${store ? store.name : 'Magasin vérifié'}) répond généralement en moins de 15 minutes.`
        }
      ]);
    }, 600);
  };

  const openWhatsAppProposal = () => {
    const wa = store ? store.whatsapp : '213661223344';
    const text = encodeURIComponent(`Bonjour ${store ? store.name : ''}, je suis intéressé par votre annonce "${product?.name}". Après estimation, je vous propose une offre à ${offerPrice.toLocaleString()} DZD avec paiement à la livraison / remise en main propre. Est-ce envisageable pour vous ? Merci !`);
    window.open(`https://wa.me/${wa}?text=${text}`, '_blank');
  };

  return (
    <div className="screen-modal-overlay">
      {/* Header */}
      <div className="modal-screen-header">
        <button className="btn-back-header" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <span className="modal-header-title">
          {isAr ? 'الرسائل والمفاوضة' : 'Messages'}
        </span>
        <div style={{ width: 36 }} />
      </div>

      {/* Tabs matching screenshot */}
      <div style={{ display: 'flex', background: 'var(--surface)', borderBottom: '1px solid var(--border-light)' }}>
        <button
          onClick={() => setActiveTab('messages')}
          style={{ flex: 1, padding: '0.75rem', border: 'none', background: 'transparent', fontWeight: '800', fontSize: '0.88rem', color: activeTab === 'messages' ? 'var(--navy-header)' : 'var(--text-muted)', borderBottom: activeTab === 'messages' ? '2px solid var(--orange-action)' : 'none', cursor: 'pointer' }}
        >
          Messages
        </button>
        <button
          onClick={() => setActiveTab('refinement')}
          style={{ flex: 1, padding: '0.75rem', border: 'none', background: 'transparent', fontWeight: '800', fontSize: '0.88rem', color: activeTab === 'refinement' ? 'var(--navy-header)' : 'var(--text-muted)', borderBottom: activeTab === 'refinement' ? '2px solid var(--orange-action)' : 'none', cursor: 'pointer' }}
        >
          Refinement (Offre IA)
        </button>
      </div>

      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', paddingBottom: '5rem' }}>
        {/* Chatbot Banner Item matching screenshot */}
        <div style={{ background: '#fef3c7', borderRadius: '16px', padding: '0.9rem 1rem', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <Bot size={24} color="#d97706" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.88rem', fontWeight: '800', color: '#92400e' }}>
              Chatbot d'Aide à la Négociation
            </div>
            <div style={{ fontSize: '0.75rem', color: '#b45309' }}>
              Optimisez votre offre avec l'IA du marché algérien
            </div>
          </div>
        </div>

        {/* Quick Offer Calculator Box */}
        {product && (
          <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '1rem', border: '1px solid var(--border-light)', marginBottom: '1rem', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-muted)' }}>Prix demandé par le vendeur :</span>
              <span style={{ fontSize: '0.92rem', fontWeight: '800' }}>{product.price.toLocaleString()} DZD</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: '700' }}>Votre offre :</span>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(Number(e.target.value))}
                style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '10px', border: '1px solid var(--border-light)', fontWeight: '800', fontSize: '0.95rem' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>DZD</span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={handleSendOffer}
                style={{ flex: 1, background: '#f1f5f9', border: '1px solid var(--border-light)', borderRadius: '10px', padding: '0.5rem', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer' }}
              >
                Tester l'offre avec l'IA
              </button>
              <button
                onClick={openWhatsAppProposal}
                style={{ flex: 1, background: '#25d366', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '0.5rem', fontSize: '0.78rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
              >
                <MessageCircle size={15} />
                <span>Envoyer WhatsApp</span>
              </button>
            </div>
          </div>
        )}

        {/* Chat Stream */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
          {chatLog.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                background: msg.sender === 'user' ? 'var(--orange-action)' : 'var(--surface)',
                color: msg.sender === 'user' ? '#ffffff' : 'var(--text-main)',
                padding: '0.75rem 1rem',
                borderRadius: '16px',
                border: msg.sender === 'user' ? 'none' : '1px solid var(--border-light)',
                boxShadow: 'var(--shadow-card)',
                fontSize: '0.85rem',
                lineHeight: '1.4'
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input area */}
        <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '0.5rem', background: 'var(--surface)', padding: '0.5rem', borderRadius: '16px', border: '1px solid var(--border-light)', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
          <input
            type="text"
            placeholder="Écrire un message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', padding: '0.4rem 0.6rem', fontSize: '0.88rem' }}
          />
          <button
            type="submit"
            style={{ background: 'var(--orange-gradient)', border: 'none', color: '#fff', borderRadius: '12px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
