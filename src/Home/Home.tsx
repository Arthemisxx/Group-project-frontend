import { Body } from "./Body/Body";
import {Explore} from "../Explore/Explore.tsx";
import {Footer} from "./Footer/Footer.tsx";

export default function Home() {
  return (
    <div>
        <Body />
        <Explore/>
        <Footer/>
    </div>
  );
}