export const ssr = true;
export const csr = false;

import { apiInstance } from '$lib/stores/api.js';

export function load({ params }) {
  return {
    id: params.id,
  };
}
