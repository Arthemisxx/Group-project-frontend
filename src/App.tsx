import './App.css'
import Header from "./Header/Header";
import Home from "./Home/Home.tsx";
import Odkrywaj from "./Odkrywaj/Odkrywaj.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MapView} from "./Map/MapView.tsx";

function App() {

  return (
    <>
      <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<MapView />} />
        <Route path="/odkrywaj" element={<Odkrywaj />} />
      </Routes>
      </BrowserRouter>

    </>
  )
}



export default App
