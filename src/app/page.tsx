"use client";

import toast from "react-hot-toast";
import instance from "@/utils/axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveAs } from "file-saver";
import Image from "next/image";

export default function Home() {
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [exlGenerated, setExlGenerated] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const fetchUploadedImages = async () => {
    try {
      const response = await instance.get("upload/list");
      setUploadedImages(response.data.images);
      toast.success("Fetched uploaded images successfully!");
    } catch (error) {
      toast.error("Error fetching uploaded images.");
    }
  };

  useEffect(() => {
    fetchUploadedImages();
  }, []);

  const handleFileChange = (e: any) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const response = await instance.post("upload", formData);
        toast.success(response.data.message);
        setSelectedFile(null);
      } catch (error) {
        toast.error("Error uploading image. Please try again later.");
      }
    }
  };
  const generatePDF = async () => {
    try {
      const response = await instance.get("pdf", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });

      saveAs(blob, "generated_pdf.pdf");

      setPdfGenerated(true);
      toast.success("PDF generated successfully!");
    } catch (error) {
      toast.error("errror pdf not generated properly");
    }
  };

  const generateExl = async () => {
    try {
      const response = await instance.get("excel", {
        responseType: "arraybuffer",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      saveAs(blob, "generated_excel.xlsx");

      setExlGenerated(true);

      toast.success("Exl generated successfully!");
    } catch (error) {
      toast.error("Error generating Exl. Please try again later.");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-10 p-24">
      <h1 className="py-2 text-3xl">TASK ASSINGED.</h1>
      <div className="flex gap-10 px-4 py-2 rounded-2xl">
        <Button onClick={generatePDF} className="hover:bg-amber-800">
          {pdfGenerated ? "PDF Generated" : "Generate PDF"}
        </Button>
        <Button onClick={generateExl} className="hover:bg-green-700">
          {exlGenerated ? "EXL Generated" : "Generate EXL"}
        </Button>
      </div>
      <div className="grid items-center w-full max-w-sm gap-4">
        <Label htmlFor="picture">
          Upload Picture<span className="text-amber-500">*</span>
        </Label>
        <div className="flex gap-5">
          <Input
            id="image"
            type="file"
            onChange={handleFileChange}
            accept=".jpg, .jpeg, .png"
          />
          <Button onClick={handleUpload} className="rounded-xl">
            Save
          </Button>
        </div>
      </div>
      <div className="uploaded-images">
        <div className="grid grid-cols-3 gap-5">
          {uploadedImages.length > 0 ? (
            uploadedImages.map((imageName) => (
              <div key={imageName}>
                <Image
                  src={`https://kevin250.blob.core.windows.net/kevin250/${imageName}`}
                  alt={imageName}
                  width={350}
                  height={350}
                />
              </div>
            ))
          ) : (
            <p>No images uploaded yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
