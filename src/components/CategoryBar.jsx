import React from 'react';
import { CATEGORIES } from '../data/initialData';
import { Sparkles, Smartphone, Shirt, Home, Sparkle, Apple, Car } from 'lucide-react';

const ICON_MAP = {
  Sparkles,
  Smartphone,
  Shirt,
  Home,
  Sparkle,
  Apple,
  Car
};

export function CategoryBar({ selectedCategory, onSelectCategory, lang }) {
  return (
    <div className="category-scroller">
      {CATEGORIES.map(cat => {
        const Icon = ICON_MAP[cat.icon] || Sparkles;
        const label = lang === 'ar' ? cat.nameAr : (lang === 'en' ? cat.nameEn : cat.nameFr);
        const isActive = selectedCategory === cat.id;

        return (
          <button
            key={cat.id}
            className={`cat-chip ${isActive ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
