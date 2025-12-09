import './MapView.css';
import {Map} from "./components/Map.tsx"
import {GoogleButton} from "./components/GoogleButton.tsx";
import {useState} from "react";
import type {Spot} from "../Utils/Spot.ts";
import type {Photo} from "../Utils/Photo.ts";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaRegUser } from "react-icons/fa";
import {SpotModal} from "./components/SpotModal.tsx";
import type {Comment} from "../Utils/Comment.ts";

export const MapView = () => {
    const [currentSpot, setCurrentSpot] = useState<Spot | null>(null)
    const [currentSpotPhotos, setCurrentSpotPhotos] = useState<Photo[]>([])
    const [currentSpotComments, setCurrentSpotComments] = useState<Comment[]>([])
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

    function handleSpotDataFromMap(spot: Spot | null) {
        setCurrentSpot(spot)
    }

    function handlePhotosDataFromMap(photos: Photo[]) {
        setCurrentSpotPhotos(photos ?? [])
        photos?.map(p => {
            console.log(p)
        })
    }

    function handleCommentsDataFromMap(comments: Comment[]) {
        setCurrentSpotComments(comments ?? [])
        comments?.map(p => {
            console.log(p)
        })
    }

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        lazyLoad: 'ondemand' as const,
        adaptiveHeight: true,
    }

    function getPhotoUrl(url: string): string {
        if(url.includes("drive.google.com")){
            const id = url.substring(url.indexOf("/d/")+3, url.indexOf("/view?"));
            console.log(id);
            return`https://drive.google.com/thumbnail?id=${id}`;
        }else{
            return url;
        }
    }


    return (

        <div className={"map-view-wrapper"}>
            <div className={`info-view ${currentSpot ? "open" : "closed"}`}>

                {currentSpot && (
                    <>
                        <div className={"photos-info-wrapper"}>
                            <div className={"slider-container"}>
                                {currentSpotPhotos.length > 0 ? (
                                    <Slider {...sliderSettings}>
                                        {currentSpotPhotos?.map(photo => (
                                            <div className={"current-photo-wrapper"}>
                                                <div className={"photo-wrapper"}>
                                                    <img src={getPhotoUrl(photo.url)} alt="" className={"spot-photo"}
                                                         onClick={() => {
                                                             setSelectedPhoto(photo)
                                                             setShowModal(true)
                                                         }}/>
                                                    <div className={"photo-info-wrapper"}>
                                                        <p className={"caption"}>{photo.caption}</p>
                                                        {/*<p className={"author"}>{photo.author.displayName}</p>*/}
                                                        <p className={"author"}><FaRegUser/> Julia Staniszewska</p>
                                                    </div>

                                                </div>

                                            </div>
                                        ))}
                                    </Slider>
                                ) : (
                                    <div className="no-photos">
                                        <h2>Nikt jeszcze nie dodał zdjęcia</h2>
                                        <p>Chcesz być pierwszy?</p>
                                        <button className="btn-login">Zaloguj Się</button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={"spot-info-wrapper"}>
                            <p className={"spot-name"}>{currentSpot?.title}</p>
                            <p className={"label"}>Opis</p>
                            <p className={"descr"}>{currentSpot?.description}</p>
                        </div>

                        <div className="comments-section">
                            <h3>Komentarze</h3>

                            <div className="comments-list">
                                {currentSpotComments.length > 0 ? (
                                    currentSpotComments.map(comment => (
                                        <div key={comment.id} className="comment">
                                            <div className="comment-author">{comment.author.displayName}</div>
                                            <div className="comment-date">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </div>
                                            <p className="comment-content">{comment.content}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-comments">Brak komentarzy</p>
                                )}
                            </div>
                        </div>
                        <div className="spot-google-btn-wrapper">
                        <GoogleButton lat={currentSpot?.latitude} long={currentSpot?.longitude}/>
                        </div>
                    </>


                )}

            </div>
            <div className={`map-view ${currentSpot ? "with-spot" : "no-spot"}`}>
                <Map sendSpotDataToMapView={handleSpotDataFromMap} sendPhotosDataToMapView={handlePhotosDataFromMap}
                     sendCommentsDataToMapView={handleCommentsDataFromMap}/>
            </div>

            {selectedPhoto && currentSpot &&
                <SpotModal open={showModal} onClose={() => setShowModal(false)} photo={selectedPhoto}
                           spot={currentSpot}/>
            }


        </div>
    );
}