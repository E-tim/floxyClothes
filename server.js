const express = require("express");
const PORT = process.env.PORT || 8080;
const cors = require('cors');
const dotenv = require('dotenv');
const {MongoClient, ObjectId} = require("mongodb")
const multer = require('multer');
const upload = multer();
const fse = require('fs-extra');
const sharp = require('sharp');
const sanitizeHTML = require('sanitize-html');
const path = require('path')
// const upload = multer();
require("dotenv").config()
const app = express();

app.use(cors());
app.use(express.json());

//  allow to write react in the server
// const React = require('react');
// const ReactDomServer = require('react-dom/server');
// const ClothList = require('./src/components/ClothList').default;

// allow the server use views folder
app.set('view engine', 'ejs');
app.set('views', './views');

// allow ther server to use public folder
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());


fse.ensureDirSync(path.join("public", "uploaded-photos"))

let db;



function passwordLocked(req, res, next) {
    res.set("WWW-Authenticate", "Basic realm='test'");
    if (req.headers.authorization == "Basic dGltOnRpbQ==") {
        next();
    } else{
        console.log(req.headers.authorization);
        res.status(401).send("try again");
    }
}


app.get('/', async(req, res)=> {

    const allClothes = await db.collection('kidsClothes').find().toArray();
    res.render('home', {
        allClothes: allClothes
    });
})

app.get('/admin', passwordLocked, (req, res)=> {
    res.render('admin')
})
app.get('/clotheList', async(req, res)=> {
    const allClothes = await db.collection('kidsClothes').find().toArray();
    res.json(allClothes);
})

// adding to database
app.post('/addClothes' , upload.single('photo') , cleanUp ,  async(req, res)=> {
    if (req.file) {
        const photoFileName = `${Date.now()}.jpeg`;
        await sharp(req.file.buffer).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photoFileName))
        req.cleanData.photo = photoFileName;
    }

    console.log(req.body);

    const info = await db.collection('kidsClothes').insertOne(req.cleanData);
    const newAddedInfo = await db.collection('kidsClothes').findOne({_id: new ObjectId(info.insertedId)})
    res.send(newAddedInfo);
})

// update the clothes in db
app.post('/upadteCloth', upload.single('photo'),cleanUp,async(req, res)=> {
    if (req.file) {
        const photoFileName = `${Date.now()}.jpeg`;
        await sharp(req.file.buffer).jpeg({quality: 60}).toFile(path.join("public", "uploaded-photos", photoFileName))
        req.cleanData.photo = photoFileName;

        const info = await db.collection('kidsClothes').findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData} )
        if (info.value.photo) {
            fse.remove(path.join("public", "uploaded-photos", info.value.photo))
        }
    } else {
        await db.collection('kidsClothes').findOneAndUpdate({_id: new ObjectId(req.body._id)}, {$set: req.cleanData} )
        // res.send(false)
    }

})

// deleting when adding 
app.delete('/deleteCloth/:id', async(req, res)=> {
    if(typeof req.params.id != "string") req.params.id = "";
    
    // remove from the folder uploaded
    const doc = await db.collection('kidsClothes').findOne({_id: new ObjectId(req.params.id)})
    if (doc.photo) {
        fse.remove(path.join("public", "uploaded-photos", doc.photo))
    }
    await db.collection('kidsClothes').deleteOne({_id: new ObjectId(req.params.id)})
    res.send("good job");
})


//  cleaning up before input to database
 function cleanUp (req, res, next) {
    if(typeof req.body.name != "string") req.body.name = "";
    if(typeof req.body.price != "string") req.body.price = "";
    if(typeof req.body._id != "string") req.body._id = "";

    req.cleanData = {
        name: sanitizeHTML(req.body.name.trim(), { allowedTags: [], allowedAttributes: {}}),
        price: sanitizeHTML(req.body.price.trim(), { allowedTags: [], allowedAttributes: {} })
    }
    next();
}

//  connecting to mongo db
const start = async() => {
    // const client = new MongoClient('mongodb://root:root@localhost:27017/floxyStore?&authSource=admin');
    const client = new MongoClient(process.env.MONGODB_URI,{ useNewUrlParser: true });

    await client.connect();
    db = client.db();
    app.listen(PORT)
}
start();

