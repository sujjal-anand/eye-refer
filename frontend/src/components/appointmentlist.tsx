import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "..";
import { useNavigate } from "react-router-dom";

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
    <div
      className="flex justify-end mt-8"
      style={{ marginLeft: "65px", width: "1225px" }}
    >
      <div className="w-[80%] mr-10">
        <h2 className="text-lg font-semibold mb-4">Appointment List</h2>
        <div className="overflow-x-auto">
          <table className="table-auto border border-gray-300 text-sm w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">DOB</th>
                <th className="border px-2 py-1">Email</th>
                <th className="border px-2 py-1">Phone Number</th>
                <th className="border px-2 py-1">Name</th>
                <th className="border px-2 py-1">Gender</th>
                <th className="border px-2 py-1">Disease Name</th>
                <th className="border px-2 py-1">Appointment Date</th>
                <th className="border px-2 py-1">Appointment Type</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.map((appointment: any, index: number) => (
                <tr key={index} className="text-center">
                  <td className="border px-2 py-1">{appointment.dob}</td>
                  <td className="border px-2 py-1">{appointment.email}</td>
                  <td className="border px-2 py-1">{appointment.phone_no}</td>
                  <td className="border px-2 py-1">
                    {appointment.firstname} {appointment.lastname}
                  </td>
                  <td className="border px-2 py-1">{appointment.gender}</td>
                  <td className="border px-2 py-1">
                    {appointment.disease_name}
                  </td>
                  <td className="border px-2 py-1">
                    {appointment.appointmentdate}
                  </td>
                  <td className="border px-2 py-1">
                    {appointment.appointmenttype}
                  </td>
                  <td className="border px-2 py-1">
                    {appointment.appointmenttype === "Consultation"
                      ? appointment.consulatationdate || "N/A"
                      : appointment.surgerydate || "N/A"}
                  </td>
                  <td className="border px-2 py-1">{appointment.Status}</td>
                  <td className="border px-2 py-1">
                    <button
                      className="btn btn-success btn-xs mr-1"
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
                    <button
                      className="btn btn-danger btn-xs mr-1"
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
                    <button
                      className="btn btn-primary btn-xs"
                      onClick={() => {
                        navigate(
                          `/app/appointmentreschedule/${appointment.id}`
                        );
                      }}
                    >
                      Reschedule
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentList;
