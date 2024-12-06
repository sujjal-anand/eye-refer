import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";

const Pagination = () => {
  const [page, setpage] = useState(0);
  const query = useQuery({
    queryKey: ["fetch", page],
    queryFn: async () => {
      const response = await axios.get(
        `http://localhost:3001/tasks?_limit=3&_page=${page}`
      );
      console.log(response.data);
      return response.data;
    },
  });
  console.log(query);
  return (
    <div>
      {query.data?.map((task: any) => (
        <div key={task.id}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>{" "}
        </div>
      ))}
      <button
        onClick={() => setpage((page) => page + 1)}
        disabled={page == 5 ? true : false}
      >
        next
      </button>

      <button
        onClick={() => setpage((page) => page - 1)}
        disabled={page == 0 ? true : false}
      >
        previous
      </button>
    </div>
  );
};

export default Pagination;
