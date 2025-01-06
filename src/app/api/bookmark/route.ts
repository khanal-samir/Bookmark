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
      userId,
    });

    if (!bookmarks.length) {
      return ApiResponse.notFound("No bookmarks found");
    }
    return ApiResponse.success(
      bookmarks,
      "User Bookmarks fetched successfully",
    );
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return ApiResponse.error("Something went wrong while fetching bookmarks");
  }
};

export const POST = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;
    const userId = result;
    const { title, description, url, isImportant } = await req.json();

    const newBookmark = await BookmarkModel.create({
      title,
      url,
      description,
      userId,
      isImportant,
    });

    if (!newBookmark) return ApiResponse.error("Error while creating bookmark");
    return new ApiResponse(
      201,
      newBookmark,
      "Bookmark created successfully",
    ).send();
  } catch (error: any) {
    console.error(
      "Something went wrong while creating bookmark",
      error.message,
    );
    return ApiResponse.error("Something went wrong while creating bookmark");
  }
};

export const PATCH = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;
    const userId = result;
    const { bookmarkId, url, title, description, isImportant } =
      await req.json();
    const bookmark = await BookmarkModel.findOneAndUpdate(
      { userId, _id: bookmarkId },
      {
        title,
        url,
        description,
        isImportant,
      },
      {
        new: true,
      },
    );
    return ApiResponse.success(bookmark, "Bookmark updated successfully");
  } catch (error: any) {
    console.log("Something went wrong while updating bookmark", error.message);
    return ApiResponse.error("Something went wrong while updating bookmark");
  }
};

export const DELETE = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;
    const { bookmarkId } = await req.json();
    await BookmarkModel.findByIdAndDelete(bookmarkId);
    return ApiResponse.success(null, "Bookmark deleted success");
  } catch (error: any) {
    console.log("Something went wrong while deleting bookmark", error.message);
    return ApiResponse.error("Something went wrong while deleting bookmark");
  }
};
