import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Local } from "../env/config";
import { FaArrowLeft } from "react-icons/fa";

// Validation schema for the form fields
const validationSchema = Yup.object({
  dob: Yup.date().required("Date of Birth is required"),
  phone_no: Yup.string().required("Phone number is required"),
  firstname: Yup.string().required("First name is required"),
  lastname: Yup.string().required("Last name is required"),
  gender: Yup.string().required("Gender is required"),
  disease_name: Yup.string().required("Disease name is required"),
  laterality: Yup.string().required("Laterality is required"),
  location: Yup.string().required("Location is required"),
  insurance_company_name: Yup.string().required(
    "Insurance company name is required"
  ),
  insurance_plan: Yup.string().required("Insurance plan is required"),
});

const UpdatePatientForm = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authtoken");
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["patientdata"],
    queryFn: async (any) => {
      const response = await axios.get(
        `${Local.BASE_URL}/${Local.GET_PATIENT}/${id}`
      );
      return response;
    },
  });
  console.log(data);
  // Mutation to update patient data
  const mutation = useMutation({
    mutationFn: async (updatedValues: any) => {
      return await axios.put(
        `${Local.BASE_URL}/${Local.UPDATE_PATIENT}/${id}`,
        updatedValues
      );
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 border border-gray-300 rounded-lg shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Update Patient Information
      </h2>
      <Formik
        enableReinitialize
        initialValues={{
          dob: data?.data?.dob,
          phone_no: data?.data?.phone_no,
          firstname: data?.data?.firstname,
          lastname: data?.data?.lastname,
          gender: data?.data?.gender,
          disease_name: data?.data?.disease_name,
          laterality: data?.data?.laterality,
          return_to_care: data?.data?.return_to_care,
          location: data?.data?.location,
          insurance_company_name: data?.data?.insurance_company_name,
          insurance_plan: data?.data?.insurance_plan,
          notes: data?.data?.firstname,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          mutation.mutate(values);
          setSubmitting(false);
          alert("patient updated");
          navigate("/app/od");
        }}
      >
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
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
            <div>
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
            <label className="block font-medium">Location</label>
            <Field
              name="location"
              className="w-full px-4 py-2 border rounded"
            />
            <ErrorMessage
              name="location"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="mb-4">
            <label className="block font-medium">Insurance Company Name</label>
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

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
          >
            Update
          </button>
        </Form>
      </Formik>
    </div>
  );
};

export default UpdatePatientForm;
