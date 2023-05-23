/**
* Takes an array of positions and rounds the corners between line segments.
* @param positions An array of positions that form a path.
* @param cornerOffset How far away from a corner in meters the curve should start. Default: 5
* @param nodeSize The number of nodes to insert between each position. Default: 15		
*/
function RoundedCorners(positions, cornerOffset = 5, nodeSize = 15) {

	//Add the start position of the line.
	var path = [positions[0]];

	var lineEnd;

	for (var i = 1; i < positions.length; i++) {

		//Get start and points of line segment.
		var p1 = positions[i - 1];
		var p2 = positions[i];

		//Calculate the length and heading of the line.
		var h = atlas.math.getHeading(p1, p2);
		var len = atlas.math.getDistanceTo(p1, p2);

		//Ensure the corner offset is no longer than half the length of the line, otherwise we will have some knots in the line.
		var offset = Math.min(len * 0.5, cornerOffset);

		//Calculate the offset first point of the linesegment. This is also the end of the previous line segment.
		var lineStart = atlas.math.getDestination(p1, h, offset);

		//Calculate curve from last end of previous line segment line.
		if (lineEnd) {
			//Calculate the midpoint between the previous lines offset end and the current lines offset start.
			var midPoint = atlas.math.interpolate(lineEnd, lineStart, 0.5);

			//Calculate the distance and heading from the offset paths, midpoint to the corner coordinate.
			var midToP1Distance = atlas.math.getDistanceTo(midPoint, p1);
			var midToP1Heading = atlas.math.getHeading(midPoint, p1);

			//Calculate the corner coordinate. 
			var corner = atlas.math.getDestination(midPoint, midToP1Heading, midToP1Distance * 0.75);

			//Calculate a spline curve around the corner.
			var curve = atlas.math.getCardinalSpline([lineEnd, corner, lineStart], 0.5, nodeSize);

			//Add the curve to the path.
			path = path.concat(curve);
		}

		//Add the start of the new line segment to the path.
		path.push(lineStart);

		//Calculate the end of the line segment and add it to the path.
		lineEnd = atlas.math.getDestination(p2, h, -offset);
		path.push(lineEnd);
	}

	//Add the end position of the line.
	path.push(positions[positions.length - 1]);

	return path;
}