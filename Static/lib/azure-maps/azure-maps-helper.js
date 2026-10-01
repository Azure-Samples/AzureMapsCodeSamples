/**
 * This is a reusable function that sets the Azure Maps platform domain,
 * signs the request, and makes use of any transformRequest set on the map.
 * Use like this: `const data = await processRequest(url);`
 */
async function processRequest(url, options = {}) {
    return processRestRequest(url, 'GET', undefined, options);
}

async function processPostRequest(url, body, options = {}) {
    return processRestRequest(url, 'POST', body, options);
}

// Optional timeout (milliseconds) and signal apply to signing, fetching and reading the response.
async function processRestRequest(url, method, body, options) {
    const hasTimeout = options.timeout !== undefined;
    const isValidTimeout = Number.isFinite(options.timeout) && options.timeout > 0;
    if (hasTimeout && !isValidTimeout) {
        throw new RangeError('Request timeout must be a positive number of milliseconds.');
    }

    const controller = new AbortController();
    const abort = () => controller.abort(options.signal.reason);
    if (options.signal) {
        if (options.signal.aborted) {
            abort();
        } else {
            options.signal.addEventListener('abort', abort, { once: true });
        }
    }

    const timeout = options.timeout === undefined ? undefined : setTimeout(() => {
        controller.abort(new DOMException('The request timed out.', 'TimeoutError'));
    }, options.timeout);

    let rejectOnAbort;
    const aborted = new Promise((resolve, reject) => {
        rejectOnAbort = () => reject(controller.signal.reason);
        if (controller.signal.aborted) {
            rejectOnAbort();
        } else {
            controller.signal.addEventListener('abort', rejectOnAbort, { once: true });
        }
    });

    async function request() {
        controller.signal.throwIfAborted();
        const requestParams = await signRequest(url);
        controller.signal.throwIfAborted();
        const headers = new Headers(requestParams.headers);
        new Headers(options.headers).forEach((value, name) => headers.set(name, value));

        const response = await fetch(requestParams.url, {
            method: method,
            mode: 'cors',
            headers: headers,
            body: body,
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        // Batch submissions need the Location header, rather than an empty JSON body.
        const isPostRequest = method === 'POST';
        const isAcceptedResponse = response.status === 202;
        const isNoContentResponse = response.status === 204;
        const shouldReturnRawResponse = isPostRequest && (isAcceptedResponse || isNoContentResponse);
        if (shouldReturnRawResponse) {
            return response;
        }

        return response.json();
    }

    try {
        return await Promise.race([request(), aborted]);
    } finally {
        clearTimeout(timeout);
        controller.signal.removeEventListener('abort', rejectOnAbort);
        if (options.signal) {
            options.signal.removeEventListener('abort', abort);
        }
    }
}

function searchResultsToGeoJson(results) {
    const collection = {
        type: 'FeatureCollection',
        features: results.map((result, index) => ({
            type: 'Feature',
            id: result.id === undefined ? String(index) : result.id,
            geometry: {
                type: 'Point',
                coordinates: [result.position.lon, result.position.lat]
            },
            properties: { ...result }
        }))
    };

    if (collection.features.length > 0) {
        collection.bbox = atlas.data.BoundingBox.fromData(collection);
    }
    return collection;
}

function routeResultsToGeoJson(routes) {
    const collection = {
        type: 'FeatureCollection',
        features: routes.map((route, index) => ({
            type: 'Feature',
            geometry: {
                type: 'MultiLineString',
                coordinates: route.legs.map(leg => leg.points.map(point => [point.longitude, point.latitude]))
            },
            properties: { ...route, routeIndex: index }
        }))
    };

    if (collection.features.length > 0) {
        collection.bbox = atlas.data.BoundingBox.fromData(collection);
    }
    return collection;
}

function routeRangeToGeoJson(reachableRange) {
    const ring = reachableRange.boundary.map(point => [point.longitude, point.latitude]);
    if (ring.length < 3) {
        throw new Error('The route range response does not contain a polygon boundary.');
    }

    const first = ring[0];
    const last = ring[ring.length - 1];
    const isRingClosed = first[0] === last[0] && first[1] === last[1];
    if (!isRingClosed) {
        ring.push(first.slice());
    }

    return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [ring] },
        properties: {}
    };
}

function createRouteDirectionsRequest(positions, options = {}) {
    return {
        ...options,
        type: 'FeatureCollection',
        features: positions.map((position, index) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: position.slice() },
            properties: { pointIndex: index, pointType: 'waypoint' }
        })),
        travelMode: options.travelMode || 'driving',
        optimizeRoute: options.optimizeRoute || 'fastestWithTraffic',
        routeOutputOptions: options.routeOutputOptions || ['routePath']
    };
}

function getRoutePath(response) {
    const route = response.features && response.features.find(feature => {
        const isRoutePath = feature.properties?.type === 'RoutePath';
        const hasRouteGeometry = isRoutePath && feature.geometry?.type === 'MultiLineString';
        return hasRouteGeometry;
    });
    const hasRouteLegs = Boolean(route) && route.geometry.coordinates.length > 0;
    const hasInvalidLeg = hasRouteLegs && route.geometry.coordinates.some(leg => leg.length < 2);
    if (!hasRouteLegs || hasInvalidLeg) {
        throw new Error('No valid route path was returned.');
    }
    return route;
}

function createRouteRangeRequest(origin, timeInSeconds) {
    return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: origin.slice() },
        properties: {
            timeBudgetInSec: timeInSeconds,
            travelMode: 'driving',
            optimizeRoute: 'fastestWithTraffic'
        }
    };
}

