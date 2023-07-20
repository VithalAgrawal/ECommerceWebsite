const db = require('../data/database');
const mongodb = require('mongodb'); 

const bcrypt = require('bcryptjs');

class User{
    constructor(email, password, fullname, street, postal, city){
        this.email = email;
        this.password = password;
        this.name = fullname;
        this.address = {
            street: street,
            postalCode: postal,
            city: city
        };
    }

    static findById(userId){
        const uid = new mongodb.ObjectId(userId);
        return db.getDb().collection('users').findOne({_id: uid}, {projection: {password: 0}}); //fetch everything except password
    }

    getUserWithSameEmail(){
        return db.getDb().collection('users').findOne({email: this.email});
    }

    async existsAlready(){
        const existingUser = await this.getUserWithSameEmail();
        if(existingUser){
            return true;
        }
        return false;
    }

    hasSamePassword(hashedPassword){
        return bcrypt.compare(this.password, hashedPassword);
    }

    async signup(){
        const hashedPassword = await bcrypt.hash(this.password, 12)
        await db.getDb().collection('users').insertOne({
            email: this.email,
            password: hashedPassword,
            name: this.name,
            address: this.address
        });
    }

}

module.exports = User;