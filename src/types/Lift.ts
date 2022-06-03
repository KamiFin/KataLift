import { Directions } from "../constants/directions";

export type Lift = {
  id: string,
  floorNumber: number,
  floorRequest: number[],
  isDoorsOpen: boolean,
  isOpeningDoors?: boolean
};

export type MovementSystem = {
  floors: number[],
  lifts: Lift[],
  requests: RequestFloor[]
};

export type RequestFloor = {
  floorNumber: number,
  direction: Directions,
  liftId?: string
}



