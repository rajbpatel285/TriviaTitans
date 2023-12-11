const admin = require("firebase-admin");

//Fetch the service Account key to connect to the firebase database
var serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'serverless-project-392501',
});

exports.handler = async (event) => {
    try {
        const data = JSON.parse(event.body);

        if (!data.email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'email is required' }),
            };
        }

        const db = admin.firestore();
        const docRef = db.collection('users').doc(data.email);
        const docSnapshot = await docRef.get();

        if (docSnapshot.exists) {
            // The document already exists, so update it
            //Code reference - https://cloud.google.com/firestore/docs/manage-data/add-data#web-version-8_12
            await docRef.update({
                quizzes: admin.firestore.FieldValue.arrayUnion(data.quizzes[0])
            });
        } else {
            // The document does not exist, create a new one
            await docRef.set(data);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Document inserted/updated successfully' }),
        };
    } catch (error) {
        console.error('Error updating document:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Something went wrong' }),
        };
    }
};