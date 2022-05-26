import { Directions } from "../constants/directions";

export type Lift = {
  id: string,
  floorNumber: number,
  floorRequest: number[],
  isDoorsOpen: boolean
};

export type MovementSystem = {
  floors: number[],
  movements: Lift[],
  requests: RequestFloor[]
};

export type RequestFloor = {
  floorNumber: number,
  direction: Directions
}



