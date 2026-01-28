import { Link } from 'react-router-dom'
import { ArrowRight, Shield, Truck, Heart, Zap, Palette, Sparkles, Camera } from 'lucide-react'
import MetallicBorder from '../components/Designer/MetallicBorder'

export default function HomePage() {
  const borderStyles = [
    { id: 'classic', name: 'Classic' },
    { id: 'ornate', name: 'Ornate' },
    { id: 'modern', name: 'Modern' },
    { id: 'elegant', name: 'Elegant' },
  ]

  const borderColors = [
    { id: 'gold', name: 'Gold' },
    { id: 'silver', name: 'Silver' },
    { id: 'bronze', name: 'Bronze' },
    { id: 'copper', name: 'Copper' },
  ]

  const metalBackgrounds = [
    { id: 'brushed', name: 'Brushed Metal', gradient: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)' },
    { id: 'marble', name: 'Marble', gradient: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 25%, #f5f5f5 50%, #e8e8e8 75%, #f5f5f5 100%)' },
    { id: 'solid', name: 'Solid', gradient: 'linear-gradient(135deg, #d4d4d4 0%, #f0f0f0 100%)' },
  ]

  return (
    <div className="min-h-screen bg-navy-900 text-white">
      {/* Hero Section with Product Showcase */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Hero Content */}
            <div className="text-center lg:text-left">
              <div className="mb-6">
                <p className="text-gold-500 uppercase text-sm tracking-wider font-semibold">
                  TRUSTED BY 10,000+ FAMILIES NATIONWIDE
                </p>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                HONOR THEIR MEMORY WITH
                <br />
                <span className="text-gold-500">BEAUTIFUL</span> PRAYER CARDS
              </h1>

              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0">
                Create stunning keepsakes that family and friends will treasure forever. From classic paper cards to premium metal finishes — delivered in as fast as 48 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link
                  to="/design"
                  className="inline-flex items-center justify-center px-8 py-4 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition font-semibold text-lg"
                >
                  Design Prayer Cards
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="#pricing"
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition font-semibold text-lg"
                >
                  See Pricing
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start items-center">
                <div className="flex items-center gap-3">
                  <Shield className="h-6 w-6 text-gold-500" />
                  <span className="text-gray-300">100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="h-6 w-6 text-gold-500" />
                  <span className="text-gray-300">48-Hour Rush Available</span>
                </div>
              </div>
            </div>

            {/* Right: Product Showcase Cards */}
            <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto lg:max-w-none">
              {/* Paper Card Preview */}
              <div className="relative">
                <div className="bg-white rounded-lg shadow-2xl p-4 relative" style={{ width: '180px', height: '306px', margin: '0 auto' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg"></div>
                  <div className="relative h-full flex flex-col items-center justify-center p-2">
                    {/* Photo Placeholder */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 mb-3 shadow-md" style={{
                      backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
                    }}></div>
                    <div className="text-center">
                      <div className="text-navy-900 font-bold text-sm mb-1">John Doe</div>
                      <div className="text-navy-700 text-xs">1940 - 2024</div>
                    </div>
                  </div>
                  <MetallicBorder style="classic" color="gold" className="rounded-lg" />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm font-semibold text-gold-500">PAPER CARDS</div>
                  <div className="text-xs text-gray-400">Glossy Cardstock</div>
                </div>
              </div>

              {/* Metal Card Preview */}
              <div className="relative">
                <div className="bg-white rounded-lg shadow-2xl p-4 relative" style={{ borderRadius: '12px', width: '180px', height: '306px', margin: '0 auto' }}>
                  <div className="absolute inset-0 rounded-lg" style={{ background: 'linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 50%, #c0c0c0 100%)' }}></div>
                  <div className="relative h-full flex flex-col items-center justify-center p-2">
                    {/* Photo Placeholder */}
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 mb-3 shadow-md" style={{
                      backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
                    }}></div>
                    <div className="text-center">
                      <div className="text-navy-900 font-bold text-sm mb-1">Jane Smith</div>
                      <div className="text-navy-700 text-xs">1955 - 2024</div>
                    </div>
                  </div>
                  <MetallicBorder style="ornate" color="silver" className="rounded-lg" />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-sm font-semibold text-gold-500">METAL CARDS</div>
                  <div className="text-xs text-gray-400">Premium Finish</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Banner */}
      <section className="py-8 px-4 bg-navy-800 border-y border-navy-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-8 text-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⭐⭐⭐⭐⭐</span>
            <span className="text-lg font-semibold">4.9/5</span>
            <span className="text-gray-400">(2,500+ reviews)</span>
          </div>
          <div className="text-lg font-semibold">10,000+ Families Served</div>
          <div className="flex items-center gap-2 text-gold-500">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">48hr Rush Delivery</span>
          </div>
        </div>
      </section>

      {/* Product Showcase - Paper & Metal Cards with Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">PHOTO PRAYER CARDS</h2>
            <p className="text-xl text-gray-300">
              Beautiful glossy cardstock prayer cards — the classic choice families have trusted for generations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Paper Cards */}
            <div className="bg-navy-800 rounded-lg p-8 border border-navy-700">
              <h3 className="text-2xl font-bold mb-4">PAPER CARDS</h3>
              <div className="mb-4">
                <p className="text-gray-300 mb-2">55 Cards + 1 Memorial Photo</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-gray-400 line-through text-lg">$125</span>
                  <span className="text-4xl font-bold text-gold-500">$67</span>
                </div>
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  Save $58
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">Need more? Add cards for just $0.77 each</p>
              <Link
                to="/design?type=paper&quantity=55"
                className="block w-full text-center px-6 py-3 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition font-semibold mb-2"
              >
                Start Designing →
              </Link>
              <p className="text-sm text-gray-400 text-center">Thick glossy cardstock</p>
            </div>

            {/* Metal Cards */}
            <div className="bg-navy-800 rounded-lg p-8 border border-navy-700 relative">
              <span className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold">
                PREMIUM
              </span>
              <h3 className="text-2xl font-bold mb-4">METAL CARDS</h3>
              <div className="mb-4">
                <p className="text-gray-300 mb-2">55 Cards + 1 Memorial Photo</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-gray-400 line-through text-lg">$175</span>
                  <span className="text-4xl font-bold text-gold-500">$97</span>
                </div>
                <span className="inline-block bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold">
                  Save $78
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">Additional sets of 55: $77 each</p>
              <Link
                to="/design?type=metal&quantity=55"
                className="block w-full text-center px-6 py-3 bg-navy-700 border-2 border-gold-500 text-gold-500 rounded-lg hover:bg-navy-600 transition font-semibold mb-2"
              >
                Start Designing →
              </Link>
              <p className="text-sm text-gray-400 text-center">Premium metal finish</p>
            </div>
          </div>

          <div className="text-center mt-8 text-gray-400">
            <p>Full color both sides</p>
            <p className="mt-2">
              <span className="text-gold-500">72-Hour $10</span> • <span className="text-gold-500">48-Hour Rush $17</span>
            </p>
          </div>
        </div>
      </section>

      {/* Visual Previews: Border Styles */}
      <section className="py-20 px-4 bg-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Sparkles className="h-8 w-8 text-gold-500" />
              <h2 className="text-4xl font-bold">CHOOSE YOUR BORDER STYLE</h2>
            </div>
            <p className="text-xl text-gray-300">
              4 elegant border styles × 4 metallic colors = 16 stunning combinations
            </p>
          </div>

          <div className="space-y-8">
            {borderStyles.map((style) => (
              <div key={style.id} className="bg-navy-900 rounded-lg p-6">
                <h3 className="text-2xl font-bold mb-6 text-center text-white">{style.name} Border</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {borderColors.map((color) => (
                    <div key={color.id} className="text-center">
                      <div className="relative bg-white rounded-lg shadow-lg mb-3 mx-auto" style={{ width: '140px', height: '238px', maxWidth: '100%' }}>
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-3">
                          <div className="relative h-full flex flex-col items-center justify-center">
                            {/* Photo Placeholder */}
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 mb-2 shadow-sm" style={{
                              backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
                            }}></div>
                            {/* Name placeholder */}
                            <div className="w-20 h-2 bg-gray-300 rounded mb-1"></div>
                            <div className="w-16 h-2 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                        <MetallicBorder style={style.id} color={color.id} className="rounded-lg" />
                      </div>
                      <div className="text-sm font-semibold text-gold-500">{color.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Previews: Metal Card Backgrounds */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Palette className="h-8 w-8 text-gold-500" />
              <h2 className="text-4xl font-bold">METAL CARD BACKGROUNDS</h2>
            </div>
            <p className="text-xl text-gray-300">
              Choose from premium metal finishes for a truly elegant memorial card
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {metalBackgrounds.map((bg) => (
              <div key={bg.id} className="text-center">
                <div className="relative rounded-lg shadow-2xl p-4 mb-4 mx-auto" style={{ borderRadius: '12px', width: '180px', height: '306px', maxWidth: '100%' }}>
                  <div className="absolute inset-0 rounded-lg" style={{ background: bg.gradient }}></div>
                  <div className="relative h-full flex flex-col items-center justify-center p-2">
                    {/* Photo Placeholder */}
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 mb-3 shadow-md" style={{
                      backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
                    }}></div>
                    <div className="text-center">
                      <div className="text-navy-900 font-bold text-xs mb-1">Sample Name</div>
                      <div className="text-navy-700 text-xs">1940 - 2024</div>
                    </div>
                  </div>
                  <MetallicBorder style="ornate" color="gold" className="rounded-lg" />
                </div>
                <div className="text-lg font-semibold text-gold-500">{bg.name}</div>
                <div className="text-sm text-gray-400 mt-1">Premium finish</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Previews: Photo Options */}
      <section className="py-20 px-4 bg-navy-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <Camera className="h-8 w-8 text-gold-500" />
              <h2 className="text-4xl font-bold">PHOTO CUSTOMIZATION</h2>
            </div>
            <p className="text-xl text-gray-300">
              Upload, edit, and position your photos with professional tools
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-navy-900 rounded-lg p-6 text-center">
              <div className="relative bg-white rounded-lg shadow-lg p-4 mb-4 mx-auto" style={{ width: '180px', height: '306px', maxWidth: '100%' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg"></div>
                <div className="relative h-full flex items-center justify-center p-2">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-300 via-blue-400 to-blue-500 shadow-md" style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
                  }}></div>
                </div>
                <MetallicBorder style="classic" color="gold" className="rounded-lg" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Upload & Edit</h3>
              <p className="text-gray-300 text-sm">Zoom, crop, rotate, and adjust brightness</p>
            </div>

            <div className="bg-navy-900 rounded-lg p-6 text-center">
              <div className="relative bg-white rounded-lg shadow-lg p-4 mb-4 mx-auto" style={{ width: '180px', height: '306px', maxWidth: '100%' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg"></div>
                <div className="relative h-full flex flex-col items-center justify-center p-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 via-purple-400 to-purple-500 mb-2 shadow-md" style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
                  }}></div>
                  <div className="text-center">
                    <div className="text-navy-900 font-bold text-xs mb-1">Loved One</div>
                    <div className="text-navy-700 text-xs">1940 - 2024</div>
                  </div>
                </div>
                <MetallicBorder style="elegant" color="silver" className="rounded-lg" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Drag & Position</h3>
              <p className="text-gray-300 text-sm">Place photos exactly where you want them</p>
            </div>

            <div className="bg-navy-900 rounded-lg p-6 text-center">
              <div className="relative bg-white rounded-lg shadow-lg p-4 mb-4 mx-auto" style={{ width: '180px', height: '306px', maxWidth: '100%' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 rounded-lg"></div>
                <div className="relative h-full flex items-center justify-center p-2">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-300 via-green-400 to-green-500 shadow-md" style={{
                    backgroundImage: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), transparent 50%)',
                  }}></div>
                </div>
                <MetallicBorder style="modern" color="bronze" className="rounded-lg" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">Large Format Prints</h3>
              <p className="text-gray-300 text-sm">16"×20" and 18"×24" memorial photo prints</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">WHY CHOOSE US</h2>
            <p className="text-xl text-gray-300">Everything you need for a beautiful memorial card</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center bg-navy-800 rounded-lg p-8">
              <Heart className="h-12 w-12 text-gold-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">FULLY PERSONALIZED</h3>
              <p className="text-gray-300">Upload photos, choose templates, add prayers or verses. Every detail is customizable.</p>
            </div>
            <div className="text-center bg-navy-800 rounded-lg p-8">
              <Shield className="h-12 w-12 text-gold-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">PREMIUM QUALITY</h3>
              <p className="text-gray-300">Metal cards that last forever, or classic glossy cardstock. Professional print quality.</p>
            </div>
            <div className="text-center bg-navy-800 rounded-lg p-8">
              <Truck className="h-12 w-12 text-gold-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">FAST DELIVERY</h3>
              <p className="text-gray-300">Choose from 48-72 hour delivery options. Rush orders available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-navy-800">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12">HOW IT WORKS</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-navy-900 rounded-lg p-8">
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-navy-900">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">DESIGN</h3>
              <p className="text-gray-300">Upload photos, choose borders, add text, and personalize your cards with our easy-to-use designer.</p>
            </div>
            <div className="bg-navy-900 rounded-lg p-8">
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-navy-900">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">ORDER</h3>
              <p className="text-gray-300">Review your design, select quantity, and complete checkout securely with Stripe.</p>
            </div>
            <div className="bg-navy-900 rounded-lg p-8">
              <div className="w-16 h-16 bg-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-navy-900">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">RECEIVE</h3>
              <p className="text-gray-300">Delivered in 48-72 hours, ready for the service. Print-ready quality you can trust.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Create Your Memorial Card?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Start designing your personalized prayer card today. It only takes a few minutes to create something beautiful.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/design"
              className="inline-flex items-center justify-center px-8 py-4 bg-gold-500 text-navy-900 rounded-lg hover:bg-gold-400 transition font-semibold text-lg"
            >
              Start Designing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/funeral-home"
              className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-gold-500 text-gold-500 rounded-lg hover:bg-gold-500/10 transition font-semibold text-lg"
            >
              Funeral Home Portal
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
