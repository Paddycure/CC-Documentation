const express = require('express');
const numbers = require('nanoid-generate/numbers');
const router = express.Router();
const db = require('./../databaseDanConfignya/connection')
const multer  = require('multer');
const upload = multer();


    // read all user details
    router.get("/diseaseDetails", (req, res) => {
        db.query("SELECT * FROM paddy_disease", (error, results) => {
          if (error) {
            console.error("Error retrieving user details:", error);
            res.status(200).json({
                result : false,
                keterangan : "kesalahan dalam mengambil data"
            });
          } else {
            res.status(200).json({
                result : true,
                keterangan : "berhasil",
                data : results
            });
          }
        });
      });

      router.get("/paddyDetail/name/:name", (req, res) => {
        const diseaseName = req.params.name;
        
        db.query(
          "SELECT * FROM paddy_disease WHERE nama_penyakit = ?",
          [diseaseName],
          (error, results) => {
            if (error) {
              console.error("Error retrieving user detail:", error);
              res.status(200).send({ result: false, msg: error });
            } else if (results.length === 0) {
              res.status(200).send({ result: false, msg: "disease not found" });
            } else {
              const diseaseDetail = results[0];
              res.status(200).send({ result: true, data: diseaseDetail });
            }
          }
        );
      });



    // read specific user detail
    router.get("/paddyDetail/:id", (req, res) => {
        const diseaseId = req.params.id;
      
        db.query(
          "SELECT * FROM paddy_disease WHERE id = ?",
          [diseaseId],
          (error, results) => {
            if (error) {
              console.error("Error retrieving user detail:", error);
              res.status(200).json({
                result : false,
                keterangan : "kesalahan dalam mengambil data"
            });
            } else if (results.length === 0) {
                res.status(200).json({
                    result : false,
                    keterangan : "tidak di temukan"
                });
            } else {
              const diseaseDetail = results[0];
              res.status(200).json({
                result : true,
                keterangan : "berhasil",
                data : diseaseDetail
            });
            }
          }
        );
      });

// create
    router.post("/create", upload.any(), (req, res) => {
    const disease = {
      id: numbers(10),
      user_id: req.body.user_id,
      nama_penyakit: req.body.nama_penyakit,
      tentang_penyakit: req.body.tentang_penyakit,
      solusi: req.body.solusi,
      product_recomendation: req.body.product_recomendation,
      //timestamp: req.body.timestamp,
    };
  
    db.query("INSERT INTO paddy_disease SET ?", disease, (error, results) => {
      if (error) {
        console.error("Error inserting user details:", error);
        res.status(200).json({
            result : false,
            keterangan : "kesalahan input data "
        });
      } else {
        console.log("User details inserted:", results);
        res.status(200).json({
            result : true,
            keterangan : "berhasil"
        });
      }
    });
  });

  module.exports=router;