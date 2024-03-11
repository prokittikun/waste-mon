import { FileInput, Label } from "flowbite-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { FileWithPath, useDropzone } from "react-dropzone";

function App() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    const reader = new FileReader();

    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewUrl(dataUrl);
    };

    reader.readAsDataURL(acceptedFiles[0]);
  }, []);

  const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        const dataUrl = reader.result as string;
        console.log(dataUrl);

        setPreviewUrl(dataUrl);
      };

      reader.readAsDataURL(file);
      console.log(file);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const [isOrganic, setIsOrganic] = useState(true);
  const [loading, setLoading] = useState(true);
  useMemo(() => {
    const timer = setTimeout(() => {
      setLoading(!loading);
    }, 1000);
  }, [loading]);

  return (
    <div {...(!previewUrl ? getRootProps() : null)}>
      {isDragActive ? (
        <div className="absolute left-0 right-0 top-0 bottom-0 flex justify-center items-center z-50 bg-[rgba(102,74,0,.8)] ">
          <img
            src="https://www.remove.bg/images/corner.svg"
            style={{ left: "34px", top: "34px", position: "absolute" }}
            alt="corner"
          />

          <img
            src="https://www.remove.bg/images/corner.svg"
            style={{
              right: "34px",
              top: "34px",
              position: "absolute",
              transform: "rotate(90deg)",
            }}
            alt="corner"
          />
          <img
            src="https://www.remove.bg/images/corner.svg"
            style={{
              left: "34px",
              bottom: "34px",
              position: "absolute",
              transform: "rotate(270deg)",
            }}
            alt="corner"
          />
          <img
            src="https://www.remove.bg/images/corner.svg"
            style={{
              right: "34px",
              bottom: "34px",
              position: "absolute",
              transform: "rotate(180deg)",
            }}
            alt="corner"
          />
          <span className="text-4xl text-white font-bold">
            Drop image anywhere
          </span>
        </div>
      ) : null}

      {
        // Preview
        previewUrl ? (
          <>
            <div className="absolute flex  left-0 right-0 top-0 bottom-0 justify-center items-center z-10">
              <button className=" bg-white rounded-full w-40 h-40 flex justify-center items-center hover:scale-105 transition-all shadow-lg">
                <span className="animate-spin text-2xl transition-all">
                  Classify!
                </span>
              </button>
            </div>
            <div className="absolute z-0 left-0 right-0 top-0 bottom-0 bg-black">
              <div className="grid  gap-5 h-full grid-cols-12">
                <div className="text-center col-span-6 bg-green-400">
                  <span className=" text-9xl font-bold text-white">
                    Organic
                  </span>
                </div>
                <div className="text-center col-span-6 bg-sky-400">
                  <span className=" text-9xl font-bold text-white">
                    Recycle
                  </span>
                </div>
              </div>

              {/* <img
              src={previewUrl || ""}
              className={previewUrl ? "" : "hidden"}
              alt="Preview"
              style={{ maxWidth: "600px", maxHeight: "600px" }}
            />

            <button className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 focus:ring-4 focus:outline-none focus:ring-red-100">
              <span className="relative px-10 py-2.5 transition-all ease-in duration-75 bg-white  rounded-md group-hover:bg-opacity-0">
                Classify!
              </span>
            </button> */}
            </div>
            <div className="absolute bg-bl h-full w-full left-0 right-0 top-0 bottom-0 flex justify-center items-center z-30 ">
              <div className="relative w-full flex justify-center ">
                <div
                  className={
                    "bg-white w-11 h-11 transition ease-in-out delay-1000 " +
                    (loading ? "mr-[50rem]" : "mr-[-50rem]")
                  }
                >
                  1
                </div>
              </div>
            </div>
          </>
        ) : null
      }
      <div
        className={
          "absolute z-0 left-0 right-0 top-0 bottom-0 flex justify-center items-start item mx-10 lg:mx-80 my-12" +
          (previewUrl ? " hidden" : "")
        }
      >
        <Label
          htmlFor="dropzone-file"
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 "
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
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 ">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            type="file"
            className="cursor-pointer"
            onChange={onChangeFile}
            {...getInputProps()}
          />
        </Label>
      </div>
    </div>
  );
}

export default App;
