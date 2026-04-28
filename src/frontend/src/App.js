import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import DormPage from './pages/DormPage.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Profile from './pages/Profile.js';
import Register from './pages/Register.js';
import Navbar from './components/Navbar.js';

function AppLayout() {
  const location = useLocation();
  const linkClass = (path) => `rounded-full px-4 py-2 text-sm font-medium transition ${location.pathname === path
    ? 'bg-ufOrange text-white shadow'
    : 'text-slate-700 hover:bg-blue-50 hover:text-ufBlue'
    }`;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-ufBlue">
            Gator<span className="text-ufOrange">Hall</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link className={linkClass('/')} to="/">Home</Link>
            <Link className={linkClass('/login')} to="/login">Login</Link>
            <Link className={linkClass('/register')} to="/register">Register</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dorms/:id" element={<DormPage />} />
          <Route path="/users/:id" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}


export default App;