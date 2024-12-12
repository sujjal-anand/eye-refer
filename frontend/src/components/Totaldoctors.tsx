import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Local } from "../env/config";

const Doctors = () => {
  const [page, setPage] = useState(1);
  const [input, setInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    console.log("Updated search:", search);
  }, [search]);

  // Fetch function to get total doctors data
  const fetchTotalDoctors = async (page: number) => {
    const response = await axios.get(
      `${Local.BASE_URL}/${Local.TOTAL_DOCTORS}?page=${page}&search=${search}`
    );
    return response.data;
  };

  // Using React Query to fetch data
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["totaldoctors", page, search],
    queryFn: () => fetchTotalDoctors(page),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-gray-700">Loading doctors...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-lg font-medium text-red-600">
          Error: {error.message}
        </p>
      </div>
    );
  }

  const doctors = data?.rows || [];
  const totalPages = Math.ceil(data?.count / 2);
  console.log(doctors);
  return (
    <div
      className="min-h-screen bg-secondary-subtle py-10 flex flex-col items-center "
      style={{ marginLeft: "35px" }}
    >
      {/* Container for heading and search input */}
      <div className="w-full max-w-3xl flex flex-col items-start mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Doctors</h2>

        <div
          className="mb-4 flex items-center space-x-2"
          style={{
            width: "400px",
            height: "53px",
            borderRadius: "5px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            gap: "1rem",
          }}
        >
          <input
            name="search"
            type="search"
            placeholder="Search doctor name"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border rounded p-2"
            style={{ height: "35px", width: "80%" }}
          />
          {input && (
            <button
              onClick={() => setInput("")}
              className="w-11 h-11 flex items-center justify-center bg-transparent text-black text-xl font-bold border-0 border-transparent rounded-full hover:bg-gray-100"
            >
              &times;
            </button>
          )}
          <button
            type="submit"
            onClick={() => setSearch(input)}
            className="ml-2 px-4 py-2 bg-[#35C0E4] hover:bg-[#2BAFD0] text-white rounded"
            style={{ height: "35px" }}
          >
            Search
          </button>
        </div>
      </div>

      {doctors.length > 0 ? (
        <div className="w-[78%] relative left-[-13px] bg-white shadow-lg rounded-lg p-3 ml-[250px] mr-4 font-normal text-sm leading-[1.43] tracking-[0.01071em] table-cell align-middle">
          <div className="overflow-x-auto">
            <table className="w-full bg-white text-center rounded border-collapse mb-2">
              <thead className=" text-nowrap border-b">
                <tr className="bg-white">
                  <th className=" px-3  font-semibold text-gray-700 w-2/6 ">
                    Doctor Name
                  </th>
                  <th className="py-1 px-3  font-semibold text-gray-700 w-1/6">
                    Referral Placed
                  </th>
                  <th className="py-1 px-3  font-semibold text-gray-700 w-1/6">
                    Referral Completed
                  </th>
                  <th className="py-1 px-3  font-semibold text-gray-700 w-1/6">
                    Avg Time of Contact (mins)
                  </th>
                  <th className="py-1 px-3 font-semibold text-gray-700 w-1/6">
                    Avg Time of Consult (mins)
                  </th>
                  <th className="py-1 px-3  font-semibold text-gray-700 w-1/6">
                    Phone
                  </th>
                  <th className="py-1 px-3  font-semibold text-gray-700 w-2/6">
                    Email
                  </th>
                  <th className="py-1 px-3  font-semibold text-gray-700 w-1/6">
                    Doctor Type
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor: any) => (
                  <tr key={doctor.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 whitespace-nowrap">
                      Dr. {doctor.firstname} {doctor.lastname}
                    </td>
                    <td className="py-2 px-4">{doctor.referralPlaced || 0}</td>
                    <td className="py-2 px-4">
                      {doctor.referralCompleted || 0}
                    </td>
                    <td className="py-2 px-4">
                      {doctor.avgTimeContact || "-"}
                    </td>
                    <td className="py-2 px-4">
                      {doctor.avgTimeConsult || "-"}
                    </td>
                    <td className="py-2 px-4">{doctor.phone || "N/A"}</td>
                    <td className="py-2 px-4">{doctor.email}</td>
                    <td className="py-2 px-4">{doctor.doctortype}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="w-[78%] relative left-[-13px] bg-white shadow-lg rounded-lg p-8 ml-[250px] mr-4">
          <p className="text-center text-gray-700 w-3/4 mx-auto my-4 text-sm leading-[1.43]">
            No doctors found. Please add some doctors to view their details.
          </p>
        </div>
      )}

      {/* Pagination Numbers */}
      <div className="flex space-x-4 mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setPage(index + 1)}
            className={`px-4 py-2 rounded-md font-semibold transition duration-300 ${
              page === index + 1
                ? "bg-teal-600 text-white"
                : "bg-teal-200 text-teal-600 hover:bg-teal-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Doctors;
