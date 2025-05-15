"use client";
import { useState } from "react";
export default function UploadPage() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        setMessage(data.message);
    };

    return (
        <div>
            <h1>Upload Attendance Excel</h1>
            <input type="file" accept=".xlsx" onChange={(e) => setFile(e.target.files[0])} />
            <button onClick={handleUpload}>Upload</button>
            <p>{message}</p>
        </div>
    );
}
