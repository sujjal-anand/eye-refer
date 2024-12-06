import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const Notification = () => {
  const token = localStorage.getItem("authtoken");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notificationdata"],
    queryFn: async () => {
      await axios.put(
        "http://localhost:5001/users/getallnotification",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    },
  });
  return <div>Notification</div>;
};

export default Notification;
