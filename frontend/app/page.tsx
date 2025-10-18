// import Features from "@/components/Features";
import { FeaturesSection } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/hero";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      {/* <Features/> */}
      <HeroSection/>
      <FeaturesSection/>
      <Footer/>
    </div>
  );
}
