import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRunners();
  }, []);

  const fetchRunners = async () => {
    try {
      const res = await axios.get("https://rwtf-udon-backend.vercel.app/runners");
      if (res.data?.data) {
        setRunners(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching runners:", error);
    } finally {
      setLoading(false);
    }
  };

  // สรุปจำนวนผู้ลงทะเบียน
  const totalRunners = runners.length;
  const vipCount = runners.filter(r => r.vip).length;
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
    { name: "S", value: runners.filter(r => r.shirt_size === "S").length },
    { name: "M", value: runners.filter(r => r.shirt_size === "M").length },
    { name: "L", value: runners.filter(r => r.shirt_size === "L").length },
    { name: "XL", value: runners.filter(r => r.shirt_size === "XL").length },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard - ข้อมูลผู้ลงทะเบียน</h1>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : (
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
          </div>

          {/* กราฟ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                    label
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

            <div className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4">จำนวนผู้ลงทะเบียนตามระยะทาง</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={distanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white shadow rounded-lg p-4 md:col-span-2 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-4">จำนวนผู้ลงทะเบียนตามขนาดเสื้อ</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={shirtData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#ffc658" />
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
                  {runners.map((r) => (
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
