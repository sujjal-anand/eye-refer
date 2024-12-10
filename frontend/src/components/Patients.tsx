import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Local } from "../env/config";
import { MdEdit, MdDelete } from "react-icons/md";
import { TiEye } from "react-icons/ti";
import { FaPlus, FaSearch } from "react-icons/fa";
import { queryClient } from "..";
const Patients = () => {
  queryClient.invalidateQueries();

  const navigate = useNavigate();
  const token = localStorage.getItem("authtoken");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [input, setInput] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    console.log("Updated search:", search);
  }, [search]);

  const fetchReferredPatients = async (page: number) => {
    const response = await axios.get(
      `${Local.BASE_URL}/${Local.GET_REFERRED_PATIENT}?page=${page}&limit=${limit}&search=${search}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  };

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["totalreferredpatients", page, search],
    queryFn: () => fetchReferredPatients(page),
  });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading patients...</p>;
  }

  if (isError) {
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  const totalPatients = data?.count || 0;
  const totalPages = Math.ceil(totalPatients / limit);

  return (
    <div
      className="p-6 dashboard bg-secondary-subtle"
      style={{ marginLeft: "15rem", height: "100%" }}
    >
      <div
        className="heading mb-4 flex items-center justify-between"
        style={{ paddingTop: "23px" }}
      >
        <h2 className="text-2xl font-semibold text-gray-700">
          Referral Patients
        </h2>
        <button
          className="ml-auto w-[237px] h-[48px] rounded-md text-white font-semibold text-lg relative bg-[#3498db] flex items-center justify-center gap-2"
          onClick={() => {
            navigate("/app/addreferpatient");
          }}
        >
          <FaPlus /> Add Referral Patient
        </button>
      </div>

      <div>
        <div className="search mb-4 flex items-center">
          <input
            name="search"
            type="search"
            placeholder="Search patient name"
            className="border px-4 py-2 rounded-md shadow-sm w-1/3"
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="ml-4 w-[131px] h-[48px] px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center space-x-2"
            onClick={() => setSearch(input)}
          >
            <FaSearch size={20} /> {/* Adds the FaSearch icon */}
            <span>Search</span> {/* Text next to the icon */}
          </button>
        </div>

        <div className="table-container bg-white p-2 rounded-lg overflow-x-auto shadow-md transition-shadow duration-300 ease-in-out">
          {" "}
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
                      className="font-roboto font-medium text-sm leading-6 tracking-tight border-b border-gray-300 text-center whitespace-nowrap px-4 py-2 pointer-events-auto"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.rows?.map((patient: any) => (
                  <tr key={patient.id} className="border-b text-gray-600">
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      {patient.firstname} {patient.lastname}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      {patient.dob}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      {new Date(patient.createdat).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      {patient.referredtoname}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      {patient.consultationdate || "-"}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      {patient.surgerydate || "-"}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      {patient.Status}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      {patient.return_to_care ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      <a
                        href={`http://localhost:3000/app/note/${patient.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View Note
                      </a>
                    </td>
                    <td className="px-4 py-2 text-left text-gray-800 capitalize whitespace-nowrap">
                      <a href="#" className="text-blue-500 hover:underline">
                        Message
                      </a>
                    </td>
                    <td className="px-4 py-2 text-gray-800 capitalize whitespace-nowrap flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          navigate(`/app/viewpatient/${patient.id}`);
                        }}
                        className="p-0 rounded-md hover:bg-green-600"
                        style={{
                          background: "lightgreen",
                          width: "24px",
                          height: "24px",
                          backgroundSize: "24px 24px",
                          display: "flex",
                          justifyContent: "center", // Centers horizontally
                          alignItems: "center", // Centers vertically
                        }}
                      >
                        <TiEye size={16} className="text-white" />
                      </button>

                      <button
                        onClick={() => {
                          navigate(`/app/updatepatient/${patient.id}`);
                        }}
                        className="text-white flex items-center justify-center w-6 h-6 bg-[#35c0e4] hover:bg-teal-600 rounded-md"
                      >
                        <MdEdit size={16} /> {/* Set icon size to 16x16 */}
                      </button>
                      <button
                        onClick={async () => {
                          const confirmDelete = window.confirm(
                            "Are you sure you want to delete this patient?"
                          );
                          if (confirmDelete) {
                            try {
                              await axios.delete(
                                `${Local.BASE_URL}/deletepatient/${patient.id}`
                              );
                              alert("Patient deleted successfully!");
                              queryClient.invalidateQueries({
                                queryKey: ["totalreferredpatients"],
                              });
                            } catch (error) {
                              console.error("Error deleting patient:", error);
                              alert(
                                "Failed to delete patient. Please try again."
                              );
                            }
                          }
                        }}
                        className="flex items-center justify-center w-6 h-6 bg-[#ff0000] hover:bg-red-600 text-white rounded-md"
                      >
                        <MdDelete size={16} /> {/* Set icon size to 16x16 */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="pagination mt-4 flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`${
                page === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              } px-4 py-2 rounded-md hover:bg-blue-600`}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Patients;
