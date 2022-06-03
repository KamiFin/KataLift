import { ListFormat } from "typescript";
import { Directions } from "../constants/directions";
import { LiftContext } from "../contexts/LiftContext";
import { Lift, MovementSystem, RequestFloor } from "../types/Lift";

export function floorRequestIsPresent(lift: Lift, floorRequest: number): boolean {
    if(lift.floorRequest && lift.floorRequest.length <= 0) {
      return false;
    }
    return lift.floorRequest.includes(floorRequest);
}

export function filterQueue({ requests }  : MovementSystem, floorRequest: number): RequestFloor[] {
    return requests.filter((req) => req.floorNumber === floorRequest);
}

export function reverseFloors(movements : MovementSystem): number[] {
    const floors = [...movements.floors]
    return floors.reverse();
}

function liftIsAssignedToRequest(lift: Lift, request: RequestFloor): boolean {
    return lift.id === request.liftId;
}

// export function liftsWithFloorRequest({ lifts } : MovementSystem, floorNumber: number): Lift[] {

// }

export function nearestLifts(movementSystem : MovementSystem, floorNumber: number): Lift[] {
    let nearestLiftUp: Lift = { id: "0", floorNumber: 0, floorRequest: [], isDoorsOpen: false };
    let nearestLiftDown: Lift = { id: "0", floorNumber: 0, floorRequest: [], isDoorsOpen: false };;
    let minDistanceUp = movementSystem.floors.length;
    let minDistanceDown = movementSystem.floors.length;
    movementSystem.lifts.forEach((lift) => {
        
        if(lift.floorNumber <= floorNumber && Math.abs(floorNumber - lift.floorNumber) <= minDistanceDown) {
            nearestLiftDown = lift;
            minDistanceDown  = Math.abs(floorNumber - lift.floorNumber);
        }  
        if(lift.floorNumber >= floorNumber && Math.abs(floorNumber - lift.floorNumber) <= minDistanceUp) {
            nearestLiftUp = lift;
            minDistanceUp  = Math.abs(floorNumber - lift.floorNumber);
        }
      
    });

    return [nearestLiftDown, nearestLiftUp];
}

function nearestLiftToCall(liftFromBottom: Lift, liftFromTop: Lift, request: RequestFloor): Lift {
    const bottomLiftReqNumber = liftFromBottom.floorRequest.length;
    const lastBottomFloorReq = bottomLiftReqNumber > 0 ? liftFromBottom.floorRequest[bottomLiftReqNumber - 1] : null;
    const topLiftReqNumber = liftFromTop.floorRequest.length;
    const lastTopFloorReq = topLiftReqNumber > 0 ? liftFromTop.floorRequest[topLiftReqNumber - 1] : null;

    if((request.direction === Directions.UP && lastBottomFloorReq!= null && lastBottomFloorReq > request.floorNumber) || lastBottomFloorReq == null) return liftFromBottom;
    if((request.direction === Directions.DOWN && lastTopFloorReq!= null && lastTopFloorReq < request.floorNumber) || lastTopFloorReq == null ) return liftFromTop;

    return liftFromBottom;
}


export function movementSystemInAction(movementSystem : MovementSystem): MovementSystem {
    let afterMove = {...movementSystem};
    const { lifts, requests } = movementSystem;

    const assignedRequests = requests.map((req) => {
        const nearestLiftSRequest = nearestLifts(movementSystem, req.floorNumber);
        console.log("nearestLiftRequest: " + JSON.stringify( nearestLiftSRequest))
        switch (nearestLiftSRequest.length) {
            case 2: return {...req, liftId: nearestLiftToCall(nearestLiftSRequest[0], nearestLiftSRequest[1], req).id};
            case 1: return {...req, liftId: nearestLiftToCall(nearestLiftSRequest[0], nearestLiftSRequest[0], req).id};
            default: return req;
        }
    });

    console.log("assigned request: " + JSON.stringify(assignedRequests));

    afterMove = {...afterMove, requests: assignedRequests};

    let afterMovementLifts = lifts.map((lift) => {
        if(lift.isOpeningDoors && !lift.isDoorsOpen) {
            return {...lift, isDoorsOpen: true};
        } else if(lift.isOpeningDoors && lift.isDoorsOpen) {
            return {...lift, isOpeningDoors: false, isDoorsOpen: false};
        }
        let liftAfterMove = { ...lift };
        const requestBeforeMove = movementSystem.requests.length;
        const reqLeft =  afterMove.requests.filter((req) => {
            const isAssigned = liftIsAssignedToRequest(lift, req);
            return (isAssigned && req.floorNumber !== lift.floorNumber) || !isAssigned;
        });
        const isCallFloor = requestBeforeMove > reqLeft.length;
        if(isCallFloor) {
            liftAfterMove = {...liftAfterMove,  isOpeningDoors: true}
            afterMove = {...afterMove, requests: reqLeft};
        }

        reverseFloors(movementSystem).forEach((floor) => {
            if(floorRequestIsPresent(lift, floor)) {
                if(lift.floorNumber == floor) {                
                    liftAfterMove = {...liftAfterMove, floorRequest: lift.floorRequest.filter((floorReq) => lift.floorNumber == floorReq), isOpeningDoors: true};
                } 
            } 
        });

        if(!liftAfterMove.isOpeningDoors && !liftAfterMove.isDoorsOpen) {
            const floorNumber = lift.floorNumber;
            const reqAssigned =  afterMove.requests.filter((req) => liftIsAssignedToRequest(lift, req));
            if(reqAssigned.length > 0) {
                if(reqAssigned[0].direction == Directions.UP) {
                    liftAfterMove = {...liftAfterMove,  floorNumber: floorNumber + 1};
                } else {
                    liftAfterMove = {...liftAfterMove,  floorNumber: floorNumber - 1};
                }
            } else {
                const nextFloorReq = liftAfterMove.floorRequest.length > 0 ? liftAfterMove.floorRequest[0] : null;
                if(nextFloorReq && nextFloorReq > floorNumber) {
                    liftAfterMove = {...liftAfterMove,  floorNumber: floorNumber + 1};
                } else if(nextFloorReq && nextFloorReq < floorNumber) {
                    liftAfterMove = {...liftAfterMove,  floorNumber: floorNumber - 1};
                }
            }
        }

        return liftAfterMove;
    });

    afterMove = {...afterMove, lifts: afterMovementLifts};
    
    return afterMove;
}