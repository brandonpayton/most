require('buster').spec.expose();
var expect = require('buster').expect;

var transduce = require('../../lib/combinator/transduce').transduce;
var reduce = require('../../lib/combinator/accumulate').reduce;
var fromArray = require('../../lib/source/fromArray').fromArray;

var t = require('transducers-js');

var sentinel = { value: 'sentinel' };

function add1(x) {
	return x + 1;
}

function even(x) {
	return x % 2 === 0;
}

describe('transduce', function() {
	it('should propagate transduced values', function() {
		var a = [1, 2, 3];

		var s = transduce(t.map(add1), fromArray(a));

		return reduce(function(results, x) {
			return results.concat(x);
		}, [], s)
			.then(function(results) {
				expect(results).toEqual(a.map(add1));
			});
	});

	it('should allow filtering', function() {
		var a = [1, 2, 3];

		var s = transduce(t.filter(even), fromArray(a));

		return reduce(function(results, x) {
			return results.concat(x);
		}, [], s)
			.then(function(results) {
				expect(results).toEqual(a.filter(even));
			});
	});

	it('should allow early end', function() {
		var a = [1, 2, 3];
		var n = 2;

		var s = transduce(t.take(n), fromArray(a));

		return reduce(function(results, x) {
			return results.concat(x);
		}, [], s)
			.then(function(results) {
				expect(results).toEqual(a.slice(0, n));
			});
	});

	it('should propagate remaining items', function() {
		var td = t.partitionBy(function(x) {
			return x < 5;
		});

		var s = transduce(td, fromArray([1,2,3,4,5,6,7,8,9]));

		return reduce(function(results, x) {
			results.push(x);
			return results;
		}, [], s)
			.then(function(results) {
				expect(results).toEqual([
					[1,2,3,4],
					[5,6,7,8,9]
				]);
			});
	});
});