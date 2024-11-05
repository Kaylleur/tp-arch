const AWS = require('aws-sdk');
const fs = require('fs');

// Configuration du client S3 pour MinIO
const s3 = new AWS.S3({
    endpoint: 'http://localhost:9000',
    accessKeyId: 'admin',
    secretAccessKey: 'password',
    s3ForcePathStyle: true, // Nécessaire pour MinIO
});

console.log('Configuration du client S3 pour MinIO terminée.');


// Nom du bucket
const bucketName = 'toto';

// Créer un bucket
s3.createBucket({Bucket: bucketName}, function (err, data) {
    if (err) {
        console.log('Erreur lors de la création du bucket:', err);
    } else {
        console.log('Bucket créé avec succès:', data.Location);
    }
    // Chemin du fichier à uploader
    const filePath = 'mon-fichier.txt';

    // Lire le fichier
    const fileContent = fs.readFileSync(filePath);

    // Uploader le fichier
    s3.putObject({
        Bucket: bucketName,
        Key: 'mon-fichier.txt',
        Body: fileContent,
    }, function (err, data) {
        if (err) {
            console.log('Erreur lors de l\'upload du fichier:', err);
        } else {
            console.log('Fichier uploadé avec succès:', data);
        }
    });
});