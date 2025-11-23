import { useState } from "react";

function RunnerSearch() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const res = await fetch(`http://localhost:8000/runners`);
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

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">
        ค้นหาเลขเสื้อของคุณ
      </h2>

      <div className="flex space-x-2 mb-6">
        <input
          type="text"
          placeholder="กรอกชื่อหรือเลขบัตรประชาชน"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded-lg p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700 transition"
        >
          ค้นหา
        </button>
      </div>

      {result && (
        <div className="relative bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl shadow-xl border border-blue-200">
          {result.notFound ? (
            <p className="text-red-500 text-center font-semibold text-lg">
              ไม่พบข้อมูลนักวิ่ง
            </p>
          ) : (
            <div className="flex flex-col space-y-3">
              <p className="text-gray-700 font-medium text-lg">ชื่อ: {result.full_name}</p>
              
              {/* BIB เด่น */}
              <div className="text-center py-4 bg-blue-600 text-white font-bold text-2xl rounded-lg shadow-md">
                BIB: {result.bib}
              </div>

              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div className="bg-white p-2 rounded-lg shadow-sm text-center">
                  <p className="font-semibold">ระยะทาง</p>
                  <p>{result.distance}</p>
                </div>
                <div className="bg-white p-2 rounded-lg shadow-sm text-center">
                  <p className="font-semibold">ขนาดเสื้อ</p>
                  <p>{result.shirt_size}</p>
                </div>
              </div>

              {/* {result.image_url && (
                <img
                  src={result.image_url}
                  alt={result.full_name}
                  className="w-32 h-32 object-cover rounded-full mx-auto shadow-md mt-2"
                />
              )} */}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RunnerSearch;
