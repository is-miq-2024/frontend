import { useRef, useState} from "react";
import {SearchControl, YMaps, ZoomControl, Map} from "@pbe/react-yandex-maps";
// @ts-ignore
const PageMap = ({coordinates}) => {
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
                <ZoomControl options={{ position: {top: 100, right: 10}}}/>
            </Map>
        </YMaps>);
};

export { PageMap }