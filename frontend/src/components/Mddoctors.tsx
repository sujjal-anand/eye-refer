import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Local } from "../env/config";

const Mddoctors = () => {
  const [count, setcount] = useState<any>(1);
  const [page, setpage] = useState<any>(1);

  // Fetching MD doctors data from the API
  const fetchMdDoctors = async () => {
    const response = await axios.get(
      `${Local.BASE_URL}/${Local.MD_DOCTORS_LIST}?page=${page}`
    );
    setcount(response?.data?.count);
    return response?.data?.rows;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["mddoctors", page],
    queryFn: fetchMdDoctors,
  });

  const totalpages = Math.ceil(count / 3);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-700">
          Loading MD doctors...
        </p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-red-600">
          Error: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          List of MD Doctors
        </h2>
        {data?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    ID
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Name
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="py-3 px-6 text-left font-semibold text-gray-700">
                    Doctor Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {data?.map((doctor: any) => (
                  <tr key={doctor.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-6">{doctor.id}</td>
                    <td className="py-3 px-6">
                      Dr. {doctor.firstname} {doctor.lastname}
                    </td>
                    <td className="py-3 px-6">{doctor.email}</td>
                    <td className="py-3 px-6">{doctor.doctortype}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-500">No MD doctors found</p>
        )}
        {/* Pagination Buttons */}
        <div className="flex justify-center items-center space-x-4 mt-6">
          {/* Previous Button */}
          <button
            disabled={page === 1}
            onClick={() => setpage(page - 1)}
            className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${
              page === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-teal-500 text-white hover:bg-teal-600"
            }`}
          >
            Prev
          </button>

          {/* Page Indicator */}
          <span className="text-gray-700 font-medium">
            Page {page} of {totalpages}
          </span>

          {/* Next Button */}
          <button
            disabled={page === totalpages}
            onClick={() => setpage(page + 1)}
            className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${
              page === totalpages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-teal-500 text-white hover:bg-teal-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mddoctors;