function getRouteRangeBoundary(response) {
    const boundary = response.features && response.features.find(feature => {
        const isBoundary = feature.properties?.type === 'boundary';
        const hasPolygonGeometry = isBoundary && feature.geometry?.type === 'Polygon';
        return hasPolygonGeometry;
    });
    const hasBoundaryRings = Boolean(boundary) && boundary.geometry.coordinates.length > 0;
    const hasInvalidRing = hasBoundaryRings && boundary.geometry.coordinates.some(ring => {
        const hasEnoughPositions = ring.length >= 4;
        if (!hasEnoughPositions) {
            return true;
        }
        const first = ring[0];
        const last = ring[ring.length - 1];
        const isRingClosed = first[0] === last[0] && first[1] === last[1];
        return !isRingClosed;
    });
    if (!hasBoundaryRings || hasInvalidRing) {
        throw new Error('No valid reachable range boundary was returned.');
    }
    return boundary;
}

async function calculateRouteMatrix(origins, destinations) {
    const response = await requestRouteMatrix(origins, destinations);
    return routeMatrixToArray(response, origins.length, destinations.length);
}

// Return the original cells so a caller can handle specific service errors before conversion.
async function requestRouteMatrix(origins, destinations, departAt = 'now') {
    const deadline = Date.now() + 120000;
    const requestOptions = () => {
        const remaining = deadline - Date.now();
        if (remaining <= 0) {
            throw new Error('Route matrix processing timed out.');
        }
        return { timeout: Math.min(remaining, 10000) };
    };
    const body = {
        type: 'FeatureCollection',
        features: [
            { type: 'Feature', geometry: { type: 'MultiPoint', coordinates: origins }, properties: { pointType: 'origins' } },
            { type: 'Feature', geometry: { type: 'MultiPoint', coordinates: destinations }, properties: { pointType: 'destinations' } }
        ],
        travelMode: 'driving',
        traffic: 'live',
        departAt: departAt
    };
    const response = await processPostRequest('https://{azMapsDomain}/route/matrix:async?api-version=2025-01-01',
        JSON.stringify(body), { ...requestOptions(), headers: { 'Content-Type': 'application/geo+json' } });
    const statusUrl = response.headers && response.headers.get('operation-location');
    const isSubmissionAccepted = response.status === 202;
    const hasStatusUrl = Boolean(statusUrl);
    if (!isSubmissionAccepted || !hasStatusUrl) {
        throw new Error('Route matrix submission did not return an Operation-Location header.');
    }
    while (true) {
        const operation = await processRequest(statusUrl, requestOptions());
        const isOperationComplete = operation.status === 'Completed' || operation.status === 'Succeeded';
        if (isOperationComplete) {
            const hasResultUrl = Boolean(operation.result?.resultUrl);
            if (!hasResultUrl) {
                throw new Error('Completed route matrix operation has no result URL.');
            }
            return processRequest(operation.result.resultUrl, requestOptions());
        }
        const isOperationPending = ['NotStarted', 'Running', 'Accepted'].includes(operation.status);
        if (!isOperationPending) {
            throw new Error('Route matrix operation failed: ' +
                (operation.error && operation.error.message || operation.status));
        }
        const remaining = deadline - Date.now();
        if (remaining <= 0) {
            throw new Error('Route matrix processing timed out.');
        }
        await new Promise(resolve => setTimeout(resolve, Math.min(1000, remaining)));
    }
}

function routeMatrixToArray(response, originCount, destinationCount) {
    const cells = response.properties && response.properties.matrix;
    const hasExpectedCellCount = Array.isArray(cells) && cells.length === originCount * destinationCount;
    if (!hasExpectedCellCount) {
        throw new Error('Invalid or incomplete route matrix response.');
    }
    const matrix = Array.from({ length: originCount }, () => Array(destinationCount));
    for (const cell of cells) {
        const { originIndex, destinationIndex } = cell;
        const isValidOriginIndex = Number.isInteger(originIndex) && originIndex >= 0 && originIndex < originCount;
        const isValidDestinationIndex = Number.isInteger(destinationIndex) && destinationIndex >= 0 && destinationIndex < destinationCount;
        const hasValidIndices = isValidOriginIndex && isValidDestinationIndex;
        const isDuplicateCell = hasValidIndices && Boolean(matrix[originIndex][destinationIndex]);
        if (!hasValidIndices || isDuplicateCell) {
            throw new Error('Invalid or duplicate route matrix indices.');
        }
        const isSuccessfulCell = cell.statusCode === 200;
        const hasValidDistance = Number.isFinite(cell.distanceInMeters) && cell.distanceInMeters >= 0;
        const hasValidDuration = Number.isFinite(cell.durationInSeconds) && cell.durationInSeconds >= 0;
        const hasTrafficDuration = cell.durationTrafficInSeconds !== undefined;
        const hasValidTrafficDuration = !hasTrafficDuration ||
            (Number.isFinite(cell.durationTrafficInSeconds) && cell.durationTrafficInSeconds >= 0);
        const isValidCell = isSuccessfulCell && hasValidDistance && hasValidDuration && hasValidTrafficDuration;
        if (!isValidCell) {
            throw new Error(`Route matrix cell ${originIndex},${destinationIndex} failed (${cell.statusCode}).`);
        }
        matrix[originIndex][destinationIndex] = cell;
    }
    return matrix;
}

async function signRequest(url) {
    // Replace the domain placeholder to ensure the same Azure Maps is used throughout the app.
    url = url.replace('{azMapsDomain}', atlas.getDomain());

    // Get the authentication details from the map for use in the request.
    var requestParams = await map.authentication.signRequest({ url });

    // Add content type of body to the headers.
    requestParams.headers['Content-type'] = 'application/json; charset=UTF-8';

    // Transform the request.
    var transform = map.getServiceOptions().transformRequest;
    if (transform) {
        requestParams = await transform(url);
    }

    return requestParams;
}