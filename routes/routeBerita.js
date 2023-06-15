const express = require('express');
const router = express.Router();
const multer  = require('multer');
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const numbers = require('nanoid-generate/numbers');
const { Storage } = require('@google-cloud/storage');
const upload = multer();
//const //manageBeritaPicture = require('./../imgBerita/manageFile')

//AMBIL DATA all by judul dan by isi
//get semua berita 
router.get("/", (req, res) => {
    db.query('SELECT * FROM berita', (err, results) => {
      if (err) {
        console.error('Kesalahan saat melakukan query: ', err);
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data berita"
        });
      } else {
        const formattedResults = results.map(result => {
          const formattedResult = {};
          Object.keys(result).forEach(key => {
            formattedResult[key] = result[key];
          });
          return formattedResult;
        });
        res.status(200).json({
            result : true,
            keterangan : "berhasil mengambil data berita",
            data : formattedResults
        });
      }
    });
  });
  

  //get berita by judul
  router.get("/search/judul/:judul", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/judul/judul bang
    const judul = `%${req.params.judul}%`
    const query = `SELECT * FROM berita WHERE judul_berita LIKE '${judul}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data"
        });
      }else{
        res.status(200).json({
            result : true,
            keterangan : "berhasil menggambil data by judul",
            data : results
        });
      }
    });
  })
  
  //get berita by penulis
  router.get("/search/penulis/:penulis", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/penulis/nama penulis bang
    const penulis = `%${req.params.penulis}%`
    const query = `SELECT * FROM berita WHERE penulis LIKE '${penulis}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(200).json({
            result : false,
            keterangan : "kesalahan saat mengambil data"
        });
      }else{
        res.status(200).json({
            result : true,
            keterangan : "berhasil mengambil data by penulis",
            data : results
        });
      }
    });
  })
  
  // get berita by isi
  router.get("/search/isi/:isi", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/isi/isi berita bang
    const isi = `%${req.params.isi}%`
    const query = `SELECT * FROM berita WHERE isi_berita LIKE '${isi}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(200).json({
            result : false,
            keterangan : "gagal mengambil data"
        });
      }else{
        res.status(200).json({
            result : true,
            keterangan : "berhasil mengambil data by isi",
            data : results
        });
      }
    });
  })
  
  //get berita by imagename
  router.get("/search/image/:image", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/image/string image bang
    const image = `%${req.params.image}%`
    const query = `SELECT * FROM berita WHERE img_berita LIKE '${image}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data"
        });
      }else{
        res.status(200).json({
            result : true,
            keterangan : "berhasil mengambil data img",
            data : results
        });
      }
    });
  })
  
  //get berita by timeStamp
  router.get("/search/timeStamp/asc", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/timeStamp/2023
    const query = 'SELECT * FROM berita ORDER BY timeStamp ASC'
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data"
        });
      }else{
        res.status(200).json({
            result : true,
            keterangan : "berhasil mengambil data berita by timestamp",
            data : results
        });
      }
    });
  })

  router.get("/search/timeStamp/desc", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/timeStamp/2023
    const query = 'SELECT * FROM berita ORDER BY timeStamp DESC'
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data"
        });
      }else{
        res.status(200).json({
            result : true,
            keterangan : "berhasil mengambil data berita by timestamp",
            data : results
        });
      }
    });
  })
  
  
  //get Berita by ID
  router.get("/search/id/:id", (req,res)=> {
    //request json contoh : http://localhost:8081/berita/search/id/123
    const id = `${req.params.id}`
    const query = `SELECT * FROM berita WHERE id = '${id}'`
    console.log(query)
    db.query( query, (err, results)=>{
      if(err){
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data "
        });
      }else{
        res.status(200).json({
            result : true,
            keterangan : "berhasil mengambil data berita by id",
            data : results
        });
      }
    });
  })
  
  /////////////////POST////////////////////////////////////
  
  
  
  router.post("/input",verifikasiUser, upload.any(), (req, res) => {
    const berita = {
      id: numbers(10),
      judul_berita: req.body.judul_berita,
      penulis: req.body.penulis,
      isi_berita: req.body.isi_berita,
      img_berita: req.files[0],
    };
  
    // Fungsi upload bucket
    const storage = new Storage({
      keyFilename: "serviceaccountkey.json",
      projectId: "tepar-388403",
    });
  
    async function uploadFileToBucket(fileObject, destinationPath) {
      const bucketName = "image-paddy";
      const bucketDirectoryName = "berita";
  
      try {
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(`${bucketDirectoryName}/${destinationPath}`);
  
        await file.save(fileObject.buffer, {
          metadata: {
            contentType: fileObject.mimetype,
          },
        });
  
        console.log(`File uploaded to ${destinationPath} successfully.`);
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
      }
    }
  
    const dateTime = Date.now();
    const destinationPath = `berita-id-${berita.id}-${dateTime}-${berita.img_berita.originalname}`;
  
    let query = `INSERT INTO berita (id, judul_berita, penulis, isi_berita, img_berita) VALUES ('${berita.id}', '${berita.judul_berita}', '${berita.penulis}', '${berita.isi_berita}', 'https://storage.googleapis.com/image-paddy/berita/${destinationPath}')`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Kesalahan saat melakukan query: ", err);
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam menginput data"
        });
      } else {
        uploadFileToBucket(berita.img_berita, destinationPath)
          .then(() => {
            res.status(200).json({
                result : true,
                keterangan : "data berita berhasil di input"
            });
          })
          .catch((error) => {
            console.error("Terjadi kesalahan saat mengunggah file:", error);
            res.status(200).json({
                result : false,
                keterangan : "terjadi kesalahan saat mengunggah file ke bucket"
            });
          });
      }
    });
  });
  
