import React, { useState } from 'react';
import { X, Camera, Sparkles, Upload, CheckCircle2, ArrowRight } from 'lucide-react';

export function CameraAiSearchModal({ isOpen, onClose, onSelectCategory, setSearchTerm, lang, t }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [preview, setPreview] = useState(null);
  const [detectedItem, setDetectedItem] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);
    setAnalyzing(true);
    setDetectedItem(null);

    // Simulate Gemini visual recognition
    setTimeout(() => {
      setAnalyzing(false);
      setDetectedItem({
        productName: 'Smartphone haut de gamme (Écran AMOLED & Caméra)',
        suggestedCategory: 'cat_electronics',
        wilayasAvailable: 'Alger, Oran, Constantine',
        confidence: '98.4%'
      });
    }, 1800);
  };

  const handleApplyResult = () => {
    if (detectedItem) {
      onSelectCategory(detectedItem.suggestedCategory);
      setSearchTerm('Samsung');
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
        <button className="close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
            <Sparkles size={28} color="#8b5cf6" />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>{t.cameraSearchTitle}</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t.cameraSearchSubtitle}
          </p>
        </div>

        {/* Upload area */}
        <label style={{ display: 'block', cursor: 'pointer' }}>
          <div style={{ border: '2px dashed var(--border)', borderRadius: '16px', padding: '2rem 1.5rem', textAlign: 'center', background: 'var(--surface-alt)', transition: 'border-color 0.2s' }}>
            {preview ? (
              <img
                src={preview}
                alt="Upload preview"
                style={{ maxHeight: '200px', maxWidth: '100%', objectFit: 'contain', borderRadius: '10px', margin: '0 auto' }}
              />
            ) : (
              <div>
                <Camera size={42} color="var(--primary)" style={{ margin: '0 auto 0.75rem', opacity: 0.8 }} />
                <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.25rem' }}>{t.dropPhoto}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>JPG, PNG ou capture caméra smartphone</div>
              </div>
            )}
          </div>
          <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} style={{ display: 'none' }} />
        </label>

        {analyzing && (
          <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700' }}>
              <Sparkles size={18} className="animate-spin" />
              <span>{t.analyzingImage}</span>
            </div>
          </div>
        )}

        {detectedItem && (
          <div style={{ marginTop: '1.5rem', background: 'var(--badge-bg)', border: '1px solid var(--badge-border)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--badge-text)', fontWeight: '800', fontSize: '0.92rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} />
              <span>{t.aiResultsFound} ({detectedItem.confidence})</span>
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '0.25rem' }}>
              {detectedItem.productName}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Boutiques disponibles dans les wilayas : {detectedItem.wilayasAvailable}
            </div>

            <button
              className="btn-add-cart"
              style={{ width: '100%', padding: '0.75rem' }}
              onClick={handleApplyResult}
            >
              <span>Afficher les articles correspondants</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
