const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uploadMiddleware = require('./middlewares/uploadMiddleware');

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/', express.static(__dirname));

const mongoUrl = 'mongodb://0.0.0.0:27017';
const dbName = 'local-ds';
const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/createFolder', async (req, res) => {
    const { folderName } = req.body;
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('folder');

        // Check if folder with the same name already exists
        const existingFolder = await collection.findOne({ foldername: folderName });
        if (existingFolder) {
            res.json({ success: false, message: 'Folder already exists' });
            return;
        }

        // Create a new folder directory on the server
        const folderPath = path.join(__dirname, 'uploads', folderName);
        fs.mkdirSync(folderPath);

        // Insert a new document for the folder
        const result = await collection.insertOne({
            foldername: folderName,
            folderPath: folderPath,
            content: []
        });

        if (result.insertedId) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Folder creation failed!' });
        }

    } catch (error) {
        console.error('Create folder error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.get('/getFolders', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('folder');

        // Find all documents in the collection
        const folders = await collection.find().toArray();
        const folderNames = folders.map(folder => folder.foldername);

        res.json({ folders: folderNames });
    } catch (error) {
        console.error('Fetch folders error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.get('/getFolderContents', async (req, res) => {
    const folderName = req.query.folderName;
    const folderPath = path.join(__dirname, 'uploads', folderName);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('folder');

        // Find the document for the folder using folderName
        const folderDocument = await collection.findOne({ foldername: folderName });
        if (!folderDocument) {
            res.status(404).json({ error: 'Folder not found' });
            return;
        }

        // Extract the contents and delayTimes from the document
        const contents = folderDocument.content;
        const delayTimes = contents.map(content => content.delay);

        /*fs.readdir(folderPath, (err, contents) => {
            if (err) {
                res.status(500).json({ error: 'Error reading folder contents' });
                return;
            }
    
            res.json({ contents });
        });*/

        // Return the contents and delayTimes3
        res.json({ contents, delayTimes });
    } catch (error) {
        console.error('Error fetching folder contents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.get('/getUploadsBaseFiles', (req, res) => {
    const uploadsDir = path.join(__dirname, 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            res.status(500).json({ error: 'Error reading files not in folder' });
            return;
        }

        const filesNotInFolder = files.filter(file => {
            // Filter out files that are in subdirectories
            return !fs.statSync(path.join(uploadsDir, file)).isDirectory();
        });

        res.json({ filesNotInFolder });
    });
});

app.post('/uploadFiles', uploadMiddleware, async (req, res) => {
    //console.log(req.body);
    const uploadFolderName = req.body.uploadFolderName;
    const uploadedFiles = req.files;
    try {
        // Open the MongoDB connection
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('folder');

        // Find the document for the folder
        const folderDocument = await collection.findOne({ foldername: uploadFolderName });
        if (!folderDocument) {
            //res.status(500).json({ error: 'Folder not found' });
            return;
        }

        // Update the content array in MongoDB document
        const updatedContent = folderDocument.content.concat(
            uploadedFiles.map((file) => ({
                fileName: file.originalname,
            }))
        );

        uploadedFiles.forEach((file) => {
            const filePath = `uploads/${uploadFolderName}/${file.filename}`;
            fs.rename(file.path, filePath, (err) => {
              if (err) {
                // Handle error appropriately and send an error response
                //return res.status(500).json({ error: 'Failed to store the file' });
              }
            });
        });

        // Update the document with the new content
        const result = await collection.updateOne(
            { foldername: uploadFolderName },
            { $set: { content: updatedContent } }
        );

        if (result.modifiedCount > 0) {
            res.redirect("/");
        } else {
            //res.json({ success: false, message: 'File upload failed!' });
        }

    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.post('/deleteFile', uploadMiddleware, async (req, res) => {
    const { foldername, filename } = req.body;
    const filePath = path.join(__dirname, 'uploads', foldername, filename);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('folder');

        // Update the document to remove the content
        const result = await collection.updateOne(
            { foldername: foldername },
            { $pull: { content: { fileName: filename } } }
        );

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, error: 'Error deleting file' });
            }
        });

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.post('/deleteFolder', uploadMiddleware, async (req, res) => {
    console.log(req.body);
    const { foldername } = req.body;
    const folderPath = path.join(__dirname, 'uploads', foldername);

    try {
        // Delete files within the folder
        fs.readdirSync(folderPath).forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.unlinkSync(filePath);
        });

        // Delete the folder itself
        fs.rmdirSync(folderPath);

        // Remove folder from MongoDB collection
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('folder');
        await collection.deleteOne({ foldername: foldername });

        res.json({ success: true });
    } catch (error) {
        console.error('Delete folder error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});


// Playlist Server Endpoints

app.post('/createPlaylist', async (req, res) => {
    const { playlistName } = req.body;
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('playlist');

        // Check if folder with the same name already exists
        const existingFolder = await collection.findOne({ playlistname: playlistName });
        if (existingFolder) {
            res.json({ success: false, message: 'Folder already exists' });
            return;
        }

        // Insert a new document for the folder
        const result = await collection.insertOne({
            playlistname: playlistName,
            content: []
        });

        if (result.insertedId) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Folder creation failed!' });
        }

    } catch (error) {
        console.error('Create folder error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.get('/getPlaylists', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('playlist');

        // Find all documents in the collection
        const playlists = await collection.find().toArray();
        const playlistNames = playlists.map(playlist => playlist.playlistname);

        res.json({ playlists: playlistNames });
    } catch (error) {
        console.error('Fetch folders error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.get('/getFolderContents', async (req, res) => {
    const playlistName = req.query.playlistName;
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('folder');

        // Find the document for the folder using folderName
        const playlistDocument = await collection.findOne({ playlistname: playlistName });
        if (!playlistDocument) {
            res.status(404).json({ error: 'Folder not found' });
            return;
        }

        // Extract the contents and delayTimes from the document
        const contents = playlistDocument.content;
        const delayTimes = contents.map(content => content.delay);


        // Return the contents and delayTimes3
        res.json({ contents, delayTimes });
    } catch (error) {
        console.error('Error fetching folder contents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});