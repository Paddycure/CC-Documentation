const express = require('express');
const router = express.Router();
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const numbers = require('nanoid-generate/numbers');
const multer = require("multer");
const { query } = require('express');

router.get("/",(req,res)=>{
    const queryAll = `SELECT * FROM chek_out`;
    db.query(queryAll,(err,results)=>{
        if(err){
            res.status(200).json({
                result : false,
                keterangan : "kesalahan mengambil data chekout",
                error : err,
            })
        }else{
            res.status(200).json({
                result : true,
                data : results
            })
        }
    })

})

router.get("/id/:id",(req,res)=>{
    const id = req.params.id
    const queryAll = `SELECT * FROM chek_out WHERE id = ${id}`;
    db.query(queryAll,(err,results)=>{
        if(err){
            res.status(200).json({
                result : false,
                keterangan : "kesalahan mengambil data chekout",
                error : err,
            })
        }else{
            res.status(200).json({
                result : true,
                data : results
            })
        }
    })

})

router.post("/create",multer().any(),verifikasiUser,(req,res)=>{
    
    //['array','array']
    const transaksi = {
        id : numbers(10),
        user_id : req.akun.id,
        pesanan_id : req.body.pesanan_id.split(","),
        total_bayar : 0,
    }
    console.log(transaksi.pesanan_id)
    for(let i =0; i<transaksi.pesanan_id.length;i++){
        const query = `SELECT * FROM pesanan WHERE id = ${transaksi.pesanan_id[i]}`;
        db.query(query,(err,resultPesanan)=>{
            if(err){
                return res.status(200).json({
                    result : false,
                    keterangan : "kesalahan mencari pesanan by id",
                    error : err,
                })
            }
            else{
                
                transaksi.total_bayar += parseInt(resultPesanan[0].total);

                if(i == transaksi.pesanan_id.length-1){
                    
                const queryInsertChek_Out = `INSERT INTO chek_out (id,user_id,pesanan_id,total_bayar) VALUES ('${transaksi.id}','${transaksi.user_id}','${transaksi.pesanan_id}','${transaksi.total_bayar}')`
                db.query(queryInsertChek_Out,(err,resultInsertCheckOut)=>{
                    if(err){
                        res.status(200).json({
                            result : false,
                            keterangan : `gagal melakukan input data chekout`,
                            error : err
                        })
                        return
                    }else{
                        return res.status(200).json({
                            result : true,
                            keterangan : `berhasil membuat transaksi baru dengan id ${transaksi.id}`,
                            data : transaksi 
                        })
                    }
                })
                }
            }
        })
    }
})

//transaksi berhasil

//transaksi gagal
router.post("/gagal/:id",multer().any(),verifikasiUser,(req,res)=>{
    const id = req.params.id
    let query = `SELECT pesanan_id FROM chek_out WHERE id = ${id}`

    db.query(query,(err,resultQuery)=>{
        if(err){
            res.status(200).json({
                result : false,
                keterangan : `kesalahan dalam mengambil pesanan`,
                error : err
            })
            return
        }else{
            //console.log(resultQuery)
            let pesanan_id = resultQuery[0].pesanan_id.split(",")
            for(let i =0; i<pesanan_id.length;i++){
                const query = `SELECT * FROM pesanan WHERE id = ${pesanan_id[i]}`;
                db.query(query,(err,resultPesanan)=>{
                    if(err){
                        return res.status(200).json({
                            result : false,
                            keterangan : "kesalahan mencari pesanan by id",
                            error : err,
                        })
                    }else{
                        //kembalikan stok kemudian delete pesanan
                        const queryKembalikanStok = `SELECT * FROM produk WHERE id = ${resultPesanan[0].id_produk}`
                        db.query(queryKembalikanStok,(err,resultProdukId)=>{
                            if(err){
                                res.status(200).json({
                                    result : false,
                                    keterangan :  `kesalahan mencari produk`,
                                    error : err
                                })
                                return
                            }else{
                                const newStock =parseInt(resultProdukId[0].stok_produk) +  parseInt(resultPesanan[0].jumlah)
                                //insert newstok ke produk
                                const queryInsert =  `UPDATE produk SET stok_produk = '${newStock}' WHERE produk.id = '${resultPesanan[0].id_produk}'`;
                                db.query(queryInsert,(err, resultInsertProduk)=>{
                                    if(err){
                                        return res.status(200).json({
                                            result : false,
                                            keterangan : `kesalahan mengubah stok`
                                        })
                                    }else{
                                        if(resultInsertProduk.affectedRows == 0){
                                            return res.status(200).json({
                                                result : false,
                                                keterangan : `gagal mengembalikan stok`,
                                            })
                                        }else{
                                            //delete pesanan
                                            const queryDeletePesanan = `DELETE FROM pesanan WHERE pesanan.id = '${pesanan_id[i]}'`
                                            db.query(queryDeletePesanan,(err,result)=>{
                                                if(err){
                                                    return res.status(200).json({
                                                        result : false,
                                                        keterangan : `kesalahan menghapus id pesanan`,
                                                        error : err,
                                                    })

                                                }else{
                                                    //berhasil menghapus id pesanan kemudian hapus transaksi jika looping terakhir
                                                    if(i == pesanan_id.length-1){
                                                        
                                                        queryHapusTransaksi = `DELETE FROM chek_out WHERE id = '${id}'`
                                                        db.query(queryHapusTransaksi,(err,resultDeleteTransaksi)=>{
                                                            if(err){
                                                                res.status(200).json({
                                                                    result : false,
                                                                    keterangan : `kesalahan dalam menghapus id transaksi`,
                                                                    error : err
                                                                })
                                                            }else{
                                                                if(resultDeleteTransaksi.affectedRows == 0){
                                                                    return res.status(200).json({
                                                                        result : false,
                                                                        keterangan : 'gagal menghapus transaksi dan gagal mengembalikan stok produk',
                                                                        data : resultDeleteTransaksi,
                                                                        idChekout : id
                                                                    })
                                                                }else{
                                                                    res.status(200).json({
                                                                        result : true,
                                                                        keterangan : `berhasil menghapus transaksi dan mengembalikan stok semua produk`
                                                                    })
                                                                }
                                                                
                                                            }
                                                        })
                                                    }

                                                }
                                            })

                                        }
                                    }
                                })
                                return
                            }
                        })
                        return
                    }
        
                })
            }
        }
    })
   
})
//delete transaksi
router.post("/berhasil/:id",multer().any(),verifikasiUser,(req,res)=>{
    const id = req.params.id
    let query = `SELECT pesanan_id FROM chek_out WHERE id = ${id}`

    db.query(query,(err,resultQuery)=>{
        if(err){
            res.status(200).json({
                result : false,
                keterangan : `kesalahan dalam mengambil pesanan`,
                error : err
            })
            return
        }else{
            //console.log(resultQuery)
            let pesanan_id = resultQuery[0].pesanan_id.split(",")
            for(let i =0; i<pesanan_id.length;i++){
                const query = `DELETE FROM pesanan WHERE id = ${pesanan_id[i]}`;
                db.query(query,(err,resultHapusPesanan)=>{
                    if(err){
                        return res.status(200).json({
                            result : false,
                            keterangan : "kesalahan mencari pesanan by id",
                            error : err,
                        })
                    }
                    else{
                        if(resultHapusPesanan.affectedRows == 0){
                            return res.status(200).json({
                                result : false,
                                keterangan : `gagal menghapus pesanan`,
                                data : resultHapusPesanan
                            })
                        }
                        if(i == pesanan_id.length -1){
                            //hapus transaksi
                            queryHapusTransaksi = `DELETE FROM chek_out WHERE id = '${id}'`
                                                        db.query(queryHapusTransaksi,(err,resultDeleteTransaksi)=>{
                                                            if(err){
                                                                res.status(200).json({
                                                                    result : false,
                                                                    keterangan : `kesalahan dalam menghapus id transaksi`,
                                                                    error : err
                                                                })
                                                            }else{
                                                                if(resultDeleteTransaksi.affectedRows == 0){
                                                                    return res.status(200).json({
                                                                        result : false,
                                                                        keterangan : 'gagal menghapus transaksi dan gagal mengembalikan stok produk',
                                                                        data : resultDeleteTransaksi,
                                                                        idChekout : id
                                                                    })
                                                                }else{
                                                                    res.status(200).json({
                                                                        result : true,
                                                                        keterangan : `berhasil menghapus transaksi dan mengembalikan stok semua produk`
                                                                    })
                                                                }
                                                                
                                                            }
                                                        })
                        }

                    }
                })
            }
        }
    })
})
//edit transaksi

module.exports = router;