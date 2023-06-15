const express = require('express');
const router = express.Router();
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const numbers = require('nanoid-generate/numbers');
const { Storage } = require('@google-cloud/storage');
const jawt = require('jsonwebtoken');
const multer = require("multer");
const upload = multer();
const { createHash } = require('crypto');
const storage = new Storage({
    keyFilename: 'serviceaccountkey.json', // Ganti dengan path ke file kredensial GCP Anda
    projectId: 'tepar-388403', // Ganti dengan ID proyek GCP Anda
  });



  router.post("/register",multer().any(),(req,res)=>{

    if(req.body.username == undefined || req.body.username == '' || req.body.password == undefined || req.body.password == ""){
        res.status(200).json({
            result : false,
            keterangan : "username dan password tidak boleh kosong"
        })
        return
    }
    

    const users = {
      id : numbers(10),
      name : req.body.nama,
      img : req.files[0],
      role : req.body.role,
      nomorHP : req.body.nomorHP,
      username : req.body.username,
      password : createHash('sha256').update(req.body.password).digest('hex'),
    }

    if(req.body.role == undefined){
        users.role = "konsumen"
    }
 
    
    

    //fungsi upload bucket
    const storage = new Storage({
        keyFilename: 'serviceaccountkey.json', // Ganti dengan path ke file kredensial GCP Anda
        projectId: 'tepar-388403', // Ganti dengan ID proyek GCP Anda
      });
    async function uploadFileToBucket(fileObject, destinationPath) {
        const bucketName = 'image-paddy'; // Ganti dengan nama bucket GCP Anda
      
        try {
          const bucket = storage.bucket(bucketName);
          const file = bucket.file(destinationPath);
      
          await file.save(fileObject.buffer, {
            metadata: {
              contentType: fileObject.mimetype,
            },
          });
      
          console.log(`File uploaded to ${destinationPath} successfully.`);
        } catch (error) {
          console.error('Error uploading file:', error);
        }
      }
      const dateTime = Date.now();

      let destinationPath = ''
      if(users.img == undefined){
       destinationPath =  `default/default.png`
      }else{
        destinationPath = `user-id-${users.id}-${dateTime}-${users.img.originalname}`
      }

    let query = `SELECT * FROM user WHERE username = '${users.username}'`;
    db.query(query,(err,result)=>{
      if(err){
        res.status(200).json({
            result : false,
            keterangan : "Kesalahan saat query mencari username dan password"
        });
      }else{

        if(result.length > 0){

          res.status(201).json({
            result : false,
            keterangan : "Username telah di gunakan"
        });

        }else{
          
          //console.log(result)
          query = `INSERT INTO user (id, nama, img, role, nomer_hp, username, password) VALUES ('${users.id}', '${users.name}', 'https://storage.googleapis.com/image-paddy/${destinationPath}', '${users.role}', '${users.nomorHP}', '${users.username}', '${users.password}')`;

          db.query(query,(err,results)=>{
            if(err){
              res.status(200).json({
                result : false,
                keterangan : "kesalahan saat melakukan input data ke database"
            });
            }else{
                const p = {
                    id : users.id,
                    name : req.body.nama,
                    img : `https://storage.googleapis.com/image-paddy/${destinationPath}`,
                    role : req.body.role,
                    nomorHP : req.body.nomorHP,
                    username : req.body.username,
                    password : req.body.password,
                }

                uploadFileToBucket(users.img, destinationPath); //ini pasti berhasil
                

                

                res.status(200).json({
                    result : true,
                    keterangan : "Berhasil Menambahkan user",
                    data : p
                });
              
            }

          })

        }

      }

    })
  });
  

router.get("/",verifikasiUser,(req,res)=>{
  const query = `SELECT id, nama, img, role, timestamp, nomer_hp, username FROM user;`

  db.query(query, (err,result)=>{
    if(err){
    res.status(200).json({
        result : false,
        keterangan : "gagal mengambil datadari database"
    });
      return
    }
    

    res.status(200).json({
        result : true,
        keterangan : "Berhasil mengambil data users",
        data : result
    });
  })
})


router.put("/ubah",verifikasiUser,multer().any(),(req,res) => {
    if(req.body.username == undefined || req.body.username == '' || req.body.password == undefined || req.body.password == ""){
        res.status(200).json({
            result : false,
            keterangan : "username dan password tidak boleh kosong"
        })
        return
    }
  const user = {
    id : req.body.id,
    name : req.body.nama,
    img : req.files[0],
    role : req.body.role,
    nomor_hp : req.body.nomor_hp,
    username : req.body.username,
    password : createHash('sha256').update(req.body.password).digest('hex'),
  }


  if(req.body.role == undefined || req.body.role == ""){
        user.role = "konsumen"
        req.body.role = "konsumen"
    }

  
  console.log(user.id)


  //cek user
  let query = `SELECT id, nama, img, role, timestamp, nomer_hp, username FROM user WHERE id = '${user.id}'`;
  db.query(query , (err, results) => {
    if(err){
      return res.status(200).json({
        result : false,
        keterangan : "gagal mengambil datadari database" + err
    });
    }
    else if(results.length <1){
        res.status(200).json({
            result : false,
            keterangan : "id user tidak ditemukan"
        });
      
    }
    else{
        if(results[0].img == 'https://storage.googleapis.com/image-paddy/default/default.png'){
          console.log("b")
            if(user.img == undefined){
                let destinationPath = "default/default.png"
                console.log('id di temukan, melakukan perubahan data  pada id ' + user.id)
                query = `UPDATE user SET nama = '${user.name}' , img = 'https://storage.googleapis.com/image-paddy/${destinationPath}', role = '${user.role}', 
                username = '${user.username}', password = '${user.password}', nomer_hp = '${user.nomor_hp}' WHERE user.id = '${user.id}'`
                
                db.query(query, (err,results)=>{
                  if(err){
                    res.status(200).json({
                        result : false,
                        keterangan : "gagal melakukan ubah data user ke database"
                    });
                  }
                  res.status(201).json({
                    result : true,
                    keterangan : "berhasil mengubah data user",
                    data : {
                      id : user.id,
                      name : req.body.nama,
                      img : `https://storage.googleapis.com/image-paddy/${destinationPath}`,
                      role : req.body.role,
                      nomorHP : req.body.nomor_hp,
                      username : req.body.username,
                  }
                 });
                })
                return
            }else{
                console.log("c")
                const storage = new Storage({
                    keyFilename: 'serviceaccountkey.json', // Ganti dengan path ke file kredensial GCP Anda
                    projectId: 'tepar-388403', // Ganti dengan ID proyek GCP Anda
                });

                    const bucketName = 'image-paddy';
                    const objectName =  results[0].img.split("https://storage.googleapis.com/image-paddy/")[1];
                    console.log(objectName)


                    //upload gambar baru ke bucket
                    //fungsi upload bucket
            
                    async function uploadFileToBucket(fileObject, destinationPath) {
                        const bucketName = 'image-paddy'; // Ganti dengan nama bucket GCP Anda
                    
                        try {
                        const bucket = storage.bucket(bucketName);
                        const file = bucket.file(destinationPath);
                    
                        await file.save(fileObject.buffer, {
                            metadata: {
                            contentType: fileObject.mimetype,
                            },
                        });
                        
                     

                        console.log(`File uploaded to ${destinationPath} successfully.`);

                        console.log('id di temukan, melakukan perubahan data  pada id ' + user.id)
                        query = `UPDATE user SET nama = '${user.name}' , img = 'https://storage.googleapis.com/image-paddy/${destinationPath}', role = '${user.role}', 
                        username = '${user.username}', password = '${user.password}',nomer_hp = '${user.nomor_hp}'  WHERE user.id = '${user.id}'`
                        
                        db.query(query, (err,results)=>{
                        if(err){
                            res.status(200).json({
                                result : false,
                                keterangan : "gagal melakukan ubah data user ke database"
                            });
                        }
                        res.status(201).json({
                            result : true,
                            keterangan : "berhasil mengubah data user",
                            data : {
                              id : user.id,
                              name : req.body.nama,
                              img : `https://storage.googleapis.com/image-paddy/${destinationPath}`,
                              role : req.body.role,
                              nomorHP : req.body.nomor_hp,
                              username : req.body.username,
                              password : req.body.password,
                          }
                        });
                        }) 


                        } catch (error) {
                        console.error('Error uploading file:', error);
                        }
                        }
                    const dateTime = Date.now();
                    const destinationPath = `user-id-${user.id}-${dateTime}-${user.img.originalname}`; // Ganti dengan path dan nama file tujuan di bucket GCP Anda

                    uploadFileToBucket(user.img, destinationPath); //ini pasti berhasil
                        
                     
            }
        }else{
          //sebelumnya udah punya pp
            if(user.img == undefined){
                //hapus dulu gambar lama
                  const storage = new Storage({
                    keyFilename: 'serviceaccountkey.json', // Ganti dengan path ke file kredensial GCP Anda
                    projectId: 'tepar-388403', // Ganti dengan ID proyek GCP Anda
                });

                const bucketName = 'image-paddy';
                const objectName =  results[0].img.split("https://storage.googleapis.com/image-paddy/")[1];
                console.log(objectName)


                  storage.bucket(bucketName).file(objectName).delete((error) => {
                    if (error) {
                    console.error('Error deleting file:', error);
                    return res.status(200).json({
                         result : false,
                         keterangan : "gagal menghapus gambar lama pada bucket"
                     })}
                    })


                let destinationPath = "default/default.png"
                console.log('id di temukan, melakukan perubahan data  pada id ' + user.id)
                query = `UPDATE user SET nama = '${user.name}' , img = 'https://storage.googleapis.com/image-paddy/${destinationPath}', role = '${user.role}', 
                username = '${user.username}', password = '${user.password}', nomer_hp = '${user.nomor_hp}' WHERE user.id = '${user.id}'`
                console.log('a')
                db.query(query, (err,results)=>{
                  if(err){
                    res.status(200).json({
                        result : false,
                        keterangan : "gagal melakukan ubah data user ke database"
                    });
                    return
                  }
                  return res.status(201).json({
                    result : true,
                    keterangan : "berhasil mengubah data user",
                    data : {
                      id : user.id,
                      name : req.body.nama,
                      img : `https://storage.googleapis.com/image-paddy/${destinationPath}`,
                      role : req.body.role,
                      nomorHP : req.body.nomor_hp,
                      username : req.body.username,
                      password : req.body.password,
                  }
                });
                })
                
              }else{
                 //hapus gambar lama dari bucket
                 const storage = new Storage({
                    keyFilename: 'serviceaccountkey.json', // Ganti dengan path ke file kredensial GCP Anda
                    projectId: 'tepar-388403', // Ganti dengan ID proyek GCP Anda
                });

                        const bucketName = 'image-paddy';
                        const objectName =  results[0].img.split("https://storage.googleapis.com/image-paddy/")[1];
                        console.log(objectName)


                    storage.bucket(bucketName).file(objectName).delete((error) => {
                        if (error) {
                        console.error('Error deleting file:', error);
                        res.status(200).json({
                            result : false,
                            keterangan : "gagal menghapus gambar lama pada bucket"
                        });
                        } else {
                        // upload gambar baru
                        
                        //upload gambar baru ke bucket
                    //fungsi upload bucket
            
                    async function uploadFileToBucket(fileObject, destinationPath) {
                        const bucketName = 'image-paddy'; // Ganti dengan nama bucket GCP Anda
                    
                        try {
                        const bucket = storage.bucket(bucketName);
                        const file = bucket.file(destinationPath);
                    
                        await file.save(fileObject.buffer, {
                            metadata: {
                            contentType: fileObject.mimetype,
                            },
                        });
                        
                        //hapus

                        console.log(`File uploaded to ${destinationPath} successfully.`);

                        console.log('id di temukan, melakukan perubahan data  pada id ' + user.id)
                        query = `UPDATE user SET nama = '${user.name}' , img = 'https://storage.googleapis.com/image-paddy/${destinationPath}', role = '${user.role}', 
                        username = '${user.username}', password = '${user.password}',nomer_hp = '${user.nomor_hp}' WHERE user.id = '${user.id}'`
                        
                        db.query(query, (err,results)=>{
                        if(err){
                            res.status(200).json({
                                result : false,
                                keterangan : "gagal melakukan ubah data user ke database"
                            });
                        }
                        res.status(201).json({
                            result : true,
                            keterangan : "berhasil mengubah data user",
                            data : {
                              id : user.id,
                              name : req.body.nama,
                              img : `https://storage.googleapis.com/image-paddy/${destinationPath}`,
                              role : req.body.role,
                              nomorHP : req.body.nomor_hp,
                              username : req.body.username,
                              password : req.body.password,
                          }
                        });
                        })


                        } catch (error) {
                        console.error('Error uploading file:', error);
                        }
                        }
                    const dateTime = Date.now();
                    const destinationPath = `user-id-${user.id}-${dateTime}-${user.img.originalname}`; // Ganti dengan path dan nama file tujuan di bucket GCP Anda

                    uploadFileToBucket(user.img, destinationPath); //ini pasti berhasil
                        
                        }
                    });

            }
        }

    }
  })
})
  


