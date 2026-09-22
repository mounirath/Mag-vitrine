import React from 'react';
import { ShoppingCart, Star, MapPin } from 'lucide-react';

export function ProductCard({ product, store, onSelectProduct, onAddToCart, lang, t }) {
  const isAr = lang === 'ar';
  const title = isAr && product.nameAr ? product.nameAr : product.name;

  return (
    <div className="product-card" onClick={() => onSelectProduct(product)}>
      <div className="prod-img-wrap">
        <img
          src={product.image}
          alt={title}
          className="prod-img"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'; }}
        />
        {product.discountPercent > 0 && (
          <span className="discount-badge">-{product.discountPercent}%</span>
        )}
      </div>

      <div className="prod-body">
        {store && (
          <div className="prod-store-link">
            <span>{store.name}</span> • <span>{product.wilaya}</span>
          </div>
        )}

        <h4 className="prod-title" title={title}>{title}</h4>

        <div className="price-wrap">
          <span className="current-price">
            {product.price.toLocaleString()} {t.currency}
          </span>
          {product.oldPrice && (
            <span className="old-price">
              {product.oldPrice.toLocaleString()} {t.currency}
            </span>
          )}
        </div>

        <button
          className="btn-add-cart"
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart(product);
          }}
        >
          <ShoppingCart size={16} />
          <span>{t.addToCart}</span>
        </button>
      </div>
    </div>
  );
}
