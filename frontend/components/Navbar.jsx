import { Shield } from "lucide-react";
import { motion } from "motion/react";

export function Navbar() {
	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5 }}
			className="sticky top-0 z-50 backdrop-blur-lg bg-[#0A192F]/80 border-b border-primary/20">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					{/* Logo */}
					<div className="flex items-center gap-2">
						<Shield className="w-8 h-8 text-primary" />
						<span
							className="text-2xl font-bold text-glow"
							style={{ fontFamily: "Orbitron, sans-serif" }}>
							PhotoAuth
						</span>
					</div>

					{/* Navigation Links */}
					<div className="hidden md:flex items-center gap-8">
						<a
							href="#home"
							className="text-foreground hover:text-primary transition-colors">
							Home
						</a>
						<a
							href="#features"
							className="text-foreground hover:text-primary transition-colors">
							Features
						</a>
						<a
							href="#api"
							className="text-foreground hover:text-primary transition-colors">
							API Access
						</a>
						<a
							href="#about"
							className="text-foreground hover:text-primary transition-colors">
							About
						</a>
					</div>

					{/* Mobile Menu Button */}
					<button className="md:hidden text-foreground">
						<svg
							className="w-6 h-6"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</motion.nav>
	);
}