router.delete("/delete/:id",verifikasiUser, (req, res) => {
    const id = req.params.id;
  
    // Inisialisasi Google Cloud Storage
   
  
    // Dapatkan path gambar dari database
    const query = `SELECT img FROM user WHERE id = '${id}'`;
    db.query(query, (err, result) => {
      if (err) {
        res.status(200).json({
            result : false,
            keterangan : "gagal mengambil data dari database"
        });
      } else {
       
          if (result.length > 0) {
            console.log("d")

            if(result[0].img == "https://storage.googleapis.com/image-paddy/default/default.png"){
              // Hapus data pengguna dari database
              const deleteQuery = `DELETE FROM user WHERE id = '${id}'`;
              db.query(deleteQuery, (err, results) => {
                if (err) {
                    res.status(200).json({
                        result : false,
                        keterangan : "gagal menghapus user"
                    });
                } else {
                    res.status(201).json({
                        result : true,
                        keterangan : "user berhasil di hapus"
                    });
                }
                return
              });
            }
            else{
               // Hapus gambar dari bucket
            const storage = new Storage({
              keyFilename: 'serviceaccountkey.json', // Ganti dengan path ke file kredensial GCP Anda
              projectId: 'tepar-388403', // Ganti dengan ID proyek GCP Anda
            });

          const bucketName = 'image-paddy';
          const objectName =  result[0].img.split("https://storage.googleapis.com/image-paddy/")[1];
          console.log(objectName)


        storage.bucket(bucketName).file(objectName).delete((error) => {
          if (error) {
            console.error('Error deleting file:', error);
            res.status(200).json({
              result : false,
              keterangan : "gagal masuk ke bucket"
          });
          } else {
            // Hapus data pengguna dari database
            const deleteQuery = `DELETE FROM user WHERE id = '${id}'`;
            db.query(deleteQuery, (err, results) => {
              if (err) {
                  res.status(200).json({
                      result : false,
                      keterangan : "gagal menghapus user"
                  });
              } else {
                  res.status(201).json({
                      result : true,
                      keterangan : "user berserta foto prodil berhasil di hapus"
                  });
              }
            });
          }
        });
      }
        } else {
            res.status(200).json({
                result : false,
                keterangan : "pengguna tidak ditemukan"
            });
        }
        

       
      }
    });
  });
  


router.get("/userDetail/:id",verifikasiUser,  (req, res) => {
  const userId = req.params.id;

  db.query(
    "SELECT * FROM user WHERE id = ?",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error retrieving user detail:", error);
        res.status(200).json({
            result : false,
            keterangan : "gagal mengambil datadari database"
        });;
      } else if (results.length === 0) {
        res.status(200).json({
            result : false,
            keterangan : "id user tidak di temukan"
        });
      } else {
        res.status(200).json({
            result : true,
            keterangan : "user dengan id tersebut ketemu bang",
            data : {
            id :  results[0].id,
            nama : results[0].nama,
            img : results[0].img,
            role : results[0].role,
            timestamp : results[0].timestamp,
            nomer_hp : results[0].nomer_hp,
            username : results[0].username
            }
        });
      }
    }
  );
});

//get user by nama
router.get("/search/nama/:nama",verifikasiUser, (req,res)=> {
const nama = `%${req.params.nama}%`
const query = `SELECT id, nama, img, role, timestamp, nomer_hp, username FROM user WHERE nama LIKE '${nama}'`
console.log(query)
db.query( query, (error, results)=>{
    if (error) {
        console.error("Error retrieving user detail:", error);
        res.status(200).json({
            result : false,
            keterangan : "gagal mengambil datadari database"
        });;
      } else if (results.length === 0) {
        res.status(200).json({
            result : false,
            keterangan : "nama user tidak di temukan"
        });
      } else {
        //const userDetail = results[0];
          res.status(200).json({
          result : true,
          keterangan : "user dengan id tersebut ketemu bang",
          data : {
          id :  results[0].id,
          nama : results[0].nama,
          img : results[0].img,
          role : results[0].role,
          timestamp : results[0].timestamp,
          nomer_hp : results[0].nomer_hp,
          username : results[0].username
          }
      });
      }
});
})



router.post("/login", upload.any(), (req,res)=>{
    if(req.body.username == undefined || req.body.username == '' || req.body.password == undefined || req.body.password == ""){
        res.status(200).json({
            result : false,
            keterangan : "username dan password tidak boleh kosong"
        })
        return
    }
  
    const user = {
      username : req.body.username,
      password : createHash('sha256').update(req.body.password).digest('hex'),
    };

  
    const query = `SELECT * FROM user WHERE username = '${user.username}' AND password = '${user.password}'`;
      
      db.query(query , (err, results) => {
        if(err){
          return res.status(200).json({
            result : false,
            keterangan : "gagal mengambil datadari database"
        });
        }
        if(results.length > 0){
          const responUser = {
            id : results[0].id,
            username : user.username,
          }
          jawt.sign(responUser,"himitsu", {expiresIn:'5d'}, (err, token)=>{
              if(err){
                console.log(err)
                res.status(200).json({
                    result : false,
                    keterangan : "gagal bikin token"
                });
                return
              }else{
                const Token = token;
                res.json({
                 result : true,
                  user:responUser,
                  token:Token
                })
                return
              }
            })
  
            }else{
                console.log(results)
          return res.status(200).json({
            result : false,
            keterangan : "username password tidak ditemukan"
        });
        }
        
      })
  
  })
  
  

  

module.exports = router;
