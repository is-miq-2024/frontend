import {memo, useRef, useState} from "react";
import {
    YMaps,
    Map,
    ZoomControl,
    SearchControl, Button
} from "@pbe/react-yandex-maps";
// @ts-ignore
const areEqual = (prevProps, nextProps) => {
    const {coordinates: prevCoordinates} = prevProps;
    const {coordinates: nextCoordinates} = nextProps;

    if (prevCoordinates?.length !== nextCoordinates?.length) {
        return false;
    }

    // Сравниваем каждую пару координат
    return prevCoordinates?.every(
        // @ts-ignore
        ([prevLat, prevLng], index) =>
            prevLat === nextCoordinates[index][0] && prevLng === nextCoordinates[index][1]
    );
};


// @ts-ignore
const YMapsComponent = memo(({setCoordinates, setPathParams, setPathMapEditMode, coordinates = []}) => {
    const [ymaps, setYmaps] = useState(null);
    const routes = useRef(null);
    // @ts-ignore
    const getRoute = ref => {
        if (ymaps) {
            // @ts-ignore
            const multiRoute = new ymaps.multiRouter.MultiRoute(
                {
                    referencePoints: coordinates,
                    params: {
                        results: 2,
                        routingMode: "pedestrian"
                    }
                },
                {
                    boundsAutoApply: true,
                    routeActiveStrokeWidth: 6,
                    routeActiveStrokeColor: "#fa6600"
                }
            );

            routes.current = multiRoute;
            ref.geoObjects.add(multiRoute);
        }
    };
    // @ts-ignore
    const getRoutes = (event) => {
        // @ts-ignore
        const wayPoints = routes.current.getWayPoints();
        const dataWaypoints: {
            latitude: number,
            longitude: number
        }[] = [];
        // @ts-ignore
        wayPoints.each(function (point) {
            dataWaypoints.push({
                latitude: point.properties.get("coordinates")[1],
                longitude: point.properties.get("coordinates")[0]
            });
        });

        const selected = event.originalEvent.target._selected;

        if (!selected) {
            // @ts-ignore
            routes.current.editor.start({
                addWayPoints: true,
                removeWayPoints: true
            });
        } else if (selected) {
            // @ts-ignore
            routes.current.editor.stop();
            setCoordinates(dataWaypoints);
            // @ts-ignore
            setPathParams((prevState) => ({
                ...prevState,
                // @ts-ignore
                durationInMinutes: Math.floor(routes.current.getActiveRoute()?.properties.get("duration").value / 60),
            }))

            // @ts-ignore
            setPathMapEditMode((prev) => !prev);

        }

    };

    return (
        <YMaps query={{apikey: "8b56a857-f05f-4dc6-a91b-bc58f302ff21"}}>
            <Map
                state={{center: [59.950649, 30.317391], zoom: 10}}
                instanceRef={ref => ref && getRoute(ref)}
                // @ts-ignore
                onLoad={ymaps => setYmaps(ymaps)}
                width="100%"
                height="400px"
                modules={["control.SearchControl", "control.RouteEditor", "multiRouter.MultiRoute", "multiRouter.EditorAddon", 'control.Button']}
            >
                <SearchControl options={{float: "right", maxWidth: 320, size: "large"}}/>

                <ZoomControl options={{position: {top: 100, right: 10}}}/>
                <Button
                    onClick={getRoutes}
                    options={{maxWidth: 128}}
                    data={{content: "Режим редактирования"}}
                    defaultState={{selected: false}}
                />
            </Map>
        </YMaps>);
}, areEqual);

export {YMapsComponent};
