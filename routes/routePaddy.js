const express = require('express');
const numbers = require('nanoid-generate/numbers');
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const router = express.Router();
const multer  = require('multer');
const { Storage } = require('@google-cloud/storage');
const upload = multer();

// create
router.post("/create", upload.any(), (req, res) => {
    const requiredParams = [];
  
    if (req.body.user_id == undefined) {
      requiredParams.push("parameter user_id belum diisi");
    }
    if (req.files.length === 0) {
      requiredParams.push("parameter img_padi belum diisi");
    }
    if (req.body.confidence == undefined) {
      requiredParams.push("parameter confidence belum diisi");
    }
    if (req.body.penyakit == undefined) {
      requiredParams.push("parameter penyakit belum diisi");
    }
    if (req.body.suggesion == undefined) {
      requiredParams.push("parameter suggesion belum diisi");
    }
    if (req.body.deskripsiPenyakit == undefined) {
      requiredParams.push("parameter deskripsiPenyakit belum diisi");
    }
    
    if (requiredParams.length > 0) {
      res.status(200).json({
        result: false,
        keterangan: "data belum lengkap",
        data: requiredParams
      });
      return;
    }
    

    const paddy = {
      id: numbers(10),
      user_id: req.body.user_id,
      img_padi: req.files[0],
      confidence: req.body.confidence,
      penyakit: req.body.penyakit,
      suggesion: req.body.suggesion,
      deskripsiPenyakit: req.body.deskripsiPenyakit
    };

  
    const storage = new Storage({
      keyFilename: "serviceaccountkey.json",
      projectId: "tepar-388403",
    });
  
    async function uploadFileToBucket(fileObject, destinationPath) {
      const bucketName = "image-paddy";
      const bucketDirectoryName = "paddy";
  
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
    const destinationPath = `paddy-id-${paddy.id}-${dateTime}-${paddy.img_padi.originalname}`;
    
    let query = `INSERT INTO paddy (id, user_id, img_padi, penyakit, suggesion, confidence, deskripsiPenyakit) 
    VALUES ('${paddy.id}', '${paddy.user_id}', 'https://storage.googleapis.com/image-paddy/paddy/${destinationPath}', '${paddy.penyakit}', '${paddy.suggesion}','${paddy.confidence}','${paddy.deskripsiPenyakit}')`;

    db.query(query, (error, results) => {
      if (error) {
        console.error("Error inserting user details:", error);
        res.status(200).json({
          result: false,
          keterangan: "gagal mengambil data dari database",
          data: error
        });
      } else {
        uploadFileToBucket(paddy.img_padi, destinationPath)
          .then(() => {
            const p={
                
                    id: paddy.id,
                    user_id: req.body.user_id,
                    img_padi: `https://storage.googleapis.com/image-paddy/paddy/${destinationPath}`,
                    confidence: req.body.confidence,
                    penyakit: req.body.penyakit,
                    suggesion: req.body.suggesion,
                    deskripsiPenyakit: req.body.deskripsiPenyakit
            }
            console.log("User details inserted:", results);
            res.status(200).json({
              result: true,
              keterangan: "berhasil di input",
              data: p
            });
          })
          .catch((error) => {
            console.error("Terjadi kesalahan saat mengunggah file:", error);
            res.status(200).json({
              result: false,
              keterangan: "terjadi kesalahan saat mengunggah file ke bucket",
            });
          });
      }
    });
  });
  

// read all user details
router.get("/paddyDetails", (req, res) => {
    db.query("SELECT id, user_id, img_padi, penyakit, confidence, suggesion, deskripsiPenyakit FROM paddy", (error, results) => {
        if (error) {
        console.error("Error retrieving user details:", error);
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data"
        });
        } else {
        res.status(200).json({
            result : false,
            keterangan : "berhasil input data",
            data : results
        });
        }
    });
    });

