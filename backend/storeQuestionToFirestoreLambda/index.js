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

    const { question } = questionData
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

    const questionId = Date.now().toString();
    const questionsCollection = firestoreDbObject.collection('questions');

    return new Promise((resolve, reject) => {
        questionsCollection
            .doc(questionId)
            .set(questionData)
            .then(() => {
                const response = {
                    statusCode: 200,
                    body: 'Question Added Successfully',
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
