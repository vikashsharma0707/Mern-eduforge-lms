// const Category = require('../models/Category');
// const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');

// exports.list = async (_req, res) => res.json(await Category.find().sort({ name: 1 }));
// exports.create = async (req, res) => {
//   const data = { ...req.body, slug: slugify(req.body.name) };
//   res.status(201).json(await Category.create(data));
// };
// exports.update = async (req, res) =>
//   res.json(await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }));
// exports.remove = async (req, res) => {
//   await Category.findByIdAndDelete(req.params.id);
//   res.json({ message: 'Deleted' });
// };



// const Category = require('../models/Category');

// const slugify = (s) =>
//   s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80);

// // GET /api/categories — public, used by CreateCourse dropdown
// exports.list = async (req, res) => {
//   try {
//     const categories = await Category.find({ isActive: true }).sort({ name: 1 });
//     res.json(categories);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// exports.get = async (req, res) => {
//   try {
//     const cat = await Category.findById(req.params.id);
//     if (!cat) return res.status(404).json({ message: 'Category not found' });
//     res.json(cat);
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// // POST /api/categories — admin only
// exports.create = async (req, res) => {
//   try {
//     const { name, description, icon } = req.body;
//     if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });

//     const slug = slugify(name);
//     const existing = await Category.findOne({ slug });
//     if (existing) return res.status(409).json({ message: 'Category already exists' });

//     const cat = await Category.create({ name: name.trim(), slug, description, icon });
//     res.status(201).json(cat);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // PUT /api/categories/:id — admin only
// exports.update = async (req, res) => {
//   try {
//     const cat = await Category.findById(req.params.id);
//     if (!cat) return res.status(404).json({ message: 'Category not found' });

//     const { name, description, icon, isActive } = req.body;
//     if (name) { cat.name = name.trim(); cat.slug = slugify(name); }
//     if (description !== undefined) cat.description = description;
//     if (icon !== undefined) cat.icon = icon;
//     if (isActive !== undefined) cat.isActive = isActive;

//     await cat.save();
//     res.json(cat);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // DELETE /api/categories/:id — admin only
// exports.remove = async (req, res) => {
//   try {
//     await Category.findByIdAndDelete(req.params.id);
//     res.json({ message: 'Category deleted' });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };





const Category = require('../models/Category');

const slugify = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);

// GET /api/categories — public
exports.list = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/categories/:id
exports.get = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/categories — Admin only
exports.create = async (req, res) => {
  try {
    const { name, description, icon } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const slug = slugify(name);
    const existing = await Category.findOne({ slug });

    if (existing) {
      return res.status(409).json({ message: 'Category with this name already exists' });
    }

    const cat = await Category.create({
      name: name.trim(),
      slug,
      description: description?.trim() || '',
      icon: icon || null,
      isActive: true,
    });

    res.status(201).json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/categories/:id — Admin only
exports.update = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    const { name, description, icon, isActive } = req.body;

    if (name) {
      cat.name = name.trim();
      cat.slug = slugify(name);
    }
    if (description !== undefined) cat.description = description?.trim() || '';
    if (icon !== undefined) cat.icon = icon;
    if (isActive !== undefined) cat.isActive = isActive;

    await cat.save();
    res.json(cat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/categories/:id — Admin only
exports.remove = async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};