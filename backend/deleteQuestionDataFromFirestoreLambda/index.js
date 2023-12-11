const admin = require('firebase-admin');
const credentials = require('./5410ProjectKey.json');

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    projectId: 'project-393914',
});

const firestoreDbObject = admin.firestore();

exports.handler = async (event) => {
    const questionId = event.questionId;
    console.log("Question Id: ", questionId)

    try {
        await firestoreDbObject.collection('questions').doc(questionId).delete();

        const gamesCollectionObj = firestoreDbObject.collection('games');
        const gamesSnapshot = await gamesCollectionObj.get();

        const batch = firestoreDbObject.batch();
        const gamesToDelete = [];

        gamesSnapshot.forEach((gameDoc) => {
            const selectedQuestions = gameDoc.data()['selected questions'];

            if (selectedQuestions && selectedQuestions[0][questionId]) {
                delete selectedQuestions[0][questionId];
                batch.update(gameDoc.ref, { 'selected questions': selectedQuestions });

                if (!selectedQuestions[0] || Object.keys(selectedQuestions[0]).length < 5) {
                    gamesToDelete.push(gameDoc.ref);
                }
            }
        });

        await batch.commit();

        if (gamesToDelete.length > 0) {
            const deleteBatch = firestoreDbObject.batch();
            gamesToDelete.forEach((gameRef) => {
                deleteBatch.delete(gameRef);
            });
            await deleteBatch.commit();
        }

        const response = {
            statusCode: 200,
            body: 'Question deleted successfully',
        };
        return response;
    } catch (error) {
        console.error('Error deleting question:', error);
        const errorResponse = {
            statusCode: 500,
            body: 'Error deleting question',
        };
        return errorResponse;
    }
};
