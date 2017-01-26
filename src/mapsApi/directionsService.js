import {
  map
} from './mapsService';

export let directionsService = null;
export let directionsDisplay = null;
export function initDirService() {
    if (!directionsService) {
        directionsService = new google.maps.DirectionsService();
    }
    if(!directionsDisplay) {
      directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
      directionsDisplay.setMap(map);
    }
}
