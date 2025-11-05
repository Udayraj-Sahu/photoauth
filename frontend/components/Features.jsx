"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import CountUp from "react-countup";
import { Brain, Search, Layers, FileText } from "lucide-react";

const features = [
	{
		icon: Brain,
		title: "AI-Powered Detection",
		description:
			"Advanced neural networks analyze every pixel to detect manipulations and AI-generated content.",
		color: "text-primary",
	},
	{
		icon: Search,
		title: "Metadata Analyzer",
		description:
			"Deep inspection of EXIF data, editing history, and hidden information in image files.",
		color: "text-accent",
	},
	{
		icon: Layers,
		title: "Heatmap Visualizer",
		description:
			"Visual representation of manipulation probability across different regions of the image.",
		color: "text-primary",
	},
	{
		icon: FileText,
		title: "Instant Reports",
		description:
			"Comprehensive analysis reports with authenticity scores and detailed findings.",
		color: "text-accent",
	},
];

export function Features() {
	const [stats, setStats] = useState({
		avg_accuracy: 0,
		avg_time: 0,
		total_images: 0,
	});

	useEffect(() => {
		const fetchStats = async () => {
			try {
				const res = await fetch(
					`${
						process.env.NEXT_PUBLIC_API_URL ||
						"http://localhost:8000"
					}/stats`
				);
				if (res.ok) {
					const data = await res.json();
					setStats(data);
				}
			} catch (err) {
				console.error("Error fetching stats:", err);
			}
		};

		fetchStats(); // initial
		const interval = setInterval(fetchStats, 5000); // refresh every 5s
		return () => clearInterval(interval);
	}, []);

	return (
		<section id="features" className="py-20 relative">
			{/* Background Grid */}
			<div className="absolute inset-0 grid-background opacity-20" />

			<div className="container mx-auto px-6 relative z-10">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="text-center mb-16">
					<h2
						className="text-5xl mb-4 text-glow"
						style={{ fontFamily: "Orbitron, sans-serif" }}>
						Powered by Intelligence
					</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Cutting-edge AI technology to protect authenticity in
						the digital age
					</p>
				</motion.div>

				{/* Features */}
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						return (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								transition={{
									delay: index * 0.1,
									duration: 0.5,
								}}
								viewport={{ once: true }}
								whileHover={{ scale: 1.05, y: -5 }}
								className="bg-card/50 border border-primary/20 rounded-xl p-6 neon-glow-hover transition-all cursor-pointer">
								{/* Icon */}
								<motion.div
									whileHover={{ rotate: 360 }}
									transition={{ duration: 0.6 }}
									className={`w-14 h-14 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 neon-glow`}>
									<Icon
										className={`w-7 h-7 ${feature.color}`}
									/>
								</motion.div>

								{/* Title */}
								<h3
									className="mb-3"
									style={{
										fontFamily: "Orbitron, sans-serif",
									}}>
									{feature.title}
								</h3>

								{/* Description */}
								<p className="text-sm text-muted-foreground leading-relaxed">
									{feature.description}
								</p>

								{/* Hover bar */}
								<motion.div
									className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mt-4 opacity-0"
									whileHover={{ opacity: 1 }}
									transition={{ duration: 0.3 }}
								/>
							</motion.div>
						);
					})}
				</div>

				{/* ✅ Live Stats Section */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.6 }}
					viewport={{ once: true }}
					className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-20">
					{(() => {
						const [stats, setStats] = useState({
							avg_accuracy: 0,
							avg_time: 0,
							total_images: 0,
						});

						useEffect(() => {
							const fetchStats = async () => {
								try {
									const res = await fetch(
										`${
											process.env.NEXT_PUBLIC_API_URL ||
											"http://localhost:8000"
										}/stats`
									);
									if (res.ok) {
										const data = await res.json();
										setStats(data);
									}
								} catch (err) {
									console.error(
										"Failed to fetch stats:",
										err
									);
								}
							};
							fetchStats();
							const interval = setInterval(fetchStats, 5000);
							return () => clearInterval(interval);
						}, []);

						return (
							<>
								<div className="text-center">
									<p
										className="text-5xl text-primary mb-2 text-glow"
										style={{
											fontFamily: "Orbitron, sans-serif",
										}}>
										<CountUp
											end={stats.avg_accuracy || 0}
											decimals={2}
											duration={2}
										/>
										%
									</p>
									<p className="text-muted-foreground">
										Accuracy Rate
									</p>
								</div>

								<div className="text-center">
									<p
										className="text-5xl text-accent mb-2 accent-glow"
										style={{
											fontFamily: "Orbitron, sans-serif",
										}}>
										&lt;
										<CountUp
											end={stats.avg_time || 0}
											decimals={2}
											duration={2}
										/>
										s
									</p>
									<p className="text-muted-foreground">
										Analysis Time
									</p>
								</div>

								<div className="text-center">
									<p
										className="text-5xl text-primary mb-2 text-glow"
										style={{
											fontFamily: "Orbitron, sans-serif",
										}}>
										<CountUp
											end={stats.total_images || 0}
											duration={2}
										/>
										+
									</p>
									<p className="text-muted-foreground">
										Images Analyzed
									</p>
								</div>
							</>
						);
					})()}
				</motion.div>
			</div>
		</section>
	);
}
