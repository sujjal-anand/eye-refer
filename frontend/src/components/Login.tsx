import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Local } from "../env/config";

const Logo = () => (
  <div className="flex items-center justify-center space-x-2">
    <img src={logo} alt="Eye Refer Logo" className="h-24 w-auto" />
    <h1 className="text-4xl font-bold text-white">EYE REFER</h1>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // Loading state

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  // Optimized API call with response handling
  const postdata = async (values: any) => {
    setLoading(true); // Start loading spinner
    try {
      const response = await axios.post(
        `${Local.BASE_URL}/${Local.LOGIN_DOCTOR}`,
        values
      );

      // Show success toast
      toast.success("Login successful");
      localStorage.setItem("authtoken", response.data.token);

      // Handle navigation based on the response
      if (response?.data?.user?.doctortype === "OD") {
        navigate("/app/od", { replace: true }); // Navigate to OD dashboard
      } else {
        navigate("/app/md", { replace: true }); // Navigate to MD dashboard
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Invalid credentials, please try again");
    } finally {
      setLoading(false); // End loading spinner immediately
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 bg-gradient-to-r from-teal-400 to-cyan-500 fixed inset-0 flex items-center justify-center">
        <Logo />
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md px-8 py-6 bg-white rounded-lg ml-[634px]">
          <h3 className="text-2xl font-bold mb-4 text-center">Log In</h3>

          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              postdata(values);
            }}
          >
            {({ handleSubmit }) => (
              <Form
                onSubmit={handleSubmit}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              >
                <div className="mb-4">
                  <label htmlFor="email" className="block font-semibold">
                    User email <span className="text-red-500 text-xl">*</span>
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

                <div className="mb-4">
                  <label htmlFor="password" className="block font-semibold">
                    Password <span className="text-red-500 text-xl">*</span>
                  </label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button
                  className="text-teal-500 hover:underline ml-1 translate-x-64"
                  onClick={() => navigate("/forgotpassword")}
                  type="button"
                >
                  Forgot Password
                </button>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    className={`w-full py-2 rounded text-white transition ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-[#34aadc] hover:bg-[#2c91c8]"
                    }`}
                    disabled={loading} // Disable button while loading
                  >
                    {loading ? (
                      <span className="flex justify-center items-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>{" "}
                        Loading...
                      </span>
                    ) : (
                      "Login"
                    )}
                  </button>
                </div>

                <div className="mt-4 text-center">
                  New user?
                  <button
                    type="button"
                    className="text-teal-500 hover:underline ml-1"
                    onClick={() => navigate("/")}
                  >
                    Signup
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} closeOnClick />
      <footer className="bg-gray-800 text-white text-center py-2 fixed bottom-0 w-full">
        &copy; {new Date().getFullYear()} Eye Refer.
      </footer>
    </div>
  );
};

export default Login;
