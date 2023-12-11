import json
import boto3

def lambda_handler(event, context):
    email = event['email'] 
   
    sns_client = boto3.client('sns')  
    topic_arn = 'arn:aws:sns:us-east-1:859931248652:sdp18-send-invite'

    response = sns_client.subscribe(
        TopicArn=topic_arn,
        Protocol='email',
        Endpoint=email,
        Attributes={
            'FilterPolicy': '{"email": ["' + email + '"]}'
        }
    )
    
    if response['ResponseMetadata']['HTTPStatusCode'] == 200:
        return {
            'statusCode': 200,
            'body': json.dumps('Subscription Created')
        }
    else:
        return {
            'statusCode': 500,
            'body': json.dumps('Subscription Creation Failed')
        }


