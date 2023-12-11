import json
import boto3

def lambda_handler(event, context):
    body= event
    inviteId = body['inviteId']
    db = boto3.resource('dynamodb')
    table = db.Table("sdp18-invite")
    
    try:
        # Get the item with the given invite_id
        response = table.get_item(Key={'inviteId': inviteId})
        item = response.get('Item')

        if item is not None and item['status'] == 'Pending':
            # Update the status to 'Declined'
            table.update_item(
                Key={'inviteId': inviteId},
                UpdateExpression='SET #statusAttr = :newStatus',
                ExpressionAttributeNames={'#statusAttr': 'status'},
                ExpressionAttributeValues={':newStatus': 'Declined'}
            )
            response_data = {
                'status': 'Status updated to "Declined"',
                'teamId': item['teamid']
            }

            return {
                'statusCode': 200,
                'body': response_data
            }
        else:
            return {
                'statusCode': 404,
                'body': json.dumps('Invite not found or already declined')
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps('Error updating status: ' + str(e))
        }
