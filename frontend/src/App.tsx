import { Route, Routes } from "react-router-dom";
import BottomBackgroundBlur from "./components/background/BottomBackgroundBlur";
import TopBackgroundBlur from "./components/background/TopBackgroundBlur";
import Header from "./components/common/Header";
import NFTMarketplace from "./pages/NftMarketplace";
import MintNFT from "./pages/MintNFT";
import Footer from "./components/common/Footer";
import Home from "./pages/Home";
import Company from "./pages/Company";
import ProfileMenu from "./pages/ProfileMenu";
import AdminPanel from "./pages/admin/AdminPanel";
import Auction from "./pages/Auction";
import { WalletProvider } from "./context/WalletContext";
import AuthenticatedRoute from "./guards/AuthenticatedRoute";
import { useState } from "react";
import ErrorMessageComponent from "./components/reusable/ErrorMessageComponent";

function App() {
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div className="bg-white">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <WalletProvider>
          <TopBackgroundBlur />
          <Header />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<NFTMarketplace title={"NFT Marketplace"} />} />
              <Route path="/company" element={<Company />} />

              {/* Routes for Logged-In Wallets */}
              <Route
                path="/auction"
                element={
                  <AuthenticatedRoute setErrorMessage={setErrorMessage}>
                    <Auction />
                  </AuthenticatedRoute>
                }
              />

              <Route path="/mintnft" element={
                <AuthenticatedRoute setErrorMessage={setErrorMessage}>
                  <MintNFT />
                </AuthenticatedRoute>
                } 
              />

              <Route path="/profilemenu" element={
                <AuthenticatedRoute setErrorMessage={setErrorMessage}>
                  <ProfileMenu />
                </AuthenticatedRoute>
                } 
              />

              {/* Admin Routes*/}
              <Route path="/admin" element={<AdminPanel />} />

            </Routes>
          <BottomBackgroundBlur />
        </WalletProvider>
      </div>

      {errorMessage && <ErrorMessageComponent message={errorMessage} />}
      <Footer />
    </div>
  );
}

export default App;
