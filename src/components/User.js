import Marker from './Marker';

export default class User {
    constructor(userPos) {
        this.marker = new Marker(userPos, 'small-beer.png', 'Your current location!');
        // will do something with this in the near future
    }
}
