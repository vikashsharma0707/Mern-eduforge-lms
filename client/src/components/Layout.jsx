// import { Outlet } from 'react-router-dom';
// import Navbar from './Navbar.jsx';
// import Footer from './Footer.jsx';

// export default function Layout() {
//   return (
//     <div className="app-shell">
//       <Navbar />
//       <main className="app-main">
//         <Outlet />
//       </main>
//       <Footer />
//     </div>
//   );
// }




// ✅ LAYOUT.JSX - Complete & Responsive

import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#0a0e27', color: '#fff' }}>
      
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}