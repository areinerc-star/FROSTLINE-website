'use client'

import { PRODUCTS, Product, formatPrice } from '@/lib/products'

interface ProductsProps {
  onAddToCart: (product: Product) => void
}

export function Products({ onAddToCart }: ProductsProps) {
  return (
    <section className="products" id="products" aria-label="Featured products">
      <div className="section-label reveal">
        <p className="u-eyebrow">( Featured Products )</p>
        <p className="u-serif" style={{ fontSize: '1.05rem' }}>
          Collection 01
        </p>
      </div>
      <ul className="grid" id="productGrid" aria-label="Product list">
        {PRODUCTS.map((p, i) => (
          <li key={p.id} className="card reveal" data-delay={i % 4}>
            <div className="card__media">
              <img src={p.img} alt={p.name} loading="lazy" />
              <button
                className="card__add"
                onClick={() => onAddToCart(p)}
              >
                Add to cart —
              </button>
            </div>
            <div className="card__info">
              <span className="card__name">{p.name}</span>
              <span className="card__sku">({p.sku})</span>
              <span className="card__price">{formatPrice(p.price)}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
