import { create } from "zustand";

const useStore = create((set) => ({
  invokeMathPopUp: false,
  elementNeedToBeEdited: "",
  insideJmp: false,
  hasMathPluginRole: false,
  updateTinyMceBody: false,
  showLatex: true,
  triggerContextMenu: { x: 0, y: 0 },
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
  setUpdateTinyMceBody: (payload) => {
    set((state) => ({
      updateTinyMceBody: payload,
    }));
  },
  setShowLatex: (payload) => {
    set((state) => ({
      showLatex: payload,
    }));
  },
  setContextMenu: (client) => {
    set((state) => ({
      triggerContextMenu: { ...client },
    }));
  },
}));

export default useStore;
