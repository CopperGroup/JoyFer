"use server";

import { redis } from "@/lib/redis";
import { fetchAllProducts } from "../product.actions";
import { getFilterSettingsAndDelay } from "../filter.actions";
import { getCategoriesNamesIdsTotalProducts } from "../categories.actions";

const MAX_SIZE = 512 * 1024; // 512 KB per chunk

export async function createCatalogChunks(filteredProducts: any, categories: any, filterSettings: any, delay: number) {
  const jsonData = JSON.stringify(filteredProducts);
  const dataSize = Buffer.byteLength(jsonData, "utf8");
  
  const numberOfChunks = Math.ceil(dataSize / MAX_SIZE);
  const chunkSize = Math.ceil(dataSize / numberOfChunks + 1);

  const chunks = [];
  for (let i = 0; i < jsonData.length; i += chunkSize) {
    chunks.push(jsonData.slice(i, i + chunkSize));
  }

  for (let i = 0; i < chunks.length; i++) {
    await redis.set(`catalog_chunk_${i}`, chunks[i]);
  }

  await redis.set("catalog_chunk_count", chunks.length);
  await redis.set("catalog_categories", JSON.stringify(categories));
  await redis.set("catalog_filter_settings", JSON.stringify(filterSettings));
  await redis.set("catalog_delay", delay.toString());
}

export async function fetchCatalog() {
  try {
    const chunks = [];
    let chunkIndex = 0;
    const chunkCount: number | null = await redis.get("catalog_chunk_count");

    if (!chunkCount) {
      return await fetchAndCreateCatalogChunks();
    }

    while (chunkIndex < chunkCount) {
      const chunk = await redis.get(`catalog_chunk_${chunkIndex}`);
      if (chunk) {
        chunks.push(chunk);
      } else {
        return await fetchAndCreateCatalogChunks();
      }
      chunkIndex++;
    }

    const combinedChunks = chunks.join("");
    const filteredProducts = JSON.parse(combinedChunks);

    // Fetch cached categories, filter settings, and delay
    const categoriesData: string | null = await redis.get("catalog_categories");
    const filterSettingsData: string | null = await redis.get("catalog_filter_settings");
    const delayData = await redis.get("catalog_delay");

    const categories = categoriesData ? JSON.parse(categoriesData) : null;
    const filterSettings = filterSettingsData ? JSON.parse(filterSettingsData) : null;
    const delay = delayData ? Number(delayData) : null;

    if (!categories || !filterSettings || delay === null) {
      return await fetchAndCreateCatalogChunks();
    }

    console.log("Fetched from Redis cache");
    return { filteredProducts, categories, filterSettings, delay };
  } catch (error) {
    return await fetchAndCreateCatalogChunks();
  }
}

export async function fetchAndCreateCatalogChunks() {
  try {
    const filteredProducts = await fetchAllProducts();
    const categories = await getCategoriesNamesIdsTotalProducts();
    const { filterSettings, delay } = await getFilterSettingsAndDelay();

    await clearCatalogCache();
    await createCatalogChunks(filteredProducts, categories, filterSettings, delay);

    return { filteredProducts, categories, filterSettings, delay };
  } catch (error: any) {
    throw new Error(`Error fetching catalog data: ${error.message}`);
  }
}

export async function clearCatalogCache() {
  let cursor = "0";
  const matchPattern = "*catalog*";

  try {
    do {
      const scanResult = await redis.scan(cursor, { match: matchPattern, count: 100 });
      cursor = scanResult[0];
      const keys = scanResult[1];

      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== "0");
  } catch (error: any) {
    throw new Error(`Error clearing catalog cache: ${error.message}`);
  }
}