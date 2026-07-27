/**
 * PBX Businesses API Client
 * Business discovery, chat, and payments
 */

import { apiUrl } from './api';

function getSession() {
  try {
    const stored = localStorage.getItem('pbx_session');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function getHeaders() {
  const session = getSession();
  return {
    'Content-Type': 'application/json',
    'X-Session-Token': session?.token || '',
    'X-Active-Profile': session?.activeProfileId || '',
  };
}

// ============================================================
// BUSINESS DISCOVERY
// ============================================================

/**
 * Discover businesses (featured, recent, by category)
 */
export async function discoverBusinesses(category = null, limit = 20) {
  let url = apiUrl(`/api/businesses/discover?limit=${limit}`);
  if (category) {
    url += `&category=${encodeURIComponent(category)}`;
  }
  
  const res = await fetch(url, {
    headers: getHeaders(),
  });
  
  if (!res.ok) {
    throw new Error('Failed to discover businesses');
  }
  
  return res.json();
}

/**
 * Get business categories
 */
export async function getBusinessCategories() {
  const res = await fetch(apiUrl('/api/businesses/categories'), {
    headers: getHeaders(),
  });
  
  if (!res.ok) {
    throw new Error('Failed to get categories');
  }
  
  return res.json();
}

/**
 * Get businesses the user has paid before
 */
export async function getBusinessesPaid() {
  const res = await fetch(apiUrl('/api/businesses/paid'), {
    headers: getHeaders(),
  });
  
  if (!res.ok) {
    throw new Error('Failed to get paid businesses');
  }
  
  return res.json();
}

/**
 * Get business profile details
 */
export async function getBusinessProfile(profileId) {
  const res = await fetch(apiUrl(`/api/businesses/${profileId}`), {
    headers: getHeaders(),
  });
  
  if (!res.ok) {
    throw new Error('Business not found');
  }
  
  return res.json();
}

// ============================================================
// BUSINESS CHAT & PAYMENTS
// ============================================================

/**
 * Start or get chat with a business
 */
export async function startBusinessChat(businessProfileId) {
  const res = await fetch(apiUrl(`/api/businesses/chat/${businessProfileId}`), {
    method: 'POST',
    headers: getHeaders(),
  });
  
  // Read body ONCE
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to start chat');
  }
  
  return data;
}

/**
 * Pay a business
 */
export async function payBusiness(businessProfileId, amountUsd, note = null) {
  const res = await fetch(apiUrl('/api/businesses/pay'), {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      business_profile_id: businessProfileId,
      amount_usd: amountUsd,
      note,
    }),
  });
  
  // Read body ONCE
  const data = await res.json().catch(() => ({}));
  
  if (!res.ok) {
    throw new Error(data.detail || 'Failed to pay business');
  }
  
  return data;
}
