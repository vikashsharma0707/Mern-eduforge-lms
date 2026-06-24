// import { useState, useEffect } from 'react';
// import { courseApi, categoryApi } from '../../services';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// export default function CreateCourse() {
//   const [form, setForm] = useState({ title: '', description: '', level: 'beginner', price: 0, language: 'English', isPublished: false });
//   const [cats, setCats] = useState([]);
//   const [file, setFile] = useState(null);
//   const navigate = useNavigate();
//   useEffect(() => { categoryApi.list().then(r => setCats(r.data)); }, []);

//   const submit = async (e) => {
//     e.preventDefault();
//     const fd = new FormData();
//     Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//     if (file) fd.append('thumbnail', file);
//     const r = await courseApi.create(fd);
//     toast.success('Course created');
//     navigate(`/teacher/courses/${r.data._id}/edit`);
//   };

//   return (
//     <div className="container page" style={{ maxWidth: 720 }}>
//       <h1>Create Course</h1>
//       <form onSubmit={submit}>
//         <label className="label">Title</label>
//         <input className="input" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
//         <label className="label">Description</label>
//         <textarea className="textarea" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
//         <div className="field-row">
//           <div><label className="label">Level</label>
//             <select className="select" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
//               <option>beginner</option><option>intermediate</option><option>advanced</option>
//             </select>
//           </div>
//           <div><label className="label">Price (₹)</label>
//             <input className="input" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
//           </div>
//         </div>
//         <label className="label">Category</label>
//         <select className="select" onChange={(e) => setForm({ ...form, category: e.target.value })}>
//           <option value="">— none —</option>
//           {cats.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
//         </select>
//         <label className="label">Thumbnail</label>
//         <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
//         <label className="label"><input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} /> Publish immediately</label>
//         <div style={{ height: 16 }} />
//         <button className="btn btn-primary">Create course</button>
//       </form>
//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { categoryApi, courseApi } from '../../services';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, BookOpen, DollarSign, Type, FileText, Eye, EyeOff, ChevronRight, AlertCircle } from 'lucide-react';

export default function CreateCourse() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    level: 'beginner',
    price: 0,
    language: 'English',
    category: '',
    isPublished: false
  });
  const [cats, setCats] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    categoryApi.list().then(r => setCats(r.data)).catch(() => setCats([]));
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = 'Course title is required';
    if (form.title.length < 5) newErrors.title = 'Title must be at least 5 characters';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (form.description.length < 20) newErrors.description = 'Description must be at least 20 characters';
    if (form.price < 0) newErrors.price = 'Price cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append('thumbnail', file);
      const r = await courseApi.create(fd);
      toast.success('🎉 Course created successfully!');
      navigate(`/teacher/courses/${r.data._id}/edit`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0e27] to-[#1a1f3a]">
      {/* Header */}
      <div className="border-b border-white/10 bg-[#0a0e27] px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl lg:text-5xl font-black text-white mb-2">
              Create <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">New Course</span>
            </h1>
            <p className="text-slate-400">Share your expertise with thousands of students worldwide</p>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-16">
        <motion.form
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={submit}
          className="space-y-6"
        >
          {/* Title */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-white mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Type className="w-4 h-4 text-blue-400" />
                Course Title
              </div>
            </label>
            <input
              type="text"
              required
              placeholder="e.g., Advanced React Patterns & Best Practices"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {errors.title && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">{form.title.length}/100 characters</p>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-white mb-3">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-purple-400" />
                Description
              </div>
            </label>
            <textarea
              rows={6}
              placeholder="Describe what students will learn in this course. Be clear and engaging!"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
            />
            {errors.description && (
              <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
                <AlertCircle className="w-4 h-4" />
                {errors.description}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-2">{form.description.length}/2000 characters</p>
          </motion.div>

          {/* Row: Level & Price */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-green-400" />
                  Level
                </div>
              </label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all cursor-pointer"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  Price (₹)
                </div>
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all"
              />
              {errors.price && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  {errors.price}
                </div>
              )}
            </div>
          </motion.div>

          {/* Row: Category & Language */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="">Select a category</option>
                {cats.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-3">
                Language
              </label>
              <select
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="w-full bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>
          </motion.div>

          {/* Thumbnail */}
          <motion.div variants={itemVariants}>
            <label className="block text-sm font-semibold text-white mb-3">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-pink-400" />
                Thumbnail Image
              </div>
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center cursor-pointer hover:border-white/40 transition-all">
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
                    <p className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </label>
              </div>
              {preview && (
                <div className="w-24 h-24">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border border-white/10"
                  />
                </div>
              )}
            </div>
          </motion.div>

          {/* Publish Toggle */}
          <motion.div variants={itemVariants}>
            <div className="bg-gradient-to-r from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.isPublished}
                    onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                    className="w-5 h-5 rounded accent-blue-500"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white flex items-center gap-2">
                    {form.isPublished ? (
                      <>
                        <Eye className="w-4 h-4 text-green-400" />
                        Publish immediately
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4 text-slate-400" />
                        Save as draft
                      </>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {form.isPublished
                      ? 'Your course will be visible to students right away'
                      : 'You can publish later after adding lessons'}
                  </p>
                </div>
              </label>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div variants={itemVariants} className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-700 text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Create Course
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-xs text-slate-400 text-center mt-3">
              You'll be able to add lessons after creating the course
            </p>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}