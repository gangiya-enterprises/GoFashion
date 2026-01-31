
import React, { useState, useMemo, useEffect } from 'react';
import { AppView, Product, CartItem } from './types';
import { PRODUCTS, CATEGORIES } from './constants';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import AIStylist from './components/AIStylist';

const App: React.FC = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [view, setView] = useState<AppView>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Simulate app loading/opening experience
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'All') return PRODUCTS;
    if (selectedCategory === 'Sale') return PRODUCTS.filter(p => p.tag === 'Sale');
    return PRODUCTS.filter(p => p.category === selectedCategory);
  }, [selectedCategory]);

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  if (isAppLoading) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex flex-col items-center justify-center z-[100]">
        <div className="serif text-4xl md:text-6xl text-white font-bold tracking-tighter mb-4 animate-pulse">
          VOGUE<span className="text-rose-500 underline decoration-4 underline-offset-8">AI</span>
        </div>
        <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden mt-8">
          <div className="h-full bg-rose-500 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-slate-400 text-xs mt-6 uppercase tracking-[0.3em] font-medium">Curating your style...</p>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white animate-in fade-in duration-1000">
      <Navbar currentView={view} setView={setView} cartCount={cartCount} />

      <main className="px-4 py-8 sm:px-8">
        <div className="max-w-7xl mx-auto">
          {view === 'home' && (
            <div className="space-y-16">
              {/* Hero Section */}
              <section className="relative h-[600px] overflow-hidden rounded-3xl bg-slate-900 group">
                <img 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1920" 
                  alt="Fashion Sale"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[2000ms] group-hover:scale-110"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
                  <span className="text-sm font-bold uppercase tracking-[0.3em] mb-4 animate-bounce">Season Finale</span>
                  <h1 className="serif text-5xl md:text-7xl font-bold mb-6 italic tracking-tight drop-shadow-2xl">The Big Fashion Sale</h1>
                  <p className="max-w-xl text-lg text-slate-200 mb-8 font-light">Up to 70% off on designer labels. Elevate your wardrobe with VogueAI's curated collections.</p>
                  <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button 
                      onClick={() => setView('shop')}
                      className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full shadow-lg shadow-rose-500/20 active:scale-95"
                    >
                      Shop Now
                    </button>
                    <button 
                      onClick={() => setView('ai-stylist')}
                      className="bg-white/10 backdrop-blur-md hover:bg-white hover:text-slate-900 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest transition-all rounded-full border border-white/30 active:scale-95"
                    >
                      Ask AI Stylist
                    </button>
                  </div>
                </div>
              </section>

              {/* Featured Products */}
              <section className="animate-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-end justify-between mb-8">
                  <div>
                    <h2 className="serif text-3xl font-bold">Featured Drops</h2>
                    <p className="text-slate-500 text-sm mt-2">Handpicked items for the modern aesthetic.</p>
                  </div>
                  <button onClick={() => setView('shop')} className="text-sm font-bold text-rose-500 hover:underline flex items-center group">
                    View All
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {PRODUCTS.slice(0, 3).map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={addToCart} />
                  ))}
                </div>
              </section>

              {/* Promo Banner */}
              <section className="bg-rose-50 rounded-3xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl"></div>
                <div className="max-w-lg mb-8 md:mb-0 relative z-10">
                  <h3 className="serif text-4xl font-bold text-slate-900 mb-4">Personalized Styling is Here</h3>
                  <p className="text-slate-600 leading-relaxed mb-8 text-lg font-light">Our VogueAI Stylist uses advanced vision models to understand your look and provide recommendations that match your personality.</p>
                  <button 
                    onClick={() => setView('ai-stylist')}
                    className="inline-flex items-center space-x-3 bg-slate-900 text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-rose-500 transition-colors group"
                  >
                    <span>Launch AI Stylist</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:translate-x-1 transition-transform">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                </div>
                <div className="relative group">
                   <img 
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800" 
                    alt="AI Feature" 
                    className="w-72 h-96 object-cover rounded-2xl shadow-2xl transition-transform duration-500 group-hover:-rotate-3" 
                  />
                   <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-xl shadow-xl border border-slate-100 flex items-center space-x-3 animate-bounce">
                     <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                     </div>
                     <span className="text-xs font-bold text-slate-900">Styling AI Online</span>
                   </div>
                </div>
              </section>
            </div>
          )}

          {view === 'shop' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <header className="mb-12">
                <h1 className="serif text-4xl font-bold text-slate-900">The Collection</h1>
                <div className="mt-8 flex flex-wrap gap-3">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-8 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                        selectedCategory === cat 
                          ? 'bg-slate-900 text-white shadow-xl scale-105' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </header>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            </div>
          )}

          {view === 'ai-stylist' && (
            <div className="py-4 animate-in zoom-in-95 duration-500">
              <div className="text-center mb-12">
                <div className="inline-block bg-rose-50 text-rose-500 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4">Powered by Gemini</div>
                <h1 className="serif text-4xl font-bold text-slate-900">VogueAI Styling Studio</h1>
                <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Upload a photo of your wardrobe or a person, and let AI curate your next iconic look.</p>
              </div>
              <AIStylist />
            </div>
          )}

          {view === 'cart' && (
            <div className="max-w-4xl mx-auto py-8 animate-in slide-in-from-right-8 duration-500">
              <h1 className="serif text-4xl font-bold mb-12">Your Shopping Bag</h1>
              {cart.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <div className="relative inline-block mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-20 h-20 text-slate-200">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.112 16.826a2.25 2.25 0 0 1-2.244 2.399H4.282a2.25 2.25 0 0 1-2.244-2.399L3.15 8.507a2.25 2.25 0 0 1 2.244-2.206h12.24c1.059 0 1.97.75 2.146 1.794Z" />
                    </svg>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-rose-100 rounded-full flex items-center justify-center animate-ping opacity-75"></div>
                  </div>
                  <p className="text-slate-500 mb-8 text-lg font-light">Your bag is looking a bit empty.</p>
                  <button 
                    onClick={() => setView('shop')}
                    className="bg-slate-900 text-white px-10 py-4 text-xs font-bold uppercase tracking-widest rounded-full shadow-xl hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Explore Collection
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex space-x-6 p-4 border border-slate-100 rounded-2xl bg-white hover:shadow-md transition-all group">
                        <div className="relative overflow-hidden rounded-lg">
                          <img src={item.image} alt={item.name} className="w-24 h-32 object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between py-2">
                          <div>
                            <div className="flex justify-between">
                              <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                              <p className="text-sm font-bold">${item.price * item.quantity}</p>
                            </div>
                            <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-medium">{item.category}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-slate-200 rounded-full bg-slate-50 overflow-hidden">
                              <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-rose-100 hover:text-rose-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                                </svg>
                              </button>
                              <span className="px-3 text-xs font-bold w-8 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-rose-100 hover:text-rose-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                              </button>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-xs text-rose-500 font-bold hover:underline p-2">Remove</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-50 p-8 rounded-3xl h-fit border border-slate-100 sticky top-24 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 text-slate-900">Order Summary</h3>
                    <div className="space-y-4 mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Subtotal</span>
                        <span className="font-bold text-slate-900">${cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Express Delivery</span>
                        <span className="text-green-600 font-bold">Complimentary</span>
                      </div>
                      <div className="border-t border-slate-200 pt-4 flex justify-between items-end">
                        <span className="font-bold text-slate-900">Grand Total</span>
                        <div className="text-right">
                          <p className="text-2xl font-black text-rose-500">${cartTotal}</p>
                          <p className="text-[10px] text-slate-400">Taxes included</p>
                        </div>
                      </div>
                    </div>
                    <button className="w-full bg-slate-900 text-white py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                      Secure Checkout
                    </button>
                    <div className="flex items-center justify-center space-x-2 mt-6">
                      <svg className="w-4 h-4 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Encrypted Payment</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white mt-24 py-16 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
             <div className="serif text-3xl font-bold tracking-tighter mb-6">VOGUE<span className="text-rose-500">AI</span></div>
             <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-light mb-8">
               Redefining fashion retail with Artificial Intelligence. Experience personalized shopping like never before.
             </p>
             <div className="flex space-x-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 transition-colors cursor-pointer">
                  <span className="text-[10px] font-bold">IG</span>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-rose-500 transition-colors cursor-pointer">
                  <span className="text-[10px] font-bold">TW</span>
                </div>
             </div>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-rose-500">Shop</h4>
            <ul className="space-y-4 text-xs text-slate-400 font-light">
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setSelectedCategory('Women'); setView('shop'); window.scrollTo(0,0); }}>Women's Collection</li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setSelectedCategory('Men'); setView('shop'); window.scrollTo(0,0); }}>Men's Collection</li>
              <li className="hover:text-white transition-colors cursor-pointer" onClick={() => { setSelectedCategory('Sale'); setView('shop'); window.scrollTo(0,0); }}>Seasonal Sale</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-rose-500">Support</h4>
            <ul className="space-y-4 text-xs text-slate-400 font-light">
              <li className="hover:text-white transition-colors cursor-pointer">Shipping & Returns</li>
              <li className="hover:text-white transition-colors cursor-pointer">Order Tracking</li>
              <li className="hover:text-white transition-colors cursor-pointer">Size Guide</li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-6 text-rose-500">Stay Inspired</h4>
            <p className="text-xs text-slate-400 font-light mb-4 leading-relaxed">Join our newsletter for exclusive AI-generated style tips and early sale access.</p>
            <div className="flex border-b border-slate-700 pb-2 mt-6">
              <input type="email" placeholder="Email Address" className="bg-transparent text-xs flex-1 outline-none text-white placeholder-slate-600" />
              <button className="text-white text-[10px] font-bold uppercase tracking-widest ml-4 hover:text-rose-500 transition-colors">Join</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/5 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          <div>&copy; 2024 VOGUEAI Fashion Inc. All Rights Reserved.</div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
