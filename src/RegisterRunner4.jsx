import React, { useState } from "react";

function RegisterRunner() {
  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    citizen_id: "",
    reward: "",
    distance: "",
    shirt_size: "",
    shirt_status: "",
    bib: "",
    health_package: false,
    hospital: "",
    medications: "",
    note: "",
    registration_status: false,
    age: "",
    gender: "",
    vip: false,
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ ตรวจสอบขนาดไฟล์ก่อนส่ง
    if (file && file.size > 5 * 1024 * 1024) {
      alert("ไฟล์ใหญ่เกิน 5MB กรุณาเลือกไฟล์ขนาดเล็กกว่า");
      return;
    }

    setLoading(true);
    setResult(null);

    const formData = new FormData();
    for (const key in form) {
      if (typeof form[key] === "boolean") {
        formData.append(key, form[key] ? "true" : "false");
      } else {
        formData.append(key, form[key]);
      }
    }
    if (file) formData.append("file", file);

    try {
      const res = await fetch(
        "https://rwtf-udon-backend.vercel.app/register-runner",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.error("HTTP error:", res.status, text);
        alert(`เกิดข้อผิดพลาด HTTP: ${res.status}`);
        return;
      }

      const data = await res.json();
      console.log("API response:", data);

      setResult(data);

      // ล้างฟอร์ม
      setForm({
        full_name: "",
        phone: "",
        citizen_id: "",
        reward: "",
        distance: "",
        shirt_size: "",
        shirt_status: false,
        bib: "",
        health_package: false,
        hospital: "",
        medications: "",
        note: "",
        registration_status: false,
        age: "",
        gender: "",
        vip: false,
      });
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
        ลงทะเบียนนักวิ่ง
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {/* ฟอร์มปกติ */}
        <input
          name="full_name"
          placeholder="ชื่อ - นามสกุล"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="เบอร์โทร"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
        <input
          name="citizen_id"
          placeholder="เลขบัตรประชาชน"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
        <input
          name="age"
          type="number"
          placeholder="อายุ"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
        <select
          name="gender"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        >
          <option value="">-- เลือกเพศ --</option>
          <option value="ชาย">ชาย</option>
          <option value="หญิง">หญิง</option>
          <option value="อื่น ๆ">อื่น ๆ</option>
        </select>
        <input
          name="reward"
          placeholder="รางวัลที่ได้รับ"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
        <input
          name="distance"
          placeholder="ระยะทางที่วิ่ง (กม.)"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
        <input
          name="shirt_size"
          placeholder="Size เสื้อ (S / M / L / XL)"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
        <input
          name="bib"
          placeholder="เบอร์เสื้อ (BIB)"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              name="shirt_status"
              checked={form.shirt_status}
              onChange={handleChange}
            />
            รับเสื้อแล้ว
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              name="registration_status"
              checked={form.registration_status || false}
              onChange={(e) =>
                setForm({ ...form, registration_status: e.target.checked })
              }
            />
            สถานะลงทะเบียน
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input
              type="checkbox"
              name="health_package"
              onChange={handleChange}
            />
            ซื้อแพ็กเกจตรวจสุขภาพ
          </label>
          <label className="flex items-center gap-2 text-gray-700">
            <input type="checkbox" name="vip" checked={form.vip} onChange={handleChange} />
            VIP
          </label>
        </div>

        <input
          name="medical_condition"
          placeholder="โรคประจำตัว"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
        <input
          name="medications"
          placeholder="ยาส่วนตัวที่ต้องพกติดตัว"
          className="w-full border rounded-lg p-2"
          onChange={handleChange}
        />
        <textarea
          name="note"
          placeholder="หมายเหตุ"
          className="w-full border rounded-lg p-2 h-24"
          onChange={handleChange}
        ></textarea>

        {/* Upload Image */}
        <div className="mt-2">
          <label className="font-medium text-gray-700">อัปโหลดรูปภาพ</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2"
          />
          {preview && (
            <img src={preview} className="mt-3 w-48 mx-auto rounded-lg shadow" />
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </div>

      {result && result.data && result.data.image_url && (
        <div className="mt-6 p-4 bg-green-100 rounded-lg text-center">
          <p className="font-bold text-green-700">บันทึกสำเร็จ!</p>
          <a
            href={result.data.image_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            ดูรูปภาพที่อัปโหลด
          </a>
        </div>
      )}
    </div>
  );
}

export default RegisterRunner;
