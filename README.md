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

# PaddyCure API Documentation

![PaddyCure Logo](https://drive.google.com/uc?id=1JqG6Ox5Kw45GkjV9sZzg0VFcp_GYGbTo)

## Users

### Register User Account

**Endpoint**: `POST /users/register`

**Description**: This endpoint is used to register a new user account.

**Request Body**:
- id: User ID
- nama: User's name
- img: User's image URL
- nomor_hp: User's phone number
- role: User's role
- username: User's username
- password: User's password

### Get User Details by ID

**Endpoint**: `GET /users/userDetail/:id`

**Description**: This endpoint is used to retrieve user details by ID.

### Get User Details by Name

**Endpoint**: `GET /users/search/nama/:nama`

**Description**: This endpoint is used to retrieve user details by name.

### Get All User Data

**Endpoint**: `GET /users`

**Description**: This endpoint is used to retrieve all user data.

### Update User Data by ID

**Endpoint**: `PUT /users/update/:id`

**Description**: This endpoint is used to update user data by ID.

**Request Body**: User data to be updated.

### Delete User Data by ID

**Endpoint**: `DELETE /users/delete/:id`

**Description**: This endpoint is used to delete user data by ID.

## News

### Get All News

**Endpoint**: `GET /berita`

**Description**: This endpoint is used to retrieve all news.

### Get News by Title

**Endpoint**: `GET /berita/search/judul/:judul`

**Description**: This endpoint is used to retrieve news by title.

### Get News by Author

**Endpoint**: `GET /berita/search/penulis/:penulis`

**Description**: This endpoint is used to retrieve news by author.

### Get News by Content

**Endpoint**: `GET /berita/search/isi/:isi`

**Description**: This endpoint is used to retrieve news by content.

### Get News by Image

**Endpoint**: `GET /berita/search/image/:image`

**Description**: This endpoint is used to retrieve news by image.

### Get News by Timestamp

**Endpoint**: `GET /berita/search/timeStamp/:timeStamp`

**Description**: This endpoint is used to retrieve news by timestamp.

### Get News by ID

**Endpoint**: `GET /berita/search/id/:id`

**Description**: This endpoint is used to retrieve news by ID.

### Insert News Data

**Endpoint**: `POST /berita/input`

**Description**: This endpoint is used to insert new news data.

**Request Body**:
- id: News ID
- judul_berita: News title
- penulis: News author
- isi_berita: News content
- img_berita: News image URL

### Update News

**Endpoint**: `PUT /berita/update/:id`

**Description**: This endpoint is used to update news by ID.

**Request Body**: News data to be updated.

### Delete News

**Endpoint**: `DELETE /berita/delete/:id`

**Description**: This endpoint is used to delete news by ID.

## Products

### Get All Products

**Endpoint**: `GET /produk`

**Description**: This endpoint is used to retrieve all products.

### Get Product Details by ID

**Endpoint**: `GET /produk/search/id/:id`

**Description**: This endpoint is used to retrieve product details by ID.

### Get Product Details by Name

**Endpoint**: `GET /produk/search/nama_produk/:nama_produk`

**Description**: This endpoint is used to retrieve product details by name.

### Insert Product Data

**Endpoint**: `POST /produk/insert-produk`

**Description**: This endpoint is used to insert new product data.

**Request Body**:
- id: Product ID
- user_id: User ID
- id_produk: Product ID
- img_produk: Product image URL
- harga_produk: Product price
- detail_produk: Product details
- stok_produk: Product stock

### Update Product Data by ID

**Endpoint**: `PUT /produk/update/:id`

**Description**: This endpoint is used to update product data by ID.

**Request Body**: Product data to be updated.

### Delete Product Data by ID

**Endpoint**: `DELETE /produk/delete/:id`

**Description**: This endpoint is used to delete product data by ID.

## Orders

### Get All Order Items

**Endpoint**: `GET /order`

**Description**: This endpoint is used to retrieve all order items.

### Get Order Items by User ID

**Endpoint**: `GET /order/:idUser`

**Description**: This endpoint is used to retrieve order items by user ID.

### Add Item to Order

**Endpoint**: `POST /order/input`

**Description**: This endpoint is used to add an item to the order.

**Request Body**: Item data to be added.

### Remove Item from Order

**Endpoint**: `DELETE /order/delete`

**Description**: This endpoint is used to remove an item from the order.

### Update Order Item

**Endpoint**: `PUT /order/ubah`

**Description**: This endpoint is used to update an order item.

**Request Body**: Item data to be updated.

## Diseases

### Get All Disease Details

**Endpoint**: `GET /disease/diseaseDetails`

**Description**: This endpoint is used to retrieve all disease details.

### Get Disease Details by ID

**Endpoint**: `GET /disease/paddyDetail/:id`

**Description**: This endpoint is used to retrieve disease details by ID.

### Create Disease Data

**Endpoint**: `POST /disease/create`

**Description**: This endpoint is used to create new disease data.

**Request Body**:
- id: Disease ID
- user_id: User ID
- nama_penyakit: Disease name
- tentang_penyakit: Description about the disease
- product_recomendation: Product recommendation
- timestamp: Disease timestamp

## Paddy

### Create Paddy Data

**Endpoint**: `POST /paddy/create`

**Description**: This endpoint is used to create new paddy data.

**Request Body**:
- id: Paddy ID
- user_id: User ID
- img_padi: Paddy image URL
- catatan: Paddy notes
- deskripsi: Paddy description
- id_disease: Disease ID

### Get All Paddy Data

**Endpoint**: `GET /paddy/paddyDetails`

**Description**: This endpoint is used to retrieve all paddy data.

### Get Paddy Data by ID

**Endpoint**: `GET /paddy/paddyDetail/:id`

**Description**: This endpoint is used to retrieve paddy data by ID.

### Update Paddy Data by ID

**Endpoint**: `PUT /paddy/update/:id`

**Description**: This endpoint is used to update paddy data by ID.

**Request Body**: Paddy data to be updated.

### Delete Paddy Data by ID

**Endpoint**: `DELETE /paddy/delete/:id`

**Description**: This endpoint is used to delete paddy data by ID.

## Login

### Generate Login Token

**Endpoint**: `POST /users/login`

**Description**: This endpoint is used to generate a login token.

**Request Body**:
- username: User's username
- password: User's password


