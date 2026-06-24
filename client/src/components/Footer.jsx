// export default function Footer() {
//   return (
//     <footer className="footer">
//       <div className="container footer-grid">
//         <div>
//           <div className="brand">Edu<span>Forge</span></div>
//           <p className="muted">AI-powered learning, built for India.</p>
//         </div>
//         <div>
//           <h4>Learn</h4>
//           <ul><li>Courses</li><li>Roadmaps</li><li>Certifications</li></ul>
//         </div>
//         <div>
//           <h4>Company</h4>
//           <ul><li>About</li><li>Careers</li><li>Contact</li></ul>
//         </div>
//         <div>
//           <h4>Legal</h4>
//           <ul><li>Privacy</li><li>Terms</li><li>Refunds</li></ul>
//         </div>
//       </div>
//       <div className="container copyright">© {new Date().getFullYear()} EduForge LMS</div>
//     </footer>
//   );
// }




import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-slate-800 bg-slate-950 text-white overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />
      <div className="absolute right-0 bottom-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 py-16">
        {/* Top */}
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Edu<span className="text-violet-400">Forge</span>
            </h2>

            <p className="mt-4 max-w-md text-slate-400 leading-relaxed">
              AI-Powered Learning Operating System for students,
              professionals and creators. Learn faster with AI Tutors,
              Coding Mentors, Career Roadmaps, PDF Chat and expert-led courses.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
                50K+ Students
              </span>

              <span className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
                500+ Courses
              </span>

              <span className="rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
                AI Powered
              </span>
            </div>
          </div>

          {/* Learn */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Learn</h3>

            <ul className="space-y-3 text-slate-400">
              <li><Link to="/courses" className="hover:text-white">Courses</Link></li>
              <li><Link to="/roadmaps" className="hover:text-white">Roadmaps</Link></li>
              <li><Link to="/certificates" className="hover:text-white">Certificates</Link></li>
              <li><Link to="/assignments" className="hover:text-white">Assignments</Link></li>
              <li><Link to="/quizzes" className="hover:text-white">Quizzes</Link></li>
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h3 className="mb-4 font-semibold text-white">AI Tools</h3>

            <ul className="space-y-3 text-slate-400">
              <li>AI Tutor</li>
              <li>PDF Chat</li>
              <li>Quiz Generator</li>
              <li>Resume Builder</li>
              <li>Coding Mentor</li>
              <li>Interview Coach</li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-4 font-semibold text-white">Company</h3>

            <ul className="space-y-3 text-slate-400">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-14 grid grid-cols-2 gap-6 rounded-2xl border border-slate-800 bg-slate-900/50 p-8 md:grid-cols-4">
          <div className="text-center">
            <h4 className="text-3xl font-bold">50K+</h4>
            <p className="mt-1 text-sm text-slate-500">Students</p>
          </div>

          <div className="text-center">
            <h4 className="text-3xl font-bold">500+</h4>
            <p className="mt-1 text-sm text-slate-500">Courses</p>
          </div>

          <div className="text-center">
            <h4 className="text-3xl font-bold">1M+</h4>
            <p className="mt-1 text-sm text-slate-500">AI Queries</p>
          </div>

          <div className="text-center">
            <h4 className="text-3xl font-bold">95%</h4>
            <p className="mt-1 text-sm text-slate-500">Completion Rate</p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-3xl border border-slate-800 bg-gradient-to-r from-violet-600/10 to-cyan-500/10 p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                Stay Updated with AI Learning
              </h3>
              <p className="mt-2 text-slate-400">
                Get updates about new courses, AI tools and learning resources.
              </p>
            </div>

            <div className="flex w-full max-w-md gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-violet-500"
              />

              <button className="rounded-xl bg-violet-600 px-5 py-3 font-medium transition hover:bg-violet-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-800 pt-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} EduForge. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-6">
            <Link to="/privacy" className="hover:text-white">
              Privacy
            </Link>

            <Link to="/terms" className="hover:text-white">
              Terms
            </Link>

            <Link to="/refunds" className="hover:text-white">
              Refund Policy
            </Link>

            <Link to="/contact" className="hover:text-white">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}