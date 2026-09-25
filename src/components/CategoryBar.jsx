import React from 'react';
import { CATEGORIES } from '../data/initialData';
import { Armchair, Tv, Shirt, Wrench, Layers, Sparkles, LayoutGrid } from 'lucide-react';

const ICON_MAP = {
  Armchair: Armchair,
  Tv: Tv,
  Shirt: Shirt,
  Wrench: Wrench,
  Layers: Layers,
  Sparkles: Sparkles,
  Sparkle: Sparkles
};

export function CategoryBar({ selectedCategory, onSelectCategory, lang, t }) {
  const isAr = lang === 'ar';

  return (
    <section className="categories-section">
      <div className="section-label-row">
        <h2 className="section-label">
          {isAr ? 'الأقسام الذكية' : 'Categories'}
        </h2>
        <span
          className="section-link"
          onClick={() => onSelectCategory('all')}
        >
          {selectedCategory === 'all' ? (isAr ? 'عرض الكل' : 'Tous') : (isAr ? 'إلغاء التحديد' : 'Réinitialiser')}
        </span>
      </div>

      <div className="pastel-categories-grid">
        {CATEGORIES.filter(c => c.id !== 'all').map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Sparkles;
          const isSelected = selectedCategory === cat.id;

          return (
            <div
              key={cat.id}
              className={`pastel-category-card ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(isSelected ? 'all' : cat.id)}
            >
              <div
                className="pastel-category-icon-box"
                style={{ background: cat.bg, color: cat.color }}
              >
                <IconComp size={24} />
              </div>
              <span className="pastel-category-title">
                {isAr ? cat.nameAr : cat.nameFr}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
