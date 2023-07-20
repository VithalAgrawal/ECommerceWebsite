const db = require('../data/database');
const mongodb = require('mongodb');

class Product {
    constructor(productData) {
        this.title = productData.title;
        this.summary = productData.summary;
        this.price = +productData.price;
        this.description = productData.description;
        this.image = productData.image; //name of the image file
        this.updateImageData();
        if (productData._id) {
            this.id = productData._id.toString();
        }
    }

    static async findById(productId) {
        // console.log(productId);
        let prodId;
        try {
            prodId = new mongodb.ObjectId(productId);
        } catch (error) {
            error.code = 404;
            throw error;
        }
        // console.log(prodId);
        const product = await db.getDb().collection('products').findOne({ _id: prodId });
        if (!product) {
            const error = new Error('Could not find product with given id');
            error.code = 404;
            throw error;
        }
        // return product;
        return new Product(product);
    }

    static async findAll() {
        const products = await db.getDb().collection('products').find().toArray();
        return products.map(function (productDocument) { //maps array of products into Product class-like blueprint
            return new Product(productDocument);
        });
    }

    static async findMultiple(ids) {
        const productIds = ids.map(function (id) {
            return new mongodb.ObjectId(id);
        })

        const products = await db
            .getDb()
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray();

        return products.map(function (productDocument) {
            return new Product(productDocument);
        });
    }

    updateImageData() {
        this.imagePath = `product-data/images/${this.image}`; //path to the image file as it is stored on the server
        this.imageUrl = `/products/assets/images/${this.image}`; //url to the image file to be served
    }

    async save() {
        const productData = {
            title: this.title,
            summary: this.summary,
            price: this.price,
            description: this.description,
            image: this.image,
        };


        if (this.id) {
            const productId = new mongodb.ObjectId(this.id);

            if (!this.image) {
                delete productData.image; //deletes the image key-value pair from the productData object
                //if no new image is uploaded, do not update the image field in the database
                //this is because the image field is not required in the database
                //if the image field is not deleted, the image field in the database will be set to null
            }

            await db.getDb().collection('products').updateOne({ _id: productId }, { $set: productData });
        }
        else {
            await db.getDb().collection('products').insertOne(productData);
        }
    }

    async replaceImage(newImage) {
        this.image = newImage;
        this.updateImageData();
    }

    // async remove(){
    //     // db.getDb().collection('products').deleteOne({_id: new mongodb.ObjectId(this.id)});
    //     const productId = new mongodb.ObjectId(this.id);
    //     await db.getDb().collection('products').deleteOne({_id: productId});
    // }
    remove() {
        // db.getDb().collection('products').deleteOne({_id: new mongodb.ObjectId(this.id)});
        const productId = new mongodb.ObjectId(this.id);
        return db.getDb().collection('products').deleteOne({_id: productId });
    }
}

module.exports = Product;