import { Link } from "react-router-dom";
import SmallBanner from "../components/ui/SmallBanner";

export default function Hero() {
  return (
    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-48">
      <SmallBanner title="Explore our latest NFT collections." />

      {/* Buy NFT Section */}
      <div className="text-center">
        <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Discover and Buy Exclusive NFTs.
        </h1>
        <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Browse through our curated collection of NFTs and own unique
          digital assets. Secure your place in the future of digital art.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/marketplace"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Explore NFTs
          </Link>
          <a href="https://www.investopedia.com/non-fungible-tokens-nft-5115211" className="text-sm/6 font-semibold text-gray-900">
            Learn more <span aria-hidden="true">→</span>
          </a>
        </div>

        {/* Statistics Section */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-indigo-600">5K+</p>
            <p className="text-gray-600">Happy Customers</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-indigo-600">2K+</p>
            <p className="text-gray-600">NFTs Sold</p>
          </div>
        </div>
      </div>
    </div>
  );
}