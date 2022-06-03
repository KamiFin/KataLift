
import { useContext, createContext, Dispatch } from "react";
import { Lift, MovementSystem } from "../types/Lift";

export const LiftContext = createContext<[MovementSystem, Dispatch<{ type: string; payload: any }>]>([
  {floors: [], lifts:[], requests: []},
  () => null,
]);

export const liftReducers = (state: MovementSystem, actions: { type: string; payload: any }) => {
  switch (actions.type) {
    case "ADD_FLOOR": {
        const cpyState: MovementSystem = {...state};
        cpyState.floors = [...cpyState.floors,
            actions.payload]
      return cpyState;
    }

    case "ADD_MOVEMENT": {
      const cpyState: MovementSystem = {...state};
      cpyState.lifts = [...cpyState.lifts,
          actions.payload]
      return cpyState;
    }

  case "ADD_REQUEST": {
    const cpyState: MovementSystem = {...state};
    cpyState.requests = [...cpyState.requests,
        actions.payload]
    return cpyState;
  }
  }

  return state;
};

export function useLiftInfo() {
  return useContext(LiftContext);
}
