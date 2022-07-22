import React, { useState } from 'react'
import axios from 'axios';
import { FaTimes } from "react-icons/fa"

const UpdateClothes = ({clothe, setClothes, onToggle}) => {
    const [updateName, setUpdateName] = useState('');
    const [updatePrice, setUpdatePrice] = useState('');
    const [updateFile, setUpdateFile] = useState();

    const handleSubmit = async()=> {
        const datas = new FormData();

        if (updateFile) {
            datas.append('photo', updateFile)
        }
        datas.append('name', updateName)
        datas.append('price', updatePrice)
        datas.append('_id', clothe._id)

        const config = {
            Headers: { 'content-type': 'multipart/form-data' }
        }
        const sendUpdate = await axios.post('/upadteCloth', datas, config)

        setClothes( prev => {
            return prev.map( pre => {
                if (pre._id === clothe._id) {
                    return { ...pre, name: updateName, price: updatePrice }
                }
            } )
        } )

        if (sendUpdate.data) {
            setClothes( prev => {
                return prev.map( pre => {
                    if (pre._id === clothe._id) {
                        return {...pre, photo: sendUpdate.photo}
                    }
                } )
            } )
        }

    }
    
  return (
    <div className="upadtePic" >
        
        <form>
        <FaTimes onClick={onToggle} className='updateFatimes'/>
            <div >
                <input type="text" onChange={e=> setUpdateName(e.target.value)} className="form-control" placeholder="Name" />
            </div>
            <div className="">
                <input type="text" onChange={e=> setUpdatePrice(e.target.value)} className="form-control" placeholder="Price"/>
            </div>
            <div className="mb-3">
                <input className="form-control" type="file" onChange={e=> setUpdateFile(e.target.files[0])} />
            </div>
            <div className="">
                <button onClick={handleSubmit} className="btn btn-dark">Update</button>
            </div>
        </form>
    </div>
  )
}

export default UpdateClothes