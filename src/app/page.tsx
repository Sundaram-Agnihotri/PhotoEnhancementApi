"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { useState } from "react";

const apikey: any = "wx6qn49n4m60kym5z"


export default function Home() {
  const [currentImage, setCurrentImage] = useState<any>(null);
  const [generatedImage, setGeneratedImage] = useState<any>(null);

  const [description, setDescription] = useState('');

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        setCurrentImage(e.target.result);
      }
      reader.readAsDataURL(selectedFile);
    }
  }

  const handleChange = (event: any) => {
    setDescription(event.target.value);
  }

  const generateImage = async () => {
    if (description.length == 0) {
      return
    }
    if (!currentImage) {
      return
    }

    try {
      const formData = new FormData();
      formData.append('background.prompt', description);
      formData.append('outputSize', '1000x1000');
      formData.append('padding', '0.1');

      const base64Response = await fetch(currentImage);
      const blob = await base64Response.blob();
      formData.append('imageFile', blob);

      const response = await fetch('https://image-api.photoroom.com/v2/edit',{
        method:'POST',
        headers: {
          'x-api-key': apikey, // Replace with your actual API key
        },
        body:formData
      })

      if (!response.ok){
        const text = await response.text(); // Try converting the body to text
        console.error('API request failed:', response.status, text);
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.blob();
      const url = window.URL.createObjectURL(data);
      setGeneratedImage(url)

    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <main className={styles.main}>
      <div className={styles.maincontainer}>
        <h1>AI IMAGE <span>ENHANCER</span></h1>
        <div className={styles.bothImages}>
          {currentImage && <img src={currentImage} alt="Generated Image" />}
          {generatedImage && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
          }
          {generatedImage && <img src={generatedImage} alt="Generated Image" />}
          {generatedImage &&
            <a className={styles.downloadbtn} download={true} href={generatedImage} target="_blank">Download</a>
          }

        </div>
        <input type="file"
          id="fileInput"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <button className={styles.selectImage} onClick={() => document.getElementById('fileInput')?.click()}>
          Select new image
        </button>

        {
          currentImage && <div
            className={styles.promptContainer}
          >
            <input type="text" value={description} onChange={handleChange} placeholder="Describe the image" />
            <button onClick={generateImage}>Try</button>

          </div>
        }
      </div>

    </main>
  );
}
