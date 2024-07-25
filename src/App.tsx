import React from "react";
import { compress } from "../pkg/webassembly";

function App() {
  const [isCompressing, setIsCompressing] = React.useState(false);
  const [originalImage, setOriginalImage] = React.useState<string | null>();
  const [compressedImage, setCompressedImage] = React.useState<string | null>(
    null
  );
  function handleFileSelect(evt: React.ChangeEvent<HTMLInputElement>) {
    const file = evt.target.files?.[0];
    const qualityDOM = document.getElementById("quality") as HTMLInputElement;
    const quality: number = !Number.isNaN(+qualityDOM?.valueAsNumber)
      ? +qualityDOM?.valueAsNumber
      : 80;
    console.log(quality);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const blob = reader.result as string;
        setOriginalImage(blob);
        setIsCompressing(true);
        const compressed = compress(blob, quality);
        setCompressedImage(compressed);
        setIsCompressing(false);
      };
    }
  }

  return (
    <div>
      <input
        type="file"
        accept="image/png"
        onChange={handleFileSelect}
        multiple={false}
      />
      <br />
      <label htmlFor="quality">Quality</label>
      <input
        type="range"
        min="1"
        max="100"
        defaultValue="90"
        id="quality"
        name="quality"
        style={{ margin: "1rem" }}
      />

      {isCompressing ? <p style={{ color: "teal" }}>Compressing...</p> : null}
      <div
        style={{
          margin: "2rem 0",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        {originalImage ? (
          <div>
            <img
              src={originalImage}
              alt="original image"
              style={{ width: "100%", objectFit: "contain" }}
            />
            <p style={{ textAlign: "center" }}>Before</p>
          </div>
        ) : null}
        {compressedImage?.length ? (
          <div>
            <img
              src={compressedImage}
              alt="compressed image"
              style={{ width: "100%", objectFit: "contain" }}
            />
            <p style={{ textAlign: "center" }}>After</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
