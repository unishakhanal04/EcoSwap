import React from "react";

const dummyRequests = [
  {
    id: 1,
    buyerName: "Anish Karki",
    item: "Recycled Plastic Pots",
    quantity: 50,
    message: "Looking for durable eco pots for my garden shop.",
    time: "2 hours ago",
  },
  {
    id: 2,
    buyerName: "Sita Rai",
    item: "Used Glass Bottles",
    quantity: 100,
    message: "Need for art project, different shapes preferred.",
    time: "5 hours ago",
  },
  {
    id: 3,
    buyerName: "Ram Shrestha",
    item: "Old Newspapers",
    quantity: 200,
    message: "Collecting for packing materials.",
    time: "1 day ago",
  },
];

const RequestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#007f66] mb-6 text-center md:text-left">
          Buyer Purchase Requests
        </h1>
        <div className="h-[70vh] overflow-y-auto pr-1 sm:pr-2">
          <div className="grid gap-4">
            {dummyRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col md:flex-row justify-between items-start md:items-center transition hover:shadow-lg"
              >
                <div className="flex items-start md:items-center gap-4 w-full">
                  <div className="hidden md:flex h-10 w-10 rounded-full bg-[#007f66]/10 text-[#007f66] items-center justify-center font-bold">
                    {req.buyerName[0]}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-800">
                      {req.buyerName} wants {req.item}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Quantity: {req.quantity}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      "{req.message}"
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{req.time}</p>
                  </div>
                </div>
                <button className="mt-4 md:mt-0 w-full text-black sm:w-auto flex items-center justify-center gap-2 bg-[#FFFFE0] hover:bg-[#FFFFE0]  px-4 py-2 rounded-md text-sm transition">
                 pending
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;