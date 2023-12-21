import React, { useState, useEffect } from "react";

export default function index() {
  const [message, setMessage] = useState("Loading");
  useEffect(() => {
    const response = fetch("http://localhost:3030/api/home")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessage(data.message)
      });
  }, []);

  return (
    <>
      <p>{message}</p>
    </>
  );
}
