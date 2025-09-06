import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.TABLE_NAME;

export const handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    if (event.httpMethod === "POST") {
      const body = JSON.parse(event.body);
      if (!body.id || !body.task) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: "id and task required" }),
        };
      }
      await dynamo.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: { id: body.id, task: body.task },
        })
      );
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Task added" }),
      };
    } else if (event.httpMethod === "GET") {
      const result = await dynamo.send(
        new ScanCommand({ TableName: TABLE_NAME })
      );
      return { statusCode: 200, headers, body: JSON.stringify(result.Items) };
    } else {
      return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
