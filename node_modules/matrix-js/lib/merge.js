'use strict';

/**
 * Merges two matrices in all directions
 * 
 * @param {Array} base Base matrix on which merge is performed
 */
function merge(base) {
    return {
        top: (mergeData) => top(base, mergeData),
        bottom: (mergeData) => bottom(base, mergeData),
        left: (mergeData) => left(base, mergeData),
        right: (mergeData) => right(base, mergeData)
    }
}

module.exports = merge;

/**
 * Merges the base matrix with the incoming matrix in the top direction
 * @param {Array} base 
 * @param {Array} mergeData incoming matrix
 */
function top(base, mergeData) {
    let baseWidth = base[0].length || base.length;
    let mergeDataWidth = mergeData[mergeData.length - 1].length || mergeData.length;

    if (baseWidth !== mergeDataWidth) {
        return base;
    }

    if (!Array.isArray(base[0])) {
        base = [base];
    }

    if (!Array.isArray(mergeData[mergeData.length - 1])) {
        mergeData = [mergeData];
    }

    for (let row = mergeData.length - 1; row >= 0; row--) {
        base.unshift(mergeData[row].map((ele) => ele));
    }
    return base;
}

/**
 * Merges the base matrix with the incoming matrix in the bottom direction
 * @param {Array} base 
 * @param {Array} mergeData incoming matrix
 */
function bottom(base, mergeData) {
    let baseWidth = base[base.length - 1].length || base.length;
    let mergeDataWidth = mergeData[0].length || mergeData.length;
    if (baseWidth !== mergeDataWidth) {
        return base;
    }

    if (!Array.isArray(base[base.length - 1])) {
        base = [base];
    }

    if (!Array.isArray(mergeData[0])) {
        mergeData = [mergeData];
    }


    for (let row = 0; row < mergeData.length; row++) {
        base.push(mergeData[row].map((ele) => ele));
    }
    return base;
}

/**
 * Merges the base matrix with the incoming matrix in the left direction
 * @param {Array} base 
 * @param {Array} mergeData incoming matrix
 */
function left(base, mergeData) {
    let baseHeight = base.length;
    let mergeDataHeight = mergeData.length;
    if (!Array.isArray(base[0]) && !Array.isArray(mergeData[0])) {
        base.unshift.apply(base, mergeData);
        return base;
    }

    if (baseHeight !== mergeDataHeight) {
        return base;
    }

    for (let row = 0; row < baseHeight; row++) {
        base[row].unshift.apply(base[row], mergeData[row].map((ele) => ele));
    }
    return base;
}

/**
 * Merges the base matrix with the incoming matrix in the right direction
 * @param {Array} base 
 * @param {Array} mergeData incoming matrix
 */
function right(base, mergeData) {
    let baseHeight = base.length;
    let mergeDataHeight = mergeData.length;
    if (!Array.isArray(base[0]) && !Array.isArray(mergeData[0])) {
        base.push.apply(base, mergeData);
        return base;
    }

    if (baseHeight !== mergeDataHeight) {
        return base;
    }

    for (let row = 0; row < baseHeight; row++) {
        base[row].push.apply(base[row], mergeData[row].map((ele) => ele));
    }
    return base;
}
