import "./SpotModal.css";
import type {Photo} from "../../Utils/Photo.ts";
import type {Spot} from "../../Utils/Spot.ts";
import {GoogleButton} from "./GoogleButton.tsx";

interface ModalProps {
    onClose: () => void;
    open: boolean;
    photo: Photo;
    spot: Spot;
}

export const SpotModal = (props: ModalProps) => {
    return (
        <div className={`${"modal"} ${props.open ? "display-block" : "display-none"}`}>
            <div className={"modal-wrapper"}>
                <div className={"modal-photo-wrapper"}>
                    <img src={props.photo.url} alt="photo" className={"modal-photo"}/>

                </div>
                <div className="modal-info">

                    <h2 className="spot-title">{props.spot.title}</h2>

                    <div className="section">
                        <p className="label">Opis miejsca</p>
                        <p className="spot-description">{props.spot.description}</p>
                    </div>

                    <div className="section">
                        <p className="label">Opis zdjęcia</p>
                        <p className="photo-caption">{props.photo.caption}</p>
                    </div>

                    <div className="section">
                        <p className="label">Autor zdjęcia</p>
                        <p className="photo-author">Julia Staniszewska</p>
                        {/*<p className="photo-author">{props.photo.author?.displayName}</p>*/}
                    </div>
                    <div className="section google-btn-wrapper">
                        <GoogleButton lat={props.spot.latitude} long={props.spot.longitude}/>
                    </div>

                </div>


            </div>
            <button onClick={props.onClose} className={"modal-btn"}>Zamknij</button>
        </div>
    );
};