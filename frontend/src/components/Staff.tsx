import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import * as Yup from "yup"; // Import Yup for validation
import "./staff.css";
import { Local } from "../env/config";

const Staff = () => {
  const [modal, setModal] = useState(false);
  const token = localStorage.getItem("authtoken");

  // Mutation for adding staff
  const addStaff = useMutation({
    mutationKey: ["addstaff"],
    mutationFn: async (values: any) => {
      const response = await axios.post(
        `${Local.BASE_URL}/${Local.ADD_STAFF}`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    },
    onSuccess: () => {
      refetch();
      setModal(false);
    },
  });

  // Mutation for deleting staff
  const deleteStaff = useMutation({
    mutationKey: ["deletestaff"],
    mutationFn: async (id: number) => {
      const response = await axios.delete(
        `${Local.BASE_URL}/${Local.DELETE_STAFF}/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Query to fetch staff data
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["getstaff"],
    queryFn: async () => {
      const response = await axios.get(`${Local.BASE_URL}/${Local.GET_STAFF}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response?.data;
    },
  });

  // Function to download CSV
  const downloadCSV = async () => {
    try {
      const response = await axios.get("http://localhost:5001/users/staffcsv", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Ensure the response is treated as binary
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "stafflist.csv"); // Set filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
    } catch (error) {
      console.error("Error downloading CSV", error);
    }
  };

  if (isLoading) return <div>Loading staff data...</div>;
  if (error) return <div>Error loading staff data. Please try again.</div>;

  // Validation schema
  const validationSchema = Yup.object({
    firstname: Yup.string()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must not exceed 50 characters")
      .required("First name is required"),
    lastname: Yup.string()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must not exceed 50 characters")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phoneno: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
  });

  return (
    <div
      className="bg-secondary-subtle container-fluid "
      style={{ height: "100vh" }}
    >
      {/* Download CSV Button */}
      <button
        className="btn btn-outline-info"
        style={{ margin: "41px -395px -117px 285px" }}
        onClick={downloadCSV}
      >
        Download CSV
      </button>

      {/* Add Staff Button */}
      <div className="add">
        <button
          type="button"
          onClick={() => setModal(true)}
          className="btn btn-primary my-3"
        >
          Add Staff
        </button>
      </div>

      {/* Staff Table */}
      <div className="table1 table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Phone Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((staff: any, index: number) => (
              <tr key={staff.id}>
                <td>{index + 1}</td>
                <td>{staff.firstname}</td>
                <td>{staff.lastname}</td>
                <td>{staff.email}</td>
                <td>{staff.gender}</td>
                <td>{staff.phoneno}</td>
                <td>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => deleteStaff.mutate(staff.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {modal && (
        <div
          className="modal fade show d-block"
          id="exampleModal"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add Staff
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={{
                    firstname: "",
                    lastname: "",
                    email: "",
                    gender: "male",
                    phoneno: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={(values: any) => {
                    addStaff.mutate(values);
                  }}
                >
                  <Form>
                    <div className="mb-3">
                      <label>First Name</label>
                      <Field
                        name="firstname"
                        className="form-control"
                        placeholder="Enter first name"
                      />
                      <ErrorMessage
                        name="firstname"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="mb-3">
                      <label>Last Name</label>
                      <Field
                        name="lastname"
                        className="form-control"
                        placeholder="Enter last name"
                      />
                      <ErrorMessage
                        name="lastname"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="mb-3">
                      <label>Email</label>
                      <Field
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Enter email"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <div className="mb-3">
                      <label>Gender</label>
                      <Field as="select" name="gender" className="form-control">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Field>
                    </div>

                    <div className="mb-3">
                      <label>Phone Number</label>
                      <Field
                        name="phoneno"
                        className="form-control"
                        placeholder="Enter phone number"
                      />
                      <ErrorMessage
                        name="phoneno"
                        component="div"
                        className="text-danger"
                      />
                    </div>

                    <button type="submit" className="btn btn-success">
                      Submit
                    </button>
                  </Form>
                </Formik>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
