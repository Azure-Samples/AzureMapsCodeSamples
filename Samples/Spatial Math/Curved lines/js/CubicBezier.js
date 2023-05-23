/**
 * A class that creates Cubic Bezier curves.
 */
class CubicBezier {

	/**
	* Takes an array of positions can calculates a cubic bezier curve through it. Returns a MultiLineString (a curve per position pair).
	* @param positions An array of positions that form a path.
	* @param tension A number that indicates the tightness of the curve. Can be any number, although a value between 0 and 1 is usually used. Default: 0.5
	* @param nodeSize The number of nodes to insert between each position. Default: 15			
	*/
	static getLine(positions, tension = 0.5, nodeSize = 15) {
		var segments = [];

		for (var i = 0; i < positions.length - 1; i++) {
			segments.push(this.getCurvedSegments(positions[i], positions[i + 1], tension, nodeSize));
		}

		return {
			type: 'MultiLineString',
			coordinates: segments
		};
	}

	/**
	* Calculates a cubic bezier curve between two points.
	* @param p1 First position.
	* @param p2 Second position.
	* @param tension A number that indicates the tightness of the curve. Can be any number, although a value between 0 and 1 is usually used. Default: 0.5
	* @param nodeSize The number of nodes to insert between each position. Default: 15
	*/
	static getCurvedSegments(p1, p2, tension = 0.5, nodeSize = 15) {
		var len = atlas.math.getDistanceTo(p1, p2);
		var heading = atlas.math.getHeading(p1, p2);

		var h1, h2;

		if (heading < 0) {
			h1 = heading + 45;
			h2 = heading + 135;
		} else {
			h1 = heading - 45;
			h2 = heading - 135;
		}

		var pA = atlas.math.getDestination(p1, h1, len * tension);
		var pB = atlas.math.getDestination(p2, h2, len * tension);

		return this.#calculateCubicBezier(p1, pA, pB, p2, nodeSize);
	}

	// Private functions

	static #calculateCubicBezier(p1, p2, p3, p4, nodeSize) {
		var path = [];

		for (var i = 0; i < nodeSize; i++) {
			path.push(this.#getBezier(p1, p2, p3, p4, i / nodeSize));
		}

		path.push(p1);

		return path;
	}

	static #getBezier(p1, p2, p3, p4, t) {
		var b1 = t * t * t;
		var b2 = 3 * t * t * (1 - t);
		var b3 = 3 * t * (1 - t) * (1 - t);
		var b4 = (1 - t) * (1 - t) * (1 - t);

		return [
			p1[0] * b1 + p2[0] * b2 + p3[0] * b3 + p4[0] * b4,
			p1[1] * b1 + p2[1] * b2 + p3[1] * b3 + p4[1] * b4
		];
	};
}