import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MarketCards from "../components/MarketCards";
import LiveTicker from "../components/LiveTicker";
import Stats from "../components/Stats";
import WhyChoose from "../components/WhyChoose";
import AccountTypes from "../components/AccountTypes";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
<Hero />
<LiveTicker />
<MarketCards />
      <Stats />
      <WhyChoose />
      <AccountTypes />
      <Testimonials />
      <FAQ />
      <Footer />
    </>
  );
}