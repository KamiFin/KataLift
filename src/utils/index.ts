import { Lift, MovementSystem } from "../types/Lift";

export function floorRequestIsPresent(lift: Lift, floorRequest: number) {
    if(lift.floorRequest && lift.floorRequest.length <= 0) {
      return false;
    }
    return lift.floorRequest.includes(floorRequest);
}

export function filterQueue(movements : MovementSystem, floorRequest: number) {
    const {requests} = movements;
    return requests.filter((req) => req.floorNumber === floorRequest);
}

export function reverseFloors(movements : MovementSystem) {
    return movements.floors.reverse();
}