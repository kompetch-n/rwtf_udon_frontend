import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
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

function App() {
  return (
    <Router>
      <Routes>
        {/* หน้าแรกนักวิ่ง */}
        <Route path="/" element={<RunnerSearch />} />

        {/* หน้า Admin */}
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="" element={<RunnerManagement />} />
                <Route path="register" element={<RegisterRunner />} />
              </Routes>
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
