
import React, { useState, useEffect } from "react";
import {createRoot} from "react-dom/client"
import Header from "./components/Header";
import axios from "axios";
import ClothList from "./components/ClothList";
import AddClothes from "./components/AddClothes";


function App() {

    const [clothes, setClothes] = useState([]);

    useEffect(()=> {
        const fetchdata =async()=> {
            try {
                let result = await axios.get('/clotheList')
                setClothes(result.data);
            } catch (error) {
                console.log(error)
            }
        }

        fetchdata();
    },[])
    // console.log(clothes);
    return(
        <div>
            {/* <Header/> */}
            <AddClothes setClothes={setClothes}/>
            
            <div className="myClothList">
                {
                    clothes.map( clothe=> {
                        return <ClothList key={clothe._id} clothes={clothes} clothe={clothe} setClothes={setClothes} />
                    } )
                }
            </div>


        </div>
    )
}

const root = createRoot(document.getElementById("app"))
root.render(<App/>)