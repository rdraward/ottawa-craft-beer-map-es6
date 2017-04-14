import {
    map
} from '../mapsApi/mapsService';

// ensures we only have a single infobox open at a single time
let infobox = null;
export function drawInfobox(content, marker) {
    if (infobox) {
        infobox.close();
    }
    infobox = new google.maps.InfoWindow({
        content: content
    });

    infobox.open(map, marker);
}

/*
 * Format the text contained in the info box
 *
 * @param {Object}
 *		breweryFeature - hopefully self-explanatory (the json to format)
 */
export function formatDetails(info, recommendation) {
    const breweryFeature = info;
    const currentDay = getCurrentDay();
    const openClass = breweryFeature.opening_hours && breweryFeature.opening_hours.open_now ? 'open' : 'closed';

    let openHours = "<div><p class='remove-margin'>";
    // NOTE: for some reason, Stray Dog doesn't have hours
    if(breweryFeature.opening_hours) {
      for (let i = 0; i < breweryFeature.opening_hours.weekday_text.length; i++) {
          if (currentDay === ((i + 1) % 7)) {
              openHours += "</p><p class='" + openClass + " remove-margin'>";
              openHours += writeWeekdayLine(breweryFeature.opening_hours.weekday_text[i]);
              openHours += "</p>";
          } else {
              openHours += writeWeekdayLine(breweryFeature.opening_hours.weekday_text[i]);
          }
      }
    } else {
      openHours += 'Unknown - no data provided!</br></br>Check the brewery website or the Yellow Pages.';
    }
    openHours += "</p></div>";

    const infoBox = "<div class='info-box'>" +
        "<h3>" + breweryFeature.name + "</h3>" +
        "<div id='contact-box'>" +
        "<a href='" + breweryFeature.website + "' target='_blank'>" + breweryFeature.website + "</a>" +
        "<p>" + breweryFeature.vicinity + "</p>" +
        "<p>" + breweryFeature.formatted_phone_number + "</p>" +
        "</div>" +
        "<div id='hours-box'>" +
        "<p><b>Hours:</b></p>" +
        "<p>" + openHours + "</p>" +
        "</div>" +
        "<div id='recommendation-box'>" +
        "<p><b>Recommendation:</b></p>" +
        "<p>" + writeRecommendation(recommendation) + "</p>" +
        "</div>" +
        "</div>"
    return infoBox;
}

function writeRecommendation(recommendation) {
    let recDivText = 'Coming Soon!';

    if (recommendation) {
        let splitRecommendation = recommendation.split(';');
        recDivText = splitRecommendation[0] + "<br> " + splitRecommendation[1] + "<br><br> " + splitRecommendation[2];
    }

    return recDivText;
}

function writeWeekdayLine(weekdayText) {
    return weekdayText + "<br>";
}

function getCurrentDay() {
    const date = new Date();
    return date.getDay();
}
