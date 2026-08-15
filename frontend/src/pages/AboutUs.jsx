import React from 'react';
import HeroImage from '../assets/heroimage.png';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';

const AboutUs = () => {
  return (
    <div className="pt-28 pb-24 bg-cream min-h-screen">
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-16 text-center">
        <span className="text-xs uppercase tracking-wide text-stone-400 font-medium">ATELIER MANIFESTO</span>
        <h1 className="text-4xl md:text-7xl font-serif font-bold text-neutral-900 mt-3 tracking-tight">
          THE AURA STORY
        </h1>
        <p className="mt-4 text-stone-500 text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
          Founded in 2026, AURA was born out of a desire for stripped-back design, pure silhouettes, and uncompromising textile quality.
        </p>
      </section>

      {/* Main Image Grid */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 my-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] bg-stone-200 overflow-hidden rounded-xs">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80"
              alt="AURA Studio"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-6 md:pl-8">
            <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900">
              Form Follows Fabric
            </h2>
            <p className="text-stone-600 text-sm font-light leading-relaxed">
              We reject seasonal fast fashion cycles. Every hoodie, trouser, and jacket is developed through months of pattern tweaking, custom weight cotton selection, and garment-dyeing trials.
            </p>
            <p className="text-stone-600 text-sm font-light leading-relaxed">
              Our aesthetic is rooted in understated luxury — clothing that adapts to your life, built with heavyweight cottons, selvedge denims, and clean french terry fabrics.
            </p>

            <div className="pt-4 border-t border-stone-200 grid grid-cols-2 gap-6 text-left">
              <div>
                <h4 className="text-2xl font-serif font-bold text-neutral-900">450 GSM</h4>
                <p className="text-[11px] text-stone-400 uppercase tracking-normal font-medium mt-1">Heavy French Terry</p>
              </div>
              <div>
                <h4 className="text-2xl font-serif font-bold text-neutral-900">100%</h4>
                <p className="text-[11px] text-stone-400 uppercase tracking-normal font-medium mt-1">Organic Cotton Base</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-stone-900 text-stone-100 py-24 my-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-3 gap-12">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wide text-stone-400 font-mono">01</span>
            <h3 className="text-xl font-serif font-medium text-white">Ethical Craft</h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Partnering exclusively with certified ateliers ensuring fair wages, safe environments, and zero compromise on construction.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wide text-stone-400 font-mono">02</span>
            <h3 className="text-xl font-serif font-medium text-white">Timeless Palette</h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Monochrome, cream, stone, and washed charcoal hues engineered to blend seamlessly into any capsule wardrobe.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wide text-stone-400 font-mono">03</span>
            <h3 className="text-xl font-serif font-medium text-white">Minimal Waste</h3>
            <p className="text-stone-400 text-xs font-light leading-relaxed">
              Small batch production runs to eliminate deadstock fabrics and ensure maximum quality assurance per piece.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-serif font-medium">Ready to experience AURA?</h2>
        <p className="text-stone-500 text-xs uppercase tracking-wide mt-2 mb-8">Discover our latest garment releases</p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-black text-white px-9 py-4 text-xs uppercase tracking-wide font-medium hover:bg-neutral-800 transition"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  );
};

export default AboutUs;
