const moment = require('moment');
const TestCaseIterator = require('../src/testCaseIterator');

describe("Parsing an input file", function() {

    const RESOURCE_FOLDER_PATH = './spec/resources/';

    it("Handle empty input file with no test cases", async() => {
        const iterator = TestCaseIterator.create(`${RESOURCE_FOLDER_PATH}empty.in`);
        expect(iterator.next()).toBe(false);
        expect(iterator.currentItem()).toBe(null);
     });

     it("Handle input file with single test case", async() => {
      const iterator = TestCaseIterator.create(`${RESOURCE_FOLDER_PATH}single_test_case.in`);
      const currentItem = iterator.currentItem();
      expect(currentItem).not.toBe(null);
      expect(currentItem.id).toBe(1);
      expect(currentItem.turnAround).toBe(5);
      expect(currentItem.fromAtoB.length).toBe(1);
      expect(currentItem.fromAtoB[0].depart).toEqual(moment("09:00", "HH:mm"));
      expect(currentItem.fromAtoB[0].arrive).toEqual(moment("10:30", "HH:mm"));
      expect(currentItem.fromBtoA.length).toBe(1);
      expect(currentItem.fromBtoA[0].depart).toEqual(moment("11:00", "HH:mm"));
      expect(currentItem.fromBtoA[0].arrive).toEqual(moment("12:30", "HH:mm"));      
      expect(iterator.next()).toBe(false);
   });

   it("Handle input file with two test cases", async() => {
      const iterator = TestCaseIterator.create(`${RESOURCE_FOLDER_PATH}two_test_cases.in`);
      const firstItem = iterator.currentItem();
      expect(firstItem).not.toBe(null);
      expect(firstItem.id).toBe(1);
      expect(firstItem.turnAround).toBe(5);
      expect(firstItem.fromAtoB.length).toBe(1);
      expect(firstItem.fromAtoB[0].depart).toEqual(moment("09:00", "HH:mm"));
      expect(firstItem.fromAtoB[0].arrive).toEqual(moment("10:30", "HH:mm"));
      expect(firstItem.fromBtoA.length).toBe(1);
      expect(firstItem.fromBtoA[0].depart).toEqual(moment("11:00", "HH:mm"));
      expect(firstItem.fromBtoA[0].arrive).toEqual(moment("12:30", "HH:mm"));      
      expect(iterator.next()).toBe(true);
      const secondItem = iterator.currentItem();
      expect(secondItem.id).toBe(2);
      expect(secondItem.turnAround).toBe(10);
      expect(secondItem.fromAtoB.length).toBe(2);
      expect(secondItem.fromAtoB[0].depart).toEqual(moment("09:00", "HH:mm"));
      expect(secondItem.fromAtoB[0].arrive).toEqual(moment("10:30", "HH:mm"));
      expect(secondItem.fromAtoB[1].depart).toEqual(moment("11:00", "HH:mm"));
      expect(secondItem.fromAtoB[1].arrive).toEqual(moment("12:30", "HH:mm"));  
      expect(secondItem.fromBtoA.length).toBe(2);
      expect(secondItem.fromBtoA[0].depart).toEqual(moment("09:30", "HH:mm"));
      expect(secondItem.fromBtoA[0].arrive).toEqual(moment("11:00", "HH:mm")); 
      expect(secondItem.fromBtoA[1].depart).toEqual(moment("13:00", "HH:mm"));
      expect(secondItem.fromBtoA[1].arrive).toEqual(moment("14:30", "HH:mm"));            
      expect(iterator.next()).toBe(false);
   });

   it("Handle test case with no journeys from A to B", async() => {
      const iterator = TestCaseIterator.create(`${RESOURCE_FOLDER_PATH}no_A_to_B_trips.in`);
      const currentItem = iterator.currentItem();
      expect(currentItem.fromAtoB.length).toBe(0);
      expect(currentItem.fromBtoA.length).toBe(1);
   });

   it("Handle test case with no journeys from B to A", async() => {
      const iterator = TestCaseIterator.create(`${RESOURCE_FOLDER_PATH}no_B_to_A_trips.in`);
      const currentItem = iterator.currentItem();
      expect(currentItem.fromAtoB.length).toBe(1);
      expect(currentItem.fromBtoA.length).toBe(0);
   });

   it("Journeys should be sorted in order", async() => {
      const iterator = TestCaseIterator.create(`${RESOURCE_FOLDER_PATH}trips_out_of_order.in`);
      const currentItem = iterator.currentItem();
      expect(currentItem.fromAtoB.length).toBe(2);
      expect(currentItem.fromAtoB[0].depart).toEqual(moment("07:00", "HH:mm"));
      expect(currentItem.fromAtoB[0].arrive).toEqual(moment("08:30", "HH:mm"));      
      expect(currentItem.fromAtoB[1].depart).toEqual(moment("09:00", "HH:mm"));
      expect(currentItem.fromAtoB[1].arrive).toEqual(moment("10:30", "HH:mm"));
      expect(currentItem.fromBtoA.length).toBe(2);
      expect(currentItem.fromBtoA[0].depart).toEqual(moment("11:00", "HH:mm"));
      expect(currentItem.fromBtoA[0].arrive).toEqual(moment("12:30", "HH:mm"));            
      expect(currentItem.fromBtoA[1].depart).toEqual(moment("15:00", "HH:mm"));
      expect(currentItem.fromBtoA[1].arrive).toEqual(moment("16:30", "HH:mm"));      
   });

});