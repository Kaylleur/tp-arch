const AWS = require('aws-sdk');
const fs = require('fs');

// Configuration du client S3 pour MinIO
const s3 = new AWS.S3({
    endpoint: 'http://localhost:9000',
    accessKeyId: 'admin',
    secretAccessKey: 'password',
    s3ForcePathStyle: true, // Nécessaire pour MinIO
});

// Nom du bucket
const bucketName = 'mon-bucket-exemple';

// Créer un bucket
s3.createBucket({ Bucket: bucketName }, function (err, data) {
    if (err) {
        console.log('Erreur lors de la création du bucket:', err);
    } else {
        console.log('Bucket créé avec succès:', data.Location);

        // Chemin du fichier à uploader
        const filePath = 'mon-fichier.txt';

        // Vérifier si le fichier existe
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, 'Ceci est un fichier exemple.');
        }

        // Lire le fichier
        const fileContent = fs.readFileSync(filePath);

        // Paramètres pour l'upload
        const params = {
            Bucket: bucketName,
            Key: 'mon-fichier.txt',
            Body: fileContent,
        };

        // Uploader le fichier
        s3.putObject(params, function (err, data) {
            if (err) {
                console.log('Erreur lors de l\'upload du fichier:', err);
            } else {
                console.log('Fichier uploadé avec succès:', data);

                // Télécharger le fichier
                s3.getObject({ Bucket: bucketName, Key: 'mon-fichier.txt' }, function (err, data) {
                    if (err) {
                        console.log('Erreur lors du téléchargement du fichier:', err);
                    } else {
                        console.log('Fichier téléchargé avec succès:');
                        console.log(data.Body.toString());
                    }
                });
            }
        });
    }
});
