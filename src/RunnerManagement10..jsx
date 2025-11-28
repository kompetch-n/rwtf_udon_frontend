import React, { useState, useEffect } from "react";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { FaTshirt, FaClipboardCheck, FaHospital, FaPills } from "react-icons/fa";

const MOCK_AVATAR = "/runner_profile.png"; // รูป mockup avatar

function RunnerManagement() {
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRunner, setEditRunner] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmBib, setConfirmBib] = useState("");
  const [saving, setSaving] = useState(false);

  // -----------------------------
  // Fetch all runners
  // -----------------------------
  const fetchRunners = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://rwtf-udon-backend.vercel.app/runners");
      const data = await res.json();
      setRunners(data.data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRunners();
  }, []);

  // -----------------------------
  // Handle form change
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  // -----------------------------
  // Update runner
  // -----------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editRunner) return;
    if (!window.confirm("คุณแน่ใจว่าจะบันทึกการแก้ไขใช่หรือไม่?")) return;

    setSaving(true); // ⭐ เริ่มโหลด

    const formData = new FormData();
    for (const key in form) {
      if (key === "file") continue;
      formData.append(
        key,
        typeof form[key] === "boolean" ? (form[key] ? "true" : "false") : form[key]
      );
    }
    if (file) formData.append("file", file);

    try {
      await fetch(
        `https://rwtf-udon-backend.vercel.app/runner/${editRunner._id}`,
        { method: "PUT", body: formData }
      );
      fetchRunners();
      setEditRunner(null);
      setForm({});
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    }

    setSaving(false); // ⭐ หยุดโหลด
  };

  // -----------------------------
  // Delete runner
  // -----------------------------
  const handleDelete = async (runner) => {
    const inputBib = prompt(`กรุณากรอกเลข BIB ของนักวิ่ง ${runner.full_name} เพื่อยืนยันการลบข้อมูล`);
    if (!inputBib) return; // ถ้า cancel หรือไม่กรอก
    if (inputBib !== runner.bib) {
      alert("เลข BIB ไม่ตรง ไม่สามารถลบข้อมูลได้");
      return;
    }

    if (!window.confirm("คุณแน่ใจว่าจะลบข้อมูลนี้ใช่หรือไม่?")) return;

    try {
      await fetch(`https://rwtf-udon-backend.vercel.app/runner/${runner._id}`, { method: "DELETE" });
      fetchRunners();
      setEditRunner(null);
      setForm({});
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
    }
  };

  // -----------------------------
  // Edit runner
  // -----------------------------
  const handleEdit = (runner) => {
    setEditRunner(runner);
    setForm({ ...runner });
    setPreview(runner.image_url || null);
  };

  // -----------------------------
  // Filter runners
  // -----------------------------
  const filteredRunners = runners.filter(
    (r) =>
      r.full_name.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
  );

  const fields = [
    { label: "ชื่อ - นามสกุล", key: "full_name" },
    { label: "เบอร์โทร", key: "phone" },
    { label: "เลขบัตรประจำตัวประชาชน", key: "citizen_id" },
    { label: "BIB", key: "bib" },
    { label: "ขนาดเสื้อ", key: "shirt_size" },
    { label: "ระยะทางวิ่ง", key: "distance" },
    { label: "รางวัลที่ได้รับ", key: "reward" }
  ];

  const medicalFields = [
    { label: "โรคประจำตัว", key: "medical_condition" },
    { label: "ยาที่พกติดตัว", key: "medications" },
    { label: "หมายเหตุ", key: "note" }
  ];


  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-700">จัดการนักวิ่ง</h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="ค้นหาชื่อหรือเบอร์โทร"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 rounded-full p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>

      {/* Runners Grid */}
      {loading ? (
        <p className="text-center text-gray-500">กำลังโหลดข้อมูล...</p>
      ) : filteredRunners.length === 0 ? (
        <p className="text-center text-gray-500">ไม่พบข้อมูล</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRunners.map((runner) => (
            <div
              key={runner._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition cursor-pointer overflow-hidden p-4 flex flex-col items-center relative"
              onClick={() => handleEdit(runner)}
            >
              {/* Avatar */}
              <img
                src={runner.image_url || MOCK_AVATAR}
                alt={runner.full_name}
                className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 shadow-md mb-4"
              />

              {/* Name */}
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{runner.full_name}</h3>

              {/* Phone / BIB / Size */}
              <p className="text-gray-600 text-sm">โทร: {runner.phone}</p>
              <p className="text-gray-600 text-sm">BIB: {runner.bib}</p>
              <p className="text-gray-600 text-sm">Size: {runner.shirt_size}</p>
              <p className="text-gray-600 text-sm">Distance: {runner.distance}</p>

              {/* Reward */}
              {/* <p className="text-gray-600 text-sm mt-1">Reward: {runner.reward}</p> */}

              {/* Status Icons */}
              <div className="flex space-x-4 mt-3">
                {/* Shirt Status */}
                <span title={runner.shirt_status ? "รับเสื้อแล้ว" : "ยังไม่รับเสื้อ"}>
                  <FaTshirt className={`w-6 h-6 ${runner.shirt_status ? "text-blue-500" : "text-gray-400"}`} />
                </span>

                {/* Registration Status */}
                <span title={runner.registration_status ? "ลงทะเบียนแล้ว" : "ยังไม่ลงทะเบียน"}>
                  <FaClipboardCheck className={`w-6 h-6 ${runner.registration_status ? "text-green-500" : "text-gray-400"}`} />
                </span>

                {/* Health Package */}
                {/* <span title={runner.health_package ? "มี Health Package" : "ไม่มี Health Package"}>
                  <FaHospital className={`w-6 h-6 ${runner.health_package ? "text-green-500" : "text-gray-400"}`} />
                </span> */}

                {/* Medical Condition */}
                {runner.medical_condition &&
                  runner.medical_condition.trim() !== "" &&
                  runner.medical_condition.trim() !== "ไม่มี" &&
                  runner.medical_condition.trim() !== "-" && (
                    <span title={`มีโรคประจำตัว: ${runner.medical_condition}`}>
                      <FaPills className="w-6 h-6 text-red-500" />
                    </span>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Form Modal */}
      {editRunner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-auto z-50 pt-12">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl p-6 animate-slideIn">
            {/* Profile Image */}
            <div className="flex justify-center mb-4">
              {/* Wrapper for profile + icon */}
              <div className="relative w-32 h-32">
                {/* Profile Picture */}
                <img
                  src={preview || editRunner.image_url || MOCK_AVATAR}
                  alt={editRunner.full_name}
                  className="w-32 h-32 object-cover rounded-full border-4 border-gray-300 shadow-lg cursor-pointer"
                  onClick={() => document.getElementById("fileInput").click()}
                />

                {/* Camera Icon Box (Subtle) */}
                <div
                  className="absolute bottom-1 right-1 bg-gray-300 w-7 h-7 flex items-center justify-center rounded-full border border-white shadow-sm cursor-pointer hover:bg-gray-400 transition"
                  onClick={() => document.getElementById("fileInput").click()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l2-3h4l2 3h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V10a2 2 0 012-2z"
                    />
                    <circle cx="12" cy="14" r="3" stroke="gray" strokeWidth={2} />
                  </svg>
                </div>
              </div>

              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Header */}
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
              แก้ไขข้อมูล: {editRunner.full_name}
            </h3>

            {/* Form */}
            <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
              {/* Personal Info */}
              <div className="grid grid-cols-2 gap-4">
                {fields.map((f) => {
                  // ให้ citizen_id เป็นแถวเต็ม
                  if (f.key === "citizen_id") {
                    return (
                      <div key={f.key} className="flex flex-col col-span-2">
                        <label className="text-gray-700 font-medium mb-1">{f.label}</label>
                        <input
                          name={f.key}
                          value={form[f.key] || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg p-2 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                      </div>
                    );
                  }

                  // field อื่น ๆ แสดงเป็น 2 คอลัมน์
                  return (
                    <div key={f.key} className="flex flex-col">
                      <label className="text-gray-700 font-medium mb-1">{f.label}</label>
                      <input
                        name={f.key}
                        value={form[f.key] || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-2 
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  );
                })}
              </div>

              {/* Medical Info */}
              <div className="grid grid-cols-1 gap-2">
                {medicalFields.map((f) => (
                  <div key={f.key} className="flex flex-col">
                    <label className="text-gray-700 font-medium mb-1">{f.label}</label>
                    <textarea
                      name={f.key}
                      value={form[f.key] || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                      rows={f.key === "note" ? 3 : 2}
                    />
                  </div>
                ))}
              </div>

              {/* Checkbox group */}
              <div className="flex flex-wrap gap-4 mt-2">
                {/* <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="shirt_status"
                    checked={form.shirt_status || false}
                    onChange={handleChange}
                    className="accent-blue-500"
                  />
                  <span className="text-gray-700 font-medium">รับเสื้อแล้ว</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="registration_status"
                    checked={form.registration_status || false}
                    onChange={handleChange}
                    className="accent-purple-500"
                  />
                  <span className="text-gray-700 font-medium">ลงทะเบียนแล้ว</span>
                </label> */}

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="health_package"
                    checked={form.health_package || false}
                    onChange={handleChange}
                    className="accent-orange-500"
                  />
                  <span className="text-gray-700 font-medium">มี Health Package</span>
                </label>
              </div>

              {/* Checkbox as Large Icon Buttons */}
              <div className="flex justify-center gap-10 mt-4">
                {/* Shirt Status */}
                <div
                  className={`flex flex-col items-center cursor-pointer transition-transform ${form.shirt_status ? "scale-110" : ""
                    }`}
                  onClick={() =>
                    setForm({ ...form, shirt_status: !form.shirt_status })
                  }
                >
                  <FaTshirt
                    className={`w-14 h-14 ${form.shirt_status ? "text-blue-500" : "text-gray-300"
                      }`}
                  />
                  <span className="text-gray-700 mt-1 font-medium text-sm">
                    รับเสื้อแล้ว
                  </span>
                </div>

                {/* Registration Status */}
                <div
                  className={`flex flex-col items-center cursor-pointer transition-transform ${form.registration_status ? "scale-110" : ""
                    }`}
                  onClick={() =>
                    setForm({ ...form, registration_status: !form.registration_status })
                  }
                >
                  <FaClipboardCheck
                    className={`w-14 h-14 ${form.registration_status ? "text-green-500" : "text-gray-300"
                      }`}
                  />
                  <span className="text-gray-700 mt-1 font-medium text-sm">
                    ลงทะเบียนแล้ว
                  </span>
                </div>
              </div>

              {/* File Upload */}
              {/* <div className="mt-2 flex flex-col items-center">
                <label className="text-gray-700 font-medium mb-1">อัปโหลดรูปโปรไฟล์</label>
                <input type="file" onChange={handleFileChange} className="w-full" />
              </div> */}

              {/* Action Buttons */}
              <div className="mt-6">
                {/* Save + Cancel (บนแถวเดียวกัน) */}
                <div className="flex justify-between gap-3">
                  <button
                    type="submit"
                    disabled={saving}
                    className={`flex-1 text-white py-2 px-4 rounded-lg shadow-md transition 
                    ${saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
                  >
                    {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditRunner(null);
                      setForm({});
                      setFile(null);
                      setPreview(null);
                    }}
                    className="flex-1 bg-gray-400 text-white py-2 px-4 rounded-lg hover:bg-gray-500 transition shadow-md"
                  >
                    ยกเลิก
                  </button>
                </div>

                {/* Delete Button (อยู่ล่าง, ไอคอนถังขยะ) */}
                <button
                  type="button"
                  onClick={() => handleDelete(editRunner)}
                  className="w-full mt-4 flex items-center justify-center gap-2 text-red-500 hover:text-red-700 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  <span className="text-sm">ลบข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default RunnerManagement;
