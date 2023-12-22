import React, { useState, useEffect } from "react";

export default function index() {
  const [image, setImage] = useState();
  const [imageSaved, setImageSaved] = useState(false);
  const [loading, setLoading] = useState("")
  const [text, setText] = useState("");
  const [output, setOutput] = useState({
    songTitle: "",
    composer: "",
    musicPublisher: "",
  });

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
      setLoading("...doing AI...")
      getInfoFromText(text);
    }
  }, [text]);

  async function saveImage(event) {
    event.preventDefault();
    // setOutput("...extracting text...")
    console.log(event.target.elements.image.files[0].type)
    const contentType = event.target.elements.image.files[0].type
    try {
      const response = await fetch("http://localhost:3030/api/save", {
        method: "POST",
        headers: {
          "Content-Type": contentType,
        },
        body: image,
      });
      const data = await response.json();
      console.log("Message from server: ", data.message);
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
    // event.preventDefault()
    if (text === "") return;

    console.log(typeof text);

    const response = await fetch("http://localhost:3030/api/getInfo")

    console.log(response)

    const data = await response.json();
    console.log(data)
    const { output } = data;
    console.log("OpenAI replied...", output);
    setOutput(output);
  }

  return (
    <>
      <form 
      onSubmit={saveImage}
      // onSubmit={getInfoFromText}
      >
        <input
          type="file"
          name="image"
          onChange={(event) => setImage(event.target.files[0])}
        ></input>
        <button type="submit">Submit</button>
      </form>
      {/* <p>{text ? text : null}</p> */}
      <div>
        <p>Song Title: {output.songTitle}</p>
        <p>Composer: {output.composer}</p>
        <p>Music Publisher: {output.musicPublisher}</p>
      </div> 
      </>
  );
}
