// this file contains unit tests that cover the functions mentioned in the testing plan.
// the tests are implemented using the Jest framework.
import get from '../get';
import filter from '../filter'
import isEmpty from '../isEmpty'
import reduce from '../reduce'
import isBoolean from '../isBoolean'
import isLength from '../isLength'
import toString from '../toString'
import isDate from '../isDate'
import words from '../words'
import map from '../map.js'
import keys from '../keys.js'

// unit test the get function
describe('get function', () => {
    const object = { 'a': [{ 'b': { 'c': 3 } }] };
  
    test('Basic Property Access', () => {
      expect(get(object, 'a[0].b.c')).toBe(3);
      expect(get(object, ['a', '0', 'b', 'c'])).toBe(3);
      // Property doesn't exist
      expect(get(object, 'x.y.z')).toBe(undefined); 
    });
  
    test('Array Index Access', () => {
      expect(get(object, ['a', 0, 'b', 'c'])).toBe(3);
      expect(get(object, 'a.0.b.c')).toBe(3);
    });
  
    test('Default Value', () => {
      // Property doesn't exist
      expect(get(object, 'a.b.c', 'default')).toBe('default'); 
      // Property doesn't exist
      expect(get(object, 'x.y.z', 'default')).toBe('default');
      // No default value provided 
      expect(get(object, 'x.y.z')).toBe(undefined); 
    });
  
    test('Edge Cases', () => {
      // Empty object
      expect(get({}, 'a.b.c')).toBe(undefined);
    });
  });

// unit test the filter function
describe('filter function', () => {
  const users = [
    { 'user': 'barney', 'active': true },
    { 'user': 'fred', 'active': false }
  ];

  test('Basic Filtering', () => {
    // Filter active users
    expect(filter(users, ({ active }) => active)).toEqual([{ 'user': 'barney', 'active': true }]);

    // Filter based on index
    expect(filter(users, (_, index) => index === 1)).toEqual([{ 'user': 'fred', 'active': false }]);

    // Empty array test
    expect(filter([], () => true)).toEqual([[]]);
  });

  test('Different Predicates', () => {
    // Predicate returning true/false values
    expect(filter(users, ({ user }) => user === 'barney')).toEqual([{ 'user': 'barney', 'active': true }]);
    expect(filter(users, ({ user }) => user === 'nonexistent')).toEqual([[]]);

    // Predicate using different conditions
    expect(filter(users, ({ active }) => active)).toEqual([{ 'user': 'barney', 'active': true }]);
    expect(filter(users, ({ user }) => user.length > 4)).toEqual([{ 'user': 'barney', 'active': true }]);
  });

  test('Returned Array', () => {
    // Contents of the returned array
    expect(filter(users, ({ active }) => active)).toEqual([{ 'user': 'barney', 'active': true }]);
  });
});

// unit test the isEmpty function
describe('isEmpty function', () => {
  test('Basic Types', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(true)).toBe(true);
    expect(isEmpty(false)).toBe(true);
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(1)).toBe(true);

    expect(isEmpty('')).toBe(true);
    expect(isEmpty('abc')).toBe(false);
  });

  test('Array-like Values', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([1, 2, 3])).toBe(false);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('abc')).toBe(false);
  });

  test('Object Values', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ 'a': 1 })).toBe(false);
    const objWithNonEnumProps = Object.create(null, {
      prop1: {
        value: 'value1',
        enumerable: false,
      },
      prop2: {
        value: 'value2',
        enumerable: false,
      },
    });
    expect(isEmpty(objWithNonEnumProps)).toBe(true);
    // Add enumerable property
    objWithNonEnumProps.prop3 = 'value3';
    expect(isEmpty(objWithNonEnumProps)).toBe(false);
  });

  test('Map and Set', () => {
    const nonEmptyMap = new Map([[1, 'one'], [2, 'two']]);
    const nonEmptySet = new Set([1, 2, 3]);

    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(nonEmptyMap)).toBe(false);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(nonEmptySet)).toBe(false);
  });

  test('Edge Cases', () => {
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(NaN)).toBe(true);
  });
});

//unit test the reduce function
describe('reduce function', () => {
  test('Array Collection', () => {
    // Summing numbers in an array
    expect(reduce([1, 2, 3], (sum, n) => sum + n, 0)).toBe(6);
    // Concatenating strings in an array
    expect(reduce(['a', 'b', 'c'], (result, value) => result + value, '')).toBe('abc');
    // No initial accumulator
    expect(reduce([1, 2, 3], (sum, n) => sum + n)).toBe(6);
  });

  test('Object Collection', () => {
    // Grouping values by keys in an object
    expect(
      reduce(
        { 'a': 1, 'b': 2, 'c': 1 },
        (result, value, key) => {
          (result[value] || (result[value] = [])).push(key);
          return result;
        },
        {}
      )
    ).toEqual({ '1': ['a', 'c'], '2': ['b'] });
  });

  test('Empty Collection', () => {
    // Empty array
    expect(reduce([], (sum, n) => sum + n, 0)).toBe(0);
    // Empty object 
    expect(reduce({}, (result, value, key) => result + value, '')).toBe(''); 
  });

  test('Initial Accumulator', () => {
    // Using a string as an initial accumulator
    expect(reduce(['a', 'b', 'c'], (result, value) => result + value, 'start')).toBe('startabc');
    // Using an object as an initial accumulator
    expect(
      reduce(
        { 'a': 1, 'b': 2 },
        (result, value, key) => {
          result[key] = value * 2;
          return result;
        },
        {}
      )
    ).toEqual({ 'a': 2, 'b': 4 });
  });
});