////////////////PUT/////////////////////////////
router.put("/update/:id",verifikasiUser, upload.any(), (req, res) => {
    const beritaId = req.params.id;
  
    const berita = {
      judul_berita: req.body.judul_berita,
      penulis: req.body.penulis,
      isi_berita: req.body.isi_berita,
      img_berita: req.files[0],
    };
  
    // Fungsi upload bucket
    const storage = new Storage({
      keyFilename: "serviceaccountkey.json",
      projectId: "tepar-388403",
    });
  
    async function uploadFileToBucket(fileObject, destinationPath) {
      const bucketName = "image-paddy";
      const bucketDirectoryName = "berita";
  
      try {
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(`${bucketDirectoryName}/${destinationPath}`);
  
        await file.save(fileObject.buffer, {
          metadata: {
            contentType: fileObject.mimetype,
          },
        });
        
        console.log(`File uploaded to ${destinationPath} successfully.`);
      } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
      }
    }
  
    async function deleteFileFromBucket(destinationPath) {
      const bucketName = "image-paddy";
      const bucketDirectoryName = "berita";
  
      try {
        const bucket = storage.bucket(bucketName);
        const file = bucket.file(`${bucketDirectoryName}/${destinationPath}`);
  
        await file.delete();
  
        console.log(`File deleted: ${destinationPath}`);
      } catch (error) {
        console.error("Error deleting file:", error);
        throw error;
      }
    }
  
    const dateTime = Date.now();
    const destinationPath = `berita-id-${beritaId}-${dateTime}-${berita.img_berita.originalname}`;
  
    let query = `SELECT img_berita FROM berita WHERE id = ${beritaId}`;
  
    db.query(query, (err, result) => {
      if (err) {
        console.error("Kesalahan saat melakukan query: ", err);
        res.status(200).json({
            result : false,
            keterangan : "terjadi kesalahan saat mengubah data"
        });
      } else {
        if (result.length === 0) {
            res.status(200).json({
                result : false,
                keterangan : "data berita yang ingin di ubah tidak di temukan"
            });
        } else {
          const oldImgBeritaUrl = result[0].img_berita;
          const oldDestinationPath = oldImgBeritaUrl.split("/").pop();
  
          query = `UPDATE berita SET judul_berita = '${berita.judul_berita}', penulis = '${berita.penulis}', isi_berita = '${berita.isi_berita}', img_berita = 'https://storage.googleapis.com/image-paddy/berita/${destinationPath}' WHERE id = ${beritaId}`;
  
          db.query(query, (err, results) => {
            if (err) {
              console.error("Kesalahan saat melakukan query: ", err);
              res.status(200).json({
                result : false,
                keterangan : "terjadi kesalahan saat mengubah berita"
            });
            } else {
              uploadFileToBucket(berita.img_berita, destinationPath)
                .then(() => {
                  if (oldDestinationPath !== destinationPath) {
                    deleteFileFromBucket(oldDestinationPath)
                      .then(() => {
                        res.status(200).json({
                            result : true,
                            keterangan : "data berita berhasil di ubah dan gambar berhasil di ubah"
                        });
                      })
                      .catch((error) => {
                        console.error(
                          "Terjadi kesalahan saat menghapus file:",
                          error
                        );
                        res.status(200).json({
                            result : false,
                            keterangan : "kesalahan dalam menghapus file"
                        });
                      });
                  } else {
                    res.status(200).json({
                        result : true,
                        keterangan : "berhasil ubah data ke data base gagal menghapus gambar lama"
                    });
                  }
                })
                .catch((error) => {
                  console.error("Terjadi kesalahan saat mengunggah file:", error);
                  res.status(200).json({
                    result : false,
                    keterangan : "terjadi kesalahan saat menggungah file"
                });
                });
            }
          });
        }
      }
    });
  });
  

  
  /////////////// DELETE //////////////////////////
  router.delete("/delete/:id",verifikasiUser, (req, res) => {
    const id = req.params.id;
  
    // Inisialisasi Google Cloud Storage
    const storage = new Storage({
      keyFilename: 'serviceaccountkey.json',
      projectId: 'tepar-388403',
    });
  
    // Dapatkan path gambar dari database
    const query = `SELECT img_berita FROM berita WHERE id = '${id}'`;
    db.query(query, (err, result) => {
      if (err) {
        res.status(200).json({
            result : false,
            keterangan : "error mengambil data dari database"
        });
      } else {
        if (result.length > 0) {
          // Hapus gambar dari bucket
          const bucketName = 'image-paddy';
          const objectName = result[0].img_berita.split("https://storage.googleapis.com/image-paddy/berita/")[1];
  
          storage
            .bucket(bucketName)
            .file(`berita/${objectName}`)
            .delete()
            .then(() => {
              // Hapus data berita dari database
              const deleteQuery = `DELETE FROM berita WHERE id = '${id}'`;
              db.query(deleteQuery, (err, results) => {
                if (err) {
                    res.status(200).json({
                        result : false,
                        keterangan : "error menghapus data dari database"
                    });
                } else {
                    res.status(200).json({
                        result : true,
                        keterangan : "berita berhasil di hapus"
                    });
                }
              });
            })
            .catch((error) => {
              console.error('Error deleting file:', error);
              res.status(200).json({
                result : false,
                keterangan : "error menghapus data dari bucket"
            });
            });
        } else {
            res.status(200).json({
                result : false,
                keterangan : "data berita tidak di temukan"
            });
        }
      }
    });
  });
  
  module.exports = router;