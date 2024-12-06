import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Local } from "../env/config";

const Changepassword = () => {
  const token = localStorage.getItem("authtoken");
  const navigate = useNavigate();

  // Validation schema using Yup
  const validationSchema = Yup.object().shape({
    oldpassword: Yup.string().required("Old password is required"),
    newpassword: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .required("New password is required"),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("newpassword")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  // Handle form submission
  const handleSubmit = async (values: any) => {
    try {
      console.log(values);
      // Send data to the server
      await axios.post(`${Local.BASE_URL}/${Local.CHANGE_PASSWORD}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Show success toast before navigating
      toast.success("Password changed successfully");

      // Navigate after the toast has been shown
      setTimeout(() => {
        navigate("/app/od");
      }, 2000); // Adjust timeout as needed to let the toast show
    } catch (error: any) {
      // Show error toast before navigating
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold mb-6 text-center">Change Password</h3>

        <Formik
          initialValues={{
            oldpassword: "",
            newpassword: "",
            confirmpassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              {/* Old Password Field */}
              <div className="mb-4">
                <label htmlFor="oldpassword" className="block font-medium">
                  Old Password
                </label>
                <Field
                  type="password"
                  name="oldpassword"
                  placeholder="Enter old password"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="oldpassword"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              {/* New Password Field */}
              <div className="mb-4">
                <label htmlFor="newpassword" className="block font-medium">
                  New Password
                </label>
                <Field
                  type="password"
                  name="newpassword"
                  placeholder="Enter new password"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="newpassword"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="mb-6">
                <label htmlFor="confirmpassword" className="block font-medium">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="confirmpassword"
                  placeholder="Confirm new password"
                  className="w-full px-3 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="confirmpassword"
                  component="div"
                  className="text-red-600 text-sm"
                />
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Update Password
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Toastify Container */}
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Changepassword;
