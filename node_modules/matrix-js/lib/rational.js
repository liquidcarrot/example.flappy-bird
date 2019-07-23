'use strict';

/**
 * Constructs an object storing rational numbers and methods performing operations
 * 
 * @param num numerator of the rational number
 * @param den denomenator of the rational number
 * @returns Object storing the rational number and method doing arthmetic operations
 */
function rational(num, den) {
  den = den || 1;
  if (Math.sign(den) === -1) {
    num = -num;
    den = -den;
  }
  return {
    num: num,
    den: den,
    add: (op) => rational(num * op.den + den * op.num, den * op.den),
    sub: (op) => rational(num * op.den - den * op.num, den * op.den),
    mul: (op) => multiply(op, num, den),
    div: (op) => {
      let _num = op.den;
      let _den = op.num;
      return multiply(rational(_num, _den), num, den);
    }
  }
}

module.exports = rational;

/**
 * Multiplies two rational number based on multiplication rules that cancels common terms
 * 
 * @param op the second operand
 * @param num numerator of first operand
 * @param den denominator of second operand
 * @returns another rational number
 */
function multiply(op, num, den) {
  let _num = Math.sign(num) * Math.sign(op.num);
  let _den = Math.sign(den) * Math.sign(op.den);
  if (Math.abs(num) === Math.abs(op.den) && Math.abs(den) === Math.abs(op.num)) {
    _num = _num;
    _den = _den;
  } else if (Math.abs(den) === Math.abs(op.num)) {
    _num = _num * Math.abs(num);
    _den = _den * Math.abs(op.den);
  } else if (Math.abs(num) === Math.abs(op.den)) {
    _num = _num * Math.abs(op.num);
    _den = _den * Math.abs(den);
  } else {
    _num = num * op.num;
    _den = den * op.den;
  }
  return rational(_num, _den);
}
