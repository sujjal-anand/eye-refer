import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../assets/logo.png";
import { Local } from "../env/config";

// Component for displaying the logo
const Logo = () => (
  <div className="flex items-center justify-center space-x-2">
    <img src={logo} alt="Eye Refer Logo" className="h-24 w-auto" />
    <h1 className="text-4xl font-bold text-white">EYE REFER</h1>
  </div>
);

const ForgotPasswordForm = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // State for handling loader visibility
  const navigate = useNavigate();

  // Validation Schema for Email
  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  // Validation Schema for OTP and Password Reset
  const otpSchema = Yup.object().shape({
    otp: Yup.string()
      .length(6, "OTP must be 6 digits")
      .required("OTP is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), ""], "Passwords must match")
      .required("Confirm password is required"),
  });

  // Function to handle email submission
  const handleEmailSubmit = async (values: any) => {
    setLoading(true); // Show the loader when request starts
    try {
      const response = await axios.post(
        `${Local.BASE_URL}/${Local.FORGOT_PASSWORD}`,
        values
      );
      if (response.status === 200) {
        console.log(response);
        toast.success("OTP sent to your email");
        setOtpSent(true);
        setEmail(values.email);
        localStorage.setItem("token", response?.data?.token);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Error sending OTP, please try again.");
    } finally {
      setLoading(false); // Hide the loader once the request finishes
    }
  };

  // Function to handle OTP and password submission
  const handleOtpSubmit = async (values: any) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${Local.BASE_URL}/forgotverify`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Password reset successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Invalid OTP or error resetting password.");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side with Logo */}
      <div className="w-1/2 bg-gradient-to-r from-teal-400 to-cyan-500 fixed inset-0 flex items-center justify-center">
        <Logo />
      </div>

      {/* Right Side with Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="relative w-full max-w-md px-8 py-6 bg-white  rounded-lg ml-[610px]">
          <h3 className="text-2xl font-bold mb-4 text-center">
            {otpSent ? "Reset Password" : "Forgot Password"}
          </h3>
          {!otpSent ? (
            <Formik
              initialValues={{ email: "" }}
              validationSchema={emailSchema}
              onSubmit={handleEmailSubmit}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-4">
                    <label htmlFor="email" className="block font-semibold">
                      User email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Back to login link */}
                  <div className="absolute bottom-16 right-5">
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/login");
                      }}
                      className="text-teal-500 hover:text-teal-700 text-sm mr-5"
                    >
                      Back to login
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#35C0E4] text-white py-2 rounded hover:bg-[#2BAFD0] transition"
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? (
                      <div className="flex justify-center items-center space-x-2">
                        <div className="w-4 h-4 border-4 border-t-transparent border-teal-500 rounded-full animate-spin"></div>
                        <span>Sending OTP...</span>
                      </div>
                    ) : (
                      "Send OTP"
                    )}
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <Formik
              initialValues={{ otp: "", password: "", confirmPassword: "" }}
              validationSchema={otpSchema}
              onSubmit={handleOtpSubmit}
            >
              {({ handleSubmit }) => (
                <Form onSubmit={handleSubmit}>
                  {/* OTP Field */}
                  <div className="mb-4">
                    <label htmlFor="otp" className="block font-semibold">
                      Enter OTP
                    </label>
                    <Field
                      type="password"
                      name="otp"
                      placeholder="Enter 6-digit OTP"
                      minLength={6}
                      maxLength={6}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <ErrorMessage
                      name="otp"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* New Password Field */}
                  <div className="mb-4">
                    <label htmlFor="password" className="block font-semibold">
                      New Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter new password"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div className="mb-4">
                    <label
                      htmlFor="confirmPassword"
                      className="block font-semibold"
                    >
                      Confirm Password
                    </label>
                    <Field
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#35C0E4] text-white py-2 rounded hover:bg-[#2BAFD0] transition"
                  >
                    Reset Password
                  </button>
                </Form>
              )}
            </Formik>
          )}
        </div>
      </div>

      {/* Toastify Container for Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
      />
      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-2 fixed bottom-0 w-full">
        &copy; {new Date().getFullYear()} Eye Refer.
      </footer>
    </div>
  );
};

export default ForgotPasswordForm;
