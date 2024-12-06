import axios from "axios";
import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { socket } from "../utils/socketconnection";
import { queryClient } from "..";

const Addappointment = () => {
  const navigate = useNavigate();
  const [referredReceived, setReferredReceived] = useState<any>([]);
  const token = localStorage.getItem("authtoken");

  useEffect(() => {
    const fetchReferredReceived = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/users/referrreceive",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReferredReceived(response?.data?.rows);
      } catch (error) {
        console.error("Error fetching referred patients:", error);
      }
    };
    fetchReferredReceived();
  }, [token]);

  // Validation Schema using Yup
  const validationSchema = Yup.object({
    patientname: Yup.string().required("Patient name is required"),
    appointmentdate: Yup.date().required("Appointment date is required"),
    appointmenttype: Yup.string().required("Type is required"),
  });

  // Initial values for Formik form
  const initialValues = {
    patientname: "",
    appointmentdate: "",
    appointmenttype: "",
    consulatationdate: null,
    surgerydate: null,
    appointmentstatus: "true",
    Status: "scheduled",
  };

  // Handle form submission
  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      console.log(values.patientname);
      const patientid = values.patientname;

      console.log("valuessssssssssssssssssssssssssssss", values);

      const response = await axios.put(
        `http://localhost:5001/users/updatepatient/${values.patientname}`,
        values
      );
      console.log(response?.data?.referredby);
      const referredbyid = response?.data?.referredby;
      console.log("Appointment added:", response.data);
      alert("Appointment added successfully!");
      const docname = localStorage.getItem("senderdoctorname");

      socket.emit("sendNotification", {
        message: `Dr. ${docname} had fixed the appointment of ${response?.data?.firstname}`,
        room: referredbyid,
      });
      navigate("/app/md");
      resetForm();
    } catch (error) {
      console.error("Error adding appointment:", error);
      alert("Failed to add appointment");
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      <h3 className="text-xl font-semibold text-center mb-6">
        Add Appointment
      </h3>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form>
            {/* Patient Name Dropdown */}
            <div className="mb-4">
              <label
                htmlFor="patientname"
                className="block text-sm font-medium text-gray-700"
              >
                Patient Name
              </label>
              <Field
                as="select"
                id="patientname"
                name="patientname"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Patient</option>
                {referredReceived
                  ?.filter((patient: any) => patient.Status === "pending")
                  .map((patient: any) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.firstname}
                    </option>
                  ))}
              </Field>
              <ErrorMessage
                name="patientname"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            {/* Appointment Date */}
            <div className="mb-4">
              <label
                htmlFor="appointmentdate"
                className="block text-sm font-medium text-gray-700"
              >
                Appointment Date
              </label>
              <Field
                type="date"
                id="appointmentdate"
                name="appointmentdate"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              <ErrorMessage
                name="appointmentdate"
                component="div"
                className="text-red-600 text-xs mt-1"
              />
            </div>

            {/* Appointment Type */}
            <div className="mb-4">
              <label
                htmlFor="appointmenttype"
                className="block text-sm font-medium text-gray-700"
              >
                Type
              </label>
              <Field
                as="select"
                id="appointmenttype"
                name="appointmenttype"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">Select Type</option>
                <option value="Consultation">Consultation</option>
                <option value="Surgery">Surgery</option>
              </Field>
            </div>
            {values.appointmenttype === "Consultation" && (
              <div className="mb-4">
                <label
                  htmlFor="consulatationdate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Consultation Date
                </label>
                <Field
                  type="date"
                  id="consulatationdate"
                  name="consulatationdate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            )}

            {/* Conditional Surgery Date Field */}
            {values.appointmenttype === "Surgery" && (
              <div className="mb-4">
                <label
                  htmlFor="surgerydate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Surgery Date
                </label>
                <Field
                  type="date"
                  id="surgerydate"
                  name="surgerydate"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <ErrorMessage
                  name="surgerydate"
                  component="div"
                  className="text-red-600 text-xs mt-1"
                />
              </div>
            )}
            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Appointment"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Addappointment;
