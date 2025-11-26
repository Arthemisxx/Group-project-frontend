import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {Body} from "./Body/Body.tsx";
import {Map} from "./Map/Map.tsx"
import Header from "./Header/Header";
import Home from "./Home/Home.tsx";
import Odkrywaj from "./Odkrywaj/Odkrywaj.tsx";

function App() {

  return (
    <>
      <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mapa" element={<Map />} />
        <Route path="/odkrywaj" element={<Odkrywaj />} />
      </Routes>
      </Router>

    </>
  )
}

export default App
