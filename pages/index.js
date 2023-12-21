import React, { useState, useEffect } from "react";

export default function index() {
  const [message, setMessage] = useState("Loading");
  const [image, setImage] = useState("")
  const [text, setText] = useState("")
  const [output, setOutput] = useState("")

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
      extractText();
    }).catch(error => {
      console.log(error)
    });
  }

  async function extractText() {
    const response = fetch("http://localhost:3030/api/extract")
    .then((response) => response.json()).then((data) => {
      console.log(data)
      setText(data.text)
      getInfoFromText(data.text)
    })
  }

  async function getInfoFromText(extractText) {
    if (extractText === "") return;

    console.log(typeof extractText, extractText)

    const response = await fetch("http://localhost:3030/api/getInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: extractText,
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output);
    // setIsLoading(false)
    setOutput(output)
  }

  // useEffect(() => {
  //   const response = fetch("http://localhost:3030/api/save")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log(data)
  //       setMessage(data.text)
  //     });
  // }, []);

  return (
    <>
      <p>{message}</p>
      <form onSubmit={sendImage}>
      <input type="file" name="image" onChange={(event) => setImage(event.target.files[0])}></input>
      <button type="submit">Submit</button>
      </form>
      <p>{text ? text : null}</p>
      <p>{output ? output : null}</p>
    </>
  );
}
