// server/utils/seedCategories.js
// Run once: node utils/seedCategories.js
// This creates the default categories so the CreateCourse dropdown
// actually has options. Without any Category documents in MongoDB,
// categoryApi.list() returns [] and the dropdown stays empty.

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const DEFAULT_CATEGORIES = [
  { name: 'Web Development',      slug: 'web-development',      icon: '🌐' },
  { name: 'Mobile Development',   slug: 'mobile-development',   icon: '📱' },
  { name: 'Data Science',         slug: 'data-science',         icon: '📊' },
  { name: 'Machine Learning',     slug: 'machine-learning',     icon: '🤖' },
  { name: 'Cloud Computing',      slug: 'cloud-computing',      icon: '☁️' },
  { name: 'DevOps',               slug: 'devops',               icon: '⚙️' },
  { name: 'Cybersecurity',        slug: 'cybersecurity',        icon: '🔒' },
  { name: 'UI/UX Design',         slug: 'ui-ux-design',         icon: '🎨' },
  { name: 'Digital Marketing',    slug: 'digital-marketing',    icon: '📣' },
  { name: 'Business',             slug: 'business',             icon: '💼' },
  { name: 'Mathematics',          slug: 'mathematics',          icon: '📐' },
  { name: 'Physics',              slug: 'physics',              icon: '⚛️' },
  { name: 'English',              slug: 'english',              icon: '📝' },
  { name: 'Programming Basics',   slug: 'programming-basics',   icon: '💻' },
  { name: 'Database',             slug: 'database',             icon: '🗄️' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    let created = 0;
    let skipped = 0;

    for (const cat of DEFAULT_CATEGORIES) {
      const exists = await Category.findOne({ slug: cat.slug });
      if (exists) {
        console.log(`  skip  ${cat.name} (already exists)`);
        skipped++;
      } else {
        await Category.create({ ...cat, isActive: true });
        console.log(`  created  ${cat.name}`);
        created++;
      }
    }

    console.log(`\nDone. Created: ${created}, Skipped: ${skipped}`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();