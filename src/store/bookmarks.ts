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

interface IBookmark {
  bookmarks: IApiResponse["data"][];
  loading: boolean;
  error: string | null;
  addBookmark: (data: AddBookmarkInput) => Promise<void>;
  deleteBookmark: (id: string) => Promise<void>;
  updateBookmark: (data: UpdateBookmarkInput) => Promise<void>;
  fetchBookmarks: () => Promise<void>;
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
          state.bookmarks.push(response.data.data);
          state.loading = false;
        });
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;
        set((state) => {
          state.error = axiosError.message || "Failed to add bookmark.";
          state.loading = false;
        });
      }
    },

    deleteBookmark: async (id) => {
      set((state) => {
        state.loading = true;
        state.error = null;
      });
      try {
        await axios.delete("/api/bookmark", { data: { id } });
        set((state) => {
          state.loading = false;
          state.bookmarks = state.bookmarks.filter((b) => b._id !== id);
        });
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;
        set((state) => {
          state.error = axiosError.message || "Failed to delete bookmark.";
          state.loading = false;
        });
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
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;
        set((state) => {
          state.error = axiosError.message || "Failed to update bookmark.";
          state.loading = false;
        });
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
      } catch (error) {
        const axiosError = error as AxiosError<IApiResponse>;
        set((state) => {
          state.error = axiosError.message || "Failed to fetch bookmarks.";
          state.loading = false;
        });
      }
    },
  })),
);

export default useBookmarkStore;
