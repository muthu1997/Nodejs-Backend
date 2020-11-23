import mongoose, { Schema } from 'mongoose';

const adminTable = new Schema({
    name: {
        type: String
    },
    password: {
        type: String
    },
    emailid: {
        type: String
    },
    address: {
        type: String
    },
    usertype: {
        type: String
    }
},{
    timestamps: true
});

adminTable.methods = {
    view(full) {
        const view = {
            id: this.id,
            name: this.name,
            password: this.password,
            emailid: this.emailid,
            address: this.address,
            usertype: this.usertype
        }
        return view;
    }
}

const model = mongoose.model('Admin', adminTable)

export default model;