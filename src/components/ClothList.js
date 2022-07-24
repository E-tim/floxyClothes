import React, { useState } from 'react'
import axios from 'axios'
import { FaTimes, FaEdit } from "react-icons/fa"
import UpdateClothes from './UpdateClothes'


const ClothList = ({clothe, setClothes, clothes}) => {
  const [isEditting, setIsedtting] = useState(false);

  const del = async()=> {
    const dele = await axios.delete(`/deleteCloth/${clothe._id}`)
    setClothes( prev => {
      return prev.filter( clot => {
        return clot._id != clothe._id
      } )
    } )
  }

  const onToggle =()=> {
    setIsedtting( prev => !prev )
  }
  return (
    <div>
      <div className='listClothes'>
          <div style={{display: 'flex', justifyContent: 'space-between', width: '50px', margin: '10px 0'}} >
            <FaEdit style={{color: 'blue', fontSize: '22px'}} onClick={onToggle} />
            <FaTimes style={{color: 'red', fontSize: '22px'}} onClick={del} />
          </div>
          <img src={ !clothe.photo ? 'https://ps.w.org/user-avatar-reloaded/assets/icon-128x128.png?rev=2540745' : `/uploaded-photos/${clothe.photo}` } alt='babies-clothing' />
          <div>
            <p>{clothe.name} <br></br><span> #{clothe.price}</span></p>
          </div>
      </div>
      <div style={{display: isEditting ? 'block' : 'none'}} >
        <UpdateClothes clothe={clothe} onToggle={onToggle} setClothes={setClothes} />
      </div>
    </div>
  )
}

export default ClothList