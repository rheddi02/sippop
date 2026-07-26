import { normalizeCategory } from "@/api/menu";
import { CategoryCoverRow } from "@/api/categoryCovers";
import { CategoryId } from "@/utils/types";

export interface CategoryCover {
  id: string;
  categoryId: CategoryId;
  image: { uri: string };
}

// Rows with no image aren't useful as cover art, so they're filtered out
// here rather than rendered with a placeholder.
export function getCategoryCovers(rows: CategoryCoverRow[]): CategoryCover[] {
  return rows
    .filter((row) => !!row.image_url)
    .map((row) => ({
      id: row.id,
      categoryId: normalizeCategory(row.category),
      image: { uri: row.image_url! },
    }));
}
