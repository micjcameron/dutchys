const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const PLACEHOLDERS = [
  { name: 'bestseller-1', text: 'Bestseller 1' },
  { name: 'bestseller-2', text: 'Bestseller 2' },
  { name: 'bestseller-3', text: 'Bestseller 3' },
  { name: 'product-1', text: 'Product 1' },
  { name: 'product-2', text: 'Product 2' },
  { name: 'product-3', text: 'Product 3' },
  { name: 'product-4', text: 'Product 4' },
  { name: 'product-5', text: 'Product 5' },
  { name: 'product-6', text: 'Product 6' },
  { name: 'product-7', text: 'Product 7' },
  { name: 'product-8', text: 'Product 8' },
  { name: 'product-9', text: 'Product 9' },
  { name: 'product-10', text: 'Product 10' },
  { name: 'product-details-1', text: 'Product Details 1' },
  { name: 'product-details-2', text: 'Product Details 2' },
  { name: 'product-details-3', text: 'Product Details 3' },
  { name: 'category-1', text: 'Category 1' },
  { name: 'category-2', text: 'Category 2' },
  { name: 'category-3', text: 'Category 3' },
  { name: 'category-4', text: 'Category 4' },
  { name: 'category-5', text: 'Category 5' },
  { name: 'collection-1', text: 'Collection 1' },
  { name: 'collection-2', text: 'Collection 2' },
  { name: 'collection-3', text: 'Collection 3' },
  { name: 'collection-4', text: 'Collection 4' },
  { name: 'collection-5', text: 'Collection 5' },
  { name: 'gallery-1', text: 'Gallery 1' },
  { name: 'gallery-2', text: 'Gallery 2' },
  { name: 'gallery-3', text: 'Gallery 3' },
  { name: 'gallery-4', text: 'Gallery 4' },
  { name: 'gallery-5', text: 'Gallery 5' },
  { name: 'gallery-6', text: 'Gallery 6' },
  { name: 'testimonial-1', text: 'Testimonial 1' },
  { name: 'testimonial-2', text: 'Testimonial 2' },
  { name: 'testimonial-3', text: 'Testimonial 3' },
  { name: 'blog-1', text: 'Blog 1' },
  { name: 'blog-2', text: 'Blog 2' },
  { name: 'blog-3', text: 'Blog 3' },
  { name: 'blog-4', text: 'Blog 4' },
  { name: 'news-1', text: 'News 1' },
  { name: 'news-2', text: 'News 2' },
  { name: 'news-3', text: 'News 3' },
  { name: 'material-1', text: 'Material 1' },
  { name: 'material-2', text: 'Material 2' },
  { name: 'material-3', text: 'Material 3' },
  { name: 'material-4', text: 'Material 4' },
  { name: 'about-us', text: 'About Us' },
  { name: 'wellness-section', text: 'Wellness Section' },
  { name: 'ice-bath', text: 'Ice Bath' },
  { name: 'hottub', text: 'Hottub' }
];

const WIDTH = 800;
const HEIGHT = 600;
const BACKGROUND_COLOR = '#E76F51';
const TEXT_COLOR = '#FFFFFF';

function generatePlaceholder(name, text) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = BACKGROUND_COLOR;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Add text
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, WIDTH / 2, HEIGHT / 2);

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../public/placeholders', `${name}.png`), buffer);
}

// Create placeholders directory if it doesn't exist
const placeholdersDir = path.join(__dirname, '../public/placeholders');
if (!fs.existsSync(placeholdersDir)) {
  fs.mkdirSync(placeholdersDir, { recursive: true });
}

// Generate all placeholders
PLACEHOLDERS.forEach(({ name, text }) => {
  generatePlaceholder(name, text);
});

console.log('Placeholder images generated successfully!'); 