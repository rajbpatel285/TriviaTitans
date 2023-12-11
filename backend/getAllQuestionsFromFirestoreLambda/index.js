const admin = require('firebase-admin');
const credentials = require('./5410ProjectKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    projectId: 'project-393914',
});

const firestoreDbObject = admin.firestore();

exports.handler = async (event) => {
    try {
        const questionsCollection = firestoreDbObject.collection('questions');
        const questionsSnapshotObj = await questionsCollection.get();

        const questions = questionsSnapshotObj.docs.map((doc) => {
            const question = doc.data();
            question.id = doc.id;
            return question;
        });

        return questions;
    } catch (error) {
        console.error('Error processing request:', error);
        throw new Error('Internal server error');
    }
};
