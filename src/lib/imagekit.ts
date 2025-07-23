import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function uploadToImageKit(
  file: File,
  fileName: string
): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await imagekit.upload({
      file: buffer,
      fileName: fileName,
      folder: "/mymo",
    });

    return result.url;
  } catch (error) {
    throw new Error("Failed to upload image");
  }
}

export async function deleteFromImageKit(fileId: string): Promise<void> {
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("Failed to delete image from ImageKit:", error);
  }
}

export { imagekit };
