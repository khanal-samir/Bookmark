import FolderModel from "@/model/folder.model";
import getUserId from "@/helpers/getUserId";
import { ApiResponse } from "@/lib/ApiResponse";

export async function POST(req: Request): Promise<Response> {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;

    let { folderId, bookmarkIds } = await req.json();

    if (!Array.isArray(bookmarkIds)) {
      bookmarkIds = [bookmarkIds];
    }
    const updateFolder = await FolderModel.findByIdAndUpdate(
      folderId,
      {
        $addToSet: {
          // push without duplicate
          bookmarks: {
            $each: bookmarkIds, // add each index
          },
        },
      },
      {
        new: true,
      },
    ).populate("bookmarks");

    if (!updateFolder) return ApiResponse.error("Error while adding bookmarks");
    return ApiResponse.success(
      updateFolder.bookmarks,
      "Bookmarks added successfully",
    );
  } catch (error: any) {
    console.error("Something went wrong while adding bookmarks", error.message);
    return ApiResponse.error("Something went wrong while adding bookmarks");
  }
}
