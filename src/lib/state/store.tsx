import React, { useContext, useReducer, createContext } from "react";

export const MIN_LEFT_PANEL_WIDTH = 160;
export const MAX_LEFT_PANEL_WIDTH = 420;
export const MIN_RIGHT_PANEL_WIDTH = 160;
export const MAX_RIGHT_PANEL_WIDTH = 420;

const INITIAL_STATE: GlobalState = {
  leftPanel: {
    width: 200,
    isOpen: true,
  },
  rightPanel: {
    width: 200,
    isOpen: false,
  },
  bottomPanel: {
    height: 200,
    isOpen: false,
  },
};

type GlobalState = {
  leftPanel: {
    width: number;
    isOpen: boolean;
  };
  rightPanel: {
    width: number;
    isOpen: boolean;
  };
  bottomPanel: {
    height: number;
    isOpen: boolean;
  };
};

const GlobalStateContext = createContext<GlobalState>(INITIAL_STATE);
const GlobalStateDispatchContext = createContext<React.Dispatch<Action>>(() => {});

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalState, dispatch] = useReducer(globalStateReducer, INITIAL_STATE);

  return (
    <GlobalStateContext value={globalState}>
      <GlobalStateDispatchContext value={dispatch}>{children}</GlobalStateDispatchContext>
    </GlobalStateContext>
  );
};

export function useGlobalState() {
  return useContext(GlobalStateContext);
}

export function useGlobalStateDispatch() {
  return useContext(GlobalStateDispatchContext);
}

export type Action =
  | {
      kind: "open-right-panel-clicked";
    }
  | {
      kind: "toggle-right-panel-clicked";
    }
  | {
      kind: "right-panel-resized";
      width: number;
    }
  | {
      kind: "toggle-left-panel-clicked";
    }
  | {
      kind: "left-panel-resized";
      width: number;
    }
  | { kind: "open-bottom-panel-clicked" };

export function globalStateReducer(state: GlobalState, action: Action): GlobalState {
  switch (action.kind) {
    case "open-right-panel-clicked":
      return { ...state, rightPanel: { ...state.rightPanel, isOpen: true } };
    case "toggle-right-panel-clicked":
      return { ...state, rightPanel: { ...state.rightPanel, isOpen: !state.rightPanel.isOpen } };
    case "right-panel-resized":
      return {
        ...state,
        rightPanel: {
          ...state.rightPanel,
          width: Math.min(MAX_RIGHT_PANEL_WIDTH, Math.max(MIN_RIGHT_PANEL_WIDTH, action.width)),
        },
      };
    case "toggle-left-panel-clicked":
      return { ...state, leftPanel: { ...state.leftPanel, isOpen: !state.leftPanel.isOpen } };
    case "left-panel-resized":
      return {
        ...state,
        leftPanel: {
          ...state.leftPanel,
          width: Math.min(MAX_LEFT_PANEL_WIDTH, Math.max(MIN_LEFT_PANEL_WIDTH, action.width)),
        },
      };
    case "open-bottom-panel-clicked":
      return { ...state, bottomPanel: { ...state.bottomPanel, isOpen: true } };
  }
}
