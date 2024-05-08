/**
 * This is a reusable function that sets the Azure Maps platform domain,
 * signs the request, and makes use of any transformRequest set on the map.
 * Use like this: `const data = await processRequest(url);`
 */
async function processRequest(url) {
    const requestParams = await signRequest(url);

    const response = await fetch(requestParams.url, {
        method: 'GET',
        mode: 'cors',
        headers: new Headers(requestParams.headers)
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

async function processPostRequest(url, body) {
    const requestParams = await signRequest(url);

    const response = await fetch(requestParams.url, {
        method: 'POST',
        mode: 'cors',
        headers: new Headers(requestParams.headers),
        body: body
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    return response;
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
    if (transform) requestParams = await transform(url);

    return requestParams;
}