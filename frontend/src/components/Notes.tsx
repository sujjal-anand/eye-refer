import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Notes = () => {
  const { id } = useParams();
  console.log("Received ID:", id);

  const [note, setNote] = useState("");

  // Fetch notes from the API
  const getNote = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5001/users/notes/${id}`
      );
      console.log("API Response:", response.data);
      setNote(response?.data?.notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Fetch note data when component mounts or `id` changes
  useEffect(() => {
    if (id) {
      getNote();
    }
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center border-b pb-4">
          Patient Notes
        </h3>
        {note ? (
          <div className="text-gray-700 bg-gray-100 p-4 rounded-md">
            <p>{note}</p>
          </div>
        ) : (
          <div className="text-gray-500 bg-gray-100 p-4 rounded-md">
            <p>No notes available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
