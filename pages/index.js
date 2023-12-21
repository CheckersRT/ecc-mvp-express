import React, { useState, useEffect } from "react";

export default function index() {
  const [message, setMessage] = useState("Loading");
  const [image, setImage] = useState("")

  // useEffect(() => {
  //   const response = fetch("http://localhost:3030/api/home")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data);
  //       setMessage(data.message);
  //     });
  // }, []);

  function sendImage(event) {
    event.preventDefault();
    const response = fetch("http://localhost:3030/api/save", {
      method: "POST",
      headers: {
        "Content-type": "image/jpeg"
      },
      body: image
    }).then(() => {
      console.log("image upload successful")
      }).catch(error => {
        console.log(error)
      });
  }

  function extractText() {
    const response = fetch("http://localhost:3030/api/extract")
    .then((response) => response.json()).then((data) => {
      console.log(data)
    })
  }


  useEffect(() => {
    const response = fetch("http://localhost:3030/api/save")
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setMessage(data.text)
      });
  }, []);

  return (
    <>
      <p>{message}</p>
      <form onSubmit={sendImage}>
      <input type="file" name="image" onChange={(event) => setImage(event.target.files[0])}></input>
      <button type="submit">Submit</button>
      </form>
    </>
  );
}
