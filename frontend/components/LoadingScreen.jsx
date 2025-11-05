import { motion } from "motion/react";
import { Loader2, Scan } from "lucide-react";

export function LoadingScreen() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
			<div className="text-center">
				{/* Holographic Scanner Effect */}
				<motion.div
					animate={{
						rotate: 360,
						scale: [1, 1.1, 1],
					}}
					transition={{
						rotate: {
							duration: 3,
							repeat: Infinity,
							ease: "linear",
						},
						scale: {
							duration: 2,
							repeat: Infinity,
							ease: "easeInOut",
						},
					}}
					className="relative w-32 h-32 mx-auto mb-8">
					<div className="absolute inset-0 rounded-full border-4 border-primary/30" />
					<div className="absolute inset-2 rounded-full border-4 border-accent/30" />
					<div className="absolute inset-4 rounded-full border-4 border-primary/30" />
					<div className="absolute inset-0 flex items-center justify-center">
						<Scan className="w-12 h-12 text-primary" />
					</div>
				</motion.div>

				{/* Loading Text */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="space-y-4">
					<h2
						className="text-3xl text-glow"
						style={{ fontFamily: "Orbitron, sans-serif" }}>
						AI is thinking
						<motion.span
							animate={{ opacity: [0, 1, 0] }}
							transition={{
								duration: 1.5,
								repeat: Infinity,
								ease: "easeInOut",
							}}>
							...
						</motion.span>
					</h2>
					<p className="text-muted-foreground">
						Analyzing pixels and metadata
					</p>
				</motion.div>

				{/* Animated Progress Bar */}
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: "100%" }}
					transition={{ duration: 2, ease: "easeInOut" }}
					className="mt-8 mx-auto max-w-md h-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full overflow-hidden">
					<motion.div
						animate={{
							x: ["-100%", "100%"],
						}}
						transition={{
							duration: 1.5,
							repeat: Infinity,
							ease: "linear",
						}}
						className="h-full w-1/3 bg-white/50 blur-sm"
					/>
				</motion.div>

				{/* Particle Effects */}
				<div className="absolute inset-0 pointer-events-none">
					{[...Array(20)].map((_, i) => (
						<motion.div
							key={i}
							className="absolute w-1 h-1 bg-primary rounded-full"
							style={{
								left: `${Math.random() * 100}%`,
								top: `${Math.random() * 100}%`,
							}}
							animate={{
								opacity: [0, 1, 0],
								scale: [0, 1.5, 0],
							}}
							transition={{
								duration: 2,
								repeat: Infinity,
								delay: Math.random() * 2,
								ease: "easeInOut",
							}}
						/>
					))}
				</div>
			</div>
		</motion.div>
	);
}
