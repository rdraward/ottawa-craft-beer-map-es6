import Marker from './Marker';
import {
    placesService
} from '../mapsApi/mapsService';
import {
    drawInfobox,
    formatDetails
} from '../utils/infoBox';

export default class Brewery {
    constructor(baseInfo, extraInfo) {
        this.baseInfo = baseInfo;
        this.extraInfo = extraInfo;
        if (extraInfo.icon) {
            this.brewery = this.createMarker(baseInfo, extraInfo.icon);
            this.bindBreweryAndInfoBox();
        }
    }

    createMarker(info, icon) {
        return new Marker(info.geometry.location, icon);
    }

    bindBreweryAndInfoBox() {
        this.brewery.marker.addListener('click', () => {
            if (!this.infoboxContents) {
                this.requestAdditionalInfo(this.baseInfo.place_id);
            } else {
                drawInfobox(this.infoboxContents, this.brewery.marker)
            }
        });
    }

    requestAdditionalInfo(placeId) {
        placesService.getDetails({
            placeId: placeId
        }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                this.info = place;
                this.infoboxContents = formatDetails(this.info, this.extraInfo.recommendation);
                drawInfobox(this.infoboxContents, this.brewery.marker);
            }
        });
    }

    toggleBrewpubVisibility(state) {
      if(this.extraInfo.brewpub) {
        this.brewery.marker.setVisible(state);
      }
    }

    getPosition() {
      return this.brewery.getPosition();
    }
}
