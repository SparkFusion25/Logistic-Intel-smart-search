import { useEffect, useRef, useState } from 'react';
import Container from '@/components/ui/Container';

interface TradeRoute {
  from: { x: number; y: number; country: string };
  to: { x: number; y: number; country: string };
  value: string;
  color: string;
}

interface CountryDot {
  x: number;
  y: number;
  country: string;
  color: string;
  size: number;
  exports: string;
}

export default function InteractiveWorldMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  // Major trade hubs with their approximate positions on a world map
  const countries: CountryDot[] = [
    { x: 15, y: 35, country: 'USA', color: '#3B82F6', size: 12, exports: '$1.65T' },
    { x: 75, y: 28, country: 'China', color: '#EF4444', size: 14, exports: '$2.64T' },
    { x: 52, y: 25, country: 'Germany', color: '#10B981', size: 10, exports: '$1.56T' },
    { x: 82, y: 40, country: 'Japan', color: '#F59E0B', size: 9, exports: '$705B' },
    { x: 48, y: 32, country: 'UK', color: '#8B5CF6', size: 8, exports: '$460B' },
    { x: 48, y: 28, country: 'France', color: '#EC4899', size: 8, exports: '$569B' },
    { x: 52, y: 42, country: 'Italy', color: '#06B6D4', size: 7, exports: '$515B' },
    { x: 70, y: 55, country: 'India', color: '#F97316', size: 9, exports: '$323B' },
    { x: 25, y: 42, country: 'Canada', color: '#84CC16', size: 7, exports: '$434B' },
    { x: 18, y: 72, country: 'Brazil', color: '#22D3EE', size: 8, exports: '$280B' },
    { x: 82, y: 62, country: 'Australia', color: '#A78BFA', size: 6, exports: '$244B' },
    { x: 65, y: 48, country: 'UAE', color: '#FBBF24', size: 6, exports: '$308B' },
    { x: 50, y: 65, country: 'South Africa', color: '#34D399', size: 5, exports: '$89B' },
    { x: 40, y: 18, country: 'Russia', color: '#F472B6', size: 8, exports: '$337B' },
    { x: 78, y: 45, country: 'South Korea', color: '#60A5FA', size: 7, exports: '$605B' },
  ];

  // Major trade routes
  const tradeRoutes: TradeRoute[] = [
    { from: { x: 75, y: 28, country: 'China' }, to: { x: 15, y: 35, country: 'USA' }, value: '$452B', color: '#3B82F6' },
    { from: { x: 52, y: 25, country: 'Germany' }, to: { x: 15, y: 35, country: 'USA' }, value: '$131B', color: '#10B981' },
    { from: { x: 75, y: 28, country: 'China' }, to: { x: 52, y: 25, country: 'Germany' }, value: '$106B', color: '#EF4444' },
    { from: { x: 82, y: 40, country: 'Japan' }, to: { x: 15, y: 35, country: 'USA' }, value: '$143B', color: '#F59E0B' },
    { from: { x: 75, y: 28, country: 'China' }, to: { x: 82, y: 40, country: 'Japan' }, value: '$142B', color: '#8B5CF6' },
    { from: { x: 70, y: 55, country: 'India' }, to: { x: 15, y: 35, country: 'USA' }, value: '$73B', color: '#F97316' },
    { from: { x: 25, y: 42, country: 'Canada' }, to: { x: 15, y: 35, country: 'USA' }, value: '$429B', color: '#84CC16' },
    { from: { x: 78, y: 45, country: 'South Korea' }, to: { x: 75, y: 28, country: 'China' }, value: '$134B', color: '#60A5FA' },
  ];

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Animate trade routes
    const animateRoutes = () => {
      const routes = svg.querySelectorAll('.trade-route');
      routes.forEach((route, index) => {
        setTimeout(() => {
          route.classList.add('animate-route');
        }, index * 500);
      });
    };

    const timer = setTimeout(animateRoutes, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 py-16 lg:py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-y-12"></div>
      </div>

      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight mb-6">
            See the world of trade
            <span className="block text-blue-300">
              like never before
            </span>
          </h1>
          <p className="text-xl text-blue-100 mb-4">
            —gain the insights your business needs
          </p>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto leading-relaxed">
            For nearly two decades, Logistic Intel has set the standard in global 
            trade data, providing businesses with the insights to stay ahead.
          </p>
        </div>

        {/* Interactive World Map */}
        <div className="relative bg-blue-800/30 rounded-2xl p-8 backdrop-blur-sm border border-blue-700/50">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold text-white mb-2">Global Trade Network</h3>
            <p className="text-blue-200">Real-time visualization of international trade flows</p>
          </div>

          <div className="relative">
            <svg
              ref={svgRef}
              viewBox="0 0 100 80"
              className="w-full h-64 lg:h-96 bg-blue-900/50 rounded-xl border border-blue-600/30"
              style={{ maxHeight: '400px' }}
            >
              {/* World Map Outline (Simplified) */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(99, 179, 237, 0.1)" strokeWidth="0.5"/>
                </pattern>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <rect width="100" height="80" fill="url(#grid)" />

              {/* Continents (Simplified shapes) */}
              <path d="M 8 25 Q 12 20 18 25 Q 25 30 30 35 Q 28 45 25 50 Q 20 48 15 45 Q 10 40 8 35 Z" 
                    fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="0.5" />
              <path d="M 45 15 Q 55 12 65 18 Q 70 25 68 35 Q 65 45 60 50 Q 55 48 50 45 Q 45 35 45 25 Z" 
                    fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="0.5" />
              <path d="M 70 20 Q 85 18 90 25 Q 88 35 85 45 Q 80 50 75 48 Q 70 40 70 30 Z" 
                    fill="rgba(59, 130, 246, 0.2)" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="0.5" />

              {/* Trade Routes with Animation */}
              {tradeRoutes.map((route, index) => (
                <g key={index}>
                  <path
                    d={`M ${route.from.x} ${route.from.y} Q ${(route.from.x + route.to.x) / 2} ${Math.min(route.from.y, route.to.y) - 10} ${route.to.x} ${route.to.y}`}
                    fill="none"
                    stroke={route.color}
                    strokeWidth="0.8"
                    strokeOpacity="0.6"
                    className="trade-route"
                    style={{
                      strokeDasharray: '2 2',
                      strokeDashoffset: '20',
                      animation: 'dash 3s linear infinite'
                    }}
                  />
                  <circle
                    cx={route.from.x}
                    cy={route.from.y}
                    r="2"
                    fill={route.color}
                    className="animate-pulse"
                  />
                </g>
              ))}

              {/* Country Dots */}
              {countries.map((country, index) => (
                <g key={index}>
                  <circle
                    cx={country.x}
                    cy={country.y}
                    r={country.size / 2}
                    fill={country.color}
                    filter="url(#glow)"
                    className="cursor-pointer transition-all duration-300 hover:r-8 animate-pulse"
                    onMouseEnter={() => setHoveredCountry(country.country)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    style={{
                      animation: `pulse 2s infinite ${index * 0.2}s`
                    }}
                  />
                  <circle
                    cx={country.x}
                    cy={country.y}
                    r={country.size / 3}
                    fill="white"
                    fillOpacity="0.8"
                  />
                </g>
              ))}

              {/* Tooltip */}
              {hoveredCountry && (
                <g>
                  {(() => {
                    const country = countries.find(c => c.country === hoveredCountry);
                    if (!country) return null;
                    return (
                      <g>
                        <rect
                          x={country.x + 2}
                          y={country.y - 8}
                          width="24"
                          height="12"
                          fill="rgba(0, 0, 0, 0.8)"
                          rx="2"
                        />
                        <text
                          x={country.x + 4}
                          y={country.y - 2}
                          fill="white"
                          fontSize="3"
                          fontWeight="bold"
                        >
                          {country.country}
                        </text>
                        <text
                          x={country.x + 4}
                          y={country.y + 2}
                          fill="#60A5FA"
                          fontSize="2.5"
                        >
                          {country.exports}
                        </text>
                      </g>
                    );
                  })()}
                </g>
              )}
            </svg>

            {/* Trade Statistics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">2.4M+</div>
                <div className="text-sm text-blue-200">Shipments tracked</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">180+</div>
                <div className="text-sm text-blue-200">Countries covered</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">$15.7T</div>
                <div className="text-sm text-blue-200">Trade value tracked</div>
              </div>
              <div className="text-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">Real-time</div>
                <div className="text-sm text-blue-200">Data updates</div>
              </div>
            </div>
          </div>
        </div>

        <style>
          {`
            @keyframes dash {
              to {
                stroke-dashoffset: 0;
              }
            }
            
            @keyframes pulse {
              0%, 100% {
                opacity: 1;
                transform: scale(1);
              }
              50% {
                opacity: 0.7;
                transform: scale(1.1);
              }
            }
            
            .animate-route {
              animation: dash 3s linear infinite;
            }
          `}
        </style>
      </Container>
    </section>
  );
}