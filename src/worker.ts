const IS_MAIN = typeof window !== "undefined" && self instanceof Window;

if (!IS_MAIN) {
  const worker = self;
  worker.onmessage = async function (message) {
    const {
      type,
      payload,
    }: { type: string; payload: { image: string; quality: number } } =
      message.data ?? {};

    if (type === "COMPRESS_IMAGE") {
      const { compress } = await import("../pkg/webassembly");
      const result = compress(payload?.image, payload?.quality);
      worker.postMessage({
        type: "COMPRESSION_COMPLETE",
        payload: {
          image: result,
        },
      });
    }
  };
}
