import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "..";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { IoEye } from "react-icons/io5";
const AppointmentList = () => {
  const navigate = useNavigate();
  const fetchAppointments = async () => {
    const token = localStorage.getItem("authtoken");
    //   console.log(first)
    const response = await axios.get(
      "http://localhost:5001/users/appointmentlist",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response?.data);
    return response.data;
  };
  const { data, error, isLoading } = useQuery({
    queryKey: ["appointments"],
    queryFn: fetchAppointments,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching data</p>;
  console.log(data);
  return (
    <div className="bg-secondary-subtle ">
      <div
        className="flex justify-end mt-2"
        style={{ marginLeft: "65px", width: "1225px" }}
      >
        <div className="w-[80%] mr-10">
          <div className="d-flex">
            <h2 className="text-lg font-semibold mb-5 mt-5">
              Appointment List
            </h2>
            <button
              className="bg-blue-400 hover:bg-blue-700 text-white font-bold ms-auto rounded p-2 h-10 mt-5"
              onClick={() => {
                navigate("/app/addappointment");
              }}
            >
              + Add Patient Appointment{" "}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="table-auto  border-gray-300 bg-white text-sm w-full">
              <thead className="border ">
                <tr>
                  <th className=" px-3 py-3">Patient Name</th>
                  <th className=" px-3 py-3">Date</th>
                  <th className=" px-3 py-3">Type</th>
                  <th className=" px-3 py-3">Status</th>
                  <th className=" px-3 py-3">Complete Appointment</th>
                  <th className=" px-3 py-3">Cancel Appointment</th>
                  <th className=" px-3 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((appointment: any, index: number) => (
                  <tr key={index} className=" border text-center">
                    <td className=" px-3 py-3">
                      {appointment.firstname} {appointment.lastname}
                    </td>

                    <td className=" px-3 py-3">
                      {appointment.appointmentdate}
                    </td>
                    <td className=" px-3 py-3">
                      {appointment.appointmenttype}
                    </td>

                    <td className=" px-3 py-3">{appointment.Status}</td>
                    <td className=" px-3 py-3">
                      {" "}
                      <button
                        className="text-success btn-xs mr-1"
                        onClick={async () => {
                          await axios.put(
                            `http://localhost:5001/users/appointmentcompletetd/${appointment.id}`
                          );
                          alert("Completed");
                          queryClient.invalidateQueries({
                            queryKey: ["appointments"],
                          });
                        }}
                      >
                        Complete
                      </button>
                    </td>
                    <td className=" px-3 py-3">
                      {" "}
                      <button
                        className="text-danger btn-xs mr-1"
                        onClick={async () => {
                          await axios.put(
                            `http://localhost:5001/users/appointmentcancelled/${appointment.id}`
                          );
                          alert("Cancelled");
                          queryClient.invalidateQueries({
                            queryKey: ["appointments"],
                          });
                        }}
                      >
                        Cancel
                      </button>
                    </td>

                    <td className=" d-flex px-3 py-3">
                      <CiEdit
                        size={24}
                        className="mr-5"
                        onClick={() => {
                          navigate(
                            `/app/appointmentreschedule/${appointment.id}`
                          );
                        }}
                      />

                      <IoEye
                        size={24}
                        onClick={() => {
                          navigate(`/app/viewpatient/${appointment.id}`);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
