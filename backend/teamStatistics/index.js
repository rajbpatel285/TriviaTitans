const admin = require("firebase-admin");

//fetch the service Account Key to connect to the firestore database
var serviceAccount = require("serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'serverless-project-392501',
});

exports.handler = async (event) => {
    try {
        if (!event.teamId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Team ID is required' }),
            };
        }

        const db = admin.firestore();
        //Code reference - https://firebase.google.com/docs/firestore/query-data/queries
        const teamPlayers = await db.collection('users').where('teamid', '==', event.teamId).get();

        //if no players are fetched belonging to the team, return error
        if (!teamPlayers) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Team not found' }),
            };
        }

        let teamTotal = 0;
        let teamTotalQuestions = 0;
        let teamTotalGamesPlayed = 0;
        let uniqueQuizIds = new Set();
        //For every player belonging to the team, iterate over all the quizzes played by a player 
        //and sum the score , questions played in each of the quiz. Add quiz id to 'SET' to ensure 
        //if two players of a team played the same quiz,  it is considered as one team game.
        // Code reference - https://www.geeksforgeeks.org/node-js-foreach-function/
        teamPlayers.forEach((teamPlayer) => {
            const quizzes = teamPlayer.data().quizzes;
            let playerTotal = 0;
            let playerTotalQuestions = 0;
            quizzes.forEach((quiz) => {
                if (quiz.quizscore && typeof quiz.quizscore === 'number'
                    && quiz.noOfQuestions && typeof quiz.noOfQuestions === 'number'
                    && quiz.quizid && typeof quiz.quizid === 'number') {
                    playerTotal += quiz.quizscore;
                    playerTotalQuestions += quiz.noOfQuestions;
                    uniqueQuizIds.add(quiz.quizid);
                }
            });
            teamTotal += playerTotal;
            teamTotalQuestions += playerTotalQuestions;
        });

        teamTotalGamesPlayed += uniqueQuizIds.size;
        const accuracy = teamTotal / teamTotalQuestions;
        const roundedAccuracy = accuracy.toFixed(2);       //round the accuracy upto 2 decimal places

        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    Team_Total: `${teamTotal}`,
                    Team_Accuracy: `${roundedAccuracy}`,
                    Team_Total_Games_Played: `${teamTotalGamesPlayed}`
                }
            ),
        };
    } catch (error) {
        console.error('Error fetching total score:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};