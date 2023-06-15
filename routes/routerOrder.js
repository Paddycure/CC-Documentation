const express = require('express');
const router = express.Router();
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const numbers = require('nanoid-generate/numbers');
const multer = require("multer");



router.get("/",verifikasiUser,(req,res)=>{
    /* no json body req bang */
    const query = "SELECT * FROM order_table";
    
    

    db.query(query, (err,results)=>{
      if(err){
        console.log(`error bang. mengambil data order table`)
        res.status(200).json({
            result : false,
            keterangan : "error menggambil data order"
        });
        return
      }else{

        const myRespon = {
          result : true,
          keterangan : "berhasil mengambil data order",
          data : []
        }
  
        for(let i = 0; i<results.length; i++){
          //console.log(results[i].produk_id)
          db.query(`SELECT * FROM produk WHERE id = ${results[i].produk_id}`,(err,results2)=>{
            //console.log(results2)
            
            if(err){
              return res.status(200).json({
                results : false,
                keterangan : "gagal mengambil data produk" + err
              })}
              else{

                const myRespon2 = {
                id : results[i].id,
                user_id : results[i].user_id,
                jumlah_pesanan : results[i].jumlah_pesanan,
                total_harga : results[i].total_harga,
                total_harga_pesanan : results[i].total_harga_pesanan,
                timestamp : results[i].timestamp,
                biaya_transaksi : results[i].biaya_transaksi,
                produk :  results2[0]
                }
                myRespon.data.push(myRespon2)
                console.log(results2)

                if(i == results.length-1){
                  console.log(myRespon)
                  return res.status(200).json(myRespon)
                }

              }
              
             })

          //console.log(i,results.length-1)
  
          //if loop terakhir
         
  
        }

      }
    })

  });

  //get order by id
  router.get("/id/:id",(req,res)=>{
    const orderId = req.params.id;
    const query = `SELECT * FROM order_table WHERE id ='${orderId}'`
    db.query(query,(err,results)=>{
      if(err){
        console.log(`error bang. mengambil data order table`)
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data produk by id"+err
        })}
        else{

          const myRespon = {
            result : true,
            keterangan : "berhasil mengambil data order by id order " + orderId,
            data : []
          }
    
          for(let i = 0; i<results.length; i++){
            //console.log(results[i].produk_id)
            db.query(`SELECT * FROM produk WHERE id = ${results[i].produk_id}`,(err,results2)=>{
              //console.log(results2)
              
              if(err){
                return res.status(200).json({
                  results : false,
                  keterangan : "gagal mengambil data produk" + err
                })}
                else{
  
                  const myRespon2 = {
                  id : results[i].id,
                  user_id : results[i].user_id,
                  jumlah_pesanan : results[i].jumlah_pesanan,
                  total_harga : results[i].total_harga,
                  total_harga_pesanan : results[i].total_harga_pesanan,
                  timestamp : results[i].timestamp,
                  biaya_transaksi : results[i].biaya_transaksi,
                  produk :  results2[0]
                  }
                  myRespon.data.push(myRespon2)
                  console.log(results2)
  
                  if(i == results.length-1){
                    console.log(myRespon)
                    return res.status(200).json(myRespon)
                  }
  
                }
                
               })
  
            //console.log(i,results.length-1)
    
            //if loop terakhir
           
    
          }
  
        }
    })
  })

  //untuk histori order
  router.get("/user/:idUser",verifikasiUser,(req,res)=>{
    /* no json req bang */
    const idUser = req.params.idUser;
    const query = `SELECT * FROM order_table WHERE user_id ='${idUser}'`;

    db.query(query, (err,results)=>{
      if(err){
        console.log(`error bang. mengambil data order table`)
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengambil data produk by id"
        });
      }else{

        const myRespon = {
          result : true,
          keterangan : "berhasil mengambil data order by id user " + idUser,
          data : []
        }
  
        for(let i = 0; i<results.length; i++){
          //console.log(results[i].produk_id)
          db.query(`SELECT * FROM produk WHERE id = ${results[i].produk_id}`,(err,results2)=>{
            //console.log(results2)
            
            if(err){
              return res.status(200).json({
                results : false,
                keterangan : "gagal mengambil data produk" + err
              })}
              else{

                const myRespon2 = {
                id : results[i].id,
                user_id : results[i].user_id,
                jumlah_pesanan : results[i].jumlah_pesanan,
                total_harga : results[i].total_harga,
                total_harga_pesanan : results[i].total_harga_pesanan,
                timestamp : results[i].timestamp,
                biaya_transaksi : results[i].biaya_transaksi,
                produk :  results2[0]
                }
                myRespon.data.push(myRespon2)
                console.log(results2)

                if(i == results.length-1){
                  console.log(myRespon)
                  return res.status(200).json(myRespon)
                }

              }
              
             })

          //console.log(i,results.length-1)
  
          //if loop terakhir
         
  
        }

      }
      
      
    })

  });


  router.post("/input",multer().any(),verifikasiUser,(req,res)=>{


    const order = {
      id : numbers(10),
      user_id : req.akun.id,
      jumlah_pesanan : req.body.jumlah_pesanan,
      total_harga : req.body.total_harga,
     
      total_harga_pesanan : req.body.total_harga_pesanan,
      //timestamp : "",
      biaya_transaksi : req.body.biaya_transaksi,
      produk_id : req.body.produk_id
    }

    const query = "INSERT INTO order_table SET ?";

    db.query(query,order,(err,result)=>{
      if(err){
        console.log("gagal menginput order " + err );
        res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam menginput order" + err
        });
        return
      }
      res.status(200).json({
        result : true,
        keterangan : "berhasil menginput data order"
    });
      console.log(`berhasil menginput order ` )
      return
    })
  })

  router.put("/ubah",multer().any(),verifikasiUser, (req,res)=>{
    /*
    {
    "id" : "116", //id kamu 
    "user_id" : "123",
    "jumlah_pesanan" : "100",
    "total_harga" : "100000",
    "total_harga_pesanan" : "125566",
    "biaya_transaksi" : "100002",
    "produk_id" : "123"
    }
    */ 

    const order = {
      id : req.body.id,
      user_id : req.akun.id,
      jumlah_pesanan : req.body.jumlah_pesanan,
      total_harga : req.body.total_harga,
      total_harga_pesanan : req.body.total_harga_pesanan,
      timestamp : "",
      biaya_transaksi : req.body.biaya_transaksi,
      produk_id : req.body.produk_id
    }

    console.log(order)

  let query = `SELECT * FROM order_table WHERE id = ${order.id}`;
  db.query(query , (err, results) => {
    if(err){
      return res.status(200).json({
        result : false,
        keterangan : "kesalahan dalam mengambil data"+err
    });
    }
    else if(results.length <1){
        res.status(200).json({
            result : false,
            keterangan : "id order tidak di temukan"
        });
    }
    else{
      console.log('id order di temukan bang, melakukan perubahan data order pada id ' + order.id)
      query = `UPDATE order_table SET jumlah_pesanan = ${order.jumlah_pesanan}, 
      total_harga = '${order.total_harga}' ,total_harga_pesanan = '${order.total_harga_pesanan}', biaya_transaksi = '${order.biaya_transaksi}', 
      produk_id = '${order.produk_id}' WHERE order_table.id = '${order.id}'`;
      
      db.query(query, (err,results)=>{
        if(err){
          console.log(`gagal merubah data order bang`)
          return res.status(200).json({
            result : false,
            keterangan : "kesalahan dalam mengubah data order"
        });
        }
        res.status(200).json({
            result : true,
            keterangan : "berhasil mengubah data order"
        });
      })
    }
  })


  })


  router.delete("/delete/:id",verifikasiUser, (req,res) =>{

  
    const id = req.params.id
    
    
  
  const query = `DELETE FROM order_table WHERE id = '${id}'`;
      
  db.query(query , (err, results) => {
        if(err){
          return res.status(200).json({
            result : false,
            keterangan : "gagal mengambil data dari database"
        });
        }
        console.log(results)
        if(results.affectedRows == 0){
          
          return res.status(200).json({
            result : false,
            keterangan : "id " + +id+ " gagal di hapus"
        });
        }
        
        return res.status(200).json({
            result : true,
            keterangan : " id " +id+ " berhasil di hapus"
        });
  
      })
      //return res.status(201).json(id)
    })
  
    


module.exports = router;