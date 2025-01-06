import BookmarkModel from "@/model/bookmark.model";
import getUserId from "@/helpers/getUserId";
import { ApiResponse } from "@/lib/ApiResponse";

export const GET = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) {
      return result;
    }
    const userId = result;
    const bookmarks = await BookmarkModel.find({
      owner: userId,
    });
    console.log(bookmarks);

    if (!bookmarks.length) {
      return ApiResponse.notFound("No bookmarks found");
    }
    return ApiResponse.success();
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return ApiResponse.error("Something went wrong while fetching bookmarks");
  }
};
