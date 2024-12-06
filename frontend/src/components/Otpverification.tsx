import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { Local } from "../env/config";

const OtpVerification = () => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .matches(/^\d{6}$/, "OTP must be 6 digits"),
  });

  const postdata = async (values: any) => {
    try {
      await axios.post(`${Local.BASE_URL}/${Local.VERIFY_OTP}`, values, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("OTP verified successfully");
      navigate("/login");
    } catch (error) {
      alert("Failed to verify OTP");
    }
  };

  const resendOtp = async () => {
    try {
      await axios.put(
        `${Local.BASE_URL}/resendotp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("OTP resent successfully");
    } catch (error) {
      alert("Failed to resend OTP");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card mx-auto shadow-lg" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h3 className="card-title text-center mb-4">OTP Verification</h3>

          <Formik
            initialValues={{ otp: "" }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              console.log(values);
              await postdata(values);
            }}
          >
            {({ handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="otp" className="form-label">
                    Enter OTP
                  </label>
                  <Field
                    type="text"
                    name="otp"
                    className="form-control"
                    placeholder="Enter 6-digit OTP"
                    minLength={6}
                    maxLength={6}
                  />
                  <ErrorMessage
                    name="otp"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="d-grid gap-2 mb-3">
                  <button type="submit" className="btn btn-primary">
                    Verify OTP
                  </button>
                </div>

                <div className="text-center">
                  <p>Didn't receive an OTP?</p>
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={resendOtp}
                  >
                    Resend OTP
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
