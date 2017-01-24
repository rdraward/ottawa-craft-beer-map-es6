import BrewMap from './BrewMap';
import {
    initGMap,
    initGService
} from './mapsApi/mapsService';

const initMap = () => {
    initGMap();
    initGService();
    new BrewMap();
}

window.initMap = initMap;
