import { suite, test, should, print } from './utils';
import { mock, instance, verify } from 'ts-mockito';
import { Lift, MovementSystem } from '../src/types/Lift'
should;

@suite class MovementSystemUnitTest {


  @test 'should do something when call a method'() {
   const lift: Lift = {id: "0", floorNumber: 0, floorRequest: [], isDoorsOpen: false};
   const floorsQueue: number[] =[ 0, 1, 2, 3, 4, 5 ];
   const movementSystem: MovementSystem = {floors: floorsQueue, movements: [lift], requests: []}

   verify(print(movementSystem));
  }

}