import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Local } from "../env/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { queryClient } from "..";
import { FaArrowLeft } from "react-icons/fa";
import { socket } from "../utils/socketconnection";

const validationSchema = Yup.object({
  dob: Yup.date().required("Date of Birth is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone_no: Yup.string().required("Phone number is required"),
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  gender: Yup.string().required("Gender is required"),
  disease_name: Yup.string().required("Disease name is required"),
  laterality: Yup.string().required("Laterality is required"),
  // timing: Yup.string().required("Timing is required"),
  location: Yup.string().required("Location is required"),
  insurance_company_name: Yup.string().required(
    "Insurance company name is required"
  ),
  insurance_plan: Yup.string().required("Insurance plan is required"),
  documentation: Yup.mixed().required("Documentation is required"),
  // .test("fileType", "Only PDF or DOCX files are allowed", (value: any) => {
  //   return value
  //     ? [
  //         "application/tsx",
  //         "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //       ].includes(value.type)
  //     : true;
  // }),
});

const ReferPatientForm = () => {
  const [address, setaddress] = useState<any>([]);
  queryClient.invalidateQueries();
  const navigate = useNavigate();
  const token = localStorage.getItem("authtoken");
  const mutation = useMutation({
    mutationFn: async (formData: any) => {
      return await axios.post(
        `${Local.BASE_URL}/${Local.ADD_PATIENT}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  });
  queryClient.invalidateQueries();
  const { data, isLoading } = useQuery({
    queryKey: ["todoss"],
    queryFn: async () => {
      const response = await axios.get(
        `${Local.BASE_URL}/${Local.MD_DOCTORS_LIST}`
      );
      return response?.data;
    },
  });

  const fetchAddresses = async (mdid: any) => {
    try {
      const response = await axios.post(
        `${Local.BASE_URL}/${Local.GET_ADDRESS_BY_ID}`,
        { mdid: mdid }
      );
      console.log(response?.data);
      setaddress(response?.data);
      console.log("><><", address);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      throw error;
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }
  // console.log("<><", `${Local.BASE_URL}/${Local.GET_ADDRESS_BY_ID}`);
  return (
    <div className="max-w-3xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">Refer a Patient</h2>
      <Formik
        initialValues={{
          dob: "",
          email: "",
          phone_no: "",
          firstname: "",
          lastname: "",
          gender: "Male",
          disease_name: "",
          laterality: "Left",
          return_to_care: false,
          timing: "",
          md_name: "",
          location: "",
          insurance_company_name: "",
          insurance_plan: "",
          documentation: null,
          notes: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const formData = new FormData();
          formData.append("dob", values.dob);
          formData.append("email", values.email);
          formData.append("phone_no", values.phone_no);
          formData.append("firstname", values.firstname);
          formData.append("lastname", values.lastname);
          formData.append("gender", values.gender);
          formData.append("disease_name", values.disease_name);
          formData.append("laterality", values.laterality);
          formData.append("return_to_care", values.return_to_care.toString());
          formData.append("timing", values.timing);
          formData.append("location", values.location);
          formData.append(
            "insurance_company_name",
            values.insurance_company_name
          );
          formData.append("insurance_plan", values.insurance_plan);
          formData.append("notes", values.notes);
          formData.append("referredto", values.md_name);
          if (values.documentation) {
            formData.append("documentation", values.documentation);
          }
          mutation.mutate(formData);

          alert("Patient referred!");
          queryClient.invalidateQueries({ queryKey: ["todo"] });
          const docname = localStorage.getItem("senderdoctorname");
          socket.emit("sendNotification", {
            message: `Dr. ${docname} referred you a patient`,
            room: values.md_name,
          });

          navigate("/app/od");
          setSubmitting(false);
        }}
      >
        {({ setFieldValue, values }) => (
          <Form>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block font-medium">Date of Birth</label>
                <Field
                  name="dob"
                  type="date"
                  className="w-full px-4 py-2 border rounded"
                />
                <ErrorMessage
                  name="dob"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block font-medium">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="w-full px-4 py-2 border rounded"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block font-medium">Phone Number</label>
                <Field
                  name="phone_no"
                  className="w-full px-4 py-2 border rounded"
                />
                <ErrorMessage
                  name="phone_no"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block font-medium">First Name</label>
                <Field
                  name="firstname"
                  className="w-full px-4 py-2 border rounded"
                />
                <ErrorMessage
                  name="firstname"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
              <div>
                <label className="block font-medium">Last Name</label>
                <Field
                  name="lastname"
                  className="w-full px-4 py-2 border rounded"
                />
                <ErrorMessage
                  name="lastname"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
              <div>
                <label className="block font-medium">Gender</label>
                <Field
                  as="select"
                  name="gender"
                  className="w-full px-4 py-2 border rounded"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Field>
                <ErrorMessage
                  name="gender"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block font-medium">Disease Name</label>
              <Field
                name="disease_name"
                className="w-full px-4 py-2 border rounded"
              />
              <ErrorMessage
                name="disease_name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Laterality</label>
              <Field
                as="select"
                name="laterality"
                className="w-full px-4 py-2 border rounded"
              >
                <option value="Left">Left</option>
                <option value="Right">Right</option>
                <option value="Both">Both</option>
              </Field>
              <ErrorMessage
                name="laterality"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium" htmlFor="md_name">
                MD Name
              </label>
              <Field
                as="select"
                name="md_name"
                id="md_name" // Added id for better accessibility
                className="w-full px-4 py-2 border rounded"
                onChange={(e: any) => {
                  setFieldValue("md_name", e.target.value);
                  fetchAddresses(e.target.value);
                }}
              >
                <option value="" disabled>
                  Select
                </option>
                {data?.rows?.map((name: any) => (
                  <option
                    key={name.id}
                    value={name.id}
                    label={`${name.firstname} ${name.lastname}`}
                  />
                ))}
              </Field>
              <ErrorMessage
                name="md_name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Location</label>
              <Field
                as="select"
                name="location"
                className="w-full px-4 py-2 border rounded"
              >
                <option value="" label="Select a location" />
                {address && address.length > 0 ? (
                  address.map((address: any, index: any) => (
                    <option key={index} value={address.id}>
                      {address.addresstitle}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No address available
                  </option>
                )}
              </Field>
              <ErrorMessage
                name="location"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">
                Insurance Company Name
              </label>
              <Field
                name="insurance_company_name"
                className="w-full px-4 py-2 border rounded"
              />
              <ErrorMessage
                name="insurance_company_name"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Insurance Plan</label>
              <Field
                name="insurance_plan"
                className="w-full px-4 py-2 border rounded"
              />
              <ErrorMessage
                name="insurance_plan"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Documentation</label>
              <input
                type="file"
                onChange={(event) => {
                  setFieldValue(
                    "documentation",
                    event.target.files ? event.target.files[0] : null
                  );
                }}
                className="w-full px-4 py-2 border rounded"
              />
              <ErrorMessage
                name="documentation"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <div className="mb-4">
              <label className="block font-medium">Notes</label>
              <Field
                as="textarea"
                name="notes"
                className="w-full px-4 py-2 border rounded"
              />
              <ErrorMessage
                name="notes"
                component="div"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ReferPatientForm;
