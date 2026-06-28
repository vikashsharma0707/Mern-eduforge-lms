// const mongoose = require('mongoose');

// const courseSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true },
//     slug: { type: String, required: true, unique: true, lowercase: true },
//     description: { type: String, default: '' },
//     thumbnail: { type: String, default: '' },
//     promoVideo: { type: String, default: '' },
//     teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
//     level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
//     language: { type: String, default: 'English' },
//     price: { type: Number, default: 0 },
//     discountPrice: { type: Number, default: 0 },
//     isPublished: { type: Boolean, default: false },
//     tags: [String],
//     requirements: [String],
//     whatYouLearn: [String],
//     ratingAvg: { type: Number, default: 0 },
//     ratingCount: { type: Number, default: 0 },
//     enrollmentCount: { type: Number, default: 0 },
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model('Course', courseSchema);




const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title:           { type: String, required: true, trim: true },
    slug:            { type: String, required: true, unique: true, lowercase: true },
    description:     { type: String, default: '' },
    thumbnail:       { type: String, default: '' },
    promoVideo:      { type: String, default: '' },
    teacher:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category:        { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
    level:           { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    language:        { type: String, default: 'English' },
    price:           { type: Number, default: 0 },
    discountPrice:   { type: Number, default: 0 },
    isPublished:     { type: Boolean, default: false },
    tags:            [String],
    requirements:    [String],
    whatYouLearn:    [String],
    ratingAvg:       { type: Number, default: 0 },
    ratingCount:     { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);