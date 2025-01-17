import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { IApiResponse } from "@/types/apiResponse";
import axios, { AxiosError } from "axios";

// Input types for different operations
interface AddBookmarkInput {
  title: string;
  description: string;
  url: string;
  isImportant: boolean;
}

interface UpdateBookmarkInput {
  bookmarkId: string;
  title?: string;
  description?: string;
  url?: string;
  isImportant?: boolean;
}

export interface ISingleBookmark {
  _id: string;
  title: string;
  description: string;
  url: string;
  isImportant: boolean;
  updatedAt: Date;
  createdAt: Date;
}
interface IBookmark {
  bookmarks: Array<ISingleBookmark>;
  loading: boolean;
  error: string | null;
  addBookmark: (data: AddBookmarkInput) => Promise<boolean>;
  deleteBookmark: (id: string) => Promise<boolean>;
  updateBookmark: (data: UpdateBookmarkInput) => Promise<boolean>;
  fetchBookmarks: () => Promise<boolean>;
}

const useBookmarkStore = create<IBookmark>()(
  immer((set) => ({
    bookmarks: [],
    loading: false,
    error: null,

    // Add a bookmark
    addBookmark: async (data) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await axios.post<IApiResponse>("/api/bookmark", data);
        set((state) => {
          state.bookmarks.unshift(response.data.data);
          state.loading = false;
        });
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;

        set((state) => {
          state.error =
            axiosError.response?.data.message || "Failed to add bookmark.";
          state.loading = false;
        });
        return false;
      }
    },

    deleteBookmark: async (bookmarkId) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await axios.delete("/api/bookmark", {
          data: { bookmarkId },
        });
        console.log(response);

        set((state) => {
          state.loading = false;
          state.bookmarks = state.bookmarks.filter((b) => b._id !== bookmarkId);
        });
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;
        console.log(axiosError);

        set((state) => {
          state.error =
            axiosError.response?.data.message || "Failed to delete bookmark.";
          state.loading = false;
        });
        return false;
      }
    },
    updateBookmark: async (data) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await axios.patch("/api/bookmark", data);
        set((state) => {
          state.loading = false;
          const index = state.bookmarks.findIndex(
            (b) => b._id === data.bookmarkId,
          );
          if (index > -1) {
            state.bookmarks[index] = response.data.data;
          }
        });
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;
        console.log(axiosError);

        set((state) => {
          state.error =
            axiosError.response?.data.message || "Failed to update bookmark.";
          state.loading = false;
        });
        return false;
      }
    },

    // Fetch all bookmarks
    fetchBookmarks: async () => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        const response = await axios.get<IApiResponse>("/api/bookmark");
        set((state) => {
          state.bookmarks = response.data.data;
          state.loading = false;
        });
        return true;
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;
        set((state) => {
          state.error =
            axiosError.response?.data.message || "Failed to fetch bookmarks.";
          state.loading = false;
        });
        return false;
      }
    },
  })),
);

export default useBookmarkStore;