// read specific user detail
router.get("/paddyDetail/:id", (req, res) => {
    const paddyId = req.params.id;
    
    db.query(
        "SELECT * FROM paddy WHERE id = ?",
        [paddyId],
        (error, results) => {
        if (error) {
            console.error("Error retrieving user detail:", error);
            res.status(200).json({
            result : false,
            keterangan : "gagal ambil data"
        });
        } else if (results.length === 0) {
            res.status(200).json({
                result : false,
                keterangan : "id tidak di temukan"
            });
        } else {
            const userDetail = results[0];
            res.status(200).json({
            result : true,
            keterangan : "berhasil",
            data : userDetail
        });
        }
        }
    );
    });

router.get("/search/user_id/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    
    db.query(
        "SELECT * FROM paddy WHERE user_id = ?",
        [user_id],
        (error, results) => {
        if (error) {
            console.error("Error retrieving user detail:", error);
            res.status(200).json({
            result : false,
            keterangan : "gagal ambil data"
        });
        } else if (results.length === 0) {
            res.status(200).json({
                result : false,
                keterangan : "id tidak di temukan"
            });
        } else {
            const userDetail = results[0];
            res.status(200).json({
            result : true,
            keterangan : "berhasil",
            data : results
        });
        }
        }
    );
    });


////////////////PUT/////////////////////////////
router.put("/update/:id", upload.any(), (req, res) => {
    const paddyId = req.params.id;
  
    const paddy = {
        id: numbers(10),
        user_id: req.body.user_id,
        img_padi: req.files[0],
        confidence: req.body.confidence,
        penyakit: req.body.penyakit,
        suggesion: req.body.suggesion,
        deskripsiPenyakit: req.body.deskripsiPenyakit
      };
  
    // Fungsi upload bucket
    const storage = new Storage({
      keyFilename: "serviceaccountkey.json",
      projectId: "tepar-388403",
    });
  
    async function uploadFileToBucket(fileObject, destinationPath) {
      const bucketName = "image-paddy";
      const bucketDirectoryName = "paddy";
  
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
      const bucketDirectoryName = "paddy";
  
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
    const destinationPath = `paddy-id-${paddyId}-${dateTime}-${paddy.img_padi.originalname}`;
  
    let query = `SELECT img_padi FROM paddy WHERE id = ${paddyId}`;
  
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
          const oldImgPadiUrl = result[0].img_padi;
          const oldDestinationPath = oldImgPadiUrl.split("/").pop();
  
          query = `UPDATE paddy SET user_id = '${paddy.user_id}', penyakit = '${paddy.penyakit}', confidence = '${paddy.confidence}', suggesion='${paddy.suggesion}', deskripsiPenyakit='${paddy.deskripsiPenyakit}',img_padi = 'https://storage.googleapis.com/image-paddy/paddy/${destinationPath}' WHERE id = ${paddyId}`;
  
          db.query(query, (err, results) => {
            if (err) {
              console.error("Kesalahan saat melakukan query: ", err);
              res.status(200).json({
                result : false,
                keterangan : "terjadi kesalahan saat mengubah data Paddy"
            });
            } else {
              uploadFileToBucket(paddy.img_padi, destinationPath)
                .then(() => {
                  if (oldDestinationPath !== destinationPath) {
                    deleteFileFromBucket(oldDestinationPath)
                      .then(() => {
                        res.status(200).json({
                            result : true,
                            keterangan : "data paddy berhasil di ubah dan gambar berhasil di ubah"
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

  // delete
  
 // router.delete("/paddy/delete/:id",  verifikasiUser, (req, res)=> {
  router.delete("/delete/:id",  (req, res)=> {
    const paddyId = req.params.id;
    
    db.query("DELETE FROM paddy WHERE id = ?", [paddyId], (error, results) => {
        if (error) {
            console.error("Error deleting user details:", error);
            res.status(200).json({
                result : false,
                keterangan : "kesalahan dalam mengambil data"
            });
        } else {
            console.log("User details deleted:", results);
            res.status(200).json({
                result : false,
                keterangan : "data berhasil di hapus"
            });
        }
    });
});

module.exports=router;
