const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Bir hata oluştu");
  }

  return data;
}

export const productsApi = {
  getAll: (brand?: string, categoryId?: string) => {
    const params = new URLSearchParams();
    if (brand) params.append("brand", brand.toUpperCase());
    if (categoryId) params.append("categoryId", categoryId);
    return fetchApi(`/products?${params.toString()}`);
  },
};

export const categoriesApi = {
  getAll: (brand?: string) => {
    const params = new URLSearchParams();
    if (brand) params.append("brand", brand.toUpperCase());
    return fetchApi(`/categories?${params.toString()}`);
  },
};

export const traitsApi = {
  getAll: (brand?: string) => {
    const params = new URLSearchParams();
    if (brand) params.append("brand", brand.toUpperCase());
    return fetchApi(`/traits?${params.toString()}`);
  },
};
