import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Notification = () => {
  const token = localStorage.getItem("authtoken");
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notificationdata"],
    queryFn: async () => {
      const response = await axios.put(
        "http://localhost:5001/users/getallnotification",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response?.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading notifications</div>;

  return (
    <div style={{ padding: "15px" }}>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: "bold",
          marginBottom: "8px",
        }}
      >
        Notifications
      </h2>
      {data?.notifications?.length > 0 ? (
        data.notifications.map((notification: any, index: any) => (
          <div
            key={index}
            style={{
              background: "#f8f9fa",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "8px",
              marginRight: "5px", // Reduced right margin
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              maxWidth: "800px", // Reduce width
              marginLeft: "auto", // Center the notification
              // marginRight: "auto", // Center the notification
            }}
          >
            <p
              style={{
                fontSize: "14px",
                margin: "0",
                color: "#333",
                fontWeight: "400",
              }}
            >
              {notification.message}
            </p>
            <span
              style={{
                fontSize: "10px",
                color: "#777",
                marginTop: "5px",
                display: "block",
              }}
            >
              {new Date(notification.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      ) : (
        <p>No notifications available</p>
      )}
    </div>
  );
};

export default Notification;
