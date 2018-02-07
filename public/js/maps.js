/*global $*/
/*global google*/

function makeMap(href) {
    var l_lat = $(href).find(".latitude").text();
    var l_lng = $(href).find(".longitude").text();
    var location = {lat: parseFloat(l_lat), lng: parseFloat(l_lng)};
    /*
    "#launch-" + href.split("#")[1]) ==> "#launch-map-####"
    */
    var map = new google.maps.Map(document.getElementById("launch-" + href.split("#")[1]), {
        zoom: 4,
    });
    
    map.addListener("idle", function(event) {
       google.maps.event.trigger(map, "resize"); 
       map.panTo(location);
    });
    
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
}


function initMap() {
    $("#myTab #map-tab").on("click", function(e){
       makeMap($(this).attr('href')); 
    });
}