import { v2 as cloudinary } from "cloudinary";
import { program } from "commander";
import "dotenv/config";
import { resolve } from "node:path";
import { readJson } from "utils";

const assetManifestPath = resolve(process.cwd(), "assets", "manifest.json");
const assetManifestPromise = readJson(assetManifestPath);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

interface IntegrationAsset {
  id: string;
  image: string;
  banner?: string;
}
interface AssetManifest {
  integrations: IntegrationAsset[];
}

const assetPath = (file: string) => resolve(process.cwd(), "assets", file);

async function main() {
  const manifest: AssetManifest = await assetManifestPromise;

  const { integrations } = manifest;

  for (const integration of integrations) {
    const { id, image, banner } = integration;

    const imageUploadResult = await cloudinary.uploader.upload(
      assetPath(image),
      {
        public_id: `integrations/${id}/icon`,
        overwrite: true,
        access_mode: "public",
        colors: true,
        folder: "twona",
      },
    );

    console.log(
      `Uploaded image for integration ${id}: ${imageUploadResult.secure_url}`,
      imageUploadResult,
    );

    if (banner) {
      const bannerUploadResult = await cloudinary.uploader.upload(
        assetPath(banner),
        {
          public_id: `integrations/${id}/banner`,
          overwrite: true,
        },
      );

      console.log(
        `Uploaded banner for integration ${id}: ${bannerUploadResult.secure_url}`,
      );
    }
  }

  program.option("-i, --integration <integration>", "Integration ID");
}

main()
  .catch(console.error)
  .finally(() => {
    process.exit(0);
  });
