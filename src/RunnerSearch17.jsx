import { useState } from "react";
import { FaGlobe, FaChevronDown, FaChevronUp, FaLine, FaPhone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


function RunnerSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [lang, setLang] = useState("th");
  const [showActivities, setShowActivities] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;

    // ✅ พิมพ์ /admin แล้วเด้งไป path /admin
    if (query.trim() === "/admin") {
      navigate("/admin");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`https://rwtf-udon-backend.vercel.app/runners`);
      const data = await res.json();

      // ใช้ filter เพื่อเอาทุกคนที่ match
      const matchedList = data.data.filter(
        (runner) =>
          runner.full_name.toLowerCase().includes(query.toLowerCase())
      );

      if (matchedList.length > 0) {
        setResult(matchedList);
      } else {
        setResult([{ notFound: true }]);
      }
    } catch (err) {
      console.error(err);
      setResult([{ notFound: true }]);
    }

    setLoading(false);
  };

  const text = {
    th: {
      title: "ค้นหาเลขเสื้อของคุณ",
      placeholder: "กรอกชื่อ",
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
      placeholder: "Enter Name",
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
    <div className="min-h-screen flex justify-center items-start md:items-center bg-gray-100 py-10">

      <div className="max-w-xl w-full mx-auto p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg relative border border-gray-100">

        {/* Language Switch */}
        <button
          onClick={() => setLang(lang === "th" ? "en" : "th")}
          className="absolute top-4 right-4 bg-white/70 backdrop-blur-md hover:bg-white p-2 rounded-full shadow 
               border border-gray-200 transition"
          title="Switch Language"
        >
          <FaGlobe className="text-gray-700" />
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-6 mt-2">
          <img
            src="/rwtf_logo.svg"
            alt="logo"
            className="w-full max-h-48 object-contain drop-shadow"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 tracking-tight">
          {text[lang].title}
        </h2>

        {/* Search Box */}
        <div className="flex space-x-2 mb-6">
          <input
            type="text"
            placeholder={text[lang].placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            className="flex-1 border border-gray-200 rounded-full p-3 px-5 shadow-sm bg-white/70 backdrop-blur 
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-6 rounded-full font-medium shadow-md hover:bg-blue-700 
                active:scale-95 transition"
          >
            {text[lang].search}
          </button>
        </div>


        {loading && (
          <div className="flex justify-center my-6">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-300 border-t-transparent"></div>
          </div>
        )}


        {result && result.length > 0 && (
          result[0].notFound ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl shadow-sm text-center mb-6">
              <p className="text-red-600 font-semibold text-lg">{text[lang].notFound}</p>
            </div>
          ) : (
            result.map((runner, idx) => (
              <div
                key={idx}
                className="bg-blue-50 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100 mb-6 
                   hover:shadow-xl transition"
              >
                <p className="text-gray-800 font-semibold text-xl mb-2">
                  {text[lang].name}: {runner.full_name}
                </p>

                <div className="text-center py-4 bg-blue-600 text-white font-bold text-3xl rounded-xl shadow">
                  {text[lang].bib}:{" "}
                  {lang === "en" && runner.bib === "กำลังดำเนินการ"
                    ? "In progress"
                    : runner.bib}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
                  <div className="bg-white rounded-xl shadow p-3 text-center border border-gray-100">
                    <p className="font-semibold">{text[lang].distance}</p>
                    <p className="text-gray-600">{runner.distance}</p>
                  </div>
                  <div className="bg-white rounded-xl shadow p-3 text-center border border-gray-100">
                    <p className="font-semibold">{text[lang].shirt_size}</p>
                    <p className="text-gray-600">{runner.shirt_size}</p>
                  </div>
                </div>
              </div>
            ))
          )
        )}


        {/* Collapsible Activities Section */}
        <div className="mb-6">
          <button
            onClick={() => setShowActivities(!showActivities)}
            className="flex items-center justify-center w-full bg-gray-50 border border-gray-200 
             text-gray-700 font-medium py-3 rounded-xl shadow-sm hover:bg-gray-100 
             transition active:scale-95"
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
  const sponsors = [
    "/sponsor1.svg",
    "/sponsor2.svg",
    "/sponsor3.svg",
    "/sponsor4.svg",
    "/sponsor5.svg",
    "/sponsor6.svg",
  ];

  return (
    <div className="mt-10 mb-6">
      {/* Sponsors */}
      {/* <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
        {sponsors.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`Sponsor ${idx + 1}`}
            className="h-10 w-auto object-contain"
          />
        ))}
      </div> */}

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
