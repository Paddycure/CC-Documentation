const express = require("express");
require('@google-cloud/debug-agent').start()
const app = express();
const port = 8081;


//const numbers = require('nanoid-generate/numbers');
//const jawt = require('jsonwebtoken');
//const multer  = require('multer');
//const fs = require('fs');



//import variable
//const db = require('./databaseDanConfignya/connection.js')
const beritaRouter = require('./routes/routeBerita');
const userRouter = require('./routes/routeUser');
const orderRouter = require('./routes/routerOrder');
const produkRouter = require('./routes/routeProduk');
const paddyRouter = require('./routes/routePaddy');
const paddyDiseaseRouter = require('./routes/routePaddyDisease')
//const verifikasiUser = require('./routes/verifikasi/verivikasi')

app.get("/", (req, res) => {
    return res.status(200).send("Hai there");
  });

app.use(express.json())

// router
app.use('/berita', beritaRouter);
app.use('/users', userRouter);
app.use('/order', orderRouter);
app.use('/produk', produkRouter);
app.use('/paddy', paddyRouter);
app.use('/disease', paddyDiseaseRouter);
  //server start
  app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
  });



  //berita harus login untuk post sama put

  /*
  
  BERITA
https://paddy-disease-387609.et.r.appspot.com/berita
method : get
json params key :{
  {kosong}
}
json headers key :{
  bearer : "isinya token"
}
jsonbodykey :
{kosong}


https://paddy-disease-387609.et.r.appspot.com/berita/search/judul/:judul
method : get
json params key :{
  {judul:"sisinya judul yang di cari"}
}
json headers key :{
  {kosong}
}
jsonbodykey :
{kosong}


https://paddy-disease-387609.et.r.appspot.com/berita/search/penulis/:penulis
method : get
json params key :{
  {penulis:"isinya penulis yang di cari"}
}
json headers key :{
  {kosong}
}
jsonbodykey :
{kosong}


https://paddy-disease-387609.et.r.appspot.com/berita/search/isi/:isi
method : get
json params key :{
  {isi:"isinya berita yang di cari"}
}
json headers key :{
  {kosong}
}
jsonbodykey :
{kosong}

https://paddy-disease-387609.et.r.appspot.com/berita/search/image/:image
method : get
json params key :{
  {image:"isinya lmage yang di cari"}
}
json headers key :{
 {kosong}
}
jsonbodykey :
{kosong}

https://paddy-disease-387609.et.r.appspot.com/berita/search/timeStamp/:timeStamp
method get
json params key :{
  {timeStamp:"sisinya time stamp yang di cari"}
}
json headers key :{
  {kosong}
}
jsonbodykey :
{kosong}

https://paddy-disease-387609.et.r.appspot.com/berita/search/id/:id
method get
json params key :{
  {id:"sisinya id yang di cari"}
}
json headers key :{
  {kosong}
}
jsonbodykey :
{kosong}

https://paddy-disease-387609.et.r.appspot.com/berita/input
method post
json params key :{
  {kosong}
}
json headers key :{
  bearer : "isinya token"
}
jsonbodykey :
{
    "judul": "berita saya2",
    "penulis": "penulis2",
    "isi": "ini adalah isi berita bang2",
    "img": "link atau data gambar bang2"
}

https://paddy-disease-387609.et.r.appspot.com/berita/ubah
method put
json params key :{
  {kosong}
}
json headers key :{
  bearer : "isinya token"
}
jsonbodykey :
{
    id: req.body.id,
    judul_berita: req.body.judul,
    penulis : req.body.penulis,
    isi_berita : req.body.isi,
    img_berita : req.body.img,
}

https://paddy-disease-387609.et.r.appspot.com/berita/delete
method delete
json params key :{
  {kosong}
}
json headers key :{
  bearer : "isinya token"
}
jsonbodykey :
{
    "id" : [874,996,444]
}

ECOMMERCE
https://paddy-disease-387609.et.r.appspot.com/produk
https://paddy-disease-387609.et.r.appspot.com/produk/produkDetail/:id
https://paddy-disease-387609.et.r.appspot.com/produk/search/nama_produk/:nama_produk
https://paddy-disease-387609.et.r.appspot.com/produk/insert-produk
https://paddy-disease-387609.et.r.appspot.com/produk/update/:id
https://paddy-disease-387609.et.r.appspot.com/produk/delete/:id

LOGIN
https://paddy-disease-387609.et.r.appspot.com/users/login


ORDER
https://paddy-disease-387609.et.r.appspot.com/order
https://paddy-disease-387609.et.r.appspot.com/order/:idUser
https://paddy-disease-387609.et.r.appspot.com/order/input
https://paddy-disease-387609.et.r.appspot.com/order

PADDY DISEASE
https://paddy-disease-387609.et.r.appspot.com/disease/diseaseDetails
https://paddy-disease-387609.et.r.appspot.com/disease/paddyDetail/:id
https://paddy-disease-387609.et.r.appspot.com/disease/create

PADDY
https://paddy-disease-387609.et.r.appspot.com/paddy/create
https://paddy-disease-387609.et.r.appspot.com/paddy/paddyDetails
https://paddy-disease-387609.et.r.appspot.com/paddy/paddyDetail/:id
https://paddy-disease-387609.et.r.appspot.com/paddy/update/:id
https://paddy-disease-387609.et.r.appspot.com/paddy/delete/:id

USER
https://paddy-disease-387609.et.r.appspot.com/user/create
https://paddy-disease-387609.et.r.appspot.com/user/userDetail/:id
https://paddy-disease-387609.et.r.appspot.com/user/search/nama/:nama
https://paddy-disease-387609.et.r.appspot.com/user/userDetails
https://paddy-disease-387609.et.r.appspot.com/user/update/:id
https://paddy-disease-387609.et.r.appspot.com/user/delete/:id
  
  
  */

app.get("/tes",(req,res)=>{
  console.log(req.headers)
})
