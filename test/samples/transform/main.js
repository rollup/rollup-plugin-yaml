import array from './array.yaml';
import object from './object.yaml';

assert.equal(array.length, 2);
assert.equal(array[0].name, 'bob');
assert.equal(array[1].name, 'carl');

assert.equal(Object.keys(object).length, 2);
assert(!object.hasOwnProperty('alice'));
assert(object.hasOwnProperty('bob'));
assert(object.hasOwnProperty('carl'));
