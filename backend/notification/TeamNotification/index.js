const { BigQuery } = require('@google-cloud/bigquery');
const AWS = require('aws-sdk');
const fs = require('fs');
const nodemailer = require("nodemailer");
const axios = require('axios');

const TOP_TEAMS_THRESHOLD = 3;
const serviceAccountKey = JSON.parse(fs.readFileSync('serviceAccountKey.json'));

const bigquery = new BigQuery({
    projectId: serviceAccountKey.project_id,
    credentials: serviceAccountKey,
});

exports.handler = async (event, context) => {
    try {
        // Fetch the top 5 players from BigQuery
        const query = `
            WITH top_teams AS (
            SELECT
            JSON_VALUE(data, '$.teamid') AS teamid,
            STRING_AGG(DISTINCT JSON_VALUE(data, '$.email'), ', ') AS team_members,
            SUM(CAST(JSON_VALUE(quiz, '$.quizscore') AS INT64)) AS team_score
            FROM
            \`serverless-project-392501.firestore_users.users_raw_latest\`,
            UNNEST(JSON_EXTRACT_ARRAY(data, '$.quizzes')) AS quiz
            WHERE
            JSON_VALUE(data, '$.teamid') IS NOT NULL
            GROUP BY
            teamid
            ORDER BY
            team_score DESC
            LIMIT
            ${TOP_TEAMS_THRESHOLD}
            )
            SELECT
            teamid,
            team_members,
            team_score
            FROM
            top_teams
        `;

        const options = {
            query,
            location: 'US',
        };

        const [rows] = await bigquery.query(options);
        console.log(rows);
        //for each player , get the player email and send an email notification 
        //with player's total score 
        if (rows.length > 0) {
            for (const team of rows) {
                const teamMembersEmails = team.team_members.split(', ');

                for (const memberEmail of teamMembersEmails) {
                    const postData = {
                        emails: [memberEmail],
                        subject: "Achievement! Your team is on the leaderboard",
                        message: `Congratulation! Your team ${team.teamid} is in the top ${TOP_TEAMS_THRESHOLD} teams with a score of ${team.team_score}`
                    }
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
