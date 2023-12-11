const admin = require('firebase-admin');
const credentials = require('./5410ProjectKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    projectId: 'project-393914',
});

const firestoreDbObject = admin.firestore();

exports.handler = async (event) => {
    try {
        const gamesCollection = firestoreDbObject.collection('games');
        const gamesSnapshotObj = await gamesCollection.get();

        const games = gamesSnapshotObj.docs.map((doc) => {
            const game = doc.data();
            game.id = doc.id;
            return game;
        });

        return games;
    } catch (error) {
        console.error('Error processing request:', error);
        throw new Error('Internal server error');
    }
};
