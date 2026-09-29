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
    if (options.timeout !== undefined && (!Number.isFinite(options.timeout) || options.timeout <= 0)) {
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

        const response = await fetch(requestParams.url, {
            method: method,
            mode: 'cors',
            headers: new Headers(requestParams.headers),
            body: body,
            signal: controller.signal
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        // Batch submissions need the Location header, rather than an empty JSON body.
        if (method === 'POST' && (response.status === 204 || response.status === 202)) {
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
    if (first[0] !== last[0] || first[1] !== last[1]) {
        ring.push(first.slice());
    }

    return {
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [ring] },
        properties: {}
    };
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