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
				/* Enterprise Design System Colors */
				'canvas': 'hsl(var(--bg-canvas))',
				'elevated': 'hsl(var(--bg-elevated))',
				'surface': 'hsl(var(--surface))',
				'surface-glass': 'hsl(var(--surface-glass))',
				'text-on-dark': 'hsl(var(--text-on-dark))',
				'text-dark': 'hsl(var(--text-dark))',
				'muted-text': 'hsl(var(--muted-text))',
				'brand': 'hsl(var(--brand))',
				'brand-hover': 'hsl(var(--brand-hover))',
				'accent': 'hsl(var(--accent))',
				'accent-muted': 'hsl(var(--accent-muted))',
				'success': 'hsl(var(--success))',
				'warning': 'hsl(var(--warning))',
				'danger': 'hsl(var(--danger))',
				'border-glass': 'hsl(var(--border-glass))',
				
				/* Semantic tokens for shadcn compatibility */
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			fontFamily: {
				sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				'h1': ['56px', { lineHeight: '1.1', fontWeight: '600' }],
				'h2': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
				'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
				'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
				'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
			},
			backgroundImage: {
				'hero-gradient': 'var(--hero-gradient)',
				'cta-gradient': 'var(--cta-gradient)',
			},
			boxShadow: {
				'enterprise-lg': 'var(--shadow-lg)',
				'enterprise-md': 'var(--shadow-md)',
			},
			borderRadius: {
				'card': 'var(--radius-card)',
				'pill': 'var(--radius-pill)',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 4px)',
				sm: 'calc(var(--radius) - 8px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fadeInUp': {
					'0%': {
						opacity: '0',
						transform: 'translateY(30px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fadeInUp': 'fadeInUp 0.8s ease-out forwards'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;