import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { queryClient } from "..";
import { Local } from "../env/config";

// Validation Schemas
const doctorValidationSchema = Yup.object({
  phoneno: Yup.string().required("Phone number is required"),
  gender: Yup.string().required("Gender is required"),
});

const addressValidationSchema = Yup.object({
  addresstitle: Yup.string().required("Address title is required"),
  officenumber: Yup.string().required("Office number is required"),
  faxno: Yup.string().required("Fax number is required"),
  street: Yup.string().required("Street is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  country: Yup.string().required("Country is required"),
  zip: Yup.string().required("Zip code is required"),
});

const Profile = () => {
  const token = localStorage.getItem("authtoken");
  const [doctormodal, setdoctormodal] = useState(false);
  const [addressmodal, setaddressmodal] = useState(false);
  const [photo, setphoto] = useState<any>();

  // Doctor Profile Update Mutation
  const updateDoctorMutation = useMutation({
    mutationKey: ["updateDoctor"],
    mutationFn: async (values: any) => {
      const response = await axios.put(
        `${Local.BASE_URL}/${Local.UPDATE_DOCTOR}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      queryClient.invalidateQueries();
      queryClient.invalidateQueries({ queryKey: ["doctorDetail"] });
      console.log("Doctor Update Response:", response);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["doctordata"],
    queryFn: async () => {
      const data = await axios.get(
        `${Local.BASE_URL}/${Local.DOCTOR_DETAILS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return data?.data;
    },
  });

  const { data: getaddresses } = useQuery({
    queryKey: ["getaddresses"],
    queryFn: async () => {
      const response = await axios.get(
        `${Local.BASE_URL}/${Local.GET_ADDRESS}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    },
  });

  // Address Update Mutation
  const updateAddressMutation = useMutation({
    mutationKey: ["updateAddress"],
    mutationFn: async (values: any) => {
      const response = await axios.post(
        `${Local.BASE_URL}/${Local.ADD_ADDRESS}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Address Update Response:", response);
    },
  });
  console.log(Local.DELETE_ADDRESS);
  const deleteAddressMutation = useMutation({
    mutationKey: ["deleteAddress"],
    mutationFn: async (addressId: number) => {
      const response = await axios.delete(
        `${Local.BASE_URL}/${Local.DELETE_ADDRESS}/${addressId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      queryClient.invalidateQueries({ queryKey: ["getaddresses"] });
      console.log("Address Deleted Response:", response);
    },
  });

  if (isLoading) {
    return <div>....loading</div>;
  }
  return (
    <div className="min-h-screen bg-secondary-subtle flex items-center justify-center">
      <h2
        className="mb-auto"
        style={{
          position: "relative",
          left: "107px",
          top: "48px",
        }}
      >
        Profile
      </h2>
      {/* White Box Container */}
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-5xl my-5">
        {/* Main Content */}
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          {/* Profile Section */}
          <div className="flex items-center justify-between space-x-6">
            {/* Profile Image and Name */}
            <div className="flex items-center space-x-64">
              <img
                src={`${Local.IMAGE_API}/${data?.doctor?.profilephoto}`}
                alt="User Profile"
                className="h-32 w-32 rounded-full border-2 border-teal-500 cursor-pointer"
              />
              <div>
                <p className="text-xl font-bold">
                  {data?.doctor?.firstname} {data?.doctor?.lastname}
                </p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <button
              type="button"
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-2"
              onClick={() => setdoctormodal(true)}
            >
              Edit Profile
            </button>
          </div>

          {/* Displaying Doctor Details */}
          <div className="mt-4 p-4 bg-gray-100 border border-gray-300 rounded-md">
            <div className="row">
              <p className="col">
                <strong>Name:</strong> {data?.doctor?.firstname}{" "}
                {data?.doctor?.lastname}
              </p>
              <p className="col">
                <strong>Phone:</strong> {data?.doctor?.phoneno}
              </p>
            </div>

            <div className="row">
              <p className="col">
                <strong>Gender:</strong> {data?.doctor?.gender}
              </p>
              <p className="col">
                <strong>Email:</strong> {data?.doctor?.email}
              </p>
            </div>
          </div>

          {/* Doctor Profile Form */}
          {doctormodal && (
            <Formik
              initialValues={{
                phoneno: "",
                gender: "",
                profilephoto: "",
              }}
              validationSchema={doctorValidationSchema}
              onSubmit={(values) => {
                const formdata = new FormData();
                formdata.append("phoneno", values.phoneno);
                formdata.append("gender", values.gender);
                if (photo) {
                  formdata.append("profilephoto", photo);
                }
                updateDoctorMutation.mutate(formdata);
                setdoctormodal(false);
              }}
            >
              {({ setFieldValue }) => (
                <Form>
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="text-xl font-bold">
                          Update Doctor Profile
                        </h5>
                        <button onClick={() => setdoctormodal(false)}>
                          &times;
                        </button>
                      </div>
                      <div className="space-y-4">
                        <Field
                          name="phoneno"
                          placeholder="Phone Number"
                          className="form-control block w-full p-2 border rounded"
                        />
                        <ErrorMessage
                          name="phoneno"
                          className="text-red-500 text-sm"
                          component="div"
                        />

                        <Field
                          as="select"
                          name="gender"
                          className="form-control block w-full p-2 border rounded"
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </Field>
                        <ErrorMessage
                          name="gender"
                          className="text-red-500 text-sm"
                          component="div"
                        />

                        <input
                          type="file"
                          name="profilephoto"
                          onChange={(e: any) => setphoto(e.target.files?.[0])}
                          className="block w-full p-2 border rounded"
                        />
                      </div>
                      <div className="flex justify-end mt-6">
                        <button
                          type="submit"
                          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
                        >
                          Save Changes
                        </button>
                        <button
                          type="button"
                          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                          onClick={() => setdoctormodal(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {/* Address Form Button */}
          <button
            type="button"
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded translate-x-64 translate-y-4"
            onClick={() => setaddressmodal(true)}
          >
            Add Address
          </button>

          {/* Address Form */}
          {addressmodal && (
            <Formik
              initialValues={{
                addresstitle: "",
                officenumber: "",
                faxno: "",
                street: "",
                city: "",
                state: "",
                country: "",
                zip: "",
              }}
              validationSchema={addressValidationSchema}
              onSubmit={(values) => {
                updateAddressMutation.mutate(values);
                setaddressmodal(false);
              }}
            >
              <Form>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-xl font-bold">Address Details</h5>
                      <button onClick={() => setaddressmodal(false)}>
                        &times;
                      </button>
                    </div>

                    <div className="space-y-4">
                      <Field
                        name="addresstitle"
                        placeholder="Address Title"
                        className="form-control block w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="addresstitle"
                        className="text-red-500 text-sm"
                        component="div"
                      />

                      <Field
                        name="officenumber"
                        placeholder="Office Number"
                        className="form-control block w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="officenumber"
                        className="text-red-500 text-sm"
                        component="div"
                      />

                      <Field
                        name="faxno"
                        placeholder="Fax Number"
                        className="form-control block w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="faxno"
                        className="text-red-500 text-sm"
                        component="div"
                      />

                      <Field
                        name="street"
                        placeholder="Street"
                        className="form-control block w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="street"
                        className="text-red-500 text-sm"
                        component="div"
                      />

                      <Field
                        name="city"
                        placeholder="City"
                        className="form-control block w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="city"
                        className="text-red-500 text-sm"
                        component="div"
                      />

                      <Field
                        name="state"
                        placeholder="State"
                        className="form-control block w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="state"
                        className="text-red-500 text-sm"
                        component="div"
                      />

                      <Field
                        name="country"
                        placeholder="Country"
                        className="form-control block w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="country"
                        className="text-red-500 text-sm"
                        component="div"
                      />

                      <Field
                        name="zip"
                        placeholder="Zip Code"
                        className="form-control block w-full p-2 border rounded"
                      />
                      <ErrorMessage
                        name="zip"
                        className="text-red-500 text-sm"
                        component="div"
                      />
                    </div>
                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-2"
                      >
                        Save Address
                      </button>
                      <button
                        type="button"
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                        onClick={() => setaddressmodal(false)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </Form>
            </Formik>
          )}
          {/* Address Section */}
          <div className="mt-4 w-full">
            <h3 className="text-lg font-bold mb-2">Address List</h3>
            {getaddresses?.map((address: any, index: any) => (
              <div
                key={index}
                className="p-4 border rounded mb-2 bg-gray-100 flex justify-between items-center"
              >
                <div>
                  <p>
                    <strong>{address.addresstitle}</strong>
                  </p>
                  <p>
                    {address.street}, {address.city}, {address.state},{" "}
                    {address.country} - {address.zip}
                  </p>
                  <p>
                    Office: {address.officenumber}, Fax: {address.faxno}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
