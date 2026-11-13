async function getLatestOvertureRelease(currentDate = new Date()) {
    if (!(currentDate instanceof Date) || !Number.isFinite(currentDate.getTime())) {
        throw new Error('A valid current date is required.');
    }

    const response = await fetch('https://docs.overturemaps.org/release-calendar.json', {
        cache: 'no-cache'
    });
    if (!response.ok) {
        throw new Error(`Unable to load the Overture release calendar (HTTP ${response.status}).`);
    }

    const calendar = await response.json();
    if (!calendar || !Array.isArray(calendar.releases)) {
        throw new Error('The Overture release calendar does not contain a releases array.');
    }

    const today = [
        currentDate.getFullYear(),
        String(currentDate.getMonth() + 1).padStart(2, '0'),
        String(currentDate.getDate()).padStart(2, '0')
    ].join('-');
    let latestRelease;

    for (const release of calendar.releases) {
        if (!release || typeof release.date !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(release.date) ||
            !Number.isFinite(Date.parse(release.date)) ||
            typeof release.dataVersion !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}(?:-(?:alpha|beta))?\.\d+$/.test(release.dataVersion)) {
            throw new Error('The Overture release calendar contains an invalid release.');
        }

        if (release.date <= today && (!latestRelease ||
            release.date > latestRelease.date ||
            (release.date === latestRelease.date &&
                release.dataVersion.localeCompare(latestRelease.dataVersion, undefined, { numeric: true }) > 0))) {
            latestRelease = release;
        }
    }

    if (!latestRelease) {
        throw new Error(`No Overture release is available as of ${today}.`);
    }

    return latestRelease.dataVersion;
}
