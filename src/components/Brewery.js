import Marker from './Marker';
import {
    service
} from '../mapsApi/mapsService';
import {
    drawInfobox,
    formatDetails
} from '../utils/infoBox';

export default class Brewery {
    constructor(baseInfo, extraInfo) {
        this.isBrewpub = extraInfo.isBrewpub;
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

    createInfoBox(info, recommendation) {
        return new InfoBox(info, recommendation);
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
        service.getDetails({
            placeId: placeId
        }, (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                this.info = place;
                this.infoboxContents = formatDetails(this.info, this.recommendation);
                drawInfobox(this.infoboxContents, this.brewery.marker);
            }
        });
    }

    toggleBrewpubVisibility(state) {
      if(this.extraInfo.brewpub) {
        this.brewery.marker.setVisible(state);
      }
    }
}
