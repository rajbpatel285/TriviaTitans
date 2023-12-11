const admin = require('firebase-admin');
const credentials = require('./5410ProjectKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    projectId: 'project-393914',
});

const firestoreDbObject = admin.firestore();

exports.handler = async (event) => {

    const sqsMessage = event.Records[0].body;
    const gameData = JSON.parse(sqsMessage);

    const gameId = Date.now().toString();
    const gamesCollection = firestoreDbObject.collection('games');

    return new Promise((resolve, reject) => {
        gamesCollection
            .doc(gameId)
            .set(gameData)
            .then(() => {
                const response = {
                    statusCode: 200,
                    body: 'Game Data Added Successfully',
                };
                resolve(response);
            })
            .catch((error) => {
                console.error('Error processing request:', error);
                const errorResponse = {
                    statusCode: 500,
                    body: 'Error processing request',
                };
                reject(errorResponse);
            });
    });
};
