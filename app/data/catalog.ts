import { FlipBookPage } from '../components/FlipBook';

// Catalog pages using local images from /public/katalogus
const katalogusImages = [
  '/katalogus/0.png',
  '/katalogus/1.png',
  '/katalogus/2.png',
  '/katalogus/3.png',
  '/katalogus/4.png',
  '/katalogus/5.png',
  '/katalogus/6.png',
  '/katalogus/7.png',
  '/katalogus/8.png',
  '/katalogus/9.png',
  '/katalogus/10.png',
  '/katalogus/11.png',
  '/katalogus/12.png',
];

export const catalogPages: FlipBookPage[] = katalogusImages.map((imageUrl, index) => ({
  id: index + 1,
  imageUrl,
  alt: `Catalog page ${index + 1}`,
}));

// Configuration for the catalog
export const catalogConfig = {
  title: 'Elite Affairs Catalog',
  subtitle: '2024',
  description: 'Browse our exclusive wedding and event services',
};
