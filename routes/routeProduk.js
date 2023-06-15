const express = require('express');
const router = express.Router();
const multer  = require('multer');
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const numbers = require('nanoid-generate/numbers');
const { Storage } = require('@google-cloud/storage');
const upload = multer();


router.get("/", (req, res) => {
    db.query("SELECT id, user_id, nama_produk, img_produk, harga_produk, detail_produk, stok_produk FROM produk", (error, results) => {
        if (error) {
        console.error("Error retrieving user details:", error);
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data"
        });
        } else {
        res.status(200).json({
            result : true,
            keterangan : "berhasil mendapatkan data produk",
            data : results
        });
        }
    });
    });

  // read specific user detail
  router.get("/search/id/:id", (req, res) => {
    const produkId = req.params.id;
  
    db.query(
      "SELECT * FROM produk WHERE id = ?",
      [produkId],
      (error, results) => {
        if (error) {
          console.error("Error retrieving user detail:", error);
          res.status(200).json({
            result : false,
            keterangan : "gagal mengambil data dari database"
        });
        } else if (results.length === 0) {
            res.status(200).json({
                result : false,
                keterangan : "produk tidak di temukan"
            });
        } else {
          const userDetail = results[0];
          res.status(200).json({
            result : true,
            keterangan : "berhasil mengambil data",
            data : results
        });
        }
      }
    );
  });

    // read specific user detail
    router.get("/search/user_id/:user_id", (req, res) => {
        const userId = req.params.user_id;
      
        db.query(
          "SELECT * FROM produk WHERE user_id = ?",
          [userId],
          (error, results) => {
            if (error) {
              console.error("Error retrieving user detail:", error);
              res.status(200).json({
                result : false,
                keterangan : "gagal mengambil data dari database"
            });
            } else if (results.length === 0) {
                res.status(200).json({
                    result : false,
                    keterangan : "produk tidak di temukan"
                });
            } else {
              const userDetail = results[0];
              res.status(200).json({
                result : true,
                keterangan : "berhasil mengambil data",
                data : results
            });
            }
          }
        );
      });

// get produk by nama produk
router.get("/search/nama_produk/:nama_produk", (req, res)=> {
  const namaProduk = `%${req.params.nama_produk}%`
  const query = `SELECT * FROM produk WHERE nama_produk LIKE '${namaProduk}'`
  console.log(query)
  db.query(query, (err, results)=>{
    if(err){
        res.status(200).json({
            result : false,
            keterangan : "terjadi kesalahan saat mengambil data"
        });
    }else{
        res.status(200).json({
            result : true,
            keterangan : "berhasil mengambil data produk by nama",
            data : results
        });
    }
  });
})

