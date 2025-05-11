import { promises as fs } from "fs";
import * as path from "path";
/**
 * Callback function type for processing files
 */
type FileCallback = (filePath: string) => Promise<void>;

/**
 * Recursively navigates through a directory and processes files
 * @param directoryPath - The path to traverse
 * @param cb - Optional callback function to process each file
 */
export async function navigation(
  directoryPath: string,
  cb: FileCallback = async () => {}
): Promise<void> {
  try {
    // Validate input
    if (!directoryPath) {
      throw new Error("Directory path is required");
    }

    // Normalize the directory path to handle special characters
    const normalizedPath = path.normalize(directoryPath);

    // Check if directory exists
    try {
      const dirStats = await fs.stat(normalizedPath);
      if (!dirStats.isDirectory()) {
        throw new Error(`Path is not a directory: ${normalizedPath}`);
      }
    } catch (error) {
      console.error(
        `Directory does not exist or cannot be accessed: ${normalizedPath}`
      );
      throw error;
    }

    // Read directory contents
    const items = await fs.readdir(normalizedPath);

    // Process each item in the directory
    for (const item of items) {
      try {
        // Create absolute path using path.join to properly handle special characters
        const fullPath = path.join(normalizedPath, item);
        const stats = await fs.stat(fullPath);

        if (stats.isDirectory()) {
          // Recursively process subdirectories
          await navigation(fullPath, cb);
        } else if (stats.isFile()) {
          // Process files
          await cb(fullPath);
        }
      } catch (error) {
        // Log error but continue processing other files
        console.error(
          `Error processing item ${item}:`,
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error processing path ${directoryPath}:`, error.message);
    } else {
      console.error(`Unknown error processing path ${directoryPath}`);
    }
    throw error; // Rethrow to let the caller handle it
  }
}
