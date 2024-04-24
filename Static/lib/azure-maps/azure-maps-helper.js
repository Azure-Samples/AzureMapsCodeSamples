/**
* This is a reusable function that sets the Azure Maps platform domain,
* signs the request, and makes use of any transformRequest set on the map.
* Use like this: `const data = await processRequest(url);`
*/
async function processRequest(url) {
    // Replace the domain placeholder to ensure the same Azure Maps is used throughout the app.
    url = url.replace('{azMapsDomain}', atlas.getDomain());

    // Get the authentication details from the map for use in the request.
    var requestParams = map.authentication.signRequest({ url: url });

    // Transform the request.
    var transform = map.getServiceOptions().transformRequest;
    if (transform) requestParams = transform(url);

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