import { useState } from "react";
import { motion } from "motion/react";
import CountUp from "react-countup";
import {
	CheckCircle,
	XCircle,
	AlertCircle,
	Eye,
	Camera,
	Cpu,
	Calendar,
	Database,
	Activity,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImagewithFallback";

export function ResultSection({ imageUrl, result }) {
	const [showHeatmap, setShowHeatmap] = useState(false);

	const metadata = result?.metadata || {};
	const model = result?.model || {};
	const ela = result?.ela || {};

	// 🧠 Determine authenticity display info
	const getStatusConfig = () => {
		const label = (
			result?.label ||
			result?.final_label ||
			""
		).toLowerCase();

		if (label.includes("authentic") || label === "real") {
			return {
				icon: CheckCircle,
				color: "text-green-400",
				bgColor: "bg-green-400/10",
				borderColor: "border-green-400/30",
				label: "🟢 Authentic",
				description:
					"This image appears genuine with minimal manipulation detected.",
			};
		}

		if (label.includes("possibly")) {
			return {
				icon: AlertCircle,
				color: "text-yellow-400",
				bgColor: "bg-yellow-400/10",
				borderColor: "border-yellow-400/30",
				label: "🟠 Possibly Edited",
				description:
					"Some inconsistencies were found. The image may have been slightly edited or enhanced.",
			};
		}

		return {
			icon: XCircle,
			color: "text-red-400",
			bgColor: "bg-red-400/10",
			borderColor: "border-red-400/30",
			label: "🔴 AI / Manipulated",
			description:
				"This image shows strong signs of AI generation or digital manipulation.",
		};
	};

	const statusConfig = getStatusConfig();
	const StatusIcon = statusConfig.icon;

	return (
		<motion.section
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className="container mx-auto px-6 py-12">
			<div className="max-w-5xl mx-auto">
				<motion.div
					initial={{ scale: 0.95 }}
					animate={{ scale: 1 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="bg-card/50 border border-primary/20 rounded-2xl p-8 neon-glow">
					<div className="grid md:grid-cols-2 gap-8">
						{/* 🖼️ Image Preview */}
						<div className="relative">
							<motion.div
								whileHover={{ scale: 1.02 }}
								className="relative rounded-xl overflow-hidden border border-primary/30 neon-glow-hover">
								<ImageWithFallback
									src={imageUrl}
									alt="Analyzed image"
									className="w-full h-auto"
									fallback="https://images.unsplash.com/photo-1516035069371-29a1b244cc32"
								/>
								{/* 🔥 Grad-CAM overlay */}
								{showHeatmap && model?.gradcam ? (
									<motion.img
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ duration: 0.6 }}
										src={`data:image/jpeg;base64,${model.gradcam}`}
										alt="Grad-CAM heatmap"
										className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-overlay"
									/>
								) : null}
							</motion.div>

							{/* Toggle Button */}
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setShowHeatmap(!showHeatmap)}
								className="mt-4 w-full px-4 py-3 bg-secondary/50 border border-primary/30 rounded-xl flex items-center justify-center gap-2 neon-glow-hover transition-all">
								<Eye className="w-5 h-5" />
								{showHeatmap ? "Hide Heatmap" : "Show Heatmap"}
							</motion.button>
						</div>

						{/* 🔍 Results Section */}
						<div className="space-y-6">
							{/* Authenticity Score */}
							<div>
								<p className="text-sm text-muted-foreground mb-2">
									Authenticity Score
								</p>
								<div className="flex items-baseline gap-2">
									<motion.span
										initial={{ opacity: 0, scale: 0.5 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{
											delay: 0.3,
											duration: 0.5,
										}}
										className="text-6xl text-primary text-glow"
										style={{
											fontFamily: "Orbitron, sans-serif",
										}}>
										<CountUp
											end={
												(result.score ??
													(result.authenticity_score >
													1
														? result.authenticity_score
														: result.authenticity_score *
														  100)) ||
												0
											}
											duration={2}
										/>
										%
									</motion.span>
								</div>
							</div>

							{/* Status Badge */}
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 }}
								className={`p-4 rounded-xl border ${statusConfig.bgColor} ${statusConfig.borderColor}`}>
								<div className="flex items-center gap-3 mb-2">
									<StatusIcon
										className={`w-6 h-6 ${statusConfig.color}`}
									/>
									<span
										className={`${statusConfig.color}`}
										style={{
											fontFamily: "Orbitron, sans-serif",
										}}>
										{statusConfig.label}
									</span>
								</div>
								<p className="text-sm text-muted-foreground mb-2">
									{statusConfig.description}
								</p>

								{/* 🧠 AI Detection Confidence */}
								{model?.confidence > 0 && (
									<div className="flex items-center gap-2 mt-2 text-sm text-primary/80">
										<Activity className="w-4 h-4" />
										<span>
											Model Confidence:{" "}
											<strong>
												{model.confidence.toFixed(1)}%
											</strong>
										</span>
									</div>
								)}
							</motion.div>

							{/* ✅ Per-Model Breakdown */}
							<div className="mt-4 space-y-2">
								<p className="text-sm text-muted-foreground mb-1">
									Model Confidence Breakdown
								</p>

								{/* ViT Detector */}
								<div className="flex items-center justify-between text-sm">
									<span>ViT Detector</span>
									<span className="font-mono text-primary">
										{result.vitConf?.toFixed(1) ?? 0}%
									</span>
								</div>

								<div className="w-full bg-primary/10 rounded-full h-2 overflow-hidden">
									<motion.div
										initial={{ width: 0 }}
										animate={{
											width: `${result.vitConf ?? 0}%`,
										}}
										transition={{ duration: 0.8 }}
										className="bg-primary h-2"
									/>
								</div>

								{/* CLIP Detector */}
								<div className="flex items-center justify-between text-sm mt-2">
									<span>CLIP Detector</span>
									<span className="font-mono text-primary">
										{result.clipConf?.toFixed(1) ?? 0}%
									</span>
								</div>

								<div className="w-full bg-secondary/10 rounded-full h-2 overflow-hidden">
									<motion.div
										initial={{ width: 0 }}
										animate={{
											width: `${result.clipConf ?? 0}%`,
										}}
										transition={{ duration: 0.8 }}
										className="bg-secondary h-2"
									/>
								</div>
							</div>

							{/* Metadata Section */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ delay: 0.7 }}
								className="space-y-3">
								<h3 className="text-sm text-muted-foreground mb-3">
									Image Metadata & AI Analysis
								</h3>

								{/* EXIF Data */}
								{metadata.exif_present && (
									<div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-primary/10">
										<Camera className="w-5 h-5 text-primary" />
										<div>
											<p className="text-xs text-muted-foreground">
												EXIF Data
											</p>
											<p className="text-sm">Present</p>
										</div>
									</div>
								)}

								{/* Editing Software */}
								{metadata.software &&
									metadata.software !== "Unknown" && (
										<div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-primary/10">
											<Cpu className="w-5 h-5 text-primary" />
											<div>
												<p className="text-xs text-muted-foreground">
													Editing Software
												</p>
												<p className="text-sm capitalize">
													{metadata.software}
												</p>
											</div>
										</div>
									)}

								{/* ELA Score */}
								{ela.ela_score && (
									<div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-primary/10">
										<Database className="w-5 h-5 text-primary" />
										<div>
											<p className="text-xs text-muted-foreground">
												ELA Score
											</p>
											<p className="text-sm">
												{ela.ela_score}
											</p>
										</div>
									</div>
								)}

								{/* Timestamp */}
								<div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg border border-primary/10">
									<Calendar className="w-5 h-5 text-primary" />
									<div>
										<p className="text-xs text-muted-foreground">
											Analyzed On
										</p>
										<p className="text-sm">
											{new Date().toLocaleString()}
										</p>
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.section>
	);
}
