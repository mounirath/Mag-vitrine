import React from 'react';
import { MOMENT_COLLECTIONS } from '../data/initialData';
import { Sparkles, ArrowRight } from 'lucide-react';

export function CollectionsBanner({ onSelectCollection, lang, t }) {
  const isAr = lang === 'ar';

  return (
    <div style={{ padding: '0 1.2rem 1.2rem' }}>
      <div className="section-label-row">
        <h3 className="section-label">
          {isAr ? 'مجموعات وتشكيلات مميزة' : 'Collections du Moment'}
        </h3>
        <span className="section-link">
          {isAr ? 'عرض الكل' : 'Explorer'}
        </span>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.4rem', scrollbarWidth: 'none' }}>
        {MOMENT_COLLECTIONS.map((col) => (
          <div
            key={col.id}
            onClick={() => onSelectCollection(col.id)}
            style={{ position: 'relative', width: '130px', height: '140px', borderRadius: '18px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-light)' }}
          >
            <img
              src={col.image}
              alt={col.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 60%)' }} />
            
            <div style={{ position: 'absolute', bottom: '8px', left: '8px', right: '8px', color: '#ffffff' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', background: 'var(--orange-action)', padding: '0.15rem 0.4rem', borderRadius: '4px', display: 'inline-block', marginBottom: '0.2rem' }}>
                {col.badge}
              </span>
              <div style={{ fontSize: '0.78rem', fontWeight: '800', lineHeight: '1.2' }}>
                {isAr ? col.titleAr : col.title}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
