import React, { useState, useRef } from 'react'
import axios from "axios";

const AddClothes = ({setClothes}) => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [file, setFile] = useState('');

    const createPhotoField = useRef();

    const submitData = async ()=> {
        const datas = new FormData();
        datas.append('name', name);
        datas.append('price', price);
        datas.append('photo', file);

        // const newDatas = await axios.post('/addClothes', data, {headers: { 'content-type': 'multipart/form-data' } })
        // setClothes(prev => prev.concat([newDatas.data]))

        // const formDatas = {
        //     name: name,
        //     price: price,
        //     photo: file
        // }
        const config = {
            Headers: { 'content-type': 'multipart/form-data' }
        }
        const newData = await axios.post('/addClothes', datas, config)
        setClothes( prev => prev.concat([newData.data]) )

        setName('');
        setPrice('');
        setFile('');
        createPhotoField.current.value = "";
    }

  return (
    <div>
        <form>
            <div className="">
                {/* <label className="">Name</label> */}
                <input onChange={e=> setName(e.target.value)} type="text" className="form-control" placeholder="Name" />
            </div>
            <div className="">
                {/* <label className="">Price</label> */}
                <input onChange={e=> setPrice(e.target.value)} type="text" className="form-control" placeholder="Price"/>
            </div>
            <div className="mb-3">
                {/* <label  className="form-label">Default file input example</label> */}
                <input ref={createPhotoField} onChange={e=> setFile(e.target.files[0])} className="form-control" type="file" />
            </div>
            <div className="">
                <button onClick={submitData} className="btn btn-dark">ADD</button>
            </div>
        </form>
    </div>
  )
}

export default AddClothes