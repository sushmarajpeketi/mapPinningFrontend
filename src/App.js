import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';
import Map, { Marker, Popup } from 'react-map-gl';
import { Room, Star } from "@mui/icons-material";
import { format } from "timeago.js";
import Register from './components/Register';
import Login from './components/Login'

function App() {
    const storage = window.localStorage;
    const [viewState, setViewState] = useState({
        longitude: 82.2475, // Longitude for Kakinada
        latitude: 16.9891,  // Latitude for Kakinada
        zoom: 4             // Initial zoom level
    });
    const [openPopups, setOpenPopups] = useState({});
    const [newPin, setNewPin] = useState(null);
    const [pins, setPins] = useState([]);
    const [title,setTitle] = useState(null);
    const [desc,setDesc] = useState(null);
    const [rating,setRating] = useState(0);
    const [currentUsername,setCurrentUsername] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    // Fetch pins on initial load
    useEffect(() => {
        const getPins = async () => {
            try {
                const res = await axios.get("/api/pins");
                const transformedPins = Array.isArray(res.data.getAllPins) ? res.data.getAllPins : [];
                setPins(transformedPins);

                const popup = {};
                transformedPins.forEach((e) => {
                    popup[e._id] = false;
                });
                setOpenPopups(popup);
            } catch (err) {
                console.error("Error fetching pins", err);
            }
        };
        getPins();
    }, []);

    const handlePopupClose = (id) => {
        setOpenPopups((prevState) => ({ ...prevState, [id]: false }));
    };

    const handleMarkerClick = (id, latitude, longitude) => {
        setOpenPopups((prevState) => ({ ...prevState, [id]: true }));
        setViewState((prevViewState) => ({
            ...prevViewState,
            latitude,
            longitude,
        }));
    };

    const handleDoubleClick = (e) => {
        const { lng, lat } = e.lngLat;
        setNewPin({ long: lng, lat });
    };

    const handleSubmit =async (e)=>{
        console.log("handleSubmit")
        e.preventDefault()
        const Pin = {
                username:currentUsername,
                title,
                desc,
                rating,
                lat:newPin.lat,
                long:newPin.long
        }
        try{
            const res = await axios.post("/api/pins", Pin)
            setPins([...pins,res.data.createdPin])
            setNewPin(null)
            
        }catch(err){
            console.log(err)
        }
    }

    const handleLogout = () => {
        storage.removeItem("user")
        setCurrentUsername(null)
    }
   

    return (
        <div className="App">
            
            <Map
                mapboxAccessToken={process.env.REACT_APP_MAPBOX}
                {...viewState} // Pass the whole viewState to the map component
                style={{ width: "100vw", height: "100vh" }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                onDblClick={handleDoubleClick}
                onMove={(evt) => setViewState(evt.viewState)}
               
            >
                {pins.map((p) => (
                    <React.Fragment key={p._id}>
                        <Marker latitude={p.lat} longitude={p.long}>
                            <Room
                                style={{
                                    fontSize: `${Math.max(15, Math.min(viewState.zoom * 5, 50))}px`,
                                    color: currentUsername === p.username ? "tomato" : "slateblue",
                                    cursor: "pointer",
                                }}
                                onClick={() => handleMarkerClick(p._id, p.lat, p.long)}
                            />
                        </Marker>

                        {openPopups[p._id] && (
                            <Popup
                                latitude={p.lat}
                                longitude={p.long}
                                closeOnClick={false}
                                onClose={() => handlePopupClose(p._id)}
                                anchor="left"
                            >
                                <div className="card">
                                    <label>Place</label>
                                    <h4 className="place"><b>{p.title}</b></h4>
                                    <label>Review</label>
                                    <p className="desc">{p.desc}</p>
                                    <label>Rating</label>
                                    <div className="stars">
                                        {Array(p.rating).fill(<Star className="star" />)}  
                                    </div>
                                    <label>Information</label>
                                    <span className="username">Created by <b>{p.username}</b></span>
                                    <span className="date">{format(p.createdAt)}</span>
                                </div>
                            </Popup>
                        )}

                        {newPin && (
                            <Popup
                                latitude={newPin.lat}
                                longitude={newPin.long}
                                closeOnClick={false}
                                onClose={() => setNewPin(null)}
                                anchor="left"
                            >
                                <div>
                                    <form onSubmit={handleSubmit}>
                                        <label>Title</label>
                                        <input placeholder='Enter a title' onChange={(e)=>setTitle(e.target.value)}></input>
                                        <label>Desc</label>
                                        <textarea placeholder='Say us about something' onChange={(e)=>setDesc(e.target.value)}></textarea>
                                        <label>Rating</label>
                                        <select onChange={(e)=> setRating(e.target.value)}>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </select>
                                        <button className='submitButton' type='submit'>Add Pin</button>
                                    </form>
                                </div>
                            </Popup>
                        )}
                       
                    </React.Fragment>
                    
                ))}
                    {
                        currentUsername ?(
                            <div >
                                <button className='button logout' onClick={handleLogout}>Log Out</button>

                            </div>
                        ):
                        (<div className='buttons'>
                            <button className='button login' onClick={()=>setShowLogin(true)}>LogIn</button>
                            <button className='button register' onClick={()=>setShowRegister(true)}>SignIn</button>
                        </div>)
                    }
                { showRegister && <Register setShowRegister={setShowRegister}/>}
                { showLogin && <Login setCurrentUsername={setCurrentUsername} setShowLogin={setShowLogin} storage={storage}/>}
                        
                
            </Map>
        </div>                                                   
    );
}

export default App;
