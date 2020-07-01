
export function createPolygonPath(coordinates) {
    const paths = [];
    let exteriorDirection;
    let interiorDirection;
    for (let i = 0; i < coordinates.length; i++) {
        const path = coordinates[i].map(
            coord => new google.maps.LatLng(coord[1], coord[0])
        );
        if (!i) {
            exteriorDirection = checkCCW(path);
            paths.push(path);
        } else if (i === 1) {
            interiorDirection = checkCCW(path);
            if (exteriorDirection === interiorDirection) {
                paths.push(path.reverse());
            } else {
                paths.push(path);
            }
        } else {
            if (exteriorDirection === interiorDirection) {
                paths.push(path.reverse());
            } else {
                paths.push(path);
            }
        }
    }

    return paths;
}

function checkCCW(path) {
    let isCCW;
    let a = 0;
    for (let i = 0; i < path.length - 2; i++) {
        a = a
            + ((path[i + 1].lat()
                - path[i].lat())
                * (path[i + 2].lng()
                    - path[i].lng())
                - (path[i + 2].lat()
                    - path[i].lat())
                * (path[i + 1].lng()
                    - path[i].lng()));
    }
    if (a > 0) {
        isCCW = true;
    }
    else {
        isCCW = false;
    }
    return isCCW;
}
