import {Schema, model} from 'mongoose';

const userSchema = new Schema({
    name: {type: String, required: [true, 'Name is required']},
    age: {type: Number, required: [true, 'Age is required']},
    bio: {type: String, required: [true, 'Bio is required']},
    address: {type: String, required: [true, 'Address is required']},
    district: {type: String, required: [true, 'District is required']},
    city: {type: String, required: [true, 'City is required']},
    uf: {type: String, required: [true, 'UF is required']},
    profileImage: {type: String}
});

export default model('user', userSchema);