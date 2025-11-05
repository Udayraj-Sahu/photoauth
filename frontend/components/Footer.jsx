import { Shield } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-[#0A192F]/90 border-t border-primary/20 py-12 mt-20">
			<div className="container mx-auto px-6">
				<div className="flex flex-col md:flex-row justify-between items-center gap-6">
					{/* Logo and Tagline */}
					<div className="flex items-center gap-2">
						<Shield className="w-6 h-6 text-primary" />
						<span
							className="text-xl text-glow"
							style={{ fontFamily: "Orbitron, sans-serif" }}>
							PhotoAuth
						</span>
					</div>

					{/* Links */}
					<div className="flex gap-8 text-sm">
						<a
							href="#privacy"
							className="text-muted-foreground hover:text-primary transition-colors">
							Privacy
						</a>
						<a
							href="#terms"
							className="text-muted-foreground hover:text-primary transition-colors">
							Terms
						</a>
						<a
							href="#contact"
							className="text-muted-foreground hover:text-primary transition-colors">
							Contact
						</a>
					</div>

					{/* Copyright */}
					<p className="text-sm text-muted-foreground">
						© 2025 PhotoAuth — Built to See the Truth.
					</p>
				</div>
			</div>
		</footer>
	);
}
