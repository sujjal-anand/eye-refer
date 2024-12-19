import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { TiEye } from "react-icons/ti";
import { Local } from "../env/config";

const Patientsreceived = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authtoken");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input
  const pageSize = 10; // Number of rows per page

  const fetchReferredReceived = async () => {
    const response = await axios.get(`${Local.BASE_URL}/referrreceive`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["patientsreceived"],
    queryFn: fetchReferredReceived,
  });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading patients...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  // Filter data based on search query
  const filteredData = data?.rows?.filter((patient: any) => {
    const fullName = `${patient.firstname} ${patient.lastname}`.toLowerCase();
    return (
      fullName.includes(searchQuery.toLowerCase()) || // Search by name
      patient.dob.includes(searchQuery) || // Search by DOB
      patient.referredtoname?.toLowerCase().includes(searchQuery.toLowerCase()) // Search by referred to name
    );
  });

  // Calculate paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData?.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(filteredData?.length / pageSize);

  return (
    <div
      className="p-6 dashboard bg-secondary-subtle"
      style={{ marginLeft: "15rem", height: "100vh" }}
    >
      <div
        className="heading mb-4 flex items-center justify-between"
        style={{ paddingTop: "23px" }}
      >
        <h2 className="text-2xl font-semibold text-gray-700">Refer Received</h2>
      </div>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by Name, DOB, or Referred To"
        className="w-full p-2 mb-4 border rounded-md"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="table-container bg-white p-2 rounded-lg overflow-x-auto shadow-md transition-shadow duration-300 ease-in-out">
        <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
          <table className="table-auto w-full">
            <thead>
              <tr className="border-b text-left text-gray-600">
                {[
                  "Patient Name",
                  "DOB",
                  "Referred On",
                  "Referred To",
                  "Consult Date",
                  "Surgery Date",
                  "Status",
                  "Return to Referrer",
                  "Consult Note",
                  "Direct Message",
                  "Actions",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="font-roboto font-medium text-sm leading-6 tracking-tight border-b border-gray-300 text-center whitespace-nowrap px-4 py-2"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((patient: any) => (
                <tr key={patient.id} className="border-b text-gray-600">
                  <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                    {patient.firstname} {patient.lastname}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">
                    {patient.dob}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">
                    {new Date(patient.createdat).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">
                    {patient.referredtoname}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">
                    {patient.consultationdate || "-"}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">
                    {patient.surgerydate || "-"}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">
                    {patient.Status}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">
                    {patient.return_to_care ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">
                    <a
                      href={`http://localhost:3000/app/note/${patient.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View Note
                    </a>
                  </td>
                  <td className="px-4 py-2 text-left text-gray-800 whitespace-nowrap">
                    <a href="#" className="text-blue-500 hover:underline">
                      Message
                    </a>
                  </td>
                  <td className="px-4 py-2 text-gray-800 whitespace-nowrap flex justify-center">
                    <button
                      onClick={() => navigate(`/app/viewpatient/${patient.id}`)}
                      className="p-0 rounded-md hover:bg-green-600"
                      style={{
                        background: "lightgreen",
                        width: "24px",
                        height: "24px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TiEye size={16} className="text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
        >
          Previous
        </button>
        <span className="text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Patientsreceived;
