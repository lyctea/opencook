import Express from 'express';
//引入jsonwebtoken
import jwt from 'jsonwebtoken';
//引入User Recipe Model方便进行数据库操作
import User from '../models/user';
import Recipe from '../models/recipe';
import config from '../config';

//API Route
const app = new Express();
const apiRoutes = Express.Router();
//设定JSON Web Token的secret variable
app.set('superSecret',config.secret); //secret variable
//使用者登入API, 依据使用email和密码去验证, 做成功则返回一个认证token(时效24小时)
//方便前後端存取。這邊我們先不考慮太多資訊安全的議題
apiRoutes.post('/login',function (req, res) {
    //find the user
    User.findOne({
        email: req.body.email
    },(err, user) => {
        if(err) throw err;
        if(!user){
            res.json({success: false,message: 'Authentication failed.User not found.'});
        }else if(user){
            //check if password matches
            if(user.password != req.body.password){
                res.json({success:false,message: 'Authentication failed.Wrong password.'});
            }else{
                //if user is found and password is right
                //create a token
                const token = jwt.sign({email: user.email}, app.get('superSecret'),{
                    expiresIn: 60 * 60 * 24 //expires(期限) in 24 小时
                });
                //return the information including token as JSON
                //若登录成功则返回一会json信息
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token,
                    userId: user._id
                });
            }
        }
    })
});
//初始化api, 一开始数据库尚未建立任何使用者,在浏览器输入`http://localhost:3000/api/setup`,
//进行数据库初始化這個動作將新增一個使用者、一份食譜，若是成功新增將回傳一個 success 訊息
apiRoutes.get('/setup',(req, res) => {
    //create a sample user
    const sampleUser = new User({
        username: 'mark',
        email: 'mark@demo.com',
        password: '123456',
        admin: true
    });
    const sampleRecipe = new Recipe({
        id: '110ec58a-a0f2-4ac4-8393-c866d813b8d1',
        name: '番茄炒蛋',
        description: '番茄炒蛋，一道非常經典的家常菜料理。雖然看似普通，但每個家庭都有屬於自己家裡的不同味道',
        imagePath: 'https://c1.staticflickr.com/6/5011/5510599760_6668df5a8a_z.jpg',
        steps:['放入番茄', '打个鸡蛋', '放入少许盐巴', '用心快炒'],
        updatedAt: new Date()
    });
    sampleUser.save((err) => {
        if(err) throw err;
        sampleRecipe.save((err) => {
            if (err) throw err;
            console.log('User saved successfully');
            res.json({success: true});
        })
    });
});

//返回所有recipes
apiRoutes.get('./recipes',(req, res) => {
    Recipe.find({}, (err, recipes) => {
        res.status(200).json(recipes);
    })
});

//route middleware to verify a token
//接下来api讲进行控管,也就是必须在网址请求中夹带认证token才能完成请求
apiRoutes.use((req, res, next) => {
    //check header or url parameters or post parameters for token
    //确认标头,网址或者post参数是否含有token,因为便捷实用网址query参数
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    //decode token
    if (token){
        //verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'),(err, decoded) => {
            if (err){
                return res.json({success: false, message: 'Failed to authenticate token.'});
            }else {
                //if everything is good, save to request for use in other routers
                req.decode = decoded;
                next();
            }
        });
    }else{
        //if there is no token
        //return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });
    }
});

//确认认证是否成功
apiRoutes.get('/authenticate',(req, res) => {
    res.json({
        success: true,
        message: 'Enjoy your token!'
    });
});

//create recipe 新增食谱
apiRoutes.post('/recipes', (req, res) => {
    const newRecipe = new Recipe({
        name: req.body.name,
        description: req.body.description,
        imagePath: req.body.imagePath,
        steps: ['放入番茄','打个鸡蛋','放入少许盐巴','用心快炒'],
        updatedAt: new Date()
    });
    newRecipe.save((err) => {
        if (err) throw err;
        console.log('User saved successfuly');
        res.json({success: true});
    });
});

//update recipe 根据_id(mongodb的id)更新食谱
apiRoutes.put('/recipes/:id',(req, res) => {
    Recipe.update({_id: req.params.id},{
        name: req.body.name,
        description: req.body.description,
        imagePath: req.body.description,
        steps: ['放入番茄', '打個蛋', '放入少許鹽巴', '用心快炒'],
        updatedAt: new Date()
    }, (err) => {
        if (err) throw err;
        console.log('User updated successfully');
        res.json({success: true});
    });
});
//remove recipe 根据_id删除食谱,若成功返回信息
apiRoutes.delete('/recipes/:id',(req, res) => {
    Recipe.remove({_id: req.params.id }, (err, recipe) => {
        if(err) throw err;
        console.log('remove saved successfully');
        res.json({success: true});
    });
});
export default apiRoutes;


























