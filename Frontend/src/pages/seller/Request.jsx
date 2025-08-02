import React, { useState, useEffect } from "react";
import { requestAPI } from "../../services/api";
import { toast } from "react-hot-toast";

const statusStyles = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  declined: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
};

const RequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvedPrice, setApprovedPrice] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      console.log('Fetching seller requests...');
      const response = await requestAPI.getSellerRequests();
      console.log('Response received:', response.data);
      
      if (response.data.success) {
        setRequests(response.data.data);
        console.log('Requests set:', response.data.data);
      } else {
        console.error('API returned success: false');
        toast.error("Failed to fetch requests");
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (request) => {
    setSelectedRequest(request);
    setApprovedPrice(request.requestedPrice || "");
    setShowPriceModal(true);
  };

  const handleStatusChange = async (id, newStatus, price = null) => {
    try {
      const updateData = { status: newStatus };
      if (newStatus === 'approved' && price) {
        updateData.approvedPrice = parseFloat(price);
      }
      
      console.log('🚀 Sending request update:', { id, updateData });
      
      const response = await requestAPI.updateRequestStatus(id, updateData);
      
      console.log('📨 Response from backend:', response);
      
      if (response.data.success) {
        toast.success(`Request ${newStatus} successfully`);
        fetchRequests();
        setShowPriceModal(false);
        setSelectedRequest(null);
        setApprovedPrice("");
      } else {
        toast.error(`Failed to ${newStatus} request`);
      }
    } catch (error) {
      console.error(`Error ${newStatus} request:`, error);
      toast.error(`Error ${newStatus} request`);
    }
  };

  const handlePriceSubmit = () => {
    if (!approvedPrice || parseFloat(approvedPrice) <= 0) {
      toast.error("Please enter a valid price");
      return;
    }
    const status = selectedRequest.status === 'approved' ? 'approved' : 'approved';
    handleStatusChange(selectedRequest.id, status, approvedPrice);
  };



  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#007f66] mb-6 text-center md:text-left">
          Buyer Purchase Requests
        </h1>
        <div className="h-[70vh] overflow-y-auto pr-1 sm:pr-2">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">Loading requests...</div>
            </div>
          ) : requests.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg text-gray-600">No requests found</div>
            </div>
          ) : (
            <div className="grid gap-4">
              {requests.map((req) => (
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
                      address: {req.address}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      "{req.message}"
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{req.time}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-medium capitalize ${statusStyles[req.status]}`}
                  >
                    {req.status}
                  </span>
                  {req.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(req)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(req.id, "declined")}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {req.status === 'approved' && !req.approvedPrice && (
                    <button
                      onClick={() => handleApprove(req)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      Add Price
                    </button>
                  )}
                  {req.requestedPrice && (
                    <div className="text-sm text-gray-600">
                      Requested: Rs. {req.requestedPrice}
                    </div>
                  )}
                  {req.approvedPrice && (
                    <div className="text-sm text-green-600 font-medium">
                      Approved: Rs. {req.approvedPrice}
                    </div>
                  )}
                </div>
              </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Modal */}
        {showPriceModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Approve Request
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {selectedRequest.buyerName} wants {selectedRequest.item}
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Approved Price (Rs.)
                </label>
                <input
                  type="number"
                  value={approvedPrice}
                  onChange={(e) => setApprovedPrice(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#007f66]"
                  placeholder="Enter approved price"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePriceSubmit}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setShowPriceModal(false);
                    setSelectedRequest(null);
                    setApprovedPrice("");
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;
