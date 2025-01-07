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
    }).sort({ ["createdAt"]: -1 });

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

    const bookmark = await BookmarkModel.findOne({
      userId,
      $or: [{ title }, { url }],
    });

    if (bookmark)
      return ApiResponse.badRequest(
        "Bookmark with similar title or URL already exists",
      );
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
    const { bookmarkId, url, title, description } = await req.json();
    const bookmark = await BookmarkModel.findByIdAndUpdate(
      bookmarkId,
      {
        $set: {
          title,
          url,
          description,
        },
      },
      { new: true },
    );
    console.log(bookmark);
    if (!bookmark) return ApiResponse.error("Error while updating bookmark");
    return ApiResponse.success(bookmark, "Bookmark updated successfully");
  } catch (error: any) {
    console.log("Something went wrong while updating bookmark", error.message);
    return ApiResponse.error("Something went wrong while updating bookmark");
  }
};
export const PUT = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;
    const { bookmarkId, isImportant } = await req.json();
    const bookmark = await BookmarkModel.findByIdAndUpdate(
      bookmarkId,
      {
        $set: {
          isImportant,
        },
      },
      { new: true },
    );
    console.log(bookmark);
    if (!bookmark)
      return ApiResponse.error("Error while updating isImportant for bookmark");
    return ApiResponse.success(bookmark, "Bookmark updated successfully");
  } catch (error: any) {
    console.log("Something went wrong while updating bookmark", error.message);
    return ApiResponse.error(
      "Something went wrong while updating isImportant for bookmark",
    );
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
