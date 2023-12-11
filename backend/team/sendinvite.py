import json
import boto3
from uuid import uuid4

def lambda_handler(event, context):
    body= event

    email = body['email']
    teamid = body['teamId'] 
    teamName = body['teamName']  
    invite_id = str(uuid4())
    
    def add_invite_to_dynamodb(invite_id, email, teamid):
        dynamodb = boto3.resource('dynamodb')
        table_name = 'sdp18-invite'  # Name of your DynamoDB table
        
        table = dynamodb.Table(table_name)
        invite_data = {
            'inviteId': invite_id,
            'email': email,
            'teamid': teamid,
            'status': 'Pending',
            'teamName': teamName
        }

        try:
            table.put_item(Item=invite_data)
            return {
                'statusCode': 200,
                'body': json.dumps('Data added in db')
            }
        except Exception as e:
           return {
                'statusCode': 500,
                'body': json.dumps(str(e))
            }

    return add_invite_to_dynamodb(invite_id, email, teamid)  
