import { useState } from "react";
import { FaGlobe } from "react-icons/fa"; // ไอคอนโลกจาก react-icons

function RunnerSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState("th"); // th = ไทย, en = อังกฤษ

  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(`https://rwtf-udon-backend.vercel.app/runners`);
      const data = await res.json();
      const matched = data.data.find(
        (runner) =>
          runner.full_name.toLowerCase().includes(query.toLowerCase()) ||
          runner.citizen_id.includes(query)
      );
      setResult(matched || { notFound: true });
    } catch (err) {
      console.error(err);
    }
  };

  // ข้อความสลับภาษา
  const text = {
    th: {
      title: "ค้นหาเลขเสื้อของคุณ",
      placeholder: "กรอกชื่อหรือเลขบัตรประชาชน",
      search: "ค้นหา",
      notFound: "ไม่พบข้อมูลนักวิ่ง",
      name: "ชื่อ",
      bib: "BIB",
      distance: "ระยะทาง",
      shirt_size: "ขนาดเสื้อ"
    },
    en: {
      title: "Find Your BIB Number",
      placeholder: "Enter Name or Citizen ID",
      search: "Search",
      notFound: "Runner not found",
      name: "Name",
      bib: "BIB",
      distance: "Distance",
      shirt_size: "Shirt Size"
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10 relative">
      {/* Language Switch */}
      <button
        onClick={() => setLang(lang === "th" ? "en" : "th")}
        className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow-md"
        title="Switch Language"
      >
        <FaGlobe className="text-gray-700" />
      </button>

      {/* --- LOGO ด้านบน --- */}
      <div className="flex justify-center mb-6 mt-2">
        <img
          src="/rwtf_logo.svg"
          alt="logo"
          className="h-36 object-contain drop-shadow-lg"
        />
      </div>

      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
        {text[lang].title}
      </h2>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder={text[lang].placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
        >
          {text[lang].search}
        </button>
      </div>

      {result && (
        <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-xl border border-blue-200">
          {result.notFound ? (
            <p className="text-red-500 text-center font-semibold text-lg">
              {text[lang].notFound}
            </p>
          ) : (
            <div className="flex flex-col space-y-3">
              <p className="text-gray-700 font-medium text-lg">
                {text[lang].name}: {result.full_name}
              </p>

              {/* BIB เด่น */}
              <div className="text-center py-4 bg-blue-600 text-white font-bold text-2xl rounded-lg shadow-md">
                {text[lang].bib}: {result.bib}
              </div>

              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div className="bg-white p-2 rounded-lg shadow-sm text-center">
                  <p className="font-semibold">{text[lang].distance}</p>
                  <p>{result.distance}</p>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm text-center">
                  <p className="font-semibold">{text[lang].shirt_size}</p>
                  <p>{result.shirt_size}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RunnerSearch;
