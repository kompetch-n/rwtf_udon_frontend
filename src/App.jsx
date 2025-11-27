import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import RegisterRunner from './RegisterRunner';
import RunnerManagement from './RunnerManagement';
import RunnerSearch from './RunnerSearch';
import './App.css';

// Layout สำหรับ Admin
function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md p-4 flex justify-center space-x-6">
        <Link to="/admin" className="text-blue-600 font-semibold hover:text-blue-800">
          จัดการนักวิ่ง
        </Link>
        <Link to="/admin/register" className="text-blue-600 font-semibold hover:text-blue-800">
          ลงทะเบียนนักวิ่ง
        </Link>
      </nav>
      <div className="p-6">{children}</div>
    </div>
  );
}

// หน้า Password Gate
function AdminPasswordGate({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const ADMIN_PASSWORD = "1234"; // เปลี่ยนเป็นรหัสจริง
    if (password === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError("รหัสไม่ถูกต้อง");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">กรุณากรอกรหัสผู้ดูแล</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="รหัสผ่าน"
          className="w-full border border-gray-300 rounded-lg p-2 mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
};

function App() {
  const [adminAccess, setAdminAccess] = useState(false);

  return (
    <Router>
      <Routes>
        {/* หน้าแรกนักวิ่ง */}
        <Route path="/" element={<RunnerSearch />} />

        {/* หน้า Admin */}
        <Route
          path="/admin/*"
          element={
            adminAccess ? (
              <AdminLayout>
                <Routes>
                  <Route path="" element={<RunnerManagement />} />
                  <Route path="register" element={<RegisterRunner />} />
                </Routes>
              </AdminLayout>
            ) : (
              <AdminPasswordGate onSuccess={() => setAdminAccess(true)} />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
