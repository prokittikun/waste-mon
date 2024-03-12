import { Label } from "flowbite-react";
import { Camera, Cpu, FileSearch, ImageUp, ListChecks } from "lucide-react";
import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import PreviewImage from "./components/previewImage";
import axios from "axios";

interface previewImage {
  url: string;
  file: File;
  name: string;
  size: number;
  status: "ready" | "process" | "done";
  result: string | null;
}
function UploadImage() {
  const [previewUrls, setPreviewUrls] = useState<previewImage[] | null>(null);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const newPreviewUrls: previewImage[] = [];

    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;
        newPreviewUrls.push({
          url: dataUrl,
          file: file,
          name: file.name,
          size: file.size,
          status: "ready",
          result: null,
        });

        if (newPreviewUrls.length === acceptedFiles.length) {
          setPreviewUrls((prevUrls) => {
            return prevUrls ? [...prevUrls, ...newPreviewUrls] : newPreviewUrls;
          });
        }
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/heic": [],
      "image/jfif": [],
    },
  });

  const classifyImage = (
    file: File,
    index: number
  ): Promise<{ result: string; index: number }> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      axios
        .post(`${process.env.REACT_APP_API_URL!}/classify`, formData)
        .then((response: any) => {
          console.log(response.data);
          resolve({ result: response.data.prediction.class, index });
        })
        .catch((error) => {
          console.error("Error during classification:", error);
          reject(error);
        });
    });
  };

  const handleClassify = () => {
    setPreviewUrls((prevUrls) => {
      if (prevUrls) {
        return prevUrls.map((image) => {
          return { ...image, status: "process" };
        });
      }
      return prevUrls;
    });
    const classifyPromises =
      previewUrls?.map((image, index) => classifyImage(image.file, index)) ||
      [];

    Promise.all(classifyPromises)
      .then((results) => {
        console.log("Classify results:", results);

        setPreviewUrls((prevUrls) => {
          if (prevUrls) {
            return prevUrls.map((image, index) => {
              const matchingResult = results.find(
                (result) => result.index === index
              );
              return matchingResult
                ? { ...image, result: matchingResult.result, status: "done" }
                : image;
            });
          }
          return prevUrls;
        });
      })
      .catch((error) => {
        console.error("Error during classification:", error);
      });
  };

  const handleRemoveImage = (index: number) => {
    setPreviewUrls((prevUrls) => {
      if (prevUrls && prevUrls.length > 0) {
        const updatedUrls = [...prevUrls];
        updatedUrls.splice(index, 1);
        return updatedUrls;
      }
      return prevUrls;
    });
    if (previewUrls && previewUrls.length === 1) {
      setPreviewUrls(null);
    }
  };

  return (
    <>
      <div className="relative w-full h-[100vh] flex justify-center items-center bg">
        <div className="relative bg-white max-w-[32rem] max-h-[43rem] flex flex-col gap-4 h-full w-full rounded-3xl p-5 shadow-xl mx-3 md:mx-4">
          <div className="flex justify-center">
            <img
              src="/wastemon-logo.png"
              className="w-[6rem] my-[-20px]"
              alt="Wastemon Logo"
            />
          </div>
          <div
            className={"relative flex flex-col h-44 w-full"}
            {...getRootProps()}
          >
            {isDragActive ? (
              <div className="absolute rounded-md left-0 right-0 top-0 bottom-0 flex h-full justify-center items-center z-50  bg-[rgba(102,74,0,.8)] ">
                <img
                  src="https://www.remove.bg/images/corner.svg"
                  style={{
                    left: "12px",
                    top: "12px",
                    position: "absolute",
                    width: "34px",
                  }}
                  alt="corner"
                />

                <img
                  src="https://www.remove.bg/images/corner.svg"
                  style={{
                    right: "12px",
                    top: "12px",
                    position: "absolute",
                    transform: "rotate(90deg)",
                    width: "34px",
                  }}
                  alt="corner"
                />
                <img
                  src="https://www.remove.bg/images/corner.svg"
                  style={{
                    left: "12px",
                    bottom: "12px",
                    position: "absolute",
                    transform: "rotate(270deg)",
                    width: "34px",
                  }}
                  alt="corner"
                />
                <img
                  src="https://www.remove.bg/images/corner.svg"
                  style={{
                    right: "12px",
                    bottom: "12px",
                    position: "absolute",
                    transform: "rotate(180deg)",
                    width: "34px",
                  }}
                  alt="corner"
                />
                <span className="text-4xl text-white font-bold">
                  Drop image here
                </span>
              </div>
            ) : null}

            <Label
              htmlFor="dropzone-file"
              className={
                "flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 "
              }
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg
                  className="mb-4 h-8 w-8 text-gray-500 "
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 ">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 ">
                  PNG or JPG (MAX. 1200x1200px)
                </p>
              </div>
            </Label>
            <input
              {...getInputProps()}
              type="file"
              accept="image/png, image/gif, image/jpeg"
              className=""
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl ">Files in queue</span>
            <span
              onClick={() => setPreviewUrls(null)}
              className="text-red-500 cursor-pointer"
            >
              Remove all
            </span>
          </div>
          <div className=" max-h-full no-scrollbar overflow-y-auto flex flex-col gap-2">
            {previewUrls?.map((data, index) => (
              <PreviewImage
                key={index}
                previewUrl={data.url}
                name={data.name}
                size={data.size}
                classifyResult={data.result}
                status={data.status}
                onClick={() => handleRemoveImage(index)}
              />
            ))}
          </div>
          {!previewUrls ? (
            <>
              <div className="flex flex-col h-full justify-center items-center">
                <FileSearch className="text-3xl " color="#dddddd" size={40} />
                <span className="text-lg font-semibold text-[#dddddd]">
                  No file selected
                </span>
              </div>
            </>
          ) : (
            <button
              onClick={handleClassify}
              className={
                "bg-green-500 px-16 py-2.5 rounded-lg text-white font-semibold bottom-0"
              }
            >
              Classify
            </button>
          )}
        </div>
      </div>
      <div className="flex flex-col  h-screen justify-start items-center mt-14 gap-12 lg:gap-28 lg:mt-[10rem]">
        <div className="flex flex-col justify-center items-center">
          <div className="text-center text-[2.5rem] font-bold text-[#00d748]">
            4 Easy Steps to Use the Waste-Mon
          </div>
          <div className="text-center text-xl text-[#00d748]">
            Turn Waste into Resources
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="bg-green-50 w-[21rem] h-[21rem] flex flex-col gap-3 justify-center items-center px-6">
            <div className="bg-white w-32 h-32 rounded-full flex justify-center items-center border-4 border-[#00d748]">
              <Camera size={80} color="#00d748" />
            </div>
            <span className="text-2xl font-semibold text-[#00d748] text-center">
              Take a photo
            </span>
            <span className="text-[#00d748] text-center">
              Just snap a photo of the trash that catches your eye
            </span>
          </div>
          <div className="bg-green-50 w-[21rem] h-[21rem] flex flex-col gap-3 justify-center items-center px-6">
            <div className="bg-white w-32 h-32 rounded-full flex justify-center items-center border-4 border-[#00d748]">
              <ImageUp size={80} color="#00d748" />
            </div>
            <span className="text-2xl font-semibold text-[#00d748] text-center">
              Upload
            </span>
            <span className="text-[#00d748] text-center">
              Once you're done, select "Upload Image" to proceed.
            </span>
          </div>
          <div className="bg-green-50 w-[21rem] h-[21rem] flex flex-col gap-3 justify-center items-center px-6">
            <div className="bg-white w-32 h-32 rounded-full flex justify-center items-center border-4 border-[#00d748]">
              <Cpu size={80} color="#00d748" />
            </div>
            <span className="text-2xl font-semibold text-[#00d748] text-center">
              Proceed
            </span>
            <span className="text-[#00d748] text-center">
              Simply click the <b>"Classify"</b> button to let the system
              analyze the image.
            </span>
          </div>
          <div className="bg-green-50 w-[21rem] h-[21rem] flex flex-col gap-3 justify-center items-center px-6">
            <div className="bg-white w-32 h-32 rounded-full flex justify-center items-center border-4 border-[#00d748]">
              <ListChecks size={80} color="#00d748" />
            </div>
            <span className="text-2xl font-semibold text-[#00d748] text-center">
              Completed
            </span>
            <span className="text-[#00d748] text-center">
              Done! Check out the results, categorized as Organic and Recycle.
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default UploadImage;
