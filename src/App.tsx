import './App.css'
import Header from "./Header/Header";
import Home from "./Home/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MapView} from "./Map/MapView.tsx";
import {Explore} from "./Explore/Explore.tsx";
import {AuthProvider} from "./Auth/AuthProvider.tsx";
import User from "./User/User.tsx";
import { TagGallery } from "./Explore/TagGallery";

function App() {
    return (
        <>
            <AuthProvider>
                <BrowserRouter>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<Home/>}/>
                        <Route path="/mapa" element={<MapView/>}/>
                        <Route path="/odkrywaj" element={<Explore/>}/>
                        <Route path="/odkrywaj/:tagName" element={<TagGallery />} />
                        <Route path="/uzytkownik" element={<User />} />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>

        </>
    )
}

export default App
