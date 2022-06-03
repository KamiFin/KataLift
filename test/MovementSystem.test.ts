import { suite, test, should, print, printWithoutDoors } from './utils';
import { mock, instance, verify } from 'ts-mockito';
import { Lift, MovementSystem, RequestFloor } from '../src/types/Lift';
import { Directions } from '../src/constants/directions';
import { movementSystemInAction, nearestLifts, reverseFloors } from '../src/utils';

describe('LiftSystemPrinter', function () {
  it('No lifts', function () {
      const floors: number[] = [0, 1, 2, 3];
      const movementSystem: MovementSystem = {floors, lifts: [], requests: []}
      verify(print(movementSystem, true));
  });

  it('Lift no doors', function () {
      const lift: Lift = { id: "0", floorNumber: 0, floorRequest: [2, 3], isDoorsOpen: false };
      const floors: number[] = [0, 1, 2, 3];
      const movementSystem: MovementSystem = {floors, lifts: [lift], requests: []}
     verify(printWithoutDoors(movementSystem));
  });

  it('Movement system with 4 lifts', function () {
      const lift1: Lift = { id: "0", floorNumber: 3, floorRequest: [0], isDoorsOpen: false };
      const lift2: Lift ={ id: "2", floorNumber: 2,  floorRequest: [], isDoorsOpen: true};
      const lift3 : Lift ={ id: "3", floorNumber: 2, floorRequest: [], isDoorsOpen: false };
      const lift4 : Lift ={ id: "4", floorNumber: 0, floorRequest: [0], isDoorsOpen: false };
      const floors: number[] = [0, 1, 2, 3];
      const lifts = [lift1, lift2, lift3, lift4];
      const request: RequestFloor = {floorNumber: 1, direction: Directions.DOWN};
      const movementSystem : MovementSystem = {floors, lifts, requests: [request]};
      verify(print(movementSystem, true));
  });

  it('Movement system with a lot of lifts', function () {
      const lift1: Lift = { id: "0", floorNumber: 3, floorRequest: [3, 5, 7], isDoorsOpen: false };
      const lift2: Lift ={ id: "2", floorNumber: 2,  floorRequest: [], isDoorsOpen: true};
      const lift3 : Lift ={ id: "3", floorNumber: -2, floorRequest: [-2, 0], isDoorsOpen: false };
      const lift4 : Lift ={ id: "4", floorNumber: 8, floorRequest: [0, -1, -2], isDoorsOpen: true };
      const lift00 : Lift ={ id: "00", floorNumber: 10, floorRequest: [0, -1], isDoorsOpen: false };
      const lift111 : Lift ={ id: "111", floorNumber: 8, floorRequest: [], isDoorsOpen: false };
      const floors: number[] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const lifts = [lift1, lift2, lift3, lift4, lift00, lift111];
      const requests: RequestFloor[] = [
          {floorNumber: 1, direction: Directions.DOWN},
          {floorNumber: 6, direction: Directions.DOWN},
          {floorNumber: 5, direction: Directions.UP},
          {floorNumber: 5, direction: Directions.DOWN},
          {floorNumber: -1,direction: Directions.UP},
      ];
      const movementSystem : MovementSystem = {floors, lifts, requests};
      verify(print(movementSystem, true));

      
  });

  it('Movement system in action ', function () {
    const lift1: Lift = { id: "0", floorNumber: 3, floorRequest: [3, 5, 7], isDoorsOpen: false };
    const lift2: Lift ={ id: "2", floorNumber: 2,  floorRequest: [], isDoorsOpen: true};
    const lift3 : Lift ={ id: "3", floorNumber: -2, floorRequest: [-2, 0], isDoorsOpen: false };
    const lift4 : Lift ={ id: "4", floorNumber: 8, floorRequest: [0, -1, -2], isDoorsOpen: true };
    const floors: number[] = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const lifts = [lift1, lift2, lift3, lift4];
    const requests: RequestFloor[] = [
        {floorNumber: 1, direction: Directions.DOWN},
        {floorNumber: 6, direction: Directions.DOWN},
        {floorNumber: 5, direction: Directions.UP},
        {floorNumber: -1,direction: Directions.UP},
    ];
    const movementSystem : MovementSystem = {floors, lifts, requests};
    console.log(print(movementSystem, true))
    // console.log(print(movementSystemInAction(movementSystem), true));
    verify(print(movementSystem, true));

    
});
});