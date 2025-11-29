import AppAppBar from "@/components/landing/AppAppBar";
import FAQ from "@/components/landing/FAQ";
import Features from "@/components/landing/Features";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import Highlights from "@/components/landing/Highlights";
import LogoCollection from "@/components/landing/LogoCollection";
import Pricing from "@/components/landing/Pricing";
import AppTheme from "@/theme/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";

export default function LandingPage() {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        <Divider />
        <Highlights />
        <Divider />
        <Pricing />
        <Divider />
        <FAQ />
        <Divider />
        <Footer />
      </div>
    </AppTheme>
  );
}
