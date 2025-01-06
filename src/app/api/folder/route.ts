import getUserId from "@/helpers/getUserId";
import FolderModel from "@/model/folder.model";
import { ApiResponse } from "@/lib/ApiResponse";

export const GET = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) {
      return result;
    }
    const userId = result;
    const folders = await FolderModel.find({
      userId,
    });

    if (!folders.length) {
      return ApiResponse.notFound("No folders found");
    }
    return ApiResponse.success(folders, "User folders fetched successfully");
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return ApiResponse.error("Something went wrong while fetching folders");
  }
};

export const POST = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;
    const userId = result;
    const { title, description, isImportant } = await req.json();

    const folder = await FolderModel.findOne({ title, userId });
    if (folder)
      return ApiResponse.badRequest("Folder with similar title exists");

    const newFolder = await FolderModel.create({
      title,
      description,
      isImportant,
      userId,
    });

    if (!newFolder) return ApiResponse.error("Error while creating folder");
    return new ApiResponse(
      201,
      newFolder,
      "Folder created successfully",
    ).send();
  } catch (error: any) {
    console.error("Something went wrong while creating folder", error.message);
    return ApiResponse.error("Something went wrong while creating folder");
  }
};

export const PATCH = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;
    const userId = result;
    const { folderId, title, description } = await req.json();
    const folder = await FolderModel.findOneAndUpdate(
      { userId, _id: folderId },
      {
        title,
        description,
      },
      {
        new: true,
      },
    );
    if (!folder) return ApiResponse.error("Error while updating folder");
    return ApiResponse.success(folder, "Folder updated successfully");
  } catch (error: any) {
    console.log("Something went wrong while updating folder", error.message);
    return ApiResponse.error("Something went wrong while updating folder");
  }
};

export const PUT = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;
    const userId = result;
    const { folderId, isImportant } = await req.json();
    const folder = await FolderModel.findOneAndUpdate(
      { userId, _id: folderId },
      {
        isImportant,
      },
      {
        new: true,
      },
    );
    if (!folder) return ApiResponse.error("Error while updating folder");
    return ApiResponse.success(
      folder,
      "Isimportant for folder updated successfully",
    );
  } catch (error: any) {
    console.log("Something went wrong while updating folder", error.message);
    return ApiResponse.error(
      "Something went wrong while updating isImportant for folder",
    );
  }
};
export const DELETE = async (req: Request): Promise<Response> => {
  try {
    const result = await getUserId();
    if (result instanceof Response) return result;
    const { folderId } = await req.json();
    await FolderModel.findByIdAndDelete(folderId);
    return ApiResponse.success(null, "Folder deleted success");
  } catch (error: any) {
    console.log("Something went wrong while deleting folder", error.message);
    return ApiResponse.error("Something went wrong while deleting folder");
  }
};
