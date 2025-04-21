import { MongoClient, ServerApiVersion } from "mongodb"

// Check if MongoDB URI is defined
const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/therapymatch"
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Function to create a client with error handling
const createClient = () => {
  try {
    if (!uri || uri.trim() === "") {
      throw new Error("MONGODB_URI is not defined")
    }

    const newClient = new MongoClient(uri, options)
    return newClient.connect()
  } catch (error) {
    console.error("Failed to create MongoDB client:", error)
    // Return a promise that rejects with the error
    return Promise.reject(error)
  }
}

// In development mode, use a global variable so that the value
// is preserved across module reloads caused by HMR (Hot Module Replacement).
const globalWithMongo = global as typeof global & {
  _mongoClientPromise?: Promise<MongoClient>
}

if (!globalWithMongo._mongoClientPromise) {
  client = new MongoClient(uri, options)
  globalWithMongo._mongoClientPromise = createClient().catch((err) => {
    console.error("MongoDB connection error:", err)
    // Return a mock client that will be handled by our error-tolerant code
    return {} as MongoClient
  })
}
clientPromise = globalWithMongo._mongoClientPromise

// Export a module-scoped MongoClient promise
export default clientPromise
