export default function ConnectWallet() {
    return (
      <div className="group relative inline-block rounded-full p-4 transition duration-300 ease-in-out hover:bg-indigo-600">
        <a
          href="#"
          className="block text-sm font-semibold text-gray-900 transition duration-300 ease-in-out group-hover:text-white"
        >
          Connect Wallet <span aria-hidden="true" className="group-hover:translate-x-1 inline-block transition-transform duration-300">&rarr;</span>
        </a>
      </div>
    );
  }