import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import placed from "../assets/image.png";
import doctors from "../assets/image copy 2.png";
import completed from "../assets/image copy.png";
import { Local } from "../env/config";
import { json } from "stream/consumers";
import { socket } from "../utils/socketconnection";
import { toast, ToastContainer } from "react-toastify";
import { queryClient } from "..";

const MDdashboard = () => {
  const token = localStorage.getItem("authtoken");
  const [referredreceived, setReferredReceived] = useState<any>([]);
  const [totalDoctors, setTotalDoctors] = useState<any>([]);
  const [patientCount, setPatientCount] = useState<any>("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch MD doctors
  useEffect(() => {
    const fetchTotalDoctors = async () => {
      const response = await axios.get(
        `${Local.BASE_URL}/${Local.TOTAL_DOCTORS}?page=${""}&search=${""}`
      );
      setTotalDoctors(response?.data);
    };
    fetchTotalDoctors();
  }, []);

  // Fetch referred patients with pagination
  useEffect(() => {
    const fetchReferredReceived = async () => {
      const response = await axios.get(
        "http://localhost:5001/users/referrreceive",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setReferredReceived(response?.data?.rows);
      setPatientCount(response?.data?.count);
    };
    if (token) {
      fetchReferredReceived();
    }
  }, [token]);

  // Fetch additional data for doctor details
  const fetchData = async () => {
    const { data } = await axios.get(
      `${Local.BASE_URL}/${Local.DOCTOR_DETAILS}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctorDetails"],
    queryFn: fetchData,
  });

  const docid = data?.doctor?.id;

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (isError)
    return <div className="text-center py-4">Error fetching data</div>;

  return (
    <div
      className="p-6 bg-gray-100"
      style={{ marginLeft: "15.5rem", marginTop: "13px", height: "100vh" }}
    >
      <ToastContainer />
      <p className="text-2xl font-bold mb-4">Dashboard</p>

      <div className="flex flex-wrap gap-4 mb-6">
        {/* Referrals Placed Box */}
        <div className="bg-white rounded-lg p-4 flex-1 min-w-[276px] h-32">
          <a
            href="http://localhost:3000/app/doctors"
            className="text-blue-600 hover:text-blue-800 nav-link"
          >
            <div className="flex items-center justify-between">
              <img
                src={placed}
                alt="Referrals Placed Icon"
                className="h-10 w-10 mt-[-9px]"
              />
              <div className="text-right">
                <p className="font-medium text-lg whitespace-nowrap relative -top-[13px] -left-[40px]">
                  Total OD/MD{" "}
                </p>
                <p className="font-bold text-2xl relative left-[92px]">
                  {totalDoctors?.count ?? 0}
                </p>
              </div>
            </div>
            <div className="text-right mt-2">
              <p
                className="text-xs text-gray-500"
                style={{
                  width: "109px",
                  position: "relative",
                  top: "43px",
                }}
              >
                Last update: Nov 27
              </p>
            </div>
          </a>
        </div>

        {/* Referrals Completed Box */}
        <div className="bg-white rounded-lg p-4 flex-1 min-w-[276px] h-32">
          <a
            href="http://localhost:3000/app/patientreceived"
            className="text-blue-600 hover:text-blue-800 nav-link"
          >
            <div className="flex items-center justify-between">
              <img
                src={completed}
                alt="Referrals Completed Icon"
                className="h-10 w-10 mt-[-9px]"
              />
              <div className="text-right">
                <p className="font-medium text-lg whitespace-nowrap relative -top-[13px] -left-[40px]">
                  Refer Received
                </p>
                <p className="font-bold text-2xl relative left-[61px]">
                  {patientCount}
                </p>{" "}
                {/* Updated left position */}
              </div>
            </div>
            <div className="text-right mt-2">
              <p
                className="text-xs text-gray-500"
                style={{
                  width: "108px",
                  position: "relative",
                  top: "43px",
                  right: "17px",
                }}
              >
                Last update: Nov 28
              </p>
            </div>
          </a>
        </div>

        {/* MD Doctors Box */}
        <div className="bg-white rounded-lg p-4 flex-1 min-w-[276px] h-32">
          <a
            href="http://localhost:3000/app/mddoctors"
            className="text-blue-600 hover:text-blue-800 nav-link"
          >
            <div className="flex items-center justify-between">
              <img
                src={doctors}
                alt="MD Icon"
                className="h-10 w-10 mt-[-9px]"
              />
              <div className="text-right">
                <p className="font-medium text-lg whitespace-nowrap relative -top-[13px] -left-[40px]">
                  MD
                </p>
                <p className="font-bold text-2xl relative left-[199px]">{60}</p>{" "}
                {/* Updated left position */}
              </div>
            </div>
            <div className="text-right mt-2">
              <p
                className="text-xs text-gray-500"
                style={{
                  position: "relative",
                  left: "80px",
                  top: "41px",
                }}
              >
                Last update: Nov 27
              </p>
            </div>
          </a>
        </div>
      </div>

      {/* Referral Patient Section */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xl font-semibold">Referral Patient</p>
        <button
          className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            navigate("/app/addappointment");
          }}
        >
          + Add Patient Appointment{" "}
        </button>
      </div>

      {/* Referred Patients Table */}
      <div className="overflow-x-auto bg-white text-black transition-all duration-300 ease-in-out rounded-md shadow-md w-full">
        <table className="min-w-full bg-white shadow-md rounded-lg border border-gray-300">
          <thead>
            <tr className="bg-white text-gray-600 text-sm leading-[0.75] w-[1225px] h-[56px] border-b border-gray-200">
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Patient Name
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                DOB
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Referred On
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Referred To
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Consultation Date
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Surgery Date
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Status
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Return to Referrer
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Consult Note
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Direct Message
              </th>
              <th className="py-[14px] px-[10px] text-center whitespace-nowrap pointer-events-auto">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {referredreceived?.map((data: any) => (
              <tr
                key={data.id}
                className="border-b border-gray-200 hover:bg-gray-100"
              >
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  {data.firstname} {data.lastname}
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  {data.dob}
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  {new Date(data.createdat).toLocaleDateString()}
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  {data.referredtoname}
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  {data.consulatationdate ? data.consulatationdate : "-"}
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  {data.surgerydate ? data.surgerydate : "-"}
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  <span
                    className={`px-2 py-1 rounded ${
                      data.Status === "cancelled"
                        ? "bg-red-100 text-red-600"
                        : data.Status === "Completed"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {data.Status}
                  </span>
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  {data.return_to_care ? "Yes" : "No"}
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  <a
                    href={`http://localhost:3000/app/note/${data.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Yes
                  </a>
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  <a
                    onClick={() => {
                      const chatdata = {
                        patient: data?.id,
                        user1: data?.referredto,
                        user2: data?.referredby,
                        user: docid,
                        roomname: `${data?.firstname} ${data.lastname}`,
                      };
                      localStorage.setItem(
                        "chatdata",
                        JSON.stringify(chatdata)
                      );
                      console.log("<><<<<", chatdata);
                      localStorage.setItem("pname", chatdata.roomname);
                      navigate("/app/chat");
                      return;
                    }}
                    className="text-blue-500 hover:underline"
                  >
                    Send Message
                  </a>
                </td>
                <td className="py-[14px] px-[10px] text-center whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/app/viewpatient/${data.id}`)}
                    className="text-blue-500 hover:underline"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          Previous
        </button>
        <span className="flex items-center justify-center">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default MDdashboard;
