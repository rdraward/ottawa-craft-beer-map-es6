import BrewMap from './BrewMap';
import {
    initGMap,
    initGService
} from './mapsApi/mapsService';
import {
  initDirService
} from './mapsApi/directionsService';

const initMap = () => {
    initGMap();
    initGService();
    initDirService();
    new BrewMap();
}

window.initMap = initMap;