// unit test the isBoolean function
describe('isBoolean function', () => {
  test('Boolean Primitives', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  test('Boolean Objects', () => {
    expect(isBoolean(new Boolean(true))).toBe(true);
    expect(isBoolean(new Boolean(false))).toBe(true);
  });

  test('Non-Boolean Values', () => {
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean('')).toBe(false);
    expect(isBoolean({})).toBe(false);
  });
});

// unit test the isLength function
describe('isLength function', () => {
  test('Valid Lengths', () => {
    expect(isLength(0)).toBe(true);
    expect(isLength(1)).toBe(true);
    // test with the biggest safe integer
    expect(isLength(9007199254740991)).toBe(true);
  });

  test('Invalid Lengths', () => {
    expect(isLength(-1)).toBe(false);
    expect(isLength(1.5)).toBe(false);
    expect(isLength('3')).toBe(false);
    expect(isLength(Infinity)).toBe(false);
    expect(isLength(NaN)).toBe(false);
  });

  test('Edge Cases', () => {
    expect(isLength(Number.MIN_VALUE)).toBe(false);
  });
});

// unit test the toString function
describe('toString function', () => {
  test('Primitive Values', () => {
    expect(toString(null)).toBe('');
    expect(toString(undefined)).toBe('');
    expect(toString(-0)).toBe('-0');
    expect(toString(0)).toBe('0');
    expect(toString('hello')).toBe('hello');
    expect(toString(Symbol('test'))).toBe('Symbol(test)');
    expect(toString(Infinity)).toBe('Infinity');
    expect(toString(-Infinity)).toBe('-Infinity');
  });

  test('Arrays', () => {
    expect(toString([1, 2, 3])).toBe('1,2,3');
    expect(toString(['a', 'b', 'c'])).toBe('a,b,c');
    expect(toString([null, undefined, 0])).toBe(',,0');

    // Test with nested arrays
    expect(toString([1, [2, [3, [4]]]])).toBe('1,2,3,4');
  });
});

// unit test the isDate function
describe('isDate function', () => {
  test('Valid Dates', () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date('2023-12-25'))).toBe(true);

    // Mixed values - Date and non-Date objects
    expect(isDate(new Date())).toBe(true);
    expect(isDate({})).toBe(false);
  });

  test('Invalid Dates', () => {
    // Date string
    expect(isDate('Mon April 23 2012')).toBe(false); 
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
    // Numeric value
    expect(isDate(123456)).toBe(false);
    // Array 
    expect(isDate(['a', 'b', 'c'])).toBe(false); 
  });
});

// unit test words function
describe('words function', () => {
  test('Default Behavior', () => {
    expect(words('fred, barney, & pebbles')).toEqual(['fred', 'barney', 'pebbles']);
    expect(words('')).toEqual([]);
    expect(words(null)).toEqual([]);
    expect(words(undefined)).toEqual([]);
    expect(words(123)).toEqual([]);
  });

  test('Custom Pattern', () => {
    expect(words('fred, barney, & pebbles', /[^, ]+/g)).toEqual(['fred', 'barney', '&', 'pebbles']);
    expect(words('split#by#hash', /[^#]+/g)).toEqual(['split', 'by', 'hash']);

    // Testing with a pattern that captures special characters
    expect(words('special$characters@in!this', /[^$@!]+/g)).toEqual(['special', 'characters', 'in', 'this']);
  });
});
// unit test the map function
describe('map function', () => {
  test('Basic Mapping', () => {
    // Mapping function squares numbers
    expect(map([4, 8], (n) => n * n)).toEqual([16, 64]);

    // Mapping function to uppercase strings
    expect(map(['hello', 'world'], (str) => str.toUpperCase())).toEqual(['HELLO', 'WORLD']);

    // Empty array test
    expect(map([], (n) => n * 2)).toEqual([]);
  });

  test('Different Data Types', () => {
    // Mapping function to return objects
    expect(map([1, 2, 3], (n) => ({ value: n }))).toEqual([{ value: 1 }, { value: 2 }, { value: 3 }]);

    // Mapping function returning different data types
    expect(map([10, 'abc', { key: 'value' }], (val) => typeof val)).toEqual(['number', 'string', 'object']);
  });

  test('Edge Cases', () => {
    // Test with null and undefined values
    expect(map([null, undefined], (val) => val)).toEqual([null, undefined]);

    // Test with arrays containing null and undefined elements
    expect(map([1, null, 3], (n) => n * n)).toEqual([1, null, 9]);
  });
});
// unit test the keys function
describe('keys function', () => {
  test('Object with Enumerable Properties', () => {
    // Test with a simple object
    expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b']);

    // Test with an object inheriting properties
    function Foo() {
      this.a = 1;
      this.b = 2;
    }
    Foo.prototype.c = 3;
    expect(keys(new Foo())).toEqual(['a', 'b']);
  });

  test('Array-Like Structure', () => {
    // Test with a string
    expect(keys('hello')).toEqual(['0', '1', '2', '3', '4']);

    // Test with arguments object
    function testFunction() {
      // Assuming this is in a non-arrow function
      expect(keys(arguments)).toEqual(['0', '1', '2']); 
    }
    testFunction(1, 'hi', [3]);
  });

  test('Non-Object Values', () => {
    // Test with a number coerced into an object
    expect(keys(123)).toEqual([]);

    // Test with a null value
    expect(keys(null)).toEqual([]);

    // Test with an undefined value
    expect(keys(undefined)).toEqual([]);
  });
});