import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * ============================================================================
 * SUPABASE SERVICE LAYER FOR MAG VITRINE ALGÉRIE
 * ============================================================================
 */

export const productsApi = {
  async getAll() {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async getById(id) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  async create(product) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const newProduct = {
      id: product.id || `prod_${Date.now()}`,
      store_id: product.storeId || product.store_id,
      category_id: product.categoryId || product.category_id,
      name: product.name,
      name_ar: product.nameAr || '',
      description: product.description,
      price: Number(product.price),
      old_price: product.oldPrice ? Number(product.oldPrice) : null,
      is_promotion: Boolean(product.isPromotion),
      discount_percent: Number(product.discountPercent || 0),
      condition: product.condition || 'new',
      stock_status: product.stockStatus || 'IN_STOCK',
      delivery_available: product.deliveryAvailable !== false,
      image_url: product.imageUrl || product.image_url || '',
      images: product.images || [],
      video_url: product.videoUrl || '',
      location: product.location || '',
      wilaya: product.wilaya || '',
      status: 'ACTIVE'
    };

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();

    return { data, error };
  },

  async update(id, updates) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id) {
    const supabase = getSupabase();
    if (!supabase) return { error: new Error('Supabase non configuré') };

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    return { error };
  }
};

export const storesApi = {
  async getAll() {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async getById(id) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', id)
      .single();

    return { data, error };
  },

  async create(store) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const slug = (store.name || 'store')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const newStore = {
      id: store.id || `store_${Date.now()}`,
      name: store.name,
      slug: store.slug || `${slug}-${Math.floor(Math.random() * 1000)}`,
      logo: store.logo || 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400',
      banner: store.banner || '',
      description: store.description,
      manager_name: store.managerName || store.manager_name || '',
      phone: store.phone,
      whatsapp: store.whatsapp || store.phone,
      address: store.address,
      wilaya: store.wilaya,
      commune: store.commune || '',
      category: store.category || 'all',
      badge: store.badge || 'Vérifié',
      status: 'active'
    };

    const { data, error } = await supabase
      .from('stores')
      .insert([newStore])
      .select()
      .single();

    return { data, error };
  },

  async update(id, updates) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('stores')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async delete(id) {
    const supabase = getSupabase();
    if (!supabase) return { error: new Error('Supabase non configuré') };

    const { error } = await supabase
      .from('stores')
      .delete()
      .eq('id', id);

    return { error };
  }
};

export const ordersApi = {
  async getAll() {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async create(order) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const newOrder = {
      id: order.id || `DZ-${Date.now().toString().slice(-6)}`,
      store_id: order.storeId || order.store_id,
      store_name: order.storeName || order.store_name,
      customer_id: order.customerId || order.customer_id || 'guest',
      customer_name: order.customerName || order.customer_name,
      customer_phone: order.customerPhone || order.customer_phone,
      wilaya: order.wilaya,
      commune: order.commune,
      address: order.address,
      delivery_method: order.deliveryMethod || order.delivery_method || 'HOME_DELIVERY',
      payment_method: order.paymentMethod || order.payment_method || 'CASH_ON_DELIVERY',
      items: order.items || [],
      subtotal: Number(order.subtotal || 0),
      delivery_fee: Number(order.deliveryFee || order.delivery_fee || 0),
      total: Number(order.total || 0),
      status: order.status || 'NEW',
      notes: order.notes || ''
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([newOrder])
      .select()
      .single();

    return { data, error };
  },

  async update(orderId, updates) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    return { data, error };
  },

  async updateStatus(orderId, status) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId)
      .select()
      .single();

    return { data, error };
  },

  async delete(orderId) {
    const supabase = getSupabase();
    if (!supabase) return { error: new Error('Supabase non configuré') };

    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    return { error };
  }
};

export const storeReviewsApi = {
  async getAll() {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('store_reviews')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async create(review) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const newReview = {
      id: review.id || `s_rev_${Date.now()}`,
      store_id: review.storeId || review.store_id,
      customer_name: review.customerName || review.customer_name,
      customer_phone: review.customerPhone || review.customer_phone,
      rating: Number(review.rating),
      criteria: review.criteria || { deliverySpeed: 5, conformity: 5, communication: 5 },
      comment: review.comment,
      comment_fr: review.commentFr || review.comment_fr || '',
      verified_order: review.verifiedOrder !== false,
      order_id: review.orderId || review.order_id || null
    };

    const { data, error } = await supabase
      .from('store_reviews')
      .insert([newReview])
      .select()
      .single();

    return { data, error };
  },

  async delete(id) {
    const supabase = getSupabase();
    if (!supabase) return { error: new Error('Supabase non configuré') };

    const { error } = await supabase
      .from('store_reviews')
      .delete()
      .eq('id', id);

    return { error };
  }
};

