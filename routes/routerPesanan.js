const express = require('express');
const router = express.Router();
const verifikasiUser = require('./verifikasi/verivikasi')
const db = require('./../databaseDanConfignya/connection')
const numbers = require('nanoid-generate/numbers');
const multer = require("multer");
const { query } = require('express');


router.get("/",multer().any(),verifikasiUser,(req,res)=>{
    const query = `SELECT * FROM pesanan`

    db.query(query,(err,result)=>{
        if(err){
            return res.status(200).json({
                result : false,
                keterangan : "kesalahan mengambil data pesanan ",
                error : err,
            })
        }
        else{
            const respon = []
            for(let i = 0; i<result.length; i++){
                const queryGetProduk = `SELECT * FROM produk WHERE id = ${result[i].id_produk}`
                db.query(queryGetProduk,(err,resultDataProduk)=>{
                    if(err){
                        return res.status(200).json({
                            result : false,
                            keterangan : "kesalahan dalam mengambil produk",
                            error : err,
                        })
                    }else{
                        const data ={
                            id_Pesanan : result[i].id,
                            id_user : result[i].id_user,
                            id_produk : result[i].id_produk,
                            jumlah : result[i].jumlah,
                            total : result[i].total,
                            dataProduk : resultDataProduk,
                        }
                        respon.push(data)

                        if(i == result.length-1){
                            res.status(200).json({
                                result : true,
                                keterangan : "berhasil mengambil data pesanan beserta keterangan produk",
                                data : respon
                            })
                        }
                    }
                })
            }
        }
    })
})

router.get("/id/:id",multer().any(),verifikasiUser,(req,res)=>{
    const id = req.params.id
    if(id == undefined || id == '' || id == ':id'){
        res.status(200).json({
            result : false,
            keterangan : 'request parameter ID tidak boleh kosong'
        })
        return
    }
    const query = `SELECT * FROM pesanan WHERE id = ${id}`

    db.query(query,(err,result)=>{
        if(err){
            return res.status(200).json({
                result : false,
                keterangan : "kesalahan mengambil data pesanan by id",
                error : err,
            })
        }
        else{
          const queryGetProduk = `SELECT * FROM produk WHERE id = ${result[0].id_produk}`
          db.query(queryGetProduk,(err,resultDataProduk)=>{
            if(err){
                return res.status(200).json({
                    result : false,
                    keterangan : "kesalahan dalam mengambil produk",
                    error : err,
                })
            }else{
                res.status(200).json({
                    result : true,
                    keterangan : "berhasil mengambil data pesanan by id dan data produk yang di pesan",
                    id : result[0].id,
                    id_user : result[0].id_user,
                    //id_produk : result[0].id_produk,
                    jumlah : result[0].jumlah,
                    total : result[0].total,
                    dataProduk : resultDataProduk
                })
            }
          })
        }
    })
})

router.get("/idUser/:id",multer().any(),verifikasiUser,(req,res)=>{
    const id = req.params.id

    if(id == undefined || id == '' || id == ':id'){
        res.status(200).json({
            result : false,
            keterangan : 'request parameter ID tidak boleh kosong'
        })
        return
    }


    const query = `SELECT * FROM pesanan WHERE id_user = ${id}`

    db.query(query,(err,result)=>{
        if(err){
            return res.status(200).json({
                result : false,
                keterangan : "kesalahan mengambil data pesanan by id user",
                error : err,
            })
        }
        else{
            const respon = []
            for(let i = 0; i<result.length; i++){
                const queryGetProduk = `SELECT * FROM produk WHERE id = ${result[i].id_produk}`
                db.query(queryGetProduk,(err,resultDataProduk)=>{
                    if(err){
                        return res.status(200).json({
                            result : false,
                            keterangan : "kesalahan dalam mengambil produk",
                            error : err,
                        })
                    }else{
                        const data ={
                            id_pesanan : result[i].id,
                            id_user : result[i].id_user,
                            id_produk : result[i].id_produk,
                            jumlah : result[i].jumlah,
                            total : result[i].total,
                            dataProduk : resultDataProduk,
                        }
                        respon.push(data)

                        if(i == result.length-1){
                            res.status(200).json({
                                result : true,
                                keterangan : "berhasil mengambil data pesanan by id user berserta keterangan produk",
                                data : respon
                            })
                        }
                    }
                })
            }
        }
    })
})

