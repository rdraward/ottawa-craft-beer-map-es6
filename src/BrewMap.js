import User from './components/User';
import Brewery from './components/Brewery';
import {
    map,
    service
} from './mapsApi/mapsService';
import {
    createLatLng,
    limitMapScroll
} from './utils/bounds';
import {
    ottawaLatLong
} from './properties/map-props';

export default class BrewMap {

    constructor() {
        this.brewpubsHidden = false;
        this.breweries = [];

        limitMapScroll(map);
        map.controls[google.maps.ControlPosition.BOTTOM].push(this.setupBrewpubFilter());

        // make the request to get the brewery data on load
        service.nearbySearch({
            location: createLatLng(ottawaLatLong.lat, ottawaLatLong.lng),
            keyword: 'brewery',
            radius: '50000'
        }, this.populateMap.bind(this));

        // add personal location - GET ME TO CLOSEST BEER
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const userPos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.user = this.addUserMarker(userPos);

            }, error => console.log(error));
        }
    }

    /*
     * Add the user to the map
     */
    addUserMarker(userPos) {
        return new User(userPos);
    }

    /*
     * Callback from getting the initial brewery data
     */
    populateMap(baseBreweryInfo, status, pagination) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (let i = 0; i < baseBreweryInfo.length; i++) {
                const breweryExtras = breweryRecommendations.find(
                    b => b.placeId.indexOf(baseBreweryInfo[i].place_id) != -1
                );

                if (breweryExtras) {
                    this.breweries.push(new Brewery(baseBreweryInfo[i], breweryExtras));
                } else {
                    // remove extra results
                    baseBreweryInfo.splice(i, 1);
                    i--;
                }
            }

            if (pagination.hasNextPage) {
                pagination.nextPage();
            }
        }
    }

    /*
     * Build and enable the brewpub filter button
     */
    setupBrewpubFilter() {
        let filter = document.createElement('div');
        filter.className = 'brewpub-filter';

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.brewpubsHidden;
        checkbox.id = 'brewpub-filter-check';
        checkbox.onchange = () => {
            this.brewpubsHidden = !this.brewpubsHidden;
            this.applyBrewpubVisibility(this.brewpubsHidden);
        };

        let label = document.createElement('label')
        label.htmlFor = 'brewpub-filter-check';
        label.className = 'roboto';
        label.appendChild(document.createTextNode('Hide brewpubs'));

        filter.appendChild(checkbox);
        filter.appendChild(label);
        return filter;
    }

    /*
     * Toggle brewpub visibility
     */
    applyBrewpubVisibility(state) {
        for (let i = 0; i < this.breweries.length; i++) {
            this.breweries[i].toggleBrewpubVisibility(!state);
        }
    }
}
