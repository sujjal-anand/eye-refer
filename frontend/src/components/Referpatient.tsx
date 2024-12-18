import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Local } from "../env/config";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { queryClient } from "..";
import { FaArrowLeft } from "react-icons/fa";
import { socket } from "../utils/socketconnection";

const validationSchema = Yup.object({
  dob: Yup.date().required("Date of Birth is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  return_to_care: Yup.boolean()
    .oneOf([true, false], "Please select an option.")
    .required("This field is required."),
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
  //         "application/pptx",
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
    onSuccess: () => {
      // Show success toast on successful submission
      toast.success("Patient Referred");
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
    <>
      <ToastContainer />
      <div className="w-75 me-5  mx-auto p-6 border border-gray-300 rounded-lg shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <h2 className="text-2xl font-bold mb-6 text-start">Refer a Patient</h2>
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
            return_to_care: "",
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
            formData.append("return_to_care", values.return_to_care);
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
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Date of Birth</label>
                  <Field name="dob" type="date" className="form-control" />
                  <ErrorMessage
                    name="dob"
                    component="div"
                    className="text-danger small"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Email</label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger small"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Phone Number</label>
                  <Field name="phone_no" className="form-control" />
                  <ErrorMessage
                    name="phone_no"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">First Name</label>
                  <Field name="firstname" className="form-control" />
                  <ErrorMessage
                    name="firstname"
                    component="div"
                    className="text-danger small"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Last Name</label>
                  <Field name="lastname" className="form-control" />
                  <ErrorMessage
                    name="lastname"
                    component="div"
                    className="text-danger small"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Gender</label>
                  <Field as="select" name="gender" className="form-select">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Field>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-start">
                Reason of Consult
              </h2>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Reason</label>
                  <Field
                    as="select"
                    name="disease_name"
                    className="form-select"
                  >
                    <option value="" disabled>
                      choose disease
                    </option>
                    <option value="Disease 1">Disease 1</option>
                    <option value="Disease 2">Disease 2</option>
                    <option value="Disease 3">Disease 3</option>
                    <option value="Disease 4">Disease 4</option>
                    <option value="Disease 5">Disease 5</option>
                  </Field>
                  <ErrorMessage
                    name="disease_name"
                    component="div"
                    className="text-danger small"
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Laterality</label>
                  <Field as="select" name="laterality" className="form-select">
                    <option value="Left">Left</option>
                    <option value="Right">Right</option>
                    <option value="Both">Both</option>
                  </Field>
                  <ErrorMessage
                    name="laterality"
                    component="div"
                    className="text-danger small"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">
                    Patient to Return to Your Care
                  </label>
                  <div className="form-check form-switch">
                    <Field
                      type="checkbox"
                      name="return_to_care"
                      className="form-check-input"
                    />
                    <label className="form-check-label">
                      {values.return_to_care ? "Yes" : "No"}
                    </label>
                  </div>
                  <ErrorMessage
                    name="return_to_care"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Timing</label>
                  <Field as="select" name="timing" className="form-select">
                    <option value="" disabled>
                      Select timing
                    </option>
                    <option value="Routine">Routine</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Emergent">Emergent</option>
                  </Field>
                  <ErrorMessage
                    name="timing"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-6 text-start">MD details</h2>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">MD Name</label>
                  <Field
                    as="select"
                    name="md_name"
                    className="form-select"
                    onChange={(e: any) => {
                      setFieldValue("md_name", e.target.value);
                      fetchAddresses(e.target.value);
                    }}
                  >
                    <option value="" disabled>
                      Select
                    </option>
                    {data?.rows?.map((name: any) => (
                      <option key={name.id} value={name.id}>
                        {`${name.firstname} ${name.lastname}`}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="md_name"
                    component="div"
                    className="text-danger small"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Location</label>
                  <Field as="select" name="location" className="form-select">
                    <option value="">Select a location</option>
                    {address?.length > 0 ? (
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
                    className="text-danger small"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Insurance Company Name</label>
                  <Field
                    name="insurance_company_name"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="insurance_company_name"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Insurance Plan</label>
                  <Field name="insurance_plan" className="form-control" />
                  <ErrorMessage
                    name="insurance_plan"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-4">
                  <label className="form-label">Documentation</label>
                  <input
                    type="file"
                    onChange={(event) => {
                      setFieldValue(
                        "documentation",
                        event.target.files ? event.target.files[0] : null
                      );
                    }}
                    className="form-control"
                  />
                  <ErrorMessage
                    name="documentation"
                    component="div"
                    className="text-danger small"
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Notes</label>
                  <Field as="textarea" name="notes" className="form-control" />
                  <ErrorMessage
                    name="notes"
                    component="div"
                    className="text-danger small"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-info px-4 text-white">
                Submit
              </button>
              <button
                type="button"
                className="btn btn-outline-success ms-4 px-4"
                onClick={() => {
                  navigate(-1);
                }}
              >
                cancel
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default ReferPatientForm;
