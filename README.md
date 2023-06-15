# CC-Documentation
Happy Learning :)
# Backend JavaScript with Express

This is a backend JavaScript project that utilizes the Express framework to build an API. The project serves as the backend for a specific application and provides various API endpoints to manage user data, news, products, orders, diseases, and paddy data.

## Project Setup

1. **Clone the repository** to your local directory.
   ```shell
   git clone <repository_link>

2. Install the dependencies required by using npm.
npm install

3.Configure the environment by creating a .env file and setting the required environment variables. Example .env:
PORT=3000
DATABASE_URL=

4.Start the server to test the project locally.
npm start


User
Mendaftarkan akun user
Endpoint: POST /users/register
Deskripsi: Endpoint ini digunakan untuk mendaftarkan akun pengguna baru.
Body Request:
id: ID pengguna
nama: Nama pengguna
img: URL gambar pengguna
nomor_hp: Nomor HP pengguna
role: Peran pengguna
username: Username pengguna
password: Password pengguna
Mendapatkan detail user berdasarkan ID
Endpoint: GET /users/userDetail/:id
Deskripsi: Endpoint ini digunakan untuk mendapatkan detail pengguna berdasarkan ID.
Mendapatkan detail user berdasarkan nama
Endpoint: GET /users/search/nama/:nama
Deskripsi: Endpoint ini digunakan untuk mendapatkan detail pengguna berdasarkan nama.
Menampilkan semua data user
Endpoint: GET /users
Deskripsi: Endpoint ini digunakan untuk menampilkan semua data pengguna.
Mengubah data user berdasarkan ID
Endpoint: PUT /users/update/:id
Deskripsi: Endpoint ini digunakan untuk mengubah data pengguna berdasarkan ID.
Body Request: Data pengguna yang ingin diubah.
Menghapus data user berdasarkan ID
Endpoint: DELETE /users/delete/:id
Deskripsi: Endpoint ini digunakan untuk menghapus data pengguna berdasarkan ID.
Berita
Menampilkan semua berita
Endpoint: GET /berita
Deskripsi: Endpoint ini digunakan untuk menampilkan semua berita.
Mendapatkan berita berdasarkan judul
Endpoint: GET /berita/search/judul/:judul
Deskripsi: Endpoint ini digunakan untuk mendapatkan berita berdasarkan judul.
Mendapatkan berita berdasarkan penulis
Endpoint: GET /berita/search/penulis/:penulis
Deskripsi: Endpoint ini digunakan untuk mendapatkan berita berdasarkan penulis.
Mendapatkan berita berdasarkan isi
Endpoint: GET /berita/search/isi/:isi
Deskripsi: Endpoint ini digunakan untuk mendapatkan berita berdasarkan isi.
Mendapatkan berita berdasarkan image
Endpoint: GET /berita/search/image/:image
Deskripsi: Endpoint ini digunakan untuk mendapatkan berita berdasarkan gambar.
Mendapatkan berita berdasarkan waktu
Endpoint: GET /berita/search/timeStamp/:timeStamp
Deskripsi: Endpoint ini digunakan untuk mendapatkan berita berdasarkan timestamp.
Mendapatkan berita berdasarkan ID
Endpoint: GET /berita/search/id/:id
Deskripsi: Endpoint ini digunakan untuk mendapatkan berita berdasarkan ID.
Memasukkan data berita
Endpoint: POST /berita/input
Deskripsi: Endpoint ini digunakan untuk memasukkan data berita baru.
Body Request:
id: ID berita
judul_berita: Judul berita
penulis: Penulis berita
isi_berita: Isi berita
img_berita: URL gambar berita
Mengubah berita
Endpoint: PUT /berita/update/:id
Deskripsi: Endpoint ini digunakan untuk mengubah berita berdasarkan ID.
Body Request: Data berita yang ingin diubah.
Menghapus berita
Endpoint: DELETE /berita/delete/:id
Deskripsi: Endpoint ini digunakan untuk menghapus berita berdasarkan ID.
Produk
Menampilkan produk
Endpoint: GET /produk
Deskripsi: Endpoint ini digunakan untuk menampilkan semua produk.
Mendapatkan detail produk berdasarkan ID
Endpoint: GET /produk/search/id/:id
Deskripsi: Endpoint ini digunakan untuk mendapatkan detail produk berdasarkan ID.
Mendapatkan detail produk berdasarkan nama
Endpoint: GET /produk/search/nama_produk/:nama_produk
Deskripsi: Endpoint ini digunakan untuk mendapatkan detail produk berdasarkan nama.
Memasukkan data produk
Endpoint: POST /produk/insert-produk
Deskripsi: Endpoint ini digunakan untuk memasukkan data produk baru.
Body Request:
id: ID produk
user_id: ID pengguna
id_produk: ID produk
img_produk: URL gambar produk
harga_produk: Harga produk
detail_produk: Detail produk
stok_produk: Stok produk
Mengubah data produk berdasarkan ID
Endpoint: PUT /produk/update/:id
Deskripsi: Endpoint ini digunakan untuk mengubah data produk berdasarkan ID.
Body Request: Data produk yang ingin diubah.
Menghapus data produk berdasarkan ID
Endpoint: DELETE /produk/delete/:id
Deskripsi: Endpoint ini digunakan untuk menghapus data produk berdasarkan ID.
Order
Menampilkan semua barang pesanan
Endpoint: GET /order
Deskripsi: Endpoint ini digunakan untuk menampilkan semua barang pesanan.
Menampilkan barang pesanan berdasarkan ID user
Endpoint: GET /order/:idUser
Deskripsi: Endpoint ini digunakan untuk menampilkan barang pesanan berdasarkan ID user.
Memasukkan barang ke dalam pesanan
Endpoint: POST /order/input
Deskripsi: Endpoint ini digunakan untuk memasukkan barang ke dalam pesanan.
Body Request: Data barang yang ingin dimasukkan.
Menghapus barang pesanan dari keranjang
Endpoint: DELETE /order/delete
Deskripsi: Endpoint ini digunakan untuk menghapus barang pesanan dari keranjang.
Mengubah barang pesanan
Endpoint: PUT /order/ubah
Deskripsi: Endpoint ini digunakan untuk mengubah barang pesanan.
Body Request: Data barang yang ingin diubah.
Disease
Menampilkan semua data detail penyakit
Endpoint: GET /disease/diseaseDetails
Deskripsi: Endpoint ini digunakan untuk menampilkan semua data detail penyakit.
Menampilkan data detail penyakit berdasarkan ID
Endpoint: GET /disease/paddyDetail/:id
Deskripsi: Endpoint ini digunakan untuk menampilkan data detail penyakit berdasarkan ID.
Membuat data penyakit
Endpoint: POST /disease/create
Deskripsi: Endpoint ini digunakan untuk membuat data penyakit baru.
Body Request:
id: ID penyakit
user_id: ID pengguna
nama_penyakit: Nama penyakit
tentang_penyakit: Deskripsi tentang penyakit
product_recomendation: Rekomendasi produk
timestamp: Timestamp penyakit
Paddy
Membuat data padi
Endpoint: POST /paddy/create
Deskripsi: Endpoint ini digunakan untuk membuat data padi baru.
Body Request:
id: ID padi
user_id: ID pengguna
img_padi: URL gambar padi
catatan: Catatan padi
deskripsi: Deskripsi padi
id_disease: ID penyakit
Menampilkan semua data padi
Endpoint: GET /paddy/paddyDetails
Deskripsi: Endpoint ini digunakan untuk menampilkan semua data padi.
Menampilkan data padi berdasarkan ID
Endpoint: GET /paddy/paddyDetail/:id
Deskripsi: Endpoint ini digunakan untuk menampilkan data padi berdasarkan ID.
Mengubah data padi berdasarkan ID
Endpoint: PUT /paddy/update/:id
Deskripsi: Endpoint ini digunakan untuk mengubah data padi berdasarkan ID.
Body Request: Data padi yang ingin diubah.
Menghapus data padi berdasarkan ID
Endpoint: DELETE /paddy/delete/:id
Deskripsi: Endpoint ini digunakan untuk menghapus data padi berdasarkan ID.
Login
Menggenerate token untuk login
Endpoint: POST /users/login
Deskripsi: Endpoint ini digunakan untuk menggenerate token untuk login.
Body Request:
username: Username pengguna
password: Password pengguna
Harap dicatat bahwa ini hanya merupakan representasi teks dari dokumentasi backend yang Anda berikan. Pastikan untuk mengonfirmasi dan menyesuaikan dengan kode aktual Anda.

