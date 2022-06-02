let coordinates = {}

$(document).ready(function () {
    get_coordinates();
    render_elements();
})

function get_coordinates() {
    let searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('source') && searchParams.has('destination')) {
        let source = searchParams.get('source')
        let destination = searchParams.get('destination')
        coordinates.source_lat = source.split(";")[0]
        coordinates.source_lon = source.split(";")[1]
        coordinates.destination_lat = destination.split(";")[0]
        coordinates.destination_lon = destination.split(";")[1]
    } else {
        alert("Coordinates not selected!")
        window.history.back();
    }
}

function render_elements() {
   $.ajax({
       url:`https://api.mapbox.com/directions/v5/mapbox/driving/-122.42,37.78;-77.03,38.91?access_token=pk.eyJ1IjoiaGFyc2ltcmFuLWthdXIxNyIsImEiOiJjbDNqZ3p1em8wM3dmM2twdWR2anRtdjQyIn0.PO7kR6J-ZPkc3Zys55k9Hg`,
       type:'get',
       success:function(respones){
           let images={
               "turn_right":"ar_right.png",
               "turn_left":"ar_left.png",
               "slight_left":"ar_slight_left.png",
               "slight_right":"ar_slight_right.png",
               "straight":"ar_straight.png",
            }
            let steps=response.routes[0].legs[0].steps
            for(let i=0;i<steps.length;i++){
                let image;
                let distance=steps[i].distance
                let instruction=steps[i].maneuver.instruction
                if(instruction.includes("Turn right")){
                    image="turn_right"
                }else if(instruction.includes("Turn left")){
                    image="turn_left"
                }
                if(i>0){
                    $('#scene_container').append(
                        `<a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].maneuver.location[0]};"> 
                        <a-image name="${instruction}" src="./assets/${images[image]}" look-at="#step_${i - 1}" scale="5 5 5" id="step_${i}" position="0 0 0" > 
                        </a-image> 
                        <a-entity> <a-text height="50" value="${instruction} (${distance}m)"></a-text> 
                        </a-entity> 
                        </a-entity> `
                    )
                }else{
                    $('#scene_container').append(
                        `<a-entity gps-entity-place="latitude: ${steps[i].maneuver.location[1]}; longitude: ${steps[i].maneuver.location[0]};"> 
                        <a-image name="${instruction}" src="./assets/ar_start.png" look-at="#step_${i + 1}" scale="5 5 5" id="step_${i}" position="0 0 0" > 
                        </a-image> 
                        <a-entity> <a-text height="50" value="${instruction} (${distance}m)"></a-text> 
                        </a-entity> 
                        </a-entity> `
                    )
                }
            }
       }
   })
}