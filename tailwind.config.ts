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
				// Phase 21 CRM Brand Colors (Pipedrive-ish)
				brand: {
					primary: '#2F80ED',
					primaryFg: '#FFFFFF',
					accent: '#00C2A8',
					warning: '#F2994A',
					danger: '#EB5757'
				},
				surface: {
					base: '#FFFFFF',
					subtle: '#F7F9FC',
					card: '#FFFFFF'
				},
				text: {
					main: '#0F172A',
					muted: '#64748B'
				},
				line: '#E5EAF2',

				/* Enhanced Design System Colors */
				'canvas': 'hsl(var(--bg-canvas))',
				'elevated': 'hsl(var(--bg-elevated))',

				'surface-glass': 'hsl(var(--surface-glass))',
				'text-on-dark': 'hsl(var(--text-on-dark))',
				'text-dark': 'hsl(var(--text-dark))',
				'muted-text': 'hsl(var(--muted-text))',

				'accent-muted': 'hsl(var(--accent-muted))',
				'success': 'hsl(var(--success))',

				'border-glass': 'hsl(var(--border-glass))',
				
				/* Extended Primary/Secondary Palettes */
				primary: {
					50: '#f0f9ff',
					100: '#e0f2fe',
					200: '#bae6fd',
					300: '#7dd3fc',
					400: '#38bdf8',
					500: '#0ea5e9',
					600: '#0284c7',
					700: '#0369a1',
					800: '#075985',
					900: '#0c4a6e',
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					50: '#f8fafc',
					100: '#f1f5f9',
					200: '#e2e8f0',
					300: '#cbd5e1',
					400: '#94a3b8',
					500: '#64748b',
					600: '#475569',
					700: '#334155',
					800: '#1e293b',
					900: '#0f172a',
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				
				/* Semantic tokens for shadcn compatibility */
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
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
				},
				chart: {
					"1": "hsl(var(--chart-1))",
					"2": "hsl(var(--chart-2))",
					"3": "hsl(var(--chart-3))",
					"4": "hsl(var(--chart-4))",
					"5": "hsl(var(--chart-5))",
				}
			},
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			fontSize: {
				/* Enhanced Typography Scale */
				'h1': ['56px', { lineHeight: '1.1', fontWeight: '600' }],
				'h2': ['36px', { lineHeight: '1.2', fontWeight: '600' }],
				'h3': ['24px', { lineHeight: '1.3', fontWeight: '600' }],
				'body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
				'small': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
				'heading-1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
				'heading-2': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
				'heading-3': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
				'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
				'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
			},
			backgroundImage: {
				'hero-gradient': 'var(--hero-gradient)',
				'cta-gradient': 'var(--cta-gradient)',
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'primary-gradient': 'linear-gradient(135deg, hsl(var(--primary-600)), hsl(var(--primary-800)))',
			},
			boxShadow: {
				// Phase 21 CRM Shadows
				'card': '0 2px 10px rgba(20,23,28,0.05)',
				'enterprise-lg': 'var(--shadow-lg)',
				'enterprise-md': 'var(--shadow-md)',
				'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
				'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
				'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)',
				'elegant': '0 10px 30px -10px hsl(var(--primary) / 0.3)',
				'glow': '0 0 40px hsl(var(--primary) / 0.4)',
			},
			borderRadius: {
				// Phase 21 CRM Border Radius
				'xl2': '1rem',
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
				},
				fadeIn: {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				slideUp: {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fadeInUp': 'fadeInUp 0.8s ease-out forwards',
				'fade-in': 'fadeIn 0.5s ease-in-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'bounce-slow': 'bounce 2s infinite',
				'pulse-slow': 'pulse 3s infinite',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;