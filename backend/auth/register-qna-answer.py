import boto3

def lambda_handler(event, context):
    try:
        dynamodb = boto3.resource('dynamodb')
        # DynamoDb table
        table_name = "sdp18-user-qna"
        table = dynamodb.Table(table_name)
        
        item = event['Item']
        print(item)
        # Add the item to the DynamoDB table
        table.put_item(Item=item)

        return {
            'statusCode': 200,
            'body': 'Data added successfully'
        }
    except Exception as e:
        print("Error adding data to DynamoDB:", str(e))
        return {
            'statusCode': 500,
            'body': 'Error adding data to DynamoDB'
        }