export const customerRatingsApi = {
  async getAll() {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('customer_ratings')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async create(rating) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const newRating = {
      id: rating.id || `c_rat_${Date.now()}`,
      customer_phone: rating.customerPhone || rating.customer_phone,
      customer_name: rating.customerName || rating.customer_name,
      store_id: rating.storeId || rating.store_id,
      store_name: rating.storeName || rating.store_name,
      parcel_received: Boolean(rating.parcelReceived),
      stars: Number(rating.stars),
      reason: rating.reason,
      reason_fr: rating.reasonFr || rating.reason_fr || '',
      order_id: rating.orderId || rating.order_id || null
    };

    const { data, error } = await supabase
      .from('customer_ratings')
      .insert([newRating])
      .select()
      .single();

    return { data, error };
  },

  async delete(id) {
    const supabase = getSupabase();
    if (!supabase) return { error: new Error('Supabase non configuré') };

    const { error } = await supabase
      .from('customer_ratings')
      .delete()
      .eq('id', id);

    return { error };
  }
};

export const profilesApi = {
  async getAll() {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    return { data, error };
  },

  async updateRole(id, role) {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    const { data, error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  }
};

export const adminApi = {
  async getTableStats() {
    const supabase = getSupabase();
    if (!supabase) return { data: null, error: new Error('Supabase non configuré') };

    try {
      const [
        storesCount,
        productsCount,
        ordersCount,
        reviewsCount,
        ratingsCount,
        profilesCount
      ] = await Promise.all([
        supabase.from('stores').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('store_reviews').select('*', { count: 'exact', head: true }),
        supabase.from('customer_ratings').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true })
      ]);

      return {
        data: {
          stores: storesCount.count || 0,
          products: productsCount.count || 0,
          orders: ordersCount.count || 0,
          reviews: reviewsCount.count || 0,
          ratings: ratingsCount.count || 0,
          profiles: profilesCount.count || 0
        },
        error: null
      };
    } catch (err) {
      return { data: null, error: err };
    }
  }
};

/**
 * Sync initial data (Seed) to Supabase in one click
 */
export async function syncLocalDataToSupabase({ stores, products, storeReviews, customerRatings }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase non configuré');

  const results = {
    stores: 0,
    products: 0,
    storeReviews: 0,
    customerRatings: 0
  };

  // 1. Sync Stores
  if (stores && stores.length > 0) {
    const formattedStores = stores.map(s => ({
      id: s.id,
      name: s.name,
      slug: (s.name || 'store').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      logo: s.logo || '',
      banner: s.banner || '',
      description: s.description || '',
      manager_name: s.managerName || '',
      phone: s.phone || '',
      whatsapp: s.whatsapp || s.phone || '',
      address: s.address || '',
      wilaya: s.wilaya || '',
      commune: s.commune || '',
      badge: s.badge || 'Vérifié',
      status: 'active'
    }));

    const { error: storeErr } = await supabase
      .from('stores')
      .upsert(formattedStores, { onConflict: 'id' });

    if (!storeErr) results.stores = formattedStores.length;
    else console.warn('Store sync error:', storeErr);
  }

  // 2. Sync Products
  if (products && products.length > 0) {
    const formattedProducts = products.map(p => ({
      id: p.id,
      store_id: p.storeId,
      category_id: p.categoryId,
      name: p.name,
      name_ar: p.nameAr || '',
      description: p.description,
      price: Number(p.price),
      old_price: p.oldPrice ? Number(p.oldPrice) : null,
      is_promotion: Boolean(p.isPromotion),
      discount_percent: Number(p.discountPercent || 0),
      condition: p.condition || 'new',
      stock_status: p.stockStatus || 'IN_STOCK',
      delivery_available: p.deliveryAvailable !== false,
      image_url: p.imageUrl || '',
      images: p.images || [],
      location: p.location || '',
      wilaya: p.wilaya || '',
      status: 'ACTIVE'
    }));

    const { error: prodErr } = await supabase
      .from('products')
      .upsert(formattedProducts, { onConflict: 'id' });

    if (!prodErr) results.products = formattedProducts.length;
    else console.warn('Product sync error:', prodErr);
  }

  // 3. Sync Store Reviews
  if (storeReviews && storeReviews.length > 0) {
    const formattedReviews = storeReviews.map(r => ({
      id: r.id,
      store_id: r.storeId,
      customer_name: r.customerName,
      customer_phone: r.customerPhone,
      rating: Number(r.rating),
      criteria: r.criteria || {},
      comment: r.comment,
      comment_fr: r.commentFr || '',
      verified_order: r.verifiedOrder !== false,
      order_id: r.orderId || null
    }));

    const { error: revErr } = await supabase
      .from('store_reviews')
      .upsert(formattedReviews, { onConflict: 'id' });

    if (!revErr) results.storeReviews = formattedReviews.length;
  }

  // 4. Sync Customer Ratings
  if (customerRatings && customerRatings.length > 0) {
    const formattedRatings = customerRatings.map(c => ({
      id: c.id,
      customer_phone: c.customerPhone,
      customer_name: c.customerName,
      store_id: c.storeId,
      store_name: c.storeName,
      parcel_received: Boolean(c.parcelReceived),
      stars: Number(c.stars),
      reason: c.reason,
      reason_fr: c.reasonFr || '',
      order_id: c.orderId || null
    }));

    const { error: ratErr } = await supabase
      .from('customer_ratings')
      .upsert(formattedRatings, { onConflict: 'id' });

    if (!ratErr) results.customerRatings = formattedRatings.length;
  }

  return results;
}
