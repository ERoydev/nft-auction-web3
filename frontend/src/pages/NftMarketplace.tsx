export default function NFTMarketplace() {
  // Example NFT data
  const imageExample = "https://i.guim.co.uk/img/media/ef8492feb3715ed4de705727d9f513c168a8b196/37_0_1125_675/master/1125.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=d456a2af571d980d8b2985472c262b31"
  const nftData = [
    { id: 1, price: "1.2 ETH" },
    { id: 2, price: "0.8 ETH" },
    { id: 3, price: "2.5 ETH" },
    { id: 4, price: "3.0 ETH" },
    { id: 5, price: "1.0 ETH" },
    { id: 6, price: "0.5 ETH" },
    { id: 7, price: "4.0 ETH" },
    { id: 8, price: "2.0 ETH" },
  ];

  return (
    <div className="py-32 px-6 sm:px-12 lg:px-24">
      <h1 className="text-4xl font-bold text-center text-purple-800/60 mb-12">
        NFT Marketplace
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {nftData.map((nft) => (
          <div
            key={nft.id}
            className="rounded-lg shadow-md bg-white overflow-hidden hover:shadow-xl hover:scale-105 transition-transform duration-300 hover:cursor-pointer"
          >
            <img
              src={imageExample}
              alt={`NFT ${nft.id}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-lg font-semibold text-gray-800">
                Price: {nft.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}