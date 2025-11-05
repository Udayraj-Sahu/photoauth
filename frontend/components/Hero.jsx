import { useState, useCallback } from "react";
import { Upload, Link as LinkIcon } from "lucide-react";
import { motion } from "motion/react";
import { useDropzone } from "react-dropzone";

export function Hero({ onAnalyze }) {
	const [urlInput, setUrlInput] = useState("");

	const onDrop = useCallback(
		(acceptedFiles) => {
			if (acceptedFiles.length > 0) {
				onAnalyze(acceptedFiles[0]);
			}
		},
		[onAnalyze]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
		},
		multiple: false,
	});

	const handleUrlSubmit = () => {
		const url = urlInput.trim();

		if (!url) {
			alert("Please enter an image URL.");
			return;
		}

		try {
			// ✅ Validate URL structure
			new URL(url);
			onAnalyze(url); // Pass string to parent handler
		} catch {
			alert("Please enter a valid image URL (https://...)");
		}
	};

	return (
		<section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
			{/* Animated Grid Background */}
			<div className="absolute inset-0 grid-background opacity-30" />

			{/* Scan Line Animation */}
			<div className="absolute inset-0 pointer-events-none">
				<div className="scan-line w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
			</div>

			<div className="container mx-auto px-6 py-20 relative z-10">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="max-w-4xl mx-auto text-center">
					{/* Tagline */}
					<motion.h1
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.2, duration: 0.6 }}
						className="text-6xl md:text-7xl mb-6 text-glow"
						style={{ fontFamily: "Orbitron, sans-serif" }}>
						See Whats Real.
					</motion.h1>

					{/* Subtext */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4, duration: 0.6 }}
						className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
						AI-powered authenticity detection for photos, images,
						and generated media.
					</motion.p>

					{/* Upload Box */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.6 }}
						{...getRootProps()}
						className={`
              relative border-2 border-dashed rounded-2xl p-12 mb-6 cursor-pointer
              transition-all duration-300 neon-glow-hover
              ${
					isDragActive
						? "border-accent bg-accent/5 scale-105"
						: "border-primary/40 bg-card/50"
				}
            `}>
						<input {...getInputProps()} />
						<div className="flex flex-col items-center gap-4">
							<Upload
								className={`w-16 h-16 ${
									isDragActive
										? "text-accent"
										: "text-primary"
								} transition-colors`}
							/>
							<div>
								<p className="text-xl mb-2">
									{isDragActive
										? "Drop your image here"
										: "Drag & drop an image"}
								</p>
								<p className="text-sm text-muted-foreground">
									or click to browse • PNG, JPG, GIF, WEBP
								</p>
							</div>
						</div>
					</motion.div>

					{/* URL Input */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.8, duration: 0.6 }}
						className="flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto mb-8">
						<div className="relative flex-1 w-full">
							<LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
							<input
								type="text"
								value={urlInput}
								onChange={(e) => setUrlInput(e.target.value)}
								onKeyDown={(e) =>
									e.key === "Enter" && handleUrlSubmit()
								}
								placeholder="Paste image URL (e.g. https://...)"
								className="w-full pl-12 pr-4 py-4 bg-card/50 border border-primary/30 rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all neon-glow"
							/>
						</div>
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
							onClick={handleUrlSubmit}
							className="px-6 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl neon-glow-hover transition-all"
							style={{ fontFamily: "Orbitron, sans-serif" }}>
							Analyze
						</motion.button>
					</motion.div>

					{/* CTA Button */}
					<motion.button
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 1, duration: 0.6 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						onClick={handleUrlSubmit}
						className="px-12 py-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl neon-glow-hover transition-all"
						style={{ fontFamily: "Orbitron, sans-serif" }}>
						Analyze Image
					</motion.button>
				</motion.div>
			</div>
		</section>
	);
}
