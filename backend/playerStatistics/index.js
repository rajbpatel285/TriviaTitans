const admin = require("firebase-admin");

//fetch the service Account Key to connect to the firestore database
var serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'serverless-project-392501',
});

exports.handler = async (event) => {
    try {
        if (!event.email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'email is required' }),
            };
        }

        const db = admin.firestore();
        const docRef = db.collection('users').doc(event.email);
        const docSnapshot = await docRef.get();

        //if no user is found with the provided email address, throw error
        if (!docSnapshot.exists) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'User not found' }),
            };
        } else {
            let totalScore = 0;
            let totalQuestions = 0;
            const quizzes = docSnapshot.data().quizzes;
            const totalGamesPlayed = quizzes.length;

            //for each quiz played by the user, add the score and questions for each quiz
            //Code reference - https://www.geeksforgeeks.org/node-js-foreach-function/
            quizzes.forEach((quiz) => {
                if (quiz.quizscore && typeof quiz.quizscore === 'number'
                    && quiz.noOfQuestions && typeof quiz.noOfQuestions === 'number') {
                    totalScore += quiz.quizscore;
                    totalQuestions += quiz.noOfQuestions;
                }
            });

            const accuracy = totalScore / totalQuestions;
            const roundedAccuracy = accuracy.toFixed(2);       //round the accuracy upto 2 decimal places

            return {
                statusCode: 200,
                body: JSON.stringify(
                    {
                        totalScore: `${totalScore}`,
                        accuracy: `${roundedAccuracy}`,
                        totalGamesPlayed: `${totalGamesPlayed}`
                    }
                ),
            };

        }
    } catch (error) {
        console.error('Error fetching total score:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};