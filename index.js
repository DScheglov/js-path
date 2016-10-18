'use strict';

module.exports = exports = {
  get: get,
  set: set,
  del: del,
  ens: ens
}


/**
 * get - returns value by path
 *
 * @param  {Object} obj  object to search by path
 * @param  {String} path searching path
 * @param  {any} def  default value
 * @return {any}      value that was found by path
 *
 * @example:
 * var obj = {x: 1, y: [-1, {t: -2}, {t: -3}], z: 0};
 * console.log(get(obj, 'x')); // prints 1
 * console.log(get(obj, 'r')); // prints `undefined`
 * console.log(get(obj, 'y.1.t')); // prints -2
 *
 */
function get(obj, path, def) {
    return obj && path && findPath(
      obj, path.toString().split('.')
    ) || def;
}


/**
 * set - set the value by path
 *
 * @param  {Object} obj  object to search by path
 * @param  {String} path searching path
 * @param  {any} def  value to assign the path
 * @return {any}      assigned value or raises an error
 * if path couldn't be reached
 */
function set(obj, path, val) {
  var field;
  if (!path) throw new Error('Unable to set value to the undefined path');
  path = path.toString().split('.');
  field = path.pop();
  if (!path.length) return obj[field] = val;

  return findPath(obj, path)[field] = val;
}

/**
 * ens - ensures that path exists in obj and assignes it with the value
 *
 * @param  {Object} obj  object to search by path
 * @param  {String} path searching path
 * @param  {any} def  value to assign the path
 * @return {any}      assigned value or raises an error
 * if path couldn't be reached
 */
function ens(obj, path, val) {
  var field;
  if (!path) throw new Error('Unable to set value to the undefined path');
  path = path.toString().split('.');
  field = path.pop();
  if (!path.length) return obj[field] = val;

  var o = ensurePath(obj, path);
  if (field === '*' && typeof(o.push) === 'function') {
    o.push(val);
    return val;
  }
  return o[field] = val;
}


/**
 * del - deletes field spicified by path form the object
 *
 * @param  {Object} obj  object to search by path
 * @param  {String} path searching path
 * @return {Object}      return object;
 */
function del(obj, path) {
  var field;
  if (!path) throw new Error('Unable to delete field by the undefined path');
  path = path.toString().split('.');
  field = path.pop();
  if (!path.length) {
    delete obj[field];
    return obj;
  }

  delete findPath(obj, path)[field];
  return obj;
}


/**
 * stopReduce - exception class to break iterations via Array.prototype.reduce call
 *
 * @return {stopReduce}  an exception instance
 */
function stopReduce() {

};


/**
 * findPath - finds the field by the path
 *
 * @param  {Object} obj  object to search by path
 * @param  {Array} path searching path
 * @return {any}      value that was found by path
 */
function findPath(obj, path) {
  try {
    return path.reduce((o, p) => {
        if (!o) throw new stopReduce();
        return o && o[p]
      }, obj)
  } catch(e) {
    if (e instanceof stopReduce) return ;
    throw e;
  }
}

/**
 * findPath - finds the field by the path
 *
 * @param  {Object} obj  object to search by path
 * @param  {Array} path searching path
 * @return {any}      value that was found by path
 */
function ensurePath(obj, path) {
  return path.reduce((o, p) => {
      var isArray = /^.+\[\]$/.test(p);
      if (isArray) p = p.substr(0, p.length-2);
      if (typeof(o.push) === 'function') {
        var no;
        if (p === '*') no = {};
        if (p === '[]') no = [];
        if (no) {
          o.push(no);
          return no;
        }
      }
      if (!(p in o)) {
        if (isArray) return o[p] = [];
        return o[p] = {};
      }
      return o && o[p]
    }, obj)
}
