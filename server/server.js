import express from "express";
import cors from "cors";
import { v1 } from "@google-cloud/vision";
import fs from "fs";
import bodyParser from "body-parser";
import OpenAI from "openai";
import sample from "/Users/Checkers/Documents/spiced/ecc-app/ecc-mvp-with-express-server/server/sampleText.js";


const app = express();
const PORT = process.env.PORT || 3030;
app.use(cors());

// app.use(express.static("public"));

const client = new v1.ImageAnnotatorClient();

const openai = new OpenAI({
  Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
});

let contentType = "jpeg";

app.post(
  "/api/save",
  bodyParser.raw({
    type: ["image/jpeg", "image/png", "application/pdf"],
    limit: "5mb",
  }),
  (req, res) => {
    console.log("req body: ", req.body);

    const type = req.headers["content-type"];
    console.log(type);
    switch (type) {
      case "image/jpeg":
        contentType = "jpeg";
        fs.writeFile("image.jpeg", req.body, (error) => {
          if (error) console.log("Error writing file : ", error);
        });
        break;
      case "image/png":
        contentType = "jpeg";
        fs.writeFile("image.jpeg", req.body, (error) => {
          if (error) console.log("Error writing file : ", error);
        });
        break;
      case "application/pdf":
        contentType = "pdf";
        console.log(contentType);
        fs.writeFile("image.pdf", req.body, (error) => {
          if (error) console.log("Error writing file : ", error);
        });
        break;
    }
    res.status(200).json({ message: "File save succesful" });
  }
);

let extractedString = "";

app.get("/api/extract", async (req, res) => {
  console.log("google api requested");
  //   res.status(200).json({ text: "responses from extract api" });

  let extractedText = [];

  //   const fileName = "image.jpeg";
  const fileName = contentType === "pdf" ? "image.pdf" : "image.jpeg";

  try {
    const [response] = await client.textDetection(fileName);
    console.log(response)
    const detections = response.textAnnotations;
    console.log(detections)
    detections.forEach((word) => {
      extractedText.push(word.description);
    });
    extractedString = extractedText.toString();

    res.status(200).json({ text: extractedString });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something bad happened" });
  }
});

app.get("/api/extractPdf", async (req, res) => {
  console.log("google api requested (pdf)");
  //   res.status(200).json({ text: "responses from extract api" });

  let extractedText = [];

  //   const fileName = "image.jpeg";
  const fileName = "image.pdf";


  try {
    const [response] = await client.documentTextDetection(fileName);
    console.log(response)
    const detections = response.textAnnotations;
    console.log(detections)
    detections.forEach((word) => {
      extractedText.push(word.description);
    });
    extractedString = extractedText.toString();
    if(!response.ok) throw error

    res.status(200).json({ text: extractedString });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something bad happened" });
  }
});



app.get("/api/getInfo", async (req, res) => {
  console.log("openai api requested");
  if (extractedString === "") {
    console.log("empty extractString");
    return;
  }
  const prompt = `
    Extract the composer, song title and music publicher from this text: ${extractedString}. 
    Return a JSON object with the keys songTitle, composer, and musicPublisher. Fill in their respective values."
    }`;
  //   const prompt = `
  //     Extract the composer, song title and music publicher from this text: ${sample.sample}.
  //     Return a JSON object with the keys songTitle, composer, and musicPublisher. Fill in their respective values."
  //     }`;
  const response = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
    temperature: 0.2,
  });

  const completion = JSON.parse(response.choices[0].message.content);
  console.log(response.choices[0].message.content);
  res.status(200).json({ output: completion });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
