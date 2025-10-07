import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB_NAME || 'password_manager';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
    if (!client) {
        client = new MongoClient(uri, {
            // Optimize connection for better performance
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close connections after 45 seconds of inactivity
            connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
        });
        await client.connect();
        db = client.db(dbName);
    }
    return { client, db };
}

export async function getUsersCollection() {
    const { db } = await connectToDatabase();
    return db.collection(process.env.MONGODB_USERS_COLLECTION || 'users');
}