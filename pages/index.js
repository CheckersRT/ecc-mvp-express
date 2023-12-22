import React, { useState, useEffect } from "react";

export default function index() {
  // const [message, setMessage] = useState("Loading");
  const [image, setImage] = useState();
  const [imageSaved, setImageSaved] = useState(false);
  const [text, setText] = useState("");
  const [output, setOutput] = useState("");

  const imagedSavedIsTrue = imageSaved === true;
  useEffect(() => {
    if (imagedSavedIsTrue) {
      console.log("useEffect is running with this image: ", image);
      extractText();
    }
  }, [imagedSavedIsTrue]);

  useEffect(() => {
    console.log("text from useEffect: ", text);
    getInfoFromText(text);
  }, [text]);

  async function saveImage(event) {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3030/api/save", {
        method: "POST",
        headers: {
          "Content-Type": "image/jpeg",
        },
        body: image,
      });
      const data = await response.json();
      console.log("Message from server: ", data);
      setImageSaved(true);
    } catch (error) {
      console.log("Error with save: ", error);
    }
  }

  async function extractText() {
    const response = await fetch("http://localhost:3030/api/extract");
    const data = await response.json();
    console.log("Response data: ", data.text);
    setText(data.text);
  }

  async function getInfoFromText(text) {
    if (text === "") return;

    console.log(typeof text, text);

    const response = await fetch("http://localhost:3030/api/getInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output);
    setOutput(output);
  }

  return (
    <>
      <form onSubmit={saveImage}>
        <input
          type="file"
          name="image"
          onChange={(event) => setImage(event.target.files[0])}
        ></input>
        <button type="submit">Submit</button>
      </form>
      <p>{text ? text : null}</p>
      <p>{output ? output : null}</p>
    </>
  );
}
