import './App.css'
import {Body} from "./Body/Body.tsx";
import {Map} from "./Map/Map.tsx"
import Header from "./Header/Header";
import {Explore} from "./Explore/Explore";

function App() {

  return (
    <>

      <Body/>
      <Map/>
      <Header />
        <Explore />

    </>
  )
}



export default App
