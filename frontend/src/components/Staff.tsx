import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup"; // Import Yup for validation
import "./staff.css";
import { Local } from "../env/config";

const Staff = () => {
  const [modal, setModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<number[]>([]); // Track selected staff
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
      setSelectedStaff([]); // Clear selection after deletion
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

  // Handle checkbox changes
  const handleCheckboxChange = (id: number) => {
    setSelectedStaff((prev) =>
      prev.includes(id)
        ? prev.filter((staffId) => staffId !== id)
        : [...prev, id]
    );
  };

  // Handle delete selected
  const handleDeleteSelected = () => {
    selectedStaff.forEach((id) => deleteStaff.mutate(id));
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
      className="bg-secondary-subtle container-fluid"
      style={{ height: "100vh" }}
    >
      {/* Add Staff Button */}
      <div className="add">
        <button
          type="button"
          onClick={() => setModal(true)}
          className="btn btn-primary my-3"
        >
          Add Staff
        </button>
        <button
          type="button"
          onClick={handleDeleteSelected}
          className="btn btn-danger mx-3"
          disabled={selectedStaff.length === 0}
        >
          Save
        </button>
      </div>

      {/* Staff Table */}
      <div className="table1 table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  onChange={(e) =>
                    setSelectedStaff(
                      e.target.checked ? data.map((staff: any) => staff.id) : []
                    )
                  }
                  checked={selectedStaff.length === data?.length}
                />
              </th>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Gender</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((staff: any, index: number) => (
              <tr key={staff.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(staff.id)}
                    onChange={() => handleCheckboxChange(staff.id)}
                  />
                </td>
                <td>{index + 1}</td>
                <td>{staff.firstname}</td>
                <td>{staff.lastname}</td>
                <td>{staff.email}</td>
                <td>{staff.gender}</td>
                <td>{staff.phoneno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Staff Modal */}
      {modal && (
        <div className="modal fade show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Staff</h5>
                <button
                  type="button"
                  className="btn-close"
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
                    {/* Form Fields */}
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
