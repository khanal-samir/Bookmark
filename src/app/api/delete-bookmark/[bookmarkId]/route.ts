import FolderModel from "@/model/folder.model";
import { ApiResponse } from "@/lib/ApiResponse";
import getUserId from "@/helpers/getUserId";

export const DELETE = async (
  req: Request,
  { params }: { params: { bookmarkId: string } },
): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;

    const bookmarkId = params.bookmarkId;
    const { folderId } = await req.json();

    const updatedResult = await FolderModel.findByIdAndUpdate(
      folderId,
      {
        $pull: { bookmarks: { _id: bookmarkId } },
      },
      { new: true },
    );

    if (!updatedResult) {
      return ApiResponse.error("Error deleting bookmark from folder");
    }
    return ApiResponse.success(
      null,
      "Bookmark removed from folder successfully",
    );
  } catch (error: any) {
    console.error(
      "Something went wrong while removing bookmark from folder",
      error.message,
    );
    return ApiResponse.error(
      "Something went wrong while removing bookmark from folder",
    );
  }
};
