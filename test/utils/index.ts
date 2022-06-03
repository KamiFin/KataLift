export { suite, test, params, skip, only } from '@testdeck/mocha';

import * as _chai from 'chai';
import { Directions } from '../../src/constants/directions';
import { Lift, MovementSystem, RequestFloor } from '../../src/types/Lift';
import { filterQueue, floorRequestIsPresent, reverseFloors } from '../../src/utils';
const _should = _chai.should();
export const should = _should;

function getWhitespace(length: number): string {
    return " ".repeat(Math.max(0, length));
}

function printLift(lift: Lift, floor: number, withDoors: boolean): string {
    if (lift.isDoorsOpen && withDoors) {
        if (floorRequestIsPresent(lift, floor)) {
            return "]*" + lift.id + "[";
        } else {
            return " ]" + lift.id + "[";
        }
    }
    else {
        if (floorRequestIsPresent(lift, floor)) {
            return withDoors ? "[*" + lift.id + "]" : "*" + lift.id;
        } else {
            return withDoors ? " [" + lift.id + "]" : lift.id + " ";
        }
    }
}

export function printLiftFloor(lift: Lift, floor: number, withDoors: boolean): string {
    if (lift.floorNumber === floor) {
        return printLift(lift, floor, withDoors);
    }
    
    const padding: string = getWhitespace(lift.id.length);
    if (floorRequestIsPresent(lift, floor)) {
        return (withDoors ? "  *" : "*") + padding;
    } else {
        return (withDoors ? "   " : " ") + padding;
    }
}

function calculateFloorLength (floors: number[]) : number {
    if (floors.length === 0) {
        throw new Error("InvalidArgumentExcpetion: Must have at least one floor");
    }

    const highestFloor: number = Math.max(...floors);
    const lowestFloor: number = Math.min(...floors);
    const highestFloorNameLength: number = highestFloor.toString().length;
    const lowestFloorNameLength: number = lowestFloor.toString().length;
    return Math.max(highestFloorNameLength, lowestFloorNameLength);
}

function printCallDirection (request: RequestFloor): string {
    switch (request.direction) {
        case Directions.DOWN:
            return "v";
        case Directions.UP:
            return "^";
        default:
            return " ";
    }
}

export function print(movementSystem: MovementSystem, withDoors: boolean): string {
    const builder: string[] = [];
    const reverse = reverseFloors(movementSystem);
    const floorLength = calculateFloorLength(reverse);
    reverse.forEach((floor) => {
        const floorPadding: string = getWhitespace(floorLength - floor.toString().length);
        builder.push(floorPadding);
        builder.push(floor.toString());

        const requests = filterQueue(movementSystem, floor)
            .map(printCallDirection)
            .join("");
        // if there are less than 2 calls on a floor we add padding to keep everything aligned
        const requestPadding = getWhitespace(2 - requests.length);
        builder.push(" ");
        builder.push(requests);
        builder.push(requestPadding);

        builder.push(" ");
        const lifts = movementSystem.lifts
            .map((lift) => printLiftFloor(lift, floor, withDoors))
            .join(" ");
            builder.push(lifts);

        // put the floor number at both ends of the line to make it more readable when there are lots of lifts,
        // and to prevent the IDE from doing rstrip on save and messing up the approved files.
        builder.push(floorPadding);
        builder.push(floor.toString());

        builder.push('\n');
    });

    return builder.join("");
}

export function printWithoutDoors (movementSystem: MovementSystem): string {
    return print(movementSystem, false);
}