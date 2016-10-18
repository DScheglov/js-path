'use strict';

var assert = require('assert');
var jpath = require('../index');

describe('jpath.', function () {

  it("get({x:1}, 'x') should return 1", function () {
    assert.equal(jpath.get({x:1}, 'x'), 1);
  });

  it("get({x:1}, 'y') should return undefined", function () {
    var res = jpath.get({x:1}, 'y');
    assert.equal(typeof(res), 'undefined');
  });

  it("get({x:1, y: [2, 3]}, 'y') should return [2, 3]", function () {
    var res = jpath.get({x:1, y: [2, 3]}, 'y');
    assert.deepEqual(res, [2, 3]);
  });

  it("get({x:1, y: [2, 3]}, 'y.0') should return 2", function () {
    var res = jpath.get({x:1, y: [2, 3]}, 'y.0');
    assert.deepEqual(res, 2);
  });

  it("get({x:1, y: [{t: -1}, {t: -2}]}, 'y.1.t') should return -2", function () {
    var res = jpath.get({x:1, y: [{t: -1}, {t: -2}]}, 'y.1.t');
    assert.deepEqual(res, -2);
  });

  it("get({x:1, y: [{t: -1}, {t: -2}]}, 'y.3.t') should return undefined", function () {
    var res = jpath.get({x:1, y: [{t: -1}, {t: -2}]}, 'y.3.t');
    assert.deepEqual(typeof(res), 'undefined');
  });

  it("get({x:1}, 'y', 2) should return 2", function () {
    var res = jpath.get({x:1}, 'y', 2);
    assert.equal(res, 2);
  });

  it("get({x:1, y: [{t: -1}, {t: -2}]}, 'y.3.t', -3) should return -3", function () {
    var res = jpath.get({x:1, y: [{t: -1}, {t: -2}]}, 'y.3.t', -3);
    assert.deepEqual(res, -3);
  });

  it("set(obj, 'x', 2) should assign obj.x to 2", function () {
    var obj = {x: 1};
    assert.equal(jpath.set(obj, 'x', 2), 2);
    assert.equal(obj.x, 2);
  });

  it("set(obj, 'y.1.t', -3) should return -3", function () {
    var obj = {x:1, y: [{t: -1}, {t: -2}]};
    assert.equal(jpath.set(obj, 'y.1.t', -3), -3);
    assert.equal(obj.y[1].t, -3);
  });

  it("del(obj, 'x') should delete x from obj.x", function () {
    var obj = {x: 1};
    assert.equal(jpath.del(obj, 'x', 2), obj);
    assert.ok(!('x' in obj));
    assert.equal(typeof(obj.x), 'undefined');
  });

  it("ens(obj, 'z.x.t', -3) should assign z.x.t to -3 return -3", function () {
    var obj = {x:1, y: [{t: -1}, {t: -2}]};
    assert.equal(jpath.ens(obj, 'z.x.t', -3), -3);
    assert.equal(obj.z.x.t, -3);
  });

  it("ens(obj, 'z.x.t', -3) should assign z.x.t to -3 return -3", function () {
    var obj = {x:1, y: [{t: -1}, {t: -2}]};
    assert.equal(jpath.ens(obj, 'z.x.t', -3), -3);
    assert.equal(obj.z.x.t, -3);
  });

  it("ens(obj, 'z.x[].*.t', -5) should assign z.x.t to -3 return -3", function () {
    var obj = {};
    assert.equal(jpath.ens(obj, 'z.x[].*.t', -5), -5);
    assert.equal(obj.z.x[0].t, -5);
  });

  it("ens(obj, 'z.x[].*', n) should add items to the end of z.x[] ", function () {
    var obj = {};
    assert.equal(jpath.ens(obj, 'z.x[].*', 'a'), 'a');
    assert.equal(jpath.ens(obj, 'z.x[].*', 'b'), 'b');
    assert.equal(jpath.ens(obj, 'z.x[].*', 'c'), 'c');

    assert.deepEqual(obj.z.x, ['a', 'b', 'c']);
  });

});
