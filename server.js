require('dotenv').config()
const express = require('express')
const multer = require('multer')
const bcrypt = require('bcrypt')

const UploadModel = require('./models/Upload')
const connectDB = require('./config/connectDB')

const app = express()
const upload = multer({ dest: 'uploads' });

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/upload', upload.single('file'), async (req, res) => {
    const fileToSend = {
        path: req.file.path,
        originalName: req.file.originalname
    }
    if (req.body.password) {
        fileToSend.password = await bcrypt.hash(req.body.password, 10);
    }

    try {
        const result = await UploadModel.create(fileToSend);
        // res.json({"success": true, "data": result})
        res.render("home", {fileLink: `${req.headers.origin}/file/${result.id}`})
    } catch (error) {
        res.status(500).send('Server Error: ' + error.message);
    }
})
const handleDownload = async (req, res) => {
    const foundFile = await UploadModel.findById(req.params.id);
    if (!foundFile) return res.status(404).send('File Not Found');

    if (foundFile.password) {
        if (!req.body.password) {
            return res.render('password', {fileName: foundFile.originalName});
        }

        if (!(await bcrypt.compare(req.body.password, foundFile.password))) {
            return res.render('password', {error: true});
        }
    }
    
    foundFile.downloads++;
    await foundFile.save();

    res.download(foundFile.path, foundFile.originalName)
}

app.route('/file/:id').get(handleDownload).post(handleDownload);



const PORT = process.env.PORT;
const connectDBAndListen = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
    } catch (err) {
        console.log('Error connecting to Database and PORT')
    }
}

connectDBAndListen();