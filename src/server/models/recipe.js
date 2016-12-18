//引入mongoose和Schema 创建食谱数据
import mongoose, { Schema } from 'mongoose';

//使用mongoose.model建立新的数据库,并将schema传入
//设计了分享食谱的一些基本元素,包括名称,描述,照片位置等
export default mongoose.model('Recipe',new Schema({
    id: String,
    name: String,
    description: String,
    imagePath: String,
    steps: Array,
    updateAt: Data,
}));