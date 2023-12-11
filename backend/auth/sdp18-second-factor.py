import json
import boto3

def lambda_handler(event, context):
    # Connect to DynamoDB using boto3
    dynamodb = boto3.resource('dynamodb')
    # DynamoDB table
    table = dynamodb.Table('sdp18-user-qna')  

    request_body = event
    task = request_body['task']
    
    if task == 'verify':
        # Get user answers from request body
        print(request_body)
        uid = request_body['uid']
        a1 = request_body['a1']
        a2 = request_body['a2']
        a3 = request_body['a3']
    
        try:
            response = table.get_item(
                Key={
                    'uid': uid
                },
                ProjectionExpression="uid, a1, a2, a3"
            )
    
            item = response.get('Item')
    
            if item:
                # Compare answers
                stored_a1 = item.get('a1')
                stored_a2 = item.get('a2')
                stored_a3 = item.get('a3')
    
                if (
                    stored_a1 == a1 and
                    stored_a2 == a2 and
                    stored_a3 == a3
                ):# Answers match
                    return {
                        'statusCode': 200,
                        'body': json.dumps({'message': 'match!'})
                    }
                else:# Answers don't match
                    return {
                        'statusCode': 400,
                        'body': json.dumps({'message': 'do not match!'})
                    }
    # Handle Exception
        except Exception as e:
            print(e)
            return {
                'statusCode': 500,
                'body': json.dumps({'message': 'Internal server error'})
            }
    else:
       # Get uid from request body
        try:
            uid = request_body['uid']
            response = table.get_item(Key={'uid': uid})
            
            # Check if the item was found
            if 'Item' in response:
                item = response['Item']
                return {
                    'statusCode': 200,
                    'body': item
                }
            else:# User not found
                return {
                    'statusCode': 404,
                    'body': 'User not found'
                }
                # Handle Exception
        except Exception as e:
            print("Error retrieving data from DynamoDB:", str(e))
            return {
                'statusCode': 500,
                'body': 'Error retrieving data from DynamoDB'
            }
