import {
  directionsService, directionsDisplay
} from '../mapsApi/directionsService';

export default function findNearestBrewery(user, breweries, brewpubsHidden) {
  const userPos = user.getPosition();
  let distance = null;
  let shortestDistance = Number.MAX_SAFE_INTEGER;
  let closestBreweryPos = null;
  let closestIsBrewpub = false;

  for(let i = 0; i < breweries.length; i++) {
    const brewpub = breweries[i].extraInfo.brewpub;
    if(!brewpubsHidden || !brewpub) {
      const breweryPos = breweries[i].getPosition();
      distance = calculateLatLongDistance(userPos, breweryPos);

      if(shortestDistance > distance) {
        shortestDistance = distance;
        closestBreweryPos = breweryPos;
        closestIsBrewpub = brewpub;
      }
    }
  }

  drawPath(userPos, closestBreweryPos);
  // redraw if closest is brewpub and flip filter
  return closestIsBrewpub;
}

// formula from http://www.movable-type.co.uk/scripts/latlong.html
// doing 'dumb' distance to start
// another option - take 3(?) closest and find shortest actual travel distance
const R = 6371e3;
function calculateLatLongDistance(p1, p2) {
  const φ1 = toRadians(p1.lat()), φ2 = toRadians(p2.lat()), Δλ = toRadians(p2.lng()-p1.lng());
  return Math.acos( Math.sin(φ1) * Math.sin(φ2) + Math.cos(φ1) * Math.cos(φ2) * Math.cos(Δλ) ) * R;
}

function toRadians(x) {
  return x * Math.PI / 180;
}

function drawPath(userPos, breweryPos) {
  const request = {
    origin: userPos,
    destination: breweryPos,
    travelMode: 'DRIVING'
  };
  directionsService.route(request, (result, status) => {
    if(status === 'OK') {
      directionsDisplay.set('directions', null);
      directionsDisplay.setDirections(result);
    }
  });
}
