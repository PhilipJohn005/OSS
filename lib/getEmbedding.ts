
let extractor: any = null;

export default async function getEmbedding(text: string): Promise<number[] | null> {

  try {
    if (!extractor) {
      const { pipeline } = await import('@xenova/transformers');
        extractor = await pipeline('feature-extraction', 'Xenova/bge-small-en-v1.5', {
            quantized: true, // use quantized ONNX model for browser
        });
    }

    const output = await extractor(text, { pooling: 'mean', normalize: true });
    const data = output.data;

    return Array.isArray(data[0]) ? data[0] : data;
  } catch (err) {
    console.error("Embedding error:", err);
    return null;
  }
}
