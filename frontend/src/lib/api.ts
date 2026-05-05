const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Bir hata oluştu");
      }
      return data;
    } else {
      // JSON değilse (muhtemelen 404 HTML sayfası veya server hatası)
      const text = await response.text();
      console.error("API Error (Not JSON):", text.slice(0, 200));
      throw new Error(`Beklenmeyen yanıt formatı (Status: ${response.status}). Lütfen backend'in çalıştığından emin olun.`);
    }
  } catch (error: any) {
    console.error("Fetch API Error:", error);
    throw error;
  }
}

// Brand mapping: frontend 'salatto' -> backend 'DYSALATTO'
const mapBrand = (brand?: string) => {
  if (!brand) return undefined;
  if (brand.toLowerCase() === 'salatto') return 'DYSALATTO';
  if (brand.toLowerCase() === 'cake') return 'DYCAKE';
  return brand.toUpperCase();
};

export const productsApi = {
  getAll: (brand?: string, categoryId?: string) => {
    const params = new URLSearchParams();
    const mappedBrand = mapBrand(brand);
    if (mappedBrand) params.append("brand", mappedBrand);
    if (categoryId) params.append("categoryId", categoryId);
    return fetchApi(`/products?${params.toString()}`);
  },
};

export const categoriesApi = {
  getAll: (brand?: string) => {
    const params = new URLSearchParams();
    const mappedBrand = mapBrand(brand);
    if (mappedBrand) params.append("brand", mappedBrand);
    return fetchApi(`/categories?${params.toString()}`);
  },
};

export const traitsApi = {
  getAll: (brand?: string) => {
    const params = new URLSearchParams();
    const mappedBrand = mapBrand(brand);
    if (mappedBrand) params.append("brand", mappedBrand);
    return fetchApi(`/traits/groups?${params.toString()}`);
  },
};