router.delete("/batal/:id",verifikasiUser,multer().any(),(req,res)=>{
    const id_pesanan = req.params.id
    const query = `SELECT*FROM pesanan WHERE id = '${id_pesanan}'`
    db.query(query, (err,results)=>{
        if(err){
            res.status(200).json({
                results :false,
                keterangan : 'kesalahan dalam mengambil data pesanan',
                error : err,
            })
            return
        }else{
            if(results.length == 0){
                return res.status(200).json({
                    result : false,
                    keterangan : "id pesanan tidak ditemukan"
                })
            }
            const produkId = results[0].id_produk
            const queryMengambilDataProduk = `SELECT * FROM produk WHERE id = '${produkId}'`
            db.query(queryMengambilDataProduk,(err,resultDataProduk)=>{
                if(err){
                    res.status(200).json({
                        result : false,
                        keterangan : `kesalahan dalam mengambil data produk`,
                        error : err
                    })
                    return
                }
                else{
                    if(resultDataProduk.length == 0){
                        res.status(200).json({
                            result : false,
                            keterangan : 'produk tidak di temukan'
                        })
                        return
                    }else{
                        const newStok = parseInt(resultDataProduk[0].stok_produk) + parseInt(results[0].jumlah)
                        console.log(typeof(parseInt(resultDataProduk[0].stok_produk)))
                        console.log(typeof(parseInt(results[0].jumlah)))
                        const queryMengembalikanStok = `UPDATE produk SET stok_produk = '${newStok}' WHERE produk.id = '${produkId}'`
                        db.query(queryMengembalikanStok,(err,resultMengembalikanStok)=>{
                            if(err){
                                res.status(200).json({
                                    result : false,
                                    keterangan : 'kesalahan melakukan query',
                                    error : err
                                })
                                return
                            }else{
                                if(resultMengembalikanStok.affectedRows == 0){
                                    return res.status(200).json({
                                        result:false,
                                        keterangan : 'gagal mengubah stok'
                                    })
                                }else{
                                    const queryMenghapusPesanan = `DELETE FROM pesanan WHERE pesanan.id = '${id_pesanan}'`;
                                    db.query(queryMenghapusPesanan,(err,resultMenghapusPesanan)=>{
                                        if(err){
                                            res.status(200).json({
                                                result : false,
                                                keterangan : 'kesalahan, berhasil merubah stok namun gagal mengapus pesanan',
                                                error : err
                                            })
                                            return
                                        }else{
                                            if(resultMenghapusPesanan.affectedRows == 0){
                                                return res.status(200).json({
                                                    result : false,
                                                    keterangan : `berhasil mengembalikan stok produk namun gagal menghapus pesanan`
                                                })
                                            }else{
                                                res.status(200).json({
                                                    result : true,
                                                    keterangan : `berhasil mengembalikan stok dan menghapus pesanan`
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
        }
    })
})

router.post("/input",verifikasiUser,multer().any(),(req,res)=>{
    const pesanan = {
        id : null,
        id_user : req.akun.id,
        id_produk : req.body.id_produk,
        jumlah : req.body.jumlah,
        //chek_out : req.body.chek_out
    }
    const query = `SELECT * FROM pesanan WHERE id_user = '${pesanan.id_user}' AND id_produk = '${pesanan.id_produk}'`
    db.query(query,(err,results)=>{
        if(err){
            res.status(200).json({
                results : false,
                keterangan : "kesalahan mengambil data pesanan "+ err,
                error : err
            })
            return
        }
        else{
            //jika tidak ada
            if(results.length != 1){
                pesanan.id = numbers(10)
                
            
          
           
            

            //mendapatkan data produk
            const query2 = `SELECT * FROM produk WHERE id = ${pesanan.id_produk}`;
            db.query(query2,(err,resultProduk)=>{
                if(err){
                    res.status(200).json({
                        results : false,
                        keterangan : 'gagal ambil data produk',
                        error : err
                    })
                    return
                }
                else{
                    if(resultProduk.length == 0){
                        res.status(200).json({
                            results : false,
                            keterangan : `id produk ${pesanan.id_produk} tidak di temukan`,
                        })
                        return
                    }
                    let total = parseInt(resultProduk[0].harga_produk)*pesanan.jumlah
                    queryInsertPesanan = `INSERT INTO pesanan (id,id_user,id_produk,jumlah,total) VALUES ('${pesanan.id}','${pesanan.id_user}','${pesanan.id_produk}','${pesanan.jumlah}','${total}')`
                    db.query(queryInsertPesanan,(err,resultInsert)=>{
                        if(err){
                            res.status(200).json({
                                results : false,
                                keterangan : `gagal input ke database`,
                                error : err
                            })
                            return
                        }
                        else{
                            if(resultInsert.affectedRows == 0){
                                return res.status(200).json({
                                    results : false,
                                    keterangan : 'tidak berhasil input ke database',
                                    error : resultInsert
                                })
                            }
                            else{
                                //kurangi stok di produk
                                let newStok = parseInt(resultProduk[0].stok_produk) - parseInt(pesanan.jumlah).toString()
                               
                                console.log(newStok)
                                const queryKurangiStok = `UPDATE produk SET stok_produk = '${newStok}' WHERE produk.id = '${pesanan.id_produk}'`
                                db.query(queryKurangiStok,(err,resultKurangiStok)=>{
                                    if(err){
                                        res.status(200).json({
                                            result:false,
                                            keterangan : 'berhasil input ke database pesanan namun kesalahan mengurangi stok',
                                            error : err
                                        })
                                        return
                                    }else{
                                        if(resultKurangiStok.affectedRows == 0){
                                            res.status(200).json({
                                                result : false,
                                                keterangan : `gagal mengubah isi stok`
                                            })
                                            return
                                        }
                                        else{
                                            res.status(200).json({
                                                result : true,
                                                keterangan : `berhasil membuat object pesanan baru dengan id ${pesanan.id} dan melakukan pengurangan pada stok produk yang di pesan`,
                                            })
                                            return
                                        }
                    
                                    }
                                })
                                
                            }
                            
                        }
                    })
                    

                }
            })

        }else{
            //ada 
            
            pesanan.id = results[0].id
            pesanan.selisih = pesanan.jumlah - results[0].jumlah;

            queryProduk = `SELECT * FROM produk where id = ${pesanan.id_produk}`
                db.query(queryProduk, (err,resultsProduk)=>{
                    if(err){
                        res.status(200).json({
                            results : false,
                            keterangan : "kesalahan dalam mendapatkan data produk",
                            error : err,
                        })
                        return
                    }else{
                        if(resultsProduk == 0){
                            res.status(200).json({
                                results : false,
                                keterangan : "id produk tidak di temukan"
                            })
                            return
                        }else{
                            let total = parseInt(resultsProduk[0].harga_produk)*pesanan.jumlah
                            queryMengubahDataPesanan = `UPDATE pesanan SET jumlah = '${pesanan.jumlah}', total = '${total}' WHERE pesanan.id = '${pesanan.id}'`
                            db.query(queryMengubahDataPesanan,(err,results)=>{
                                if(err){
                                    res.status(200).send({
                                        results : false,
                                        keterangan : `kesalahan update pesanan`,
                                        error : err
                                    })
                                    return
                                }else{
                                    if(results.affectedRows == 0){
                                        res.status(200).send({
                                            results : false,
                                            keterangan : `gagal mengubah data pesanan`,
                                        })
                                        return
                                    }else{
                                        const newStok = resultsProduk[0].stok_produk - (pesanan.selisih)
                                        queryMengubahStok = `UPDATE produk SET stok_produk = '${newStok}' WHERE produk.id = '${pesanan.id_produk}'`
                                        db.query(queryMengubahStok,(err,resultsUbahStok)=>{
                                            if(err){
                                                res.status(200).json({
                                                    results : false,
                                                    keterangan : `kesalahan berhasil mengubah data pesanan namun gagal merubah stok produk`,
                                                    error : err
                                                })
                                                return
                                            }else{
                                                if(resultsUbahStok.affectedRows == 0){
                                                    res.status(200).json({
                                                        results:false,
                                                        keterangan : "berhasil mengubah data pesanan namun gagal mengubah data stok produk",
                                                    })
                                                    return
                                                }else{
                                                    res.status(200).json({
                                                        results:true,
                                                        keterangan : "berhasil mengubah data pesanan dan mengubah stok produk tersebut"
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
            

        //     id : null,
        // id_user : req.akun.id,
        // id_produk : req.body.id_produk,
        // jumlah : req.body.jumlah,
        // chek_out : req.body.chek_out

            

            

        }
        
        }
    })
})

module.exports = router;