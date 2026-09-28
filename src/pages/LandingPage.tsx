import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import TrendingCarousel from '../components/TrendingCarousel';
import Features from '../components/Features';
import Roles from '../components/Roles';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <section className="py-16 sm:py-20 bg-slate-50/50 border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <TrendingCarousel />
          </div>
        </section>
        <Features />
        <Roles />
      </main>
      <Footer />
    </>
  );
}