// create
router.post("/insert-produk",verifikasiUser, upload.any(), (req, res) => {
  if (req.body.data) {
    req.body = Object.assign(req.body, { data: req.body.data });
  }
    const produk = {
      id: numbers(10),
      user_id: req.akun.id,
      nama_produk: req.body.nama_produk,
      img_produk: req.files[0],
      harga_produk: req.body.harga_produk,
      detail_produk: req.body.detail_produk,
      stok_produk: req.body.stok_produk,
    };
  
    // Fungsi upload bucket
    const storage = new Storage({
      keyFilename: "serviceaccountkey.json",
      projectId: "tepar-388403",
    });
  
    async function uploadFileToBucket(fileObject, destinationPath) {
      const bucketName = "image-paddy";
      const bucketDirectoryName = "produk";
  
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
    const destinationPath = `produk-id-${produk.id}-${dateTime}-${produk.img_produk.originalname}`;
  
    let query = `INSERT INTO produk (id, user_id, nama_produk, img_produk, harga_produk, detail_produk, stok_produk) VALUES ('${produk.id}', '${produk.user_id}', '${produk.nama_produk}', 'https://storage.googleapis.com/image-paddy/produk/${destinationPath}', '${produk.harga_produk}', '${produk.detail_produk}', '${produk.stok_produk}')`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error("Kesalahan saat melakukan query: ", err);
        res.status(200).json({
            result : false,
            keterangan : "gagal mengambil data dari database"
        });
      } else {
        uploadFileToBucket(produk.img_produk, destinationPath)
          .then(() => {
            res.status(200).json({
                result : true,
                keterangan : "data berhasil di input"
            });
          })
          .catch((error) => {
            console.error("Terjadi kesalahan saat mengunggah file:", error);
            res.status(200).json({
                result : false,
                keterangan : "kesalahan saat mengunggah file"
            });
          });
      }
    });
  });
  
 ////////////////PUT/////////////////////////////
 router.put("/update/:id", verifikasiUser, upload.any(), (req, res) => {
    const produkId = req.params.id;
    const updatedProduk = {
      user_id: req.akun.id,
      nama_produk: req.body.nama_produk,
      img_produk: req.files[0],
      harga_produk: req.body.harga_produk,
      detail_produk: req.body.detail_produk,
      stok_produk: req.body.stok_produk,
    };
  
    // Fungsi upload bucket
    const storage = new Storage({
      keyFilename: "serviceaccountkey.json",
      projectId: "tepar-388403",
    });
  
    async function uploadFileToBucket(fileObject, destinationPath) {
      const bucketName = "image-paddy";
      const bucketDirectoryName = "produk";
  
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
        const bucketDirectoryName = "produk";
    
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
    const destinationPath = `produk-id-${produkId}-${dateTime}-${updatedProduk.img_produk.originalname}`;
  
    let query = `SELECT img_produk FROM produk WHERE id = ${produkId}`;
  
    db.query(query, (error, result) => {
      if (error) {
        console.error("Error executing query: ", error);
        res.status(200).json({
            result : false,
            keterangan : "kesalahan saat mengambil database"
        });
      } else {
        if (result.length === 0) {
            res.status(200).json({
                result : false,
                keterangan : "produk tidak di temukan"
            });
        } else {
          const oldImgProdukUrl = result[0].img_produk;
          const oldDestinationPath = oldImgProdukUrl.split("/").pop();
  
          query = `UPDATE produk SET user_id = '${updatedProduk.user_id}', nama_produk = '${updatedProduk.nama_produk}', img_produk = 'https://storage.googleapis.com/image-paddy/produk/${destinationPath}', harga_produk = '${updatedProduk.harga_produk}', detail_produk = '${updatedProduk.detail_produk}', stok_produk = '${updatedProduk.stok_produk}' WHERE id = ${produkId}`;
  
          db.query(query, (error, results) => {
            if (error) {
              console.error("Error updating user details:", error);
              res.status(200).json({
                result : false,
                keterangan : "terjadi kesalahan saat mengambil data"
            });
            } else {
              uploadFileToBucket(updatedProduk.img_produk, destinationPath)
                .then(() => {
                  if (oldDestinationPath !== destinationPath) {
                    deleteFileFromBucket(oldDestinationPath)
                      .then(() => {
                        console.log("User details updated:", results);
                        res.status(200).json({
                            result : true,
                            keterangan : "berhasil mengupdate data produk dan gambar"
                        });
                      })
                      .catch((error) => {
                        console.error(
                          "Error deleting file:",
                          error
                        );
                        res.status(200).json({
                            result : false,
                            keterangan : "gagal menghapus data produk lama"
                        });
                      });
                  } else {
                    console.log("User details updated:", results);
                    res.status(200).json({
                        result : false,
                        keterangan : "berhasil mengupdate data namun tidak dengan gambar"
                    });
                  }
                })
                .catch((error) => {
                  console.error("Error uploading file:", error);
                  res.status(200).json({
                    result : false,
                    keterangan : "gagal pokoknya"
                });
                });
            }
          });
        }
      }
    });
  });

    
  router.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
  
    // Inisialisasi Google Cloud Storage
    const storage = new Storage({
      keyFilename: 'serviceaccountkey.json',
      projectId: 'tepar-388403',
    });
  
    // Dapatkan path gambar dari database
    const query = `SELECT img_produk FROM produk WHERE id = '${id}'`;
    db.query(query, (err, result) => {
      if (err) {
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data"
        });
      } else {
        if (result.length > 0) {
          // Hapus gambar dari bucket
          const bucketName = 'image-paddy';
          const objectName = result[0].img_produk.split("https://storage.googleapis.com/image-paddy/produk/")[1];
  
          storage
            .bucket(bucketName)
            .file(`produk/${objectName}`)
            .delete()
            .then(() => {
              // Hapus data produk dari database
              const deleteQuery = `DELETE FROM produk WHERE id = '${id}'`;
              db.query(deleteQuery, (err, results) => {
                if (err) {
                    res.status(200).json({
                        result : false,
                        keterangan : "erorr menghapus berita dari database"
                    });
                } else {
                    res.status(200).json({
                        result : true,
                        keterangan : "berhasil menghapus data"
                    });
                }
              });
            })
            .catch((error) => {
              console.error('Error deleting file:', error);
              res.status(200).json({
                result : false,
                keterangan : "error menghapus gambar lama dari database"
            });
            });
        } else {
            res.status(200).json({
                result : false,
                keterangan : "produk tidak di temukan"
            });
        }
      }
    });
  });
  

module.exports=router;