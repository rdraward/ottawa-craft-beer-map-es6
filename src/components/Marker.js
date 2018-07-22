import {
    iconBase
} from '../properties/map-props';
import {
    map
} from '../mapsApi/mapsService';

export default class Marker {
    constructor(userPos, icon, title) {
        this.marker = new google.maps.Marker({
            position: userPos,
            map: map,
            icon: iconBase + icon,
            title: title
        });

        // mouseover icon brought to front
        this.marker.addListener('mouseover', () => this.marker.setZIndex(google.maps.Marker.MAX_ZINDEX));
        this.marker.addListener('mouseout', () => this.marker.setZIndex(google.maps.Marker.MAX_ZINDEX - 1))
    }

    addCallback(type, action) {
        this.marker.addListener(type, action);
    }

    getPosition() {
        return this.marker.position;
    }
}