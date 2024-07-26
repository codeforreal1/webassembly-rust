import React, { useRef, useState } from "react";
import { formatBytes, getImageSizeFromBase64 } from "./helpers";
import Worker from "./worker?worker";

function App() {
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [originalImage, setOriginalImage] = React.useState<string | null>();
  const [compressedImage, setCompressedImage] = React.useState<string | null>(
    null
  );
  const [currentQuality, setCurrentQuality] = React.useState(90);

  function handleFileSelect(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const blob = reader.result as string;
        setOriginalImage(blob);
        setIsCompressing(true);
        compressImage(blob, currentQuality);
      };
    }
  }

  function compressImage(image: string, quality: number) {
    setIsCompressing(true);
    setCompressedImage(null);
    const worker = new Worker();
    worker.postMessage({
      type: "COMPRESS_IMAGE",
      payload: { image, quality },
    });
    worker.onmessage = function (message) {
      const { type, payload }: { type: string; payload: { image: string } } =
        message.data ?? {};

      if (type === "COMPRESSION_COMPLETE") {
        setCompressedImage(payload?.image);
        setIsCompressing(false);
      }
    };
  }

  function handleReCompression() {
    if (originalImage) {
      compressImage(originalImage, currentQuality);
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/png"
        onChange={handleFileSelect}
        multiple={false}
        disabled={isCompressing}
      />
      <br />
      <QualitySlider
        quality={currentQuality}
        onChange={setCurrentQuality}
        disable={isCompressing}
      />
      {compressedImage?.length ? (
        <button onClick={handleReCompression}>Re-Compress</button>
      ) : null}

      {isCompressing ? <p style={{ color: "teal" }}>Compressing...</p> : null}
      <div
        style={{
          margin: "2rem 0",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        {originalImage ? (
          <div>
            <img
              src={originalImage}
              alt="original image"
              style={{ width: "100%", objectFit: "contain", maxHeight: "80vh" }}
            />
            <p style={{ textAlign: "center" }}>
              Before: {formatBytes(getImageSizeFromBase64(originalImage)) ?? ""}
            </p>
          </div>
        ) : null}
        {compressedImage?.length ? (
          <div>
            <img
              src={compressedImage}
              alt="compressed image"
              style={{ width: "100%", objectFit: "contain", maxHeight: "80vh" }}
            />
            <p style={{ textAlign: "center" }}>
              After:{" "}
              {formatBytes(getImageSizeFromBase64(compressedImage)) ?? ""}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function QualitySlider({
  quality,
  onChange,
  disable,
}: {
  quality: number;
  onChange: (_: number) => void;
  disable?: boolean;
}) {
  const [currentQuality, setCurrentQuality] = useState(quality);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  function handleChange(value: number) {
    setCurrentQuality(value);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onChange(value);
    }, 300);
  }

  return (
    <div>
      <label htmlFor="quality">Quality</label>
      <input
        type="range"
        min="1"
        max="100"
        id="quality"
        name="quality"
        style={{ margin: "1rem" }}
        value={currentQuality}
        onChange={(evt) => handleChange(evt?.target?.valueAsNumber)}
        disabled={disable}
      />
      <span>{currentQuality}%</span>
    </div>
  );
}

export default App;
