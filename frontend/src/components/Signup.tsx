import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Local } from "../env/config";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";

const Logo = () => (
  <div className="flex items-center justify-center space-x-2">
    <img src={logo} alt="Eye Refer Logo" className="h-24 w-auto" />
    <h1 className="text-4xl font-bold text-white">EYE REFER</h1>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State for handling loading
  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    doctortype: Yup.string().required("Doctor type is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    agree: Yup.boolean()
      .oneOf([true], "You must agree to the Terms & Conditions")
      .required("Agreement is required"),
  });

  const postdata = async (values: any) => {
    setLoading(true); // Show loader
    try {
      const response = await axios.post(`${Local.BASE_URL}`, values);
      const token = response.data.token;
      localStorage.setItem("authToken", token);

      // Simulate a delay for 3 seconds to showcase the loader
      setTimeout(() => {
        setLoading(false); // Hide loader after 3 seconds
        navigate("/verification");
      }, 3000);
    } catch (error: any) {
      setLoading(false); // Hide loader if error occurs
      alert(error?.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side with Logo and Background */}
      <div className="w-1/2 bg-gradient-to-r from-teal-400 to-cyan-500 fixed inset-0 flex items-center justify-center">
        <Logo />
      </div>

      {/* Right Side with Signup Form */}
      <div
        className="w-1/2 flex items-center justify-center bg-gray-50 overflow-y-auto"
        style={{
          position: "absolute",
          right: "0",
          top: "0",
          marginRight: "7px", // Apply margin-right here
        }}
      >
        <div className="w-full max-w-md px-8 py-6 bg-white rounded-lg mt-12 h-[722px]">
          <h3 className="text-2xl mb-4 text-center">Sign Up</h3>

          <Formik
            initialValues={{
              firstname: "",
              lastname: "",
              doctortype: "",
              email: "",
              password: "",
              confirmpassword: "",
              agree: false,
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
              postdata(values);
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                {/* First Name and Last Name in the same row */}
                <div className="mb-4 flex gap-5">
                  <div className="w-full">
                    <label htmlFor="firstname" className="block font-semibold">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="firstname"
                      placeholder="First name"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <ErrorMessage
                      name="firstname"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label htmlFor="lastname" className="block font-semibold">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <Field
                      type="text"
                      name="lastname"
                      placeholder="Last name"
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <ErrorMessage
                      name="lastname"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="doctortype" className="block font-semibold">
                    Doctor Type <span className="text-red-500">*</span>
                  </label>
                  <Field
                    as="select"
                    name="doctortype"
                    className="w-full px-4 py-2 border rounded"
                  >
                    <option value="">Select Doctor Type</option>
                    <option value="OD">OD</option>
                    <option value="MD">MD</option>
                  </Field>
                  <ErrorMessage
                    name="doctortype"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="block font-semibold">
                    Email Address <span className="text-red-500">*</span>
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
                    Password <span className="text-red-500">*</span>
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

                <div className="mb-4">
                  <label
                    htmlFor="confirmpassword"
                    className="block font-semibold"
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <ErrorMessage
                    name="confirmpassword"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Checkbox for Terms & Conditions */}
                <div className="mb-4">
                  <label className="inline-flex items-center">
                    <Field
                      type="checkbox"
                      name="agree"
                      className="form-checkbox h-5 w-5 text-teal-500"
                    />
                    <span className="ml-2 text-sm">
                      I agree to the{" "}
                      <a
                        href="/terms"
                        className="text-teal-500 hover:underline"
                      >
                        Terms & Conditions
                      </a>
                    </span>
                  </label>
                  <ErrorMessage
                    name="agree"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Submit Button */}
                <div className="text-center">
                  <button
                    type="submit"
                    className="w-full bg-[#34aadc]  text-white py-2 rounded hover:bg-teal-600 transition"
                  >
                    {loading ? (
                      <span className="loader">Loading...</span>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </div>

                {/* Already have an account */}
                <div className="mt-4 text-center">
                  Already have an account?
                  <button
                    type="button"
                    className="text-teal-500 hover:underline ml-1"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-2 fixed bottom-0 w-full">
        &copy; {new Date().getFullYear()} Eye Refer
      </footer>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Signup;
