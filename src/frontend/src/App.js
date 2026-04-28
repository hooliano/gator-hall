import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DormPage from './pages/DormPage.js';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Profile from './pages/Profile.js';
import Register from './pages/Register.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dorms/:id" element={<DormPage />} />
        <Route path="/profild" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;