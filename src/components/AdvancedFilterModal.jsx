import React, { useState } from 'react';
import { ArrowLeft, SlidersHorizontal, Check, Search, RotateCcw } from 'lucide-react';

export function AdvancedFilterModal({
  isOpen,
  onClose,
  onApplyFilters,
  currentFilters,
  lang,
  t
}) {
  const [condition, setCondition] = useState(currentFilters?.condition || 'all');
  const [material, setMaterial] = useState(currentFilters?.material || 'all');
  const [isElectronicsOnly, setIsElectronicsOnly] = useState(currentFilters?.isElectronicsOnly || false);
  const [hasGuarantee, setHasGuarantee] = useState(currentFilters?.hasGuarantee || false);
  const [fastShipping, setFastShipping] = useState(currentFilters?.fastShipping || false);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;
  const isAr = lang === 'ar';

  const handleApply = () => {
    onApplyFilters({
      condition,
      material,
      isElectronicsOnly,
      hasGuarantee,
      fastShipping,
      searchQuery
    });
    onClose();
  };

  const handleReset = () => {
    setCondition('all');
    setMaterial('all');
    setIsElectronicsOnly(false);
    setHasGuarantee(false);
    setFastShipping(false);
    setSearchQuery('');
  };

  return (
    <div className="screen-modal-overlay">
      {/* Header */}
      <div className="modal-screen-header">
        <button className="btn-back-header" onClick={onClose}>
          <ArrowLeft size={20} />
        </button>
        <span className="modal-header-title">
          {isAr ? 'فلترة متقدمة' : 'Advanced Filter'}
        </span>
        <button className="btn-back-header" onClick={handleReset} title="Reset">
          <RotateCcw size={18} />
        </button>
      </div>

      <div style={{ padding: '1.25rem', paddingBottom: '6rem' }}>
        {/* Subtitle */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
            Découvrez & Vendez
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Affinez vos critères de recherche dans les 58 Wilayas
          </p>
        </div>

        {/* Search */}
        <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '0.65rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', boxShadow: 'var(--shadow-card)' }}>
          <Search size={18} color="var(--text-muted)" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: '0.9rem', color: 'var(--text-main)' }}
          />
        </div>

        {/* Section: Attributes / Condition */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>
            Attributes (État de l'objet)
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', fontWeight: '600' }}
          >
            <option value="all">Tous les états</option>
            <option value="Très bon état">Très bon état (★★★★★)</option>
            <option value="Neuf avec étiquette">Neuf avec étiquette</option>
            <option value="Neuf scellé">Neuf scellé / Sous blister</option>
            <option value="Bon état">Bon état</option>
          </select>
        </div>

        {/* Section: Matériau */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.88rem', fontWeight: '800', color: 'var(--text-main)', display: 'block', marginBottom: '0.45rem' }}>
            Matériau
          </label>
          <select
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '14px', border: '1px solid var(--border-light)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: '0.9rem', outline: 'none', fontWeight: '600' }}
          >
            <option value="all">Tous les matériaux</option>
            <option value="Bois">Bois & Chêne massif</option>
            <option value="Tissu">Tissu / Velours</option>
            <option value="Aluminium">Aluminium & Métal</option>
            <option value="Cuir">Cuir véritable</option>
            <option value="Argile">Argile & Céramique</option>
          </select>
        </div>

        {/* Toggles Group */}
        <div style={{ background: 'var(--surface)', borderRadius: '18px', padding: '0.5rem 1rem', border: '1px solid var(--border-light)', marginBottom: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          {/* Électronique Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800' }}>Électronique uniquement</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>High-Tech, smartphones et TV</div>
            </div>
            <input
              type="checkbox"
              checked={isElectronicsOnly}
              onChange={(e) => setIsElectronicsOnly(e.target.checked)}
              style={{ width: '22px', height: '22px', accentColor: 'var(--orange-action)', cursor: 'pointer' }}
            />
          </div>

          {/* Garantie Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-light)' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800' }}>Garantie vérifiée</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Articles avec garantie revendeur active</div>
            </div>
            <input
              type="checkbox"
              checked={hasGuarantee}
              onChange={(e) => setHasGuarantee(e.target.checked)}
              style={{ width: '22px', height: '22px', accentColor: 'var(--orange-action)', cursor: 'pointer' }}
            />
          </div>

          {/* Expédition express */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0' }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: '800' }}>Livraison Express & Remise directe</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Disponible sous 24h</div>
            </div>
            <input
              type="checkbox"
              checked={fastShipping}
              onChange={(e) => setFastShipping(e.target.checked)}
              style={{ width: '22px', height: '22px', accentColor: 'var(--orange-action)', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Big Orange Button */}
        <button
          onClick={handleApply}
          style={{ width: '100%', padding: '0.9rem', background: 'var(--orange-gradient)', color: '#ffffff', border: 'none', borderRadius: '16px', fontSize: '1rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-floating)' }}
        >
          <span>Appliquer les filtres</span>
        </button>
      </div>
    </div>
  );
}
