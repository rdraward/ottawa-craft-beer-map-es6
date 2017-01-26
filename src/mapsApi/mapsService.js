import {
    styledBrewMap,
    ottawaLatLong
} from '../properties/map-props';

export let map = null;
export function initGMap() {
    if (!map) {
        map = new google.maps.Map(document.getElementById('map'), {
            center: ottawaLatLong,
            zoom: 12,
            minZoom: 11,
            clickableIcons: false,
            mapTypeControlOptions: {
                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'brew_map']
            }
        });

        map.mapTypes.set('brew_map', new google.maps.StyledMapType(styledBrewMap, {
            name: 'BrewMap'
        }));
        map.setMapTypeId('brew_map');
    }
}


// set up singleton for service
export let placesService = null;
export let directionsService = null;
export function initGService() {
    if (!placesService) {
        placesService = new google.maps.places.PlacesService(map);
    }

    if (!directionsService) {
        directionsService = new google.maps.DirectionsService();
    }
}
