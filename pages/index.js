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
    return () => setImageSaved(false)
  }, [imagedSavedIsTrue]);

  useEffect(() => {
    if(text !== "") {
      console.log("text from useEffect: ", text);
      setOutput("...doing AI...")
      getInfoFromText(text);
    }
  }, [text]);

  async function saveImage(event) {
    event.preventDefault();
    setOutput("...extracting text...")
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
      console.log("Error from saveImage: ", error);
    }
  }

  async function extractText() {
    try {
      const response = await fetch("http://localhost:3030/api/extract");
      const data = await response.json();
      console.log("Response data: ", data.text);
      setText(data.text);
      
    } catch (error) {
      console.log("Error from extractText: ", error)
    }
  }

  async function getInfoFromText(text) {
    event.preventDefault()
    // if (text === "") return;

    // console.log(typeof text);

    const response = await fetch("http://localhost:3030/api/getInfo")

    console.log(response)

    const data = await response.json();
    const { output } = data;
    console.log("OpenAI replied...", output);
    setOutput(output);
  }
  console.log(output.Composer)

  return (
    <>
      <form 
      // onSubmit={saveImage}
      onSubmit={getInfoFromText}
      >
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
