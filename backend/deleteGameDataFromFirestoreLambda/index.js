const admin = require('firebase-admin');
const credentials = require('./5410ProjectKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    projectId: 'project-393914',
});

const firestoreDbObject = admin.firestore();

exports.handler = async (event) => {
    const gameId = event.gameId;

    try {
        await firestoreDbObject.collection('games').doc(gameId).delete();

        const response = {
            statusCode: 200,
            body: 'Game data deleted successfully',
        };
        return response;
    } catch (error) {
        console.error('Error deleting game data:', error);
        const errorResponse = {
            statusCode: 500,
            body: 'Error deleting game data',
        };
        return errorResponse;
    }
};
