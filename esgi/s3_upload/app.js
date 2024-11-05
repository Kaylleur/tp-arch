const express = require('express');
const AWS = require('aws-sdk');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' });

// Configuration du client S3 pour MinIO
const s3 = new AWS.S3({
    endpoint: 'http://localhost:9000',
    accessKeyId: 'admin',
    secretAccessKey: 'password',
    s3ForcePathStyle: true, // Nécessaire pour MinIO
});

// Nom du bucket
const bucketName = 'mon-bucket-exemple';

// Vérifier si le bucket existe, sinon le créer
s3.headBucket({ Bucket: bucketName }, function (err, data) {
    if (err && err.code === 'NotFound') {
        s3.createBucket({ Bucket: bucketName }, function (err, data) {
            if (err) {
                console.log('Erreur lors de la création du bucket:', err);
            } else {
                console.log('Bucket créé avec succès:', data.Location);
            }
        });
    } else if (err) {
        console.log('Erreur lors de l\'accès au bucket:', err);
    } else {
        console.log('Le bucket existe déjà.');
    }
});

// Servir le fichier HTML statique
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint pour gérer l'upload du fichier
app.post('/upload', upload.single('file'), (req, res) => {
    const fileContent = fs.readFileSync(req.file.path);

    // Paramètres pour l'upload vers S3
    const params = {
        Bucket: bucketName,
        Key: req.file.originalname,
        Body: fileContent,
    };

    // Uploader le fichier sur S3
    s3.putObject(params, function (err, data) {
        // Supprimer le fichier temporaire
        fs.unlinkSync(req.file.path);

        if (err) {
            console.log('Erreur lors de l\'upload du fichier:', err);
            res.status(500).send('Erreur lors de l\'upload du fichier');
        } else {
            console.log('Fichier uploadé avec succès:', data);
            res.send('Fichier uploadé avec succès');
        }
    });
});

// Nouveau endpoint pour télécharger un fichier depuis S3
// /download/:fileName
app.get('/download/:fileName', (req, res) => {
    const fileName = req.params.fileName;

    const params = {
        Bucket: bucketName,
        Key: fileName,
    };

    s3.getObject(params, (err, data) => {
        if (err) {
            console.log('Erreur lors du téléchargement du fichier:', err);
            res.status(500).send('Erreur lors du téléchargement du fichier');
        } else {
            // Option 1: Envoyer le contenu du fichier directement
            // res.send(data.Body.toString());

            // Option 2: Télécharger le fichier en tant que pièce jointe
            res.setHeader('Content-Disposition', 'attachment; filename=' + fileName);
            res.send(data.Body);
        }
    });
});

// Démarrer le serveur
app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});
