export function limitMapScroll(map) {
    // bounds of the desired area
    const allowedBounds = new google.maps.LatLngBounds(
        createLatLng(45.14115518089034, -76.15005880565646),
        createLatLng(45.51227041310074, -74.58660896976092)
    );
    let lastValidCenter = map.getCenter();

    google.maps.event.addListener(map, 'center_changed', () => {
        if (allowedBounds.contains(map.getCenter())) {
            // still within valid bounds, so save the last valid position
            lastValidCenter = map.getCenter();
            return;
        }
        // not valid anymore => return to last valid position
        map.panTo(lastValidCenter);
    });
}

export function createLatLng(lat, lng) {
    return new google.maps.LatLng(lat, lng);
}
