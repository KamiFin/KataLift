export { suite, test, params, skip, only } from '@testdeck/mocha';

import * as _chai from 'chai';
import { Directions } from '../../src/constants/directions';
import { Lift, MovementSystem, RequestFloor } from '../../src/types/Lift';
import { filterQueue, floorRequestIsPresent, reverseFloors } from '../../src/utils';
const _should = _chai.should();
export const should = _should;

function getWhitespace(length: number) {
    return " ".repeat(Math.max(0, length));
}

function printLift (lift: Lift, floor: number) {
    if (lift.isDoorsOpen) {
        if (floorRequestIsPresent(lift, floor)) {
            return "]*" + lift.id + "[";
        } else {
            return " ]" + lift.id + "[";
        }
    }
    else {
        if (floorRequestIsPresent(lift, floor)) {
            return "[*" + lift.id + "]";
        } else {
            return " [" + lift.id + "]";
        }
    }
}

export function printLiftFloor(lift: Lift, floor: number) {
    if (lift.floorNumber === floor) {
        return printLift(lift, floor);
    }
    
    const padding = getWhitespace(lift.id.length);
    if (floorRequestIsPresent(lift, floor)) {
        return "  *" + padding;
    } else {
        return "   " + padding;
    }
}

function calculateFloorLength (floors: number[]) {
    if (floors.length === 0) {
        throw new Error("InvalidArgumentExcpetion: Must have at least one floor");
    }

    const highestFloor = Math.max(...floors);
    const lowestFloor = Math.min(...floors);
    const highestFloorNameLength = highestFloor.toString().length;
    const lowestFloorNameLength = lowestFloor.toString().length;
    return Math.max(highestFloorNameLength, lowestFloorNameLength);
}

function printCallDirection (request: RequestFloor) {
    switch (request.direction) {
        case Directions.DOWN:
            return "vv DOWN vv";
        case Directions.UP:
            return "^^ UP ^^";
        default:
            return " ";
    }
}

export function print(movementSystem: MovementSystem) {
    const builder = [];
    const floorLength = calculateFloorLength(reverseFloors(movementSystem));
    reverseFloors(movementSystem).forEach((floor) => {
        const floorPadding: string = getWhitespace(floorLength - floor.toString().length);
        builder.push(floorPadding);
        builder.push(floor);

        const calls = filterQueue(movementSystem, floor)
            .map(printCallDirection)
            .join("");
        // if there are less than 2 calls on a floor we add padding to keep everything aligned
        const callPadding = getWhitespace(2 - calls.length);
        builder.push(" ");
        builder.push(calls);
        builder.push(callPadding);

        builder.push(" ");
        const lifts = movementSystem.movements
            .map(lift => printLiftFloor(lift, floor))
            .join(" ");
            builder.push(lifts);

        // put the floor number at both ends of the line to make it more readable when there are lots of lifts,
        // and to prevent the IDE from doing rstrip on save and messing up the approved files.
        builder.push(floorPadding);
        builder.push(floor);

        builder.push('\n');
    });

    return builder.join("");
}

export function printWithoutDoors (movementSystem: MovementSystem) {
    print(movementSystem);
}