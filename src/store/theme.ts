import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware"; //local storage

type ThemeType = "dark" | "light";
interface ITheme {
  theme: ThemeType;
  setTheme(theme: ThemeType): void; // setTheme:()=>void
}

export const useTheme = create<ITheme>()(
  // ()() for middleware
  persist(
    immer((set) => ({
      theme: "light",
      setTheme: (t) => {
        set((state) => {
          state.theme = t;
        });
      },
    })),
    {
      name: "theme-storage",
    },
  ),
);

// without immer
// export const useThemeSample = create<ITheme>()(
//   persist(
//     (set) => ({
//       theme: "dark",
//       setTheme: (t) => {
//         set({ theme: t });
//       },
//     }),
//     { name: "theme-sample-storage" },
//   ),
// );
