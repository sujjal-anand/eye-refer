import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { Local } from "../env/config";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { jsPDF } from "jspdf";

const Viewpatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const componentRef = useRef(null); // Reference for the component to print

  // Fetch patient data using TanStack Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["viewpatient", id], // Include `id` in the query key for caching
    queryFn: async () => {
      const response = await axios.get(
        `${Local.BASE_URL}/${Local.GET_PATIENT}/${id}`
      );
      return response.data; // Return only the data part of the response
    },
  });

  // Handle loading state
  if (isLoading) {
    return <div className="py-8">Loading...</div>;
  }

  // Handle error state
  if (isError) {
    return (
      <div className="py-8">
        Error: {error instanceof Error ? error.message : "Something went wrong"}
      </div>
    );
  }

  // Destructure data for easier access
  const {
    firstname,
    lastname,
    email,
    phone_no,
    gender,
    dob,
    disease_name,
    documentation,
    insurance_company_name,
    insurance_plan,
    location,
    notes,
    referredtoname,
    return_to_care,
    surgerydate,
  } = data;

  // Function to generate and download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Adding title to the PDF
    doc.setFontSize(18);
    doc.text("Patient Details", 20, 20);

    // Adding patient details
    doc.setFontSize(12);
    doc.text(`Name: ${firstname} ${lastname}`, 20, 30);
    doc.text(`Email: ${email}`, 20, 40);
    doc.text(`Phone: ${phone_no}`, 20, 50);
    doc.text(`Gender: ${gender}`, 20, 60);
    doc.text(`Date of Birth: ${dob}`, 20, 70);
    doc.text(`Disease Name: ${disease_name}`, 20, 80);
    doc.text(`Insurance Company: ${insurance_company_name}`, 20, 90);
    doc.text(`Insurance Plan: ${insurance_plan}`, 20, 100);
    doc.text(`Location: ${location}`, 20, 110);
    doc.text(`Notes: ${notes}`, 20, 120);
    doc.text(`Referred By: ${referredtoname}`, 20, 130);
    doc.text(`Return to Care: ${return_to_care ? "Yes" : "No"}`, 20, 140);
    doc.text(`Surgery Date: ${surgerydate || "N/A"}`, 20, 150);

    // Adding Documentation link
    doc.text(`Documentation: ${documentation}`, 20, 160);

    // Save the PDF
    doc.save("patient-details.pdf");
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg ms-auto" style={{ maxWidth: "800px" }}>
        <div className="card-body" ref={componentRef}>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back
          </button>
          <h1 className="card-title text-center mb-4">Patient Details</h1>
          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>Name:</strong> {firstname} {lastname}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Email:</strong> {email}
              </p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>Phone:</strong> {phone_no}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Gender:</strong> {gender}
              </p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>Date of Birth:</strong> {dob}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Disease Name:</strong> {disease_name}
              </p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12">
              <p>
                <strong>Documentation:</strong>
                <a
                  href={`${Local.IMAGE_API}/${documentation}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary"
                >
                  View Document
                </a>
              </p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>Insurance Company:</strong> {insurance_company_name}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Insurance Plan:</strong> {insurance_plan}
              </p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12">
              <p>
                <strong>Location:</strong> {location}
              </p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12">
              <p>
                <strong>Notes:</strong> {notes}
              </p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-6">
              <p>
                <strong>Referred By:</strong> {referredtoname}
              </p>
            </div>
            <div className="col-md-6">
              <p>
                <strong>Return to Care:</strong> {return_to_care ? "Yes" : "No"}
              </p>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-12">
              <p>
                <strong>Surgery Date:</strong> {surgerydate || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Download PDF Button */}
      <button
        onClick={downloadPDF}
        className="btn btn-primary"
        style={{ position: "absolute", right: "93px", top: "128px" }}
      >
        Download PDF
      </button>
    </div>
  );
};

export default Viewpatient;
