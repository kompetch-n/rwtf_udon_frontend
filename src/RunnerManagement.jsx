import React, { useState, useEffect } from "react";

function RunnerManagement() {
  const [runners, setRunners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editRunner, setEditRunner] = useState(null);
  const [form, setForm] = useState({});
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");

  // -----------------------------
  // Fetch all runners
  // -----------------------------
  const fetchRunners = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/runners");
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

  // --- Confirm before submitting ---
  const confirmed = window.confirm("คุณแน่ใจว่าจะบันทึกการแก้ไขใช่หรือไม่?");
  if (!confirmed) return;

  const formData = new FormData();
  for (const key in form) {
    if (key === "file") continue;
    if (typeof form[key] === "boolean") {
      formData.append(key, form[key] ? "true" : "false");
    } else {
      formData.append(key, form[key]);
    }
  }
  if (file) formData.append("file", file);

  try {
    const res = await fetch(`http://localhost:8000/runner/${editRunner._id}`, {
      method: "PUT",
      body: formData,
    });
    const data = await res.json();
    console.log(data);
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
  // Delete runner
  // -----------------------------
  const handleDelete = async (id) => {
    if (!window.confirm("ต้องการลบข้อมูลใช่หรือไม่?")) return;
    try {
      await fetch(`http://localhost:8000/runner/${id}`, { method: "DELETE" });
      fetchRunners();
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-4xl font-bold mb-6 text-center text-gray-700">
        จัดการนักวิ่ง
      </h2>

      {/* Search Bar */}
      <div className="flex justify-center mb-8">
        <input
          type="text"
          placeholder="ค้นหาชื่อหรือเบอร์โทร"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border rounded-full p-3 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition cursor-pointer"
            >
              {runner.image_url && (
                <img
                  src={runner.image_url}
                  alt={runner.full_name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 space-y-1">
                <h3 className="text-xl font-semibold text-gray-800">{runner.full_name}</h3>
                <p className="text-gray-600">โทร: {runner.phone}</p>
                <p className="text-gray-600">BIB: {runner.bib}</p>
                <p className="text-gray-600">Size: {runner.shirt_size}</p>
                <p className="text-gray-600">Reward: {runner.reward}</p>
                <p className="text-gray-600">Distance: {runner.distance}</p>
                <p className="text-gray-600">Shirt Status: {runner.shirt_status ? "รับแล้ว" : "ยังไม่รับ"}</p>
                <p className="text-gray-600">Health Package: {runner.health_package ? "มี" : "ไม่มี"}</p>
                <p className="text-gray-600">Medical Condition: {runner.medical_condition}</p>
                <p className="text-gray-600">Medications: {runner.medications}</p>
                <p className="text-gray-600">Note: {runner.note}</p>
                <div className="mt-4 flex justify-between">
                  <button
                    onClick={() => handleEdit(runner)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(runner._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Form Modal */}
      {editRunner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start overflow-auto z-50 pt-20">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <h3 className="text-2xl font-semibold mb-4">แก้ไขข้อมูล: {editRunner.full_name}</h3>
            <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-3">
              {[
                "full_name", "phone", "citizen_id", "reward", "distance",
                "shirt_size", "bib", "medical_condition", "medications", "note"
              ].map((field) => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.replace("_", " ")}
                  value={form[field] || ""}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
                />
              ))}

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="shirt_status"
                    checked={form.shirt_status || false}
                    onChange={handleChange}
                  />
                  <span>รับเสื้อแล้ว</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="health_package"
                    checked={form.health_package || false}
                    onChange={handleChange}
                  />
                  <span>มี Health Package</span>
                </label>
              </div>

              <input type="file" onChange={handleFileChange} className="mt-2" />
              {preview && (
                <img
                  src={preview}
                  className="mt-2 w-32 h-32 object-cover rounded mx-auto"
                  alt="Preview"
                />
              )}

              <button
                type="submit"
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mt-2"
              >
                บันทึกการแก้ไข
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditRunner(null);
                  setForm({});
                  setFile(null);
                  setPreview(null);
                }}
                className="mt-2 text-gray-600 hover:text-gray-800"
              >
                ยกเลิก
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RunnerManagement;
