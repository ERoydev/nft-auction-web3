import { Route, Routes } from "react-router-dom";
import BottomBackgroundBlur from "./components/background/BottomBackgroundBlur";
import TopBackgroundBlur from "./components/background/TopBackgroundBlur";
import Header from "./components/common/Header";
import NFTMarketplace from "./pages/NftMarketplace";
import MintNFT from "./pages/MintNFT";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Company from "./pages/Company";

function App() {
  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <TopBackgroundBlur />
        <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/marketplace" element={<NFTMarketplace />} />
            <Route path="/mintnft" element={<MintNFT />} />
            <Route path="/company" element={<Company />} />
          </Routes>
        <BottomBackgroundBlur />
      </div>
      <Footer />
    </div>
  );
}

export default App;
