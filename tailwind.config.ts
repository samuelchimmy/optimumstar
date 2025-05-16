
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: '#be8dff', // Accent Purple
					foreground: '#f1f1f1', // Light background
					dark: '#be8dff', // Accent Purple
				},
				secondary: {
					DEFAULT: '#7be48b', // Accent Green
					foreground: '#151515', // Primary Text/Dark Background
					dark: '#7be48b', // Accent Green
				},
				dark: '#151515', // Primary Text/Dark Background
				light: '#f1f1f1', // Light background
				secondaryBg: '#212121', // Secondary Background
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" }
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" }
				},
				"celebration": {
					"0%, 100%": { transform: "scale(1)" },
					"50%": { transform: "scale(1.1)" }
				},
				"fade-in": {
					from: { opacity: "0", transform: "translateY(10px)" },
					to: { opacity: "1", transform: "translateY(0)" }
				},
				"float": {
					"0%, 100%": { transform: "translateY(0)" },
					"50%": { transform: "translateY(-10px)" }
				},
				"ripple": {
					"0%": { transform: "scale(0)", opacity: "1" },
					"100%": { transform: "scale(4)", opacity: "0" }
				},
				"bubble": {
					"0%": { transform: "scale(0)", opacity: "0" },
					"50%": { transform: "scale(1.2)", opacity: "0.8" },
					"100%": { transform: "scale(1)", opacity: "1" }
				},
				"confetti": {
					"0%": { transform: "translateY(0) rotate(0)", opacity: "1" },
					"100%": { transform: "translateY(100vh) rotate(720deg)", opacity: "0" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"celebration": "celebration 0.7s ease-in-out infinite",
				"fade-in": "fade-in 0.5s ease-out",
				"float": "float 3s ease-in-out infinite",
				"ripple": "ripple 1s ease-out",
				"bubble": "bubble 0.6s ease-out",
				"confetti": "confetti 5s ease-out forwards"
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
