/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _BrewMap = __webpack_require__(1);
	
	var _BrewMap2 = _interopRequireDefault(_BrewMap);
	
	var _mapsService = __webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var initMap = function initMap() {
	    (0, _mapsService.initGMap)();
	    (0, _mapsService.initGService)();
	    new _BrewMap2.default();
	};
	
	window.initMap = initMap;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _User = __webpack_require__(2);
	
	var _User2 = _interopRequireDefault(_User);
	
	var _Brewery = __webpack_require__(6);
	
	var _Brewery2 = _interopRequireDefault(_Brewery);
	
	var _mapsService = __webpack_require__(5);
	
	var _bounds = __webpack_require__(8);
	
	var _mapProps = __webpack_require__(4);
	
	var _distance = __webpack_require__(9);
	
	var _distance2 = _interopRequireDefault(_distance);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var BrewMap = function () {
	    function BrewMap() {
	        var _this = this;
	
	        _classCallCheck(this, BrewMap);
	
	        this.brewpubsHidden = false;
	        this.breweries = [];
	
	        (0, _bounds.limitMapScroll)(_mapsService.map);
	        _mapsService.map.controls[google.maps.ControlPosition.BOTTOM].push(this.setupCustomControls());
	
	        // make the request to get the brewery data on load
	        _mapsService.service.nearbySearch({
	            location: (0, _bounds.createLatLng)(_mapProps.ottawaLatLong.lat, _mapProps.ottawaLatLong.lng),
	            keyword: 'brewery',
	            radius: '50000'
	        }, this.populateMap.bind(this));
	
	        // add personal location - GET ME TO CLOSEST BEER
	        if (navigator.geolocation) {
	            navigator.geolocation.getCurrentPosition(function (position) {
	                var userPos = {
	                    lat: position.coords.latitude,
	                    lng: position.coords.longitude
	                };
	                _this.user = _this.addUserMarker(userPos);
	            }, function (error) {
	                return console.log(error);
	            });
	        }
	    }
	
	    /*
	     * Add the user to the map
	     */
	
	
	    _createClass(BrewMap, [{
	        key: 'addUserMarker',
	        value: function addUserMarker(userPos) {
	            return new _User2.default(userPos);
	        }
	
	        /*
	         * Callback from getting the initial brewery data
	         */
	
	    }, {
	        key: 'populateMap',
	        value: function populateMap(baseBreweryInfo, status, pagination) {
	            var _this2 = this;
	
	            if (status === google.maps.places.PlacesServiceStatus.OK) {
	                var _loop = function _loop(_i) {
	                    var breweryExtras = breweryRecommendations.find(function (b) {
	                        return b.placeId.indexOf(baseBreweryInfo[_i].place_id) != -1;
	                    });
	
	                    if (breweryExtras) {
	                        _this2.breweries.push(new _Brewery2.default(baseBreweryInfo[_i], breweryExtras));
	                    } else {
	                        // remove extra results
	                        baseBreweryInfo.splice(_i, 1);
	                        _i--;
	                    }
	                    i = _i;
	                };
	
	                for (var i = 0; i < baseBreweryInfo.length; i++) {
	                    _loop(i);
	                }
	
	                if (pagination.hasNextPage) {
	                    pagination.nextPage();
	                }
	            }
	        }
	
	        /**
	         * Add custom map controls
	         */
	
	    }, {
	        key: 'setupCustomControls',
	        value: function setupCustomControls() {
	            var customControls = document.createElement('div');
	            customControls.className = 'custom-controls';
	
	            customControls.appendChild(this.setupClosestBreweryButton());
	            customControls.appendChild(this.setupBrewpubFilter());
	
	            return customControls;
	        }
	
	        /**
	         * Build button to display path from user to closest brewery
	         */
	
	    }, {
	        key: 'setupClosestBreweryButton',
	        value: function setupClosestBreweryButton() {
	            var _this3 = this;
	
	            var closestBrewreyButton = document.createElement('input');
	            closestBrewreyButton.type = 'button';
	            closestBrewreyButton.className = 'closest-brewery';
	            closestBrewreyButton.value = 'Bring me to the closest brewery!';
	            closestBrewreyButton.onclick = function () {
	                (0, _distance2.default)(_this3.user, _this3.breweries);
	            };
	
	            return closestBrewreyButton;
	        }
	
	        /*
	         * Build and enable the brewpub filter button
	         */
	
	    }, {
	        key: 'setupBrewpubFilter',
	        value: function setupBrewpubFilter() {
	            var _this4 = this;
	
	            var filter = document.createElement('div');
	            filter.className = 'brewpub-filter';
	
	            var checkbox = document.createElement('input');
	            checkbox.type = 'checkbox';
	            checkbox.checked = this.brewpubsHidden;
	            checkbox.id = 'brewpub-filter-check';
	            checkbox.onchange = function () {
	                _this4.brewpubsHidden = !_this4.brewpubsHidden;
	                _this4.applyBrewpubVisibility(_this4.brewpubsHidden);
	            };
	
	            var label = document.createElement('label');
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
	
	    }, {
	        key: 'applyBrewpubVisibility',
	        value: function applyBrewpubVisibility(state) {
	            for (var _i2 = 0; _i2 < this.breweries.length; _i2++) {
	                this.breweries[_i2].toggleBrewpubVisibility(!state);
	            }
	        }
	    }]);
	
	    return BrewMap;
	}();
	
	exports.default = BrewMap;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _Marker = __webpack_require__(3);
	
	var _Marker2 = _interopRequireDefault(_Marker);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var User = function User(userPos) {
	    _classCallCheck(this, User);
	
	    this.marker = new _Marker2.default(userPos, 'small-beer.png', 'Your current location!');
	    // will do something with this in the near future
	};
	
	exports.default = User;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _mapProps = __webpack_require__(4);
	
	var _mapsService = __webpack_require__(5);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Marker = function () {
	    function Marker(userPos, icon, title) {
	        var _this = this;
	
	        _classCallCheck(this, Marker);
	
	        this.marker = new google.maps.Marker({
	            position: userPos,
	            map: _mapsService.map,
	            icon: _mapProps.iconBase + icon,
	            title: title
	        });
	        // mouseover icon brought to front
	        this.marker.addListener('mouseover', function () {
	            return _this.marker.setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
	        });
	    }
	
	    _createClass(Marker, [{
	        key: 'addCallback',
	        value: function addCallback(type, action) {
	            this.marker.addListener(type, action);
	        }
	    }]);
	
	    return Marker;
	}();
	
	exports.default = Marker;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var styledBrewMap = exports.styledBrewMap = [{
	  "featureType": "landscape.man_made",
	  "elementType": "geometry",
	  "stylers": [{
	    "color": "#8dd3c7"
	  }, {
	    "lightness": 75
	  }]
	}, {
	  "featureType": "landscape.natural",
	  "elementType": "geometry",
	  "stylers": [{
	    "color": "#b3de69"
	  }, {
	    "lightness": 65
	  }]
	}, {
	  "featureType": "road",
	  "elementType": "geometry",
	  "stylers": [{
	    "visibility": "simplified",
	    "color": "#ffffb3"
	  }, {
	    "lightness": 25
	  }, {
	    "weight": 1
	  }]
	}, {
	  "featureType": "water",
	  "elementType": "geometry",
	  "stylers": [{
	    "color": "#80b1d3"
	  }, {
	    "lightness": 10
	  }]
	}];
	
	var iconBase = exports.iconBase = 'icons/';
	
	var ottawaLatLong = exports.ottawaLatLong = {
	  lat: 45.3815,
	  lng: -75.7072
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.service = exports.map = undefined;
	exports.initGMap = initGMap;
	exports.initGService = initGService;
	
	var _mapProps = __webpack_require__(4);
	
	var map = exports.map = null;
	function initGMap() {
	    if (!map) {
	        exports.map = map = new google.maps.Map(document.getElementById('map'), {
	            center: _mapProps.ottawaLatLong,
	            zoom: 12,
	            minZoom: 11,
	            clickableIcons: false,
	            mapTypeControlOptions: {
	                mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain', 'brew_map']
	            }
	        });
	
	        map.mapTypes.set('brew_map', new google.maps.StyledMapType(_mapProps.styledBrewMap, {
	            name: 'BrewMap'
	        }));
	        map.setMapTypeId('brew_map');
	    }
	}
	
	// set up singleton for service
	var service = exports.service = null;
	function initGService() {
	    if (!service) {
	        exports.service = service = new google.maps.places.PlacesService(map);
	    }
	}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _Marker = __webpack_require__(3);
	
	var _Marker2 = _interopRequireDefault(_Marker);
	
	var _mapsService = __webpack_require__(5);
	
	var _infoBox = __webpack_require__(7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Brewery = function () {
	    function Brewery(baseInfo, extraInfo) {
	        _classCallCheck(this, Brewery);
	
	        this.isBrewpub = extraInfo.isBrewpub;
	        this.baseInfo = baseInfo;
	        this.extraInfo = extraInfo;
	        if (extraInfo.icon) {
	            this.brewery = this.createMarker(baseInfo, extraInfo.icon);
	            this.bindBreweryAndInfoBox();
	        }
	    }
	
	    _createClass(Brewery, [{
	        key: 'createMarker',
	        value: function createMarker(info, icon) {
	            return new _Marker2.default(info.geometry.location, icon);
	        }
	    }, {
	        key: 'bindBreweryAndInfoBox',
	        value: function bindBreweryAndInfoBox() {
	            var _this = this;
	
	            this.brewery.marker.addListener('click', function () {
	                if (!_this.infoboxContents) {
	                    _this.requestAdditionalInfo(_this.baseInfo.place_id);
	                } else {
	                    (0, _infoBox.drawInfobox)(_this.infoboxContents, _this.brewery.marker);
	                }
	            });
	        }
	    }, {
	        key: 'requestAdditionalInfo',
	        value: function requestAdditionalInfo(placeId) {
	            var _this2 = this;
	
	            _mapsService.service.getDetails({
	                placeId: placeId
	            }, function (place, status) {
	                if (status === google.maps.places.PlacesServiceStatus.OK) {
	                    _this2.info = place;
	                    _this2.infoboxContents = (0, _infoBox.formatDetails)(_this2.info, _this2.extraInfo.recommendation);
	                    (0, _infoBox.drawInfobox)(_this2.infoboxContents, _this2.brewery.marker);
	                }
	            });
	        }
	    }, {
	        key: 'toggleBrewpubVisibility',
	        value: function toggleBrewpubVisibility(state) {
	            if (this.extraInfo.brewpub) {
	                this.brewery.marker.setVisible(state);
	            }
	        }
	    }]);
	
	    return Brewery;
	}();
	
	exports.default = Brewery;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.drawInfobox = drawInfobox;
	exports.formatDetails = formatDetails;
	
	var _mapsService = __webpack_require__(5);
	
	// ensures we only have a single infobox open at a single time
	var infobox = null;
	function drawInfobox(content, marker) {
	    if (infobox) {
	        infobox.close();
	    }
	    infobox = new google.maps.InfoWindow({
	        content: content
	    });
	
	    infobox.open(_mapsService.map, marker);
	}
	
	/*
	 * Format the text contained in the info box
	 *
	 * @param {Object}
	 *		breweryFeature - hopefully self-explanatory (the json to format)
	 */
	function formatDetails(info, recommendation) {
	    var breweryFeature = info;
	    var currentDay = getCurrentDay();
	    var openClass = breweryFeature.opening_hours.open_now ? 'open' : 'closed';
	
	    var openHours = "<div><p class='remove-margin'>";
	    for (var i = 0; i < breweryFeature.opening_hours.weekday_text.length; i++) {
	        if (currentDay === (i + 1) % 7) {
	            openHours += "</p><p class='" + openClass + " remove-margin'>";
	            openHours += writeWeekdayLine(breweryFeature.opening_hours.weekday_text[i]);
	            openHours += "</p>";
	        } else {
	            openHours += writeWeekdayLine(breweryFeature.opening_hours.weekday_text[i]);
	        }
	    }
	    openHours += "</p></div>";
	
	    var infoBox = "<div class='info-box'>" + "<h3>" + breweryFeature.name + "</h3>" + "<div id='contact-box'>" + "<a href='" + breweryFeature.website + "' target='_blank'>" + breweryFeature.website + "</a>" + "<p>" + breweryFeature.vicinity + "</p>" + "<p>" + breweryFeature.formatted_phone_number + "</p>" + "</div>" + "<div id='hours-box'>" + "<p><b>Hours:</b></p>" + "<p>" + openHours + "</p>" + "</div>" + "<div id='recommendation-box'>" + "<p><b>Recommendation:</b></p>" + "<p>" + writeRecommendation(recommendation) + "</p>" + "</div>" + "</div>";
	    return infoBox;
	}
	
	function writeRecommendation(recommendation) {
	    var recDivText = 'Coming Soon!';
	
	    if (recommendation) {
	        var splitRecommendation = recommendation.split(';');
	        recDivText = splitRecommendation[0] + "<br> " + splitRecommendation[1] + "<br><br> " + splitRecommendation[2];
	    }
	
	    return recDivText;
	}
	
	function writeWeekdayLine(weekdayText) {
	    return weekdayText + "<br>";
	}
	
	function getCurrentDay() {
	    var date = new Date();
	    return date.getDay();
	}

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.limitMapScroll = limitMapScroll;
	exports.createLatLng = createLatLng;
	function limitMapScroll(map) {
	    // bounds of the desired area
	    var allowedBounds = new google.maps.LatLngBounds(createLatLng(45.14115518089034, -76.15005880565646), createLatLng(45.51227041310074, -75.08660896976092));
	    var lastValidCenter = map.getCenter();
	
	    google.maps.event.addListener(map, 'center_changed', function () {
	        if (allowedBounds.contains(map.getCenter())) {
	            // still within valid bounds, so save the last valid position
	            lastValidCenter = map.getCenter();
	            return;
	        }
	        // not valid anymore => return to last valid position
	        map.panTo(lastValidCenter);
	    });
	}
	
	function createLatLng(lat, lng) {
	    return new google.maps.LatLng(lat, lng);
	}

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = findNearestBrewery;
	function findNearestBrewery(user, breweries) {
	  console.log(user);
	  console.log(breweries);
	}

/***/ }
/******/ ]);
//# sourceMappingURL=Map.bundle.js.map