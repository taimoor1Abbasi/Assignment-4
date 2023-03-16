/*********************************************************************************
*  WEB322 – Assignment 04
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party web sites) or distributed to other students.
* 
*  Name: Taimoor Abbasi Student ID: 157265216 Date: 2023-03-15
*
*  Cyclic Web App URL: https://ill-puce-mackerel-veil.cyclic.app/about
*
*  GitHub Repository URL: https://github.com/taimoor1Abbasi/web322.app
*
********************************************************************************/ 
const express = require('express');
const blogData = require("./blog-service");
const multer = require("multer");
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const exphbs = require("express-handlebars");
const path = require("path");
const stripJs = require('strip-js');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
cloudinary.config({
    cloud_name: 'dlxaiazfi',
    api_key: '261461771716615',
    api_secret: 'Zi0PtccMGW6pL2RCte0KbJ5ew2o',
    secure: true
});
const upload = multer();
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="active" ' : '') + 
                '><a href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function (lvalue, rvalue, options) {
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        },
        safeHTML: function(context){
            return stripJs(context);
        }
    }
}));
app.set('view engine', '.hbs');
app.use(express.static('public'));
app.use(function(req,res,next){
    let route = req.path.substring(1);
    app.locals.activeRoute = (route == "/") ? "/" : "/" + route.replace(/\/(.*)/, "");
    app.locals.viewingCategory = req.query.category;
    next();
});
app.get('/', (req, res) => {
    res.redirect("/blog");
});
app.get('/about', (req, res) => {
    res.render("about");
});
app.get('/blog', async (req, res) => {
    let viewData = {};
    try{
        let posts = [];
        if(req.query.category){
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            posts = await blogData.getPublishedPosts();
        }
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
        let post = posts[0]; 
        viewData.posts = posts;
        viewData.post = post;
    }catch(err){
        viewData.message = "no results";
    }
    try{
        let categories = await blogData.getCategories();
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }
    res.render("blog", {data: viewData})
});
app.get('/posts', (req, res) => {
    let queryPromise = null;
    if (req.query.category) {
        queryPromise = blogData.getPostsByCategory(req.query.category);
    } else if (req.query.minDate) {
        queryPromise = blogData.getPostsByMinDate(req.query.minDate);
    } else {
        queryPromise = blogData.getAllPosts()
    }
    queryPromise.then(data => {
        res.render("posts", {posts: data});
    }).catch(err => {
        res.render("posts", {message: "no results"});
    })

});
app.post("/posts/add", upload.single("featureImage"), (req,res)=>{
    if(req.file){
        let streamUpload = (req) => {
            return new Promise((resolve, reject) => {
                let stream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            resolve(result);
                        } else {
                            reject(error);
                        }
                    }
                );
                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };
        async function upload(req) {
            let result = await streamUpload(req);
            console.log(result);
            return result;
        }
        upload(req).then((uploaded)=>{
            processPost(uploaded.url);
        });
    }else{
        processPost("");
    }
    function processPost(imageUrl){
        req.body.featureImage = imageUrl;

        blogData.addPost(req.body).then(post=>{
            res.redirect("/posts");
        }).catch(err=>{
            res.status(500).send(err);
        })
    }   
});
app.get('/posts/add', (req, res) => {
    res.render("addPost");
});
app.get('/post/:id', (req,res)=>{
    blogData.getPostById(req.params.id).then(data=>{
        res.json(data);
    }).catch(err=>{
        res.json({message: err});
    });
});
app.get('/blog/:id', async (req, res) => {
    let viewData = {};
    try{
        let posts = [];
        if(req.query.category){
            posts = await blogData.getPublishedPostsByCategory(req.query.category);
        }else{
            posts = await blogData.getPublishedPosts();
        }
        posts.sort((a,b) => new Date(b.postDate) - new Date(a.postDate));
        viewData.posts = posts;
    }catch(err){
        viewData.message = "no results";
    }
    try{
        viewData.post = await blogData.getPostById(req.params.id);
    }catch(err){
        viewData.message = "no results"; 
    }
    try{
        let categories = await blogData.getCategories();
        viewData.categories = categories;
    }catch(err){
        viewData.categoriesMessage = "no results"
    }
    res.render("blog", {data: viewData})
});
app.get('/categories', (req, res) => {
    blogData.getCategories().then((data => {
        res.render("categories", {categories: data});
    })).catch(err => {
        res.render("categories", {message: "no results"});
    });
});
app.use((req, res) => {
    res.status(404).render("404");
})
blogData.initialize().then(() => {
    app.listen(HTTP_PORT, () => {
        console.log('server listening on: ' + HTTP_PORT);
    });
}).catch((err) => {
    console.log(err);
})
