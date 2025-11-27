import { useState } from "react";
import { FaGlobe, FaChevronDown, FaChevronUp, FaLine, FaPhone } from "react-icons/fa";

function RunnerSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState("th");
  const [showActivities, setShowActivities] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setResult(null);

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

    setLoading(false);
  };

  const text = {
    th: {
      title: "ค้นหาเลขเสื้อของคุณ",
      placeholder: "กรอกชื่อหรือเลขบัตรประชาชน",
      search: "ค้นหา",
      notFound: "ไม่พบข้อมูลนักวิ่ง",
      name: "ชื่อ",
      bib: "BIB",
      distance: "ระยะทาง",
      shirt_size: "ขนาดเสื้อ",
      awards: "รางวัล",
      souvenir: "ของที่ระลึก",
      route: "แผนที่เส้นทาง",
      schedule: "กำหนดการ",
      contact: "ติดต่อสอบถาม",
      showActivities: "รายละเอียดกิจกรรม",
      hideActivities: "ซ่อนรายละเอียดกิจกรรม"
    },
    en: {
      title: "Find Your BIB Number",
      placeholder: "Enter Name or Citizen ID",
      search: "Search",
      notFound: "Runner not found",
      name: "Name",
      bib: "BIB",
      distance: "Distance",
      shirt_size: "Shirt Size",
      awards: "Awards",
      souvenir: "Souvenir",
      route: "Route Map",
      schedule: "Schedule",
      contact: "Contact",
      showActivities: "Activities Details",
      hideActivities: "Hide Activities"
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

      {/* Logo */}
      <div className="flex justify-center mb-6 mt-2">
        <img
          src="/rwtf_logo.svg"
          alt="logo"
          className="w-full max-h-48 object-contain drop-shadow-lg"
        />
      </div>

      {/* BIB Search */}
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
        {text[lang].title}
      </h2>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder={text[lang].placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="flex-1 border rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
        >
          {text[lang].search}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-300 border-t-transparent"></div>
        </div>
      )}

      {result && (
        <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-xl border border-blue-200 mb-6">
          {result.notFound ? (
            <p className="text-red-500 text-center font-semibold text-lg">
              {text[lang].notFound}
            </p>
          ) : (
            <div className="flex flex-col space-y-3">
              <p className="text-gray-700 font-medium text-lg">
                {text[lang].name}: {result.full_name}
              </p>

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

      {/* Collapsible Activities Section */}
      <div className="mb-6">
        <button
          onClick={() => setShowActivities(!showActivities)}
          className="flex items-center justify-center w-full bg-gray-100 text-gray-700 font-medium py-2 rounded-md shadow-sm hover:bg-gray-200 transition"
        >
          {showActivities ? (
            <>
              <FaChevronUp className="mr-2" />
              {text[lang].hideActivities}
            </>
          ) : (
            <>
              <FaChevronDown className="mr-2" />
              {text[lang].showActivities}
            </>
          )}
        </button>

        {showActivities && (
          <div className="mt-4 space-y-6">
            <Section title={text[lang].awards} img="/awards.svg" />
            <Section title={text[lang].souvenir} img="/souvenir.svg" />
            <Section title={text[lang].route} img="/route_map.svg" />
            <Section title={text[lang].schedule} img="/schedule.svg" />
          </div>
        )}
      </div>

      {/* Contact Section แยกด้านล่าง ไม่ซ่อน */}
      <SectionContact lang={lang} text={text} />
    </div>
  );
}

// Section สำหรับ Activities ปกติ
function Section({ title, img }) {
  return (
    <div className="mb-4">
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <div className="w-full rounded-lg overflow-hidden shadow-md">
        <img src={img} alt={title} className="w-full object-cover" />
      </div>
    </div>
  );
}

// Section สำหรับ Contact แบบทันสมัย (รองรับ TH/EN)
function SectionContact({ lang, text }) {
  return (
    <div className="mt-10 mb-6">
      <h3 className="text-md font-semibold text-gray-700 mb-2">
        {text[lang].contact}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* Line */}
        <a
          href="https://line.me/R/ti/p/@bud111"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 
                     rounded-full hover:bg-gray-100 transition shadow-sm"
        >
          <FaLine className="text-green-600 text-lg" />
          <span className="text-gray-700 text-sm">Line @bud111</span>
        </a>

        {/* Phone */}
        <a
          href="tel:042188999"
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 
                     rounded-full hover:bg-gray-100 transition shadow-sm"
        >
          <FaPhone className="text-blue-600 text-lg" />
          <span className="text-gray-700 text-sm">Tel 042-188-999</span>
        </a>
      </div>
    </div>
  );
}


export default RunnerSearch;
