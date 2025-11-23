import React, { useState } from "react";

function UploadImage() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    console.log("File selected:", selectedFile);

    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("กรุณาเลือกไฟล์ก่อน");
      return;
    }

    console.log("Preparing upload...");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setUploadedUrl(null);

    try {
      console.log("Uploading...");
      const res = await fetch("http://localhost:8000/upload-image", {
        method: "POST",
        body: formData,
      });

      console.log("Response received:", res);

      const data = await res.json();
      console.log("JSON response:", data);

      if (data.url) {
        console.log("Upload success URL:", data.url);
        setUploadedUrl(data.url);
      } else {
        console.log("Upload failed:", data);
        alert("Upload failed: " + JSON.stringify(data));
      }

      setLoading(false);
    } catch (error) {
      console.error("Upload error:", error);
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "auto", textAlign: "center" }}>
      <h2>Upload Image to Cloudinary</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div style={{ marginTop: 20 }}>
          <p>Preview:</p>
          <img src={preview} alt="preview" width="250" style={{ borderRadius: 10 }} />
        </div>
      )}

      <button
        onClick={handleUpload}
        style={{
          marginTop: 20,
          padding: "10px 20px",
          cursor: "pointer",
          background: "#4f46e5",
          color: "white",
          borderRadius: 8,
          border: "none",
        }}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {uploadedUrl && (
        <div style={{ marginTop: 20 }}>
          <p>Upload Success!</p>
          <a href={uploadedUrl} target="_blank" rel="noreferrer">
            ดูรูปบน Cloudinary
          </a>
        </div>
      )}
    </div>
  );
}

export default UploadImage;
