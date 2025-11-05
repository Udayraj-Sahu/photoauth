// frontend/src/services/api.js
import axios from "axios";

// Base API instance
const API = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
	timeout: 15000,
});

// Helper: common error wrapper
const handleError = (error) => {
	console.error("PhotoAuth API Error:", error);
	if (error.response) {
		return {
			error: true,
			message: error.response.data?.detail || "Server error",
		};
	} else if (error.request) {
		return {
			error: true,
			message: "No response from backend. Is the server running?",
		};
	} else {
		return { error: true, message: error.message || "Unexpected error" };
	}
};

// 🔍 Check backend status
export const checkBackendStatus = async () => {
	try {
		const res = await API.get("/");
		return res.data;
	} catch (err) {
		return handleError(err);
	}
};

// 📤 Upload and analyze image
export const analyzeImage = async (file) => {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const res = await API.post("/analyze", formData, {
			headers: { "Content-Type": "multipart/form-data" },
			onUploadProgress: (e) => {
				const percent = Math.round((e.loaded * 100) / e.total);
				console.log(`Uploading... ${percent}%`);
			},
		});

		console.log("🔍 Backend Response:", res.data);

		return res.data;
	} catch (err) {
		return handleError(err);
	}
};

// 🌐 Analyze via URL
export const analyzeImageByUrl = async (url) => {
	try {
		const res = await API.post("/analyze/url", { url });
		return res.data;
	} catch (err) {
		return handleError(err);
	}
};

export default API;
