const slugify = require('slugify');
const crypto = require('crypto');

const examples = [
  'John Smith',
  'John & Mary Smith',
  'O\'Connor Family',
  'St. John\'s Family',
  '100% Natural',
  'Email: john.smith@example.com',
  'Special!@#$%^&*() Characters',
  'Multiple   Spaces',
  'UPPERCASE lowercase',
  'Mixed-Case-With-Hyphens',
  'Numbers 123',
  'Unicode: 你好世界',
];

function generateSlug(familyName) {
  // Generate the slug part using slugify with strict mode
  const slugPart = slugify(familyName, { 
    lower: true,
    strict: true,
    trim: true
  });
  
  // Generate a unique 6-character identifier using crypto
  const uniqueId = crypto.randomBytes(4).toString('hex').slice(0, 6);
  
  // Combine them with a hyphen
  return `${slugPart}-${uniqueId}`;
}

console.log('Hybrid Slug Examples:');
console.log('----------------');
examples.forEach(example => {
  console.log(`Input: "${example}"`);
  console.log(`Output: "${generateSlug(example)}"`);
  console.log('----------------');
}); 