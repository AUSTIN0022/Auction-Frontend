import {
    Apple,
    ArrowRight,
    Clock,
    Download,
    Facebook,
    Gavel,
    Heart,
    Instagram,
    Linkedin,
    Play,
    Search,
    Shield,
    Star,
    Trophy,
    Twitter,
    UserPlus,
    Zap
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Mock data for auctions
const featuredAuctions = [
  {
    id: 1,
    title: "Vintage Ferrari 250 GTO",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop",
    currentBid: 2850000,
    endTime: "2 days left",
    category: "Cars",
    bids: 23
  },
  {
    id: 2,
    title: "Manhattan Penthouse",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
    currentBid: 8500000,
    endTime: "5 days left",
    category: "Properties",
    bids: 12
  },
  {
    id: 3,
    title: "Rare Diamond Necklace",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=300&fit=crop",
    currentBid: 125000,
    endTime: "1 day left",
    category: "Jewelry",
    bids: 45
  },
  {
    id: 4,
    title: "Harley Davidson Classic",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    currentBid: 35000,
    endTime: "3 days left",
    category: "Bikes",
    bids: 18
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Art Collector",
    content: "Found incredible pieces at unbeatable prices. The platform is trustworthy and easy to use.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=60&h=60&fit=crop&crop=face"
  },
  {
    name: "Michael Chen",
    role: "Car Enthusiast",
    content: "Bought my dream vintage car here. The bidding process was transparent and fair.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face"
  },
  {
    name: "Emma Davis",
    role: "Real Estate Investor",
    content: "Great platform for finding unique properties. Customer service is exceptional.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face"
  }
];

const MovingBorder = ({ children, className }) => {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-200 via-indigo-200 to-purple-200 opacity-60 blur-sm animate-pulse"></div>
      <div className="relative bg-white rounded-lg p-1">
        {children}
      </div>
    </div>
  );
};

const GlowingCard = ({ children, className }) => {
  return (
    <div className={`relative group ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-200 to-indigo-200 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      <div className="relative bg-white rounded-lg">
        {children}
      </div>
    </div>
  );
};

const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-sky-300 rounded-full animate-ping opacity-40"></div>
      <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-indigo-300 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-rose-300 rounded-full animate-bounce opacity-30"></div>
      <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-300 rounded-full animate-ping opacity-45"></div>
    </div>
  );
};

const AuctionCard = ({ auction }) => {
  return (
    <GlowingCard className="h-full">
      <div className="relative overflow-hidden rounded-lg bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="relative">
          <img 
            src={auction.image} 
            alt={auction.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 left-2">
            <span className="px-3 py-1 bg-gradient-to-r from-sky-400 to-indigo-400 text-white text-xs rounded-full font-semibold">
              {auction.category}
            </span>
          </div>
          <div className="absolute top-2 right-2">
            <div className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1">
              <Clock className="w-3 h-3 text-gray-600" />
              <span className="text-gray-600 text-xs">{auction.endTime}</span>
            </div>
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-gray-800">{auction.title}</h3>
          <div className="flex justify-between items-center mb-3">
            <div>
              <p className="text-sm text-gray-500">Current Bid</p>
              <p className="text-xl font-bold text-emerald-600">
                ${auction.currentBid.toLocaleString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Bids</p>
              <p className="text-lg font-semibold text-gray-700">{auction.bids}</p>
            </div>
          </div>
          <button className="w-full bg-gradient-to-r from-sky-400 to-indigo-400 text-white py-2 rounded-lg hover:from-sky-500 hover:to-indigo-500 transition-all duration-200 font-semibold">
            Place Bid
          </button>
        </div>
      </div>
    </GlowingCard>
  );
};

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100">
      <div className="flex items-center mb-4">
        <img 
          src={testimonial.avatar} 
          alt={testimonial.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
          <p className="text-sm text-gray-500">{testimonial.role}</p>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
        ))}
      </div>
      <p className="text-gray-600 italic">"{testimonial.content}"</p>
    </div>
  );
};

function LandingPage() {
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const navigate = useNavigate();
  const categories = ['All Categories', 'Cars', 'Bikes', 'Properties', 'Land', 'Electronics', 'Jewelry'];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-sky-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-sky-400 to-indigo-400 p-2 rounded-lg">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
                BidBazaar
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-sky-600 transition-colors font-medium"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button className="px-6 py-2 bg-gradient-to-r from-sky-400 to-indigo-400 text-white rounded-lg hover:from-sky-500 hover:to-indigo-500 transition-all duration-200 font-semibold"
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <FloatingElements />
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100/30 via-indigo-100/30 to-purple-100/30"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
                Find Your Next
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-500 via-rose-400 to-sky-500 bg-clip-text text-transparent">
                Great Deal
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover and bid on premium vehicles, properties, and collectibles in our 
              revolutionary auction platform powered by cutting-edge technology.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <MovingBorder className="p-2">
              <div className="flex items-center bg-white rounded-lg shadow-md">
                <input 
                  type="text" 
                  placeholder="Search luxury cars, properties, art pieces..."
                  className="flex-1 px-6 py-4 text-lg border-none rounded-lg focus:outline-none focus:ring-0"
                />
                <button className="bg-gradient-to-r from-sky-400 to-indigo-400 text-white p-4 rounded-lg hover:from-sky-500 hover:to-indigo-500 transition-all duration-200 mr-2">
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </MovingBorder>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-sky-400 to-indigo-400 text-white shadow-md transform scale-105'
                    : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-sm hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-sky-500 mb-2">50K+</div>
              <div className="text-gray-500">Active Auctions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-500 mb-2">2M+</div>
              <div className="text-gray-500">Happy Bidders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">$5B+</div>
              <div className="text-gray-500">Items Sold</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-400 mb-2">99.9%</div>
              <div className="text-gray-500">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section className="py-20 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                <Star className="inline w-8 h-8 text-amber-400 mr-3" />
                Featured Auctions
              </h2>
              <p className="text-gray-500 text-lg">Handpicked premium items ending soon</p>
            </div>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-sky-400 to-indigo-400 text-white rounded-lg hover:from-sky-500 hover:to-indigo-500 transition-all duration-200 font-semibold">
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredAuctions.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-25 to-indigo-25"></div>
        <FloatingElements />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <p className="text-xl text-gray-500">Start bidding in four simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: UserPlus, title: "Register", desc: "Create your account in seconds and verify your identity", color: "from-sky-300 to-sky-400" },
              { icon: Search, title: "Browse", desc: "Explore thousands of premium items across all categories", color: "from-indigo-300 to-indigo-400" },
              { icon: Gavel, title: "Bid", desc: "Place strategic bids and track your favorites in real-time", color: "from-purple-300 to-purple-400" },
              { icon: Trophy, title: "Win", desc: "Secure payment and enjoy your winning items", color: "from-rose-300 to-rose-400" }
            ].map((step, index) => (
              <GlowingCard key={step.title} className="text-center">
                <div className="p-8 h-full flex flex-col items-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center mb-6 shadow-md`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </GlowingCard>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <MovingBorder>
              <button className="px-8 py-4 bg-gradient-to-r from-sky-400 to-indigo-400 text-white rounded-lg hover:from-sky-500 hover:to-indigo-500 transition-all duration-200 font-semibold text-lg">
                Get Started Today
              </button>
            </MovingBorder>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose BidBazaar?</h2>
            <p className="text-xl text-gray-500">Leading the industry with innovation and trust</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: Shield, 
                title: "Secure & Trusted", 
                desc: "Bank-level security with escrow protection and verified sellers",
                color: "text-emerald-500"
              },
              { 
                icon: Zap, 
                title: "Lightning Fast", 
                desc: "Real-time bidding with instant notifications and live updates",
                color: "text-sky-500"
              },
              { 
                icon: Heart, 
                title: "Loved by Users", 
                desc: "99.9% satisfaction rate with 24/7 customer support",
                color: "text-rose-400"
              }
            ].map((feature) => (
              <div key={feature.title} className="text-center p-8 rounded-xl hover:bg-gray-25 transition-all duration-300">
                <feature.icon className={`w-12 h-12 ${feature.color} mx-auto mb-6`} />
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-sky-25 to-indigo-25 relative overflow-hidden">
        <FloatingElements />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-500">Join thousands of satisfied bidders</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={testimonial.name} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* Download App */}
      <section className="py-20 bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300 text-white relative overflow-hidden">
        <FloatingElements />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6">
                Download Our
                <br />
                Mobile App
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Stay connected and never miss an auction. Bid on the go with our 
                award-winning mobile application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <MovingBorder>
                  <button className="flex items-center space-x-3 bg-gray-800 text-white px-6 py-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                    <Play className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs">Get it on</div>
                      <div className="text-sm font-bold">Google Play</div>
                    </div>
                  </button>
                </MovingBorder>
                <MovingBorder>
                  <button className="flex items-center space-x-3 bg-gray-800 text-white px-6 py-4 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                    <Apple className="w-6 h-6" />
                    <div className="text-left">
                      <div className="text-xs">Download on the</div>
                      <div className="text-sm font-bold">App Store</div>
                    </div>
                  </button>
                </MovingBorder>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-8 max-w-sm mx-auto">
                <div className="bg-gradient-to-br from-gray-600 to-gray-800 rounded-2xl p-8 shadow-xl">
                  <Download className="w-32 h-32 text-white mx-auto opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-sky-400 to-indigo-400 p-2 rounded-lg">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">BidBazaar</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                The world's leading auction platform for premium items. 
                Join millions of satisfied users today.
              </p>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                  <button key={index} className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-600 transition-colors">
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {['Home', 'Auctions', 'How It Works', 'About Us', 'Contact'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Categories</h4>
              <ul className="space-y-3">
                {['Vehicles', 'Real Estate', 'Electronics', 'Jewelry', 'Art'].map((category) => (
                  <li key={category}>
                    <a href="#" className="text-gray-300 hover:text-white transition-colors">{category}</a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
              <p className="text-gray-300 mb-4">
                Get updates on new auctions and exclusive deals.
              </p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-l-lg focus:outline-none focus:border-sky-400 text-white"
                />
                <button className="px-6 py-2 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-r-lg hover:from-sky-500 hover:to-indigo-500 transition-all duration-200 font-semibold">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 md:mb-0">
              © 2025 BidBazaar. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;