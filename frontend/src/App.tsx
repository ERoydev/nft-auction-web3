import { Route, Routes } from "react-router-dom";
import BottomBackgroundBlur from "./components/background/BottomBackgroundBlur";
import TopBackgroundBlur from "./components/background/TopBackgroundBlur";
import Header from "./components/common/Header";
import Hero from "./pages/Hero";
import NFTMarketplace from "./pages/NftMarketplace";
import StepsSection from "./pages/Steps";

function App() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <TopBackgroundBlur />
        <Header />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/marketplace" element={<NFTMarketplace />} />
          </Routes>
        <StepsSection />
        <BottomBackgroundBlur />
      </div>
    </div>
  );
}

export default App;
