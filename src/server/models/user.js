//引入mongoose和Schema 创建用户数据模型
import mongoose, { Schema } from 'mongoose';

export default mongoose.model('User',new Schema({
    id: Number,
    username: String,
    email: String,
    password: String,
    admin: Boolean
}));