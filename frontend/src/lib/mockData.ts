export type Ingredient = {
  id: string;
  name: string;
  iconName?: string; // Lucide icon name
};

export type Product = {
  id: string;
  brand: 'salatto' | 'cake';
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  dietaryTags: string[];
  allergens: string[];
  ingredients: string[]; // Ingredient IDs
};

export const MOCK_INGREDIENTS: Ingredient[] = [
  { id: 'corn', name: 'Mısır', iconName: 'Wheat' },
  { id: 'avocado', name: 'Avokado', iconName: 'Salad' },
  { id: 'chicken', name: 'Tavuk', iconName: 'Drumstick' },
  { id: 'salmon', name: 'Somon', iconName: 'Fish' },
  { id: 'walnut', name: 'Ceviz', iconName: 'Nut' },
  { id: 'date-paste', name: 'Hurma Özü', iconName: 'Droplets' },
  { id: 'belgian-choco', name: 'Belçika Çikolatası', iconName: 'Coffee' },
  { id: 'almond-flour', name: 'Badem Unu', iconName: 'Wheat' },
];

export const MOCK_PRODUCTS: Product[] = [
  // --- Salatto Products ---
  {
    id: 's1',
    brand: 'salatto',
    name: 'Protein Kasesi',
    category: 'Bowl',
    description: 'Izgara tavuk, kinoa, mısır ve taze yeşillikler.',
    price: '245 TL',
    image: '/images/forDYSalatto/header1.jpg',
    dietaryTags: ['Yüksek Protein'],
    allergens: [],
    ingredients: ['chicken', 'corn', 'quinoa']
  },
  {
    id: 's2',
    brand: 'salatto',
    name: 'Vegan Avokado Mix',
    category: 'Bowl',
    description: 'Avokado, nohut, mısır ve özel vegan sos.',
    price: '215 TL',
    image: '/images/forDYSalatto/header1.jpg',
    dietaryTags: ['Vegan', 'Glutensiz'],
    allergens: [],
    ingredients: ['avocado', 'corn']
  },
  // --- Cake Products ---
  {
    id: 'c1',
    brand: 'cake',
    name: 'Fit San Sebastian',
    category: 'Pasta',
    description: 'Rafine şekersiz, hurma özüyle tatlandırılmış efsane lezzet.',
    price: '185 TL',
    image: '/images/forDYCake/header1.png',
    dietaryTags: ['Rafine Şekersiz'],
    allergens: ['Süt'],
    ingredients: ['date-paste']
  },
  {
    id: 'c2',
    brand: 'cake',
    name: 'Bademli Kurabiye',
    category: 'Kurabiye',
    description: 'Glutensiz badem unu ve bitter çikolata parçacıklı.',
    price: '85 TL',
    image: '/images/forDYCake/header1.png',
    dietaryTags: ['Glutensiz', 'Rafine Şekersiz'],
    allergens: ['Kuruyemiş'],
    ingredients: ['almond-flour', 'belgian-choco']
  }
];
