"use client";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ResultSection } from "@/components/ResultSection";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";

// 🧠 Import API + Formatter
import { analyzeImage, analyzeImageByUrl } from "@/services/api";
import { formatResult } from "@/utils/formatResult";

export default function App() {
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [analysisResult, setAnalysisResult] = useState(null);
	const [imageUrl, setImageUrl] = useState("");
	const [error, setError] = useState(null);

	const handleAnalyze = async (input) => {
		try {
			setIsAnalyzing(true);
			setAnalysisResult(null);
			setError(null);

			let rawData;
			let previewUrl;

			// Detect URL vs file input
			if (typeof input === "string" && input.startsWith("http")) {
				previewUrl = input;
				rawData = await analyzeImageByUrl(input);
			} else if (input instanceof File) {
				previewUrl = URL.createObjectURL(input);
				rawData = await analyzeImage(input);
			} else {
				throw new Error("Invalid input type");
			}

			console.log("🔍 Backend Response:", rawData);

			if (rawData.error) {
				setError(rawData.message);
				return;
			}

			const formatted = formatResult(rawData);
			setAnalysisResult(formatted);
			setImageUrl(previewUrl); // ✅ Corrected
		} catch (err) {
			console.error("Error analyzing image:", err);
			setError("Something went wrong while analyzing the image.");
		} finally {
			setIsAnalyzing(false);
		}
	};

	const handleReset = () => {
		setAnalysisResult(null);
		setImageUrl("");
		setError(null);
	};

	return (
		<div className="min-h-screen bg-[#0A192F] text-white">
			<Navbar />

			{isAnalyzing && <LoadingScreen />}

			{error && (
				<div className="text-center mt-4 text-red-400 font-semibold">
					⚠️ {error}
				</div>
			)}

			{!analysisResult ? (
				<>
					<Hero onAnalyze={handleAnalyze} />
					<Features />
				</>
			) : (
				<>
					<ResultSection
						imageUrl={imageUrl}
						result={analysisResult}
					/>

					{/* Analyze Another Button */}
					<div className="container mx-auto px-6 pb-12 text-center">
						<button
							onClick={handleReset}
							className="px-8 py-3 bg-primary/10 text-primary border border-primary rounded-xl neon-glow-hover transition-all hover:bg-primary/20"
							style={{ fontFamily: "Orbitron, sans-serif" }}>
							Analyze Another Image
						</button>
					</div>

					<Features />
				</>
			)}

			<Footer />
		</div>
	);
}
