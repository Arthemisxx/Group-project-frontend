import './App.css'
import Header from "./Header/Header";
import Home from "./Home/Home.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MapView} from "./Map/MapView.tsx";
import {Explore} from "./Explore/Explore.tsx";
import { Register } from "./Register/Register.tsx";

function App() {
  return (
    <>
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<MapView />} />
        <Route path="/odkrywaj" element={<Explore />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
