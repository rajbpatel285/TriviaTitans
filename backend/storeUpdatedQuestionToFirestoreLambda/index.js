const admin = require('firebase-admin');
const credentials = require('./5410ProjectKey.json');
const { LanguageServiceClient } = require('@google-cloud/language');

const languageClient = new LanguageServiceClient({
    keyFilename: './5410ProjectKey.json'
});

admin.initializeApp({
    credential: admin.credential.cert(credentials),
    projectId: 'project-393914',
});

const firestoreDbObject = admin.firestore();

exports.handler = async (event) => {
    const sqsMessage = event.Records[0].body;
    const questionData = JSON.parse(sqsMessage);


    const { questionId, question, options, correct_option, difficulty, category } = questionData;
    const repeatedQuestion = question.repeat(3);

    const [classification] = await languageClient.classifyText({
        document: {
            content: repeatedQuestion,
            type: 'PLAIN_TEXT',
        },
    });

    const tags = classification.categories.flatMap((category) => {
        const categoryPath = category.name;
        const categoryNames = categoryPath.split('/').filter((name) => name !== '');
        return categoryNames;
    });

    questionData.tags = tags;

    const questionDocObj = firestoreDbObject.collection('questions').doc(questionId);

    const updatedData = {
        question,
        options,
        correct_option,
        difficulty,
        category,
        tags
    };

    const gamesCollectionObj = firestoreDbObject.collection('games');
    const gamesSnapshot = await gamesCollectionObj.get();

    const batchObj = firestoreDbObject.batch();

    gamesSnapshot.forEach((gameDoc) => {
        const selectedQuestions = gameDoc.data()['selected questions'];

        if (selectedQuestions && selectedQuestions[0][questionId]) {
            selectedQuestions[0][questionId] = updatedData;
            batchObj.update(gameDoc.ref, { 'selected questions': selectedQuestions });
        }
    });

    await batchObj.commit();

    return new Promise((resolve, reject) => {
        questionDocObj
            .update(updatedData)
            .then(() => {
                const response = {
                    statusCode: 200,
                    body: 'Question updated successfully',
                };
                resolve(response);
            })
            .catch((error) => {
                console.error('Error updating question:', error);
                const errorResponse = {
                    statusCode: 500,
                    body: 'Error updating question',
                };
                reject(errorResponse);
            });
    });
};
