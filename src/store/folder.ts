import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { IApiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";
import type { ISingleBookmark } from "./bookmarks";
export interface ISingleFolder {
  _id: string;
  title: string;
  description: string;
  isImportant: boolean;
  bookmarks: Array<ISingleBookmark>;
  updatedAt: Date;
  createdAt: Date;
}
interface IFolder {
  folders: Array<ISingleFolder>;
  loading: boolean;
  error: string | null;
  addFolder: (data: {
    title?: string;
    description?: string;
    isImportant?: boolean;
  }) => Promise<boolean>;

  deleteFolder: (id: string) => Promise<boolean>;

  updateFolder: (data: {
    folderId: string;
    title?: string;
    description?: string;
    isImportant?: boolean;
  }) => Promise<boolean>;

  fetchFolders: () => Promise<boolean>;
  addBookmarks(data: {
    folderId: string;
    bookmarkIds: Array<string>;
  }): Promise<boolean>;
  deleteBookmarks(data: {
    folderId: string;
    bookmarkId: string;
  }): Promise<boolean>;
}

const useFolderStore = create<IFolder>()(
  immer((set) => ({
    folders: [],
    loading: false,
    error: null,

    addFolder: async (data) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await axios.post<IApiResponse>("/api/folder", data);
        set((state) => {
          state.folders.unshift(response.data.data);
          state.loading = false;
        });
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;

        set((state) => {
          state.error =
            axiosError.response?.data.message || "Failed to add folder.";
          state.loading = false;
        });
        return false;
      }
    },
    deleteFolder: async (folderId) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        // Assume we have an API call here
        await axios.delete("/api/folder", {
          data: { folderId },
        });
        set((state) => {
          state.folders = state.folders.filter(
            (folder) => folder._id !== folderId,
          );
          state.loading = false;
        });
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;

        set((state) => {
          state.error =
            axiosError.response?.data.message || "Failed to delete folder.";
          state.loading = false;
        });
        return false;
      }
    },
    updateFolder: async (data) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await axios.patch<IApiResponse>(`/api/folder`, data);
        set((state) => {
          const index = state.folders.findIndex(
            (folder) => folder._id === data.folderId,
          );
          if (index !== -1) {
            state.folders[index] = response.data.data;
          }
          state.loading = false;
        });
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;

        set((state) => {
          state.error =
            axiosError.response?.data.message || "Failed to update folder.";
          state.loading = false;
        });
        return false;
      }
    },
    fetchFolders: async () => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        // Assume we have an API call here
        const response = await axios.get<IApiResponse>("/api/folder");
        set((state) => {
          state.folders = response.data.data;
          state.loading = false;
        });
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;

        set((state) => {
          state.error =
            axiosError.response?.data.message || "Failed to fetch folders.";
          state.loading = false;
        });
        return false;
      }
    },
    addBookmarks: async (data) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await axios.post(`/api/add-bookmarks`, {
          bookmarkIds: data.bookmarkIds,
          folderId: data.folderId,
        });
        set((state) => {
          const folder = state.folders.find((f) => f._id === data.folderId);
          if (folder) {
            folder.bookmarks = response.data.data;
          }
          state.loading = false;
        });
        return true;
      } catch (error) {
        set((state) => {
          state.error = (error as AxiosError).message;
          state.loading = false;
        });
        return false;
      }
    },
    deleteBookmarks: async (data) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        await axios.delete(`api/delete-bookmark/${data.bookmarkId}`, {
          data: { folderId: data.folderId },
        });
        set((state) => {
          state.loading = false;
          const folder = state.folders.find((f) => f._id === data.folderId);
          if (folder) {
            folder.bookmarks = folder.bookmarks.filter(
              (b) => b._id !== data.bookmarkId,
            );
          }
        });
        return true;
      } catch (error) {
        set((state) => {
          state.error = (error as AxiosError).message;
          state.loading = false;
        });
        return false;
      }
    },
  })),
);

export default useFolderStore;
