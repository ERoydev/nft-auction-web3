import {Link} from "react-router-dom";

export default function Navlinks() {
    return(
        <>
            <Link to="/marketplace" className="block text-sm font-semibold text-gray-900 hover:bg-gray-200 rounded-full p-2">
              Marketplace
            </Link>
            <a href="#" className="block text-sm font-semibold text-gray-900 hover:bg-gray-200 rounded-full p-2">
              Auctions
            </a>
            <a href="#" className="block text-sm font-semibold text-gray-900 hover:bg-gray-200 rounded-full p-2">
              Past Auctions
            </a>
            <a href="#" className="block text-sm font-semibold text-gray-900 hover:bg-gray-200 rounded-full p-2">
              Company
            </a>
        </>
    );
}