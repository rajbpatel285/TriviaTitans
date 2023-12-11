const admin = require('firebase-admin');
const credentials = require('./5410ProjectKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    projectId: 'project-393914',
});

const firestoreDbObject = admin.firestore();

exports.handler = async (event) => {
    const sqsMessage = event.Records[0].body;
    const updatedGameData = JSON.parse(sqsMessage);

    const { gameId, title, category, difficulty, "selected questions": selectedQuestions } = updatedGameData;

    const gamesCollection = firestoreDbObject.collection('games');

    const updatedData = {
        title,
        category,
        difficulty,
        "selected questions": selectedQuestions
    };

    return new Promise((resolve, reject) => {
        gamesCollection
            .doc(gameId)
            .update(updatedData)
            .then(() => {
                const response = {
                    statusCode: 200,
                    body: 'Game Data updated successfully',
                };
                resolve(response);
            })
            .catch((error) => {
                console.error('Error updating game data:', error);
                const errorResponse = {
                    statusCode: 500,
                    body: 'Error updating game data',
                };
                reject(errorResponse);
            });
    });
};
