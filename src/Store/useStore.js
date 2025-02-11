import { create } from "zustand";

const useStore = create((set) => ({
  invokeMathPopUp: false,
  elementNeedToBeEdited: "",
  insideJmp: false,
  hasMathPluginRole: false,
  openMathPlugin: (element = "") =>
    set((state) => {
      return { elementNeedToBeEdited: element, invokeMathPopUp: true };
    }),
  closeMathPlugin: () => set((state) => ({ invokeMathPopUp: false })),
  setInsideJmp: (payload) => {
    set((state) => ({ insideJmp: payload }));
  },
  setHasMathPluginRole: (payload) => {
    set((state) => ({ hasMathPluginRole: payload }));
  },
}));

export default useStore;
