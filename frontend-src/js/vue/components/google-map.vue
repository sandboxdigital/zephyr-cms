<template>
    <div>
        <div class="google-map" :id="mapName" style="height: 500px;"></div>
        <input type="hidden" :name="name" v-model="value">
        <table class="mt-2">
            <tr><td>Search</td><td colspan="3"><input @keydown.enter.prevent="" type="text" id="google-map-search-input"></td></tr>
            <tr>
                <td>Latitude: </td><td><input type="text" v-model="input_lat"></td>
                <td>Longitude: </td><td><input type="text" v-model="input_lng"></td>
            </tr>
        </table>
    </div>
</template>

<script>
    export default {
        props: ['name', 'lat', 'lng', 'zoom', 'nameLat', 'nameLng'],
        data: function () {
            return {
                mapName: this.name + "-map",
                input_lat: 0,
                input_lng : 0,
                map: undefined,
                marker: undefined,
                value: undefined
            }
        },
        watch: {
            "input_lat" : function(){
                this.updateMarkerPosition();
            },
            "input_lng" : function(){
                this.updateMarkerPosition();
            }
        },
        methods: {
            updateMarkerPosition(){
                let pos = new google.maps.LatLng(this.input_lat, this.input_lng);
                this.marker.setPosition(pos);
                this.map.setCenter(pos);
                this.value = this.input_lat + ',' + this.input_lng;
            },
            updateInputCoords(lat, lng){
                this.input_lat = lat;
                this.input_lng = lng;
            }
        },
        mounted: function () {
            const element = document.getElementById(this.mapName)

            let lat = this.lat ? this.lat : -33.865143;
            let lng = this.lng ? this.lng : 151.209900;

            this.updateInputCoords(lat, lng);

            let zoom = this.zoom ? parseInt(this.zoom) : 14;

            let latLng = new google.maps.LatLng(lat,lng)
            const options = {
                zoom: zoom,
                center: latLng
            }
            this.map = new google.maps.Map(element, options);

            this.marker = new google.maps.Marker({
                position: latLng,
                map: this.map,
                draggable: true
            });

            google.maps.event.addListener(this.marker,'dragend',event => {
                this.updateInputCoords(this.marker.position.lat(),this.marker.position.lng())
            });

            let input = document.getElementById('google-map-search-input');
            let searchBox = new google.maps.places.SearchBox(input);

            searchBox.addListener('places_changed', () => {
                var places = searchBox.getPlaces();

                if (places.length == 0) {
                    return;
                }

                // For each place, get the icon, name and location.
                var bounds = new google.maps.LatLngBounds();
                places.forEach(function(place) {
                    if (!place.geometry) {
                        console.log("Returned place contains no geometry");
                        return;
                    }

                    if (place.geometry.viewport) {
                        // Only geocodes have viewport.
                        bounds.union(place.geometry.viewport);
                    } else {
                        bounds.extend(place.geometry.location);
                    }
                });
                this.map.fitBounds(bounds);
                let center = this.map.getCenter();
                this.updateInputCoords(center.lat(), center.lng());
            });

        }
    }
</script>