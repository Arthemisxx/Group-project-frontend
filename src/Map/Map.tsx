import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import "./Map.css";
import 'leaflet/dist/leaflet.css';

export const Map = () => {
    return (
        <>
            <div className={"map-wrapper"}>
                <MapContainer center={[51.505, -0.09]} zoom={15} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]} draggable>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>

            </div>
        </>
    );
};