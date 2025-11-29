import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell,
  ResponsiveContainer, LabelList
} from "recharts";

export default function Dashboard() {
  const [runners, setRunners] = useState([]);
  const [filteredRunners, setFilteredRunners] = useState([]);
  const [loading, setLoading] = useState(true);

  // เก็บ filters ปัจจุบัน
  const [filters, setFilters] = useState({
    gender: null,
    distance: null,
    shirt_size: null
  });

  useEffect(() => {
    fetchRunners();
  }, []);

  const fetchRunners = async () => {
    try {
      const res = await axios.get("https://rwtf-udon-backend.vercel.app/runners");
      if (res.data?.data) {
        setRunners(res.data.data);
        setFilteredRunners(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching runners:", error);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชัน filter และ apply filter รวม
  const filterBy = (key, value) => {
    setFilters(prev => {
      const newFilters = { ...prev, [key]: prev[key] === value ? null : value }; // toggle filter
      applyFilters(newFilters);
      return newFilters;
    });
  };

  const applyFilters = (currentFilters) => {
    let filtered = runners;

    if (currentFilters.gender) filtered = filtered.filter(r => r.gender === currentFilters.gender);
    if (currentFilters.distance) filtered = filtered.filter(r => r.distance === currentFilters.distance);
    if (currentFilters.shirt_size) filtered = filtered.filter(r => r.shirt_size === currentFilters.shirt_size);

    setFilteredRunners(filtered);
  };

  const resetFilters = () => {
    setFilters({ gender: null, distance: null, shirt_size: null });
    setFilteredRunners(runners);
  };

  const totalRunners = runners.length;
  const vipCount = runners.filter(r => r.vip).length;

  // สำหรับ charts
  const genderData = [
    { name: "ชาย", value: runners.filter(r => r.gender === "ชาย").length },
    { name: "หญิง", value: runners.filter(r => r.gender === "หญิง").length },
    { name: "อื่น ๆ", value: runners.filter(r => r.gender === "อื่น ๆ").length },
  ];

  const distanceData = [
    { name: "5.1 กม.", value: runners.filter(r => r.distance === "5.1").length },
    { name: "10.5 กม.", value: runners.filter(r => r.distance === "10.5").length },
  ];

  const shirtData = [
    { name: "3S", value: runners.filter(r => r.shirt_size === "3S").length },
    { name: "2S", value: runners.filter(r => r.shirt_size === "2S").length },
    { name: "S", value: runners.filter(r => r.shirt_size === "S").length },
    { name: "M", value: runners.filter(r => r.shirt_size === "M").length },
    { name: "L", value: runners.filter(r => r.shirt_size === "L").length },
    { name: "XL", value: runners.filter(r => r.shirt_size === "XL").length },
    { name: "2XL", value: runners.filter(r => r.shirt_size === "2XL").length },
    { name: "3XL", value: runners.filter(r => r.shirt_size === "3XL").length },
    { name: "4XL", value: runners.filter(r => r.shirt_size === "4XL").length },
    { name: "5XL", value: runners.filter(r => r.shirt_size === "5XL").length },
    { name: "6XL", value: runners.filter(r => r.shirt_size === "6XL").length },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard - ข้อมูลผู้ลงทะเบียน</h1>

      {loading ? <p className="text-gray-600">Loading...</p> : (
        <>
          {/* สรุปข้อมูล */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
              <p className="text-gray-500">ผู้ลงทะเบียนทั้งหมด</p>
              <p className="text-2xl font-bold text-blue-600">{totalRunners}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
              <p className="text-gray-500">VIP</p>
              <p className="text-2xl font-bold text-green-600">{vipCount}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
              <p className="text-gray-500">จำนวนหลัง filter</p>
              <p className="text-2xl font-bold text-purple-600">{filteredRunners.length}</p>
            </div>
          </div>

          {/* Filters ปัจจุบัน + ปุ่ม Reset */}
          <div className="mb-4 p-4 bg-white shadow rounded-lg flex items-center justify-between">
            <div>
              <span className="mr-4">Filters ปัจจุบัน:</span>
              <span className="text-blue-600 mr-2">เพศ: {filters.gender || "ทั้งหมด"}</span>
              <span className="text-green-600 mr-2">ระยะทาง: {filters.distance || "ทั้งหมด"}</span>
              <span className="text-yellow-600">Size: {filters.shirt_size || "ทั้งหมด"}</span>
            </div>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Pie Chart เพศ */}
            <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4">จำนวนผู้ลงทะเบียนตามเพศ</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={genderData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}`}
                    onClick={(data) => filterBy('gender', data.name)}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart ระยะทาง */}
            <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4">จำนวนผู้ลงทะเบียนตามระยะทาง</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={distanceData}
                  margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                  onClick={(e) => e?.activeLabel && filterBy('distance', e.activeLabel.split(' ')[0])}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} domain={[0, 'dataMax + 2']} />
                  <Tooltip />
                  {/* <Legend /> */}
                  <Bar dataKey="value" fill="#82ca9d">
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart ขนาดเสื้อ */}
            <div className="bg-white shadow rounded-lg p-4 md:col-span-2 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4">จำนวนผู้ลงทะเบียนตามขนาดเสื้อ</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={shirtData}
                  margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
                  onClick={(e) => e?.activeLabel && filterBy('shirt_size', e.activeLabel)}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} domain={[0, 'dataMax + 2']} />
                  <Tooltip />
                  {/* <Legend /> */}
                  <Bar dataKey="value" fill="#ffc658">
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ตารางข้อมูล */}
          <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
            <h2 className="text-xl font-semibold mb-4">รายชื่อผู้ลงทะเบียน</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ชื่อ</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">เบอร์</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">เพศ</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">VIP</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ระยะทาง</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Size เสื้อ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRunners.map((r) => (
                    <tr key={r._id} className="hover:bg-gray-100">
                      <td className="px-4 py-2">{r.full_name}</td>
                      <td className="px-4 py-2">{r.phone}</td>
                      <td className="px-4 py-2">{r.gender}</td>
                      <td className="px-4 py-2">{r.vip ? "ใช่" : "ไม่ใช่"}</td>
                      <td className="px-4 py-2">{r.distance} กม.</td>
                      <td className="px-4 py-2">{r.shirt_size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
