import Marker from './Marker';

// DO SOMETHING ELSE WITH THIS OR REMOVE CLASS????
export default class User {
    constructor(userPos) {
        this.marker = new Marker(userPos, 'small-beer.png', 'Your current location!');
    }

    getPosition() {
      return this.marker.getPosition();
    }
}
