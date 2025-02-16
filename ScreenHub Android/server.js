const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const uploadMiddleware = require('./middlewares/uploadMiddleware');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.static('src'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use('/', express.static(__dirname));
app.use(cors());

const mongoUrl = 'mongodb://0.0.0.0:27017';
const dbName = 'sh-portal';
const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.sendFile("src/templates/index.html", { root: __dirname });
    // path.join(__dirname, 'src', 'templates/index.html')
});

app.post('/createFolder', async (req, res) => {
    const { folderName , folderColor } = req.body;
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
            folderColor: folderColor,
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
        const folderColors = folders.map(folder => folder.folderColor);

        res.json({ folders: folderNames, colors: folderColors });
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
        const color = folderDocument.folderColor;

        /*fs.readdir(folderPath, (err, contents) => {
            if (err) {
                res.status(500).json({ error: 'Error reading folder contents' });
                return;
            }
    
            res.json({ contents });
        });*/

        // Return the contents and delayTimes3
        res.json({ contents, delayTimes, color });
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

// app.post('/updateFolder', uploadMiddleware, async (req, res) => {
//     const { folderNameOptions, folderName, folderColor } = req.body;
//     console.log(req.body);
//     try {
//         await client.connect();
//         const db = client.db(dbName);
//         const collection = db.collection('folder');

//         // Find the document for the folder
//         const folderDocument = await collection.findOne({ foldername: folderName });
//         if (!folderDocument) {
//             res.status(404).json({ error: 'Folder not found' });
//             return;
//         }

//         // Update the document with the new content
//         const result = await collection.updateOne(
//             { foldername: folderNameOptions },
//             { $set: { folderColor: folderColor } }
//         );

//         console.log(result.modifiedCount);

//         if (result.insertedId) {
//             res.json({ success: true });
//         } else {
//             res.json({ success: false, message: 'Failed to update folder' });
//         }

//     } catch (error) {
//         console.error('Update folder error:', error);
//         res.status(500).json({ success: false, error: 'Internal Server Error' });
//     } finally {
//         client.close();
//     }
// });

app.post('/uploadFiles', uploadMiddleware, async (req, res) => {
    console.log(req.body);
    const uploadFolderName = req.body.uploadFolderName;
    const uploadedFiles = req.files;
    let duration = req.body.duration;
    if(duration == null) {
        duration = 0;
    }
    try {

        uploadedFiles.forEach((file) => {
            const filePath = `uploads/${uploadFolderName}/${file.filename}`;
            fs.rename(file.path, filePath, (err) => {
              if (err) {
                // Handle error appropriately and send an error response
                //return res.status(500).json({ error: 'Failed to store the file' });
              }
            });
        });
        
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
                filePath: path.join('uploads', uploadFolderName, file.filename),
                mTime: fs.statSync(path.join('uploads', uploadFolderName, file.filename)).mtime,
                delay: duration
            }))
        );

        console.log(updatedContent);

        // Update the document with the new content
        const result = await collection.updateOne(
            { foldername: uploadFolderName },
            { $set: { content: updatedContent } }
        );


        if (result.modifiedCount > 0) {
            res.json({ success: true, message: 'File upload successful!' });
        } else {
            res.status(400).json({ success: false, message: 'File upload failed!' });
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

app.get('/getFile', (req, res) => {
    const { filename, foldername } = req.query;

    // Construct the file path based on your file storage structure
    const filePath = path.join(__dirname, 'uploads', foldername, filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
        // Read the file content
        const fileContent = fs.readFileSync(filePath);

        // Determine the file's content type based on its extension or other criteria
        const contentType = 'application/octet-stream'; // You may need to adjust this

        // Send the file data as a JSON response
        res.json({ content: fileContent, contentType, fileName: filename });
    } else {
        // Handle the case where the file does not exist
        res.status(404).json({ error: 'File not found' });
    }
});

app.post('/downloadFile', (req, res) => {
    const { filename } = req.body;

    console.log(req.body);

    const filePath = path.join(__dirname, 'uploads', filename);

    console.log(filePath);

    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
    } else {
        // Handle the case where the file does not exist
        res.status(404).send('File not found');
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
            res.json({ success: false, message: 'Playlist creation failed!' });
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

app.post('/addMediaToPlaylist', uploadMiddleware, async (req, res) => {
    const { playlistName, selectedFile, folderName } = req.body;
    console.log(req.body);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('playlist');

        // Find the playlist document by name
        const playlistDocument = await collection.findOne({ playlistname: playlistName });
        if (!playlistDocument) {
            res.json({ success: false, message: 'Playlist not found' });
            return;
        }

        // const filePath = path.join(__dirname, 'uploads', folderName, selectedFile);
        
        const mediaItem = { filename: selectedFile, foldername: folderName };
        
        // Update the content array in the playlist document with the new media item
        playlistDocument.content.push(mediaItem);

        // Update the document with the new content
        const result = await collection.updateOne(
            { playlistname: playlistName },
            { $set: { content: playlistDocument.content } }
        );

        if (result.modifiedCount > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Failed to add media to playlist' });
        }
    } catch (error) {
        console.error('Error adding media to playlist:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.get('/getPlaylistContents', async (req, res) => {
    const playlistName = req.query.playlistName;
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('playlist');

        // Find the document for the folder using folderName
        const playlistDocument = await collection.findOne({ playlistname: playlistName });
        if (!playlistDocument) {
            res.status(404).json({ error: 'Playlist not found' });
            return;
        }

        // Extract the contents and delayTimes from the document
        const contents = playlistDocument.content;
        //const delayTimes = contents.map(content => content.delay);


        // Return the contents and delayTimes3
        res.json({ contents });
    } catch (error) {
        console.error('Error fetching folder contents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.post('/deleteMedia', uploadMiddleware, async (req, res) => {
    const { playlistname, filename } = req.body;
    console.log(req.body);
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('playlist');

        // Update the document to remove the content
        const result = await collection.updateOne(
            { playlistname: playlistname },
            { $pull: { content: { filename: filename } } }
        );

    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.post('/deletePlaylist', uploadMiddleware, async (req, res) => {
    const { playlistname } = req.body;
    try {
        // Remove playlist from MongoDB collection
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('playlist');
        await collection.deleteOne({ playlistname: playlistname });

        res.json({ success: true });
    } catch (error) {
        console.error('Delete folder error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    } finally {
        client.close();
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});