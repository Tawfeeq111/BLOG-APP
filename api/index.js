const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const fs = require("fs");
const Post = require("./models/Post");
require('dotenv').config()

const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" })); // included {credentials: true, origin: "http://localhost:3000"} to avoid cros error that would arise when we use credentials in fetch
app.use(express.json());
app.use(cookieParser())
app.use("/uploads", express.static(__dirname + '/uploads'));


const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.DB);
    } catch (error) {
        console.log("Error connecting DB")
    }
}
connectToDB();

app.get("/profile", async (req, res) => {
    try {
        const { token } = req.cookies;
        const data = jwt.verify(token, process.env.JWT_SECRER, {});
        res.json(data);
    } catch (error) {
        res.status(400).json({ "error": error.message });
    }
})

app.post("/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, password: hashedPassword });
        res.json({ userInfo: { user } });
    } catch (error) {
        res.status(400).json({ "error": error.message });
    }
})

app.post("/login", async (req, res) => {
    try {

        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            res.status(500).json({ error: "User ont found :(" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(500).json({ error: "Incorrect Password :(" });
        }
        const token = jwt.sign({ _id: user._id, username: username }, process.env.JWT_SECRER, {});
        return res.status(300)
            .cookie('token', token)
            .json({ _id: user._id, username });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
})

app.post("/logout", (req, res) => {
    res.cookie('token', '').json({ message: "User logged-out :)" });
})

app.post("/post", upload.single('file'), async (req, res) => {
    try {
        console.log(req.file);
        const { path, originalname } = req.file;
        const { title, summary, content } = req.body;
        const arr = originalname.split(".");
        const ext = arr[arr.length - 1];
        const newPath = path + "." + ext;
        fs.renameSync(path, newPath);

        const { token } = req.cookies;
        const data = jwt.verify(token, process.env.JWT_SECRER, {});

        const post = new Post({
            title,
            summary,
            content,
            cover: newPath,
            author: data._id
        })
        const createdPost = await post.save();
        res.json(createdPost);
    } catch (error) {
        res.json({ "error": error.message });
    }
})

app.put("/post/:id", upload.single('file'), async (req, res) => {
    try {
        const { title, summary, content } = req.body;
        const { id } = req.params;
        let newPath = null;
        if (req.file) {
            const { path, originalname } = req.file;
            const arr = originalname.split(".");
            const ext = arr[arr.length - 1];
            newPath = path + "." + ext;
            fs.renameSync(path, newPath);
        }

        const { token } = req.cookies;
        const data = jwt.verify(token, process.env.JWT_SECRER, {});
        const post = await Post.findById(id);

        if(JSON.stringify(post.author._id) !== JSON.stringify(data._id)){
            res.status(400).json({ "error": "User is not logged-in" });
        }

        await post.updateOne({
            title,
            summary,
            content,
            cover: newPath === null ? post.cover : newPath,
            author: data._id
        })
        await post.save()
        res.json(post);
    } catch (error) {
        res.json({ "error": error.message });
    }
})

app.get("/posts", async (req, res) => {
    try {
        res.json(await Post.find().populate("author", ["username"]).sort({ createdAt: -1 }).limit(20));
    } catch (error) {
        res.json({ "error": error.message });
    }
})

app.get("/post/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id).populate("author", ["username"]);
        res.json(post);
    } catch (error) {
        res.json({ "error": error.message });
    }
})

app.get("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await Post.deleteOne({_id: id});
        req.json({"message": "Post deleted"});
    } catch (error) {   
        res.json({ "error": error.message });
    }
})

app.listen(4000, () => {
    console.log(`Listening at port 4000`);
})