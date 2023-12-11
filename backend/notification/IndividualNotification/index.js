const { BigQuery } = require('@google-cloud/bigquery');
const AWS = require('aws-sdk');
const fs = require('fs');
const nodemailer = require("nodemailer");
const axios = require('axios');

const TOP_PLAYERS_THRESHOLD = 5;
const serviceAccountKey = JSON.parse(fs.readFileSync('serviceAccountKey.json'));

const bigquery = new BigQuery({
    projectId: serviceAccountKey.project_id,
    credentials: serviceAccountKey,
});

exports.handler = async (event, context) => {
    try {
        // Fetch the top 5 players from BigQuery
        const query = `
      SELECT
        JSON_VALUE(data, '$.email') AS email,
        SUM(CAST(JSON_EXTRACT(quiz, '$.quizscore') AS INT64)) AS total_score,
        ARRAY_AGG(STRUCT(JSON_EXTRACT(quiz, '$.quiztype') AS quiztype, JSON_EXTRACT(quiz, '$.quizscore') AS quiz_score)) AS quiz_details
      FROM
        \`serverless-project-392501.firestore_users.users_raw_latest\`,
        UNNEST(JSON_EXTRACT_ARRAY(data, '$.quizzes')) AS quiz
      GROUP BY email
      ORDER BY total_score DESC
      LIMIT ${TOP_PLAYERS_THRESHOLD}
    `;

        const options = {
            query,
            location: 'US',
        };

        const [rows] = await bigquery.query(options);

        //for each player fetched send notification to player's email
        //with current total score
        if (rows.length > 0) {
            for (const player of rows) {
                const postData = {
                    emails: [player.email],
                    subject: "Achievement! You are on the leaderboard",
                    message: `Congratulation! You are in the top ${TOP_PLAYERS_THRESHOLD} players with a score of ${player.total_score}`
                };
                try {
                    // POST request using axios
                    await axios.post('https://354her5e8e.execute-api.us-east-1.amazonaws.com/prod/send-notification', postData);
                } catch (error) {
                    console.error(error);
                    return {
                        statusCode: 500,
                        body: JSON.stringify({ error: 'Failed to send player notifications' }),
                    };
                }
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Player notifications sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending player notifications:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send player notifications' }),
        };
    }
};
