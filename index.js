const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(
  cors({
      origin: ['http://localhost:5173', 'https://react-assignment-hub.web.app'],
      credentials: true,
  }),
)
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.umpxykt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const createAssignmentCollection = client.db('createAssignmentDB').collection('createAssignment');
    const createSubmissionCollection = client.db('createSubmissionDB').collection('createSubmission');
    const createFeatureCollection = client.db('featureDB').collection('feature');
  


    // createAssignment related apis
    app.get('/createAssignment', async (req, res) => {
      const cursor = createAssignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/createAssignment', async (req, res) => {
      const newAssignment = req.body;
      console.log(newAssignment);
      const result = await createAssignmentCollection.insertOne(newAssignment);
      res.send(result);
    })
    app.put('/createAssignment/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedAssignment = req.body;
      const assignment = {
        $set: {
          title: updatedAssignment.title,
          marks: updatedAssignment.marks,
          description: updatedAssignment.description,
          difficultyLevel: updatedAssignment.difficultyLevel,
          imageURL: updatedAssignment.imageURL,
          startDate: updatedAssignment.startDate,
          userName: updatedAssignment.userName
        }
      }
      const result = await createAssignmentCollection.updateOne(filter, assignment, options);
      res.send(result);
    })

    app.delete('/createAssignment/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await createAssignmentCollection.deleteOne(query);
      res.send(result);
    })

    // createSubmission related apis
    app.get('/createSubmission', async (req, res) => {
      const cursor = createSubmissionCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post('/createSubmission', async (req, res) => {
      const newSubmission = req.body;
      console.log(newSubmission);
      const result = await createSubmissionCollection.insertOne(newSubmission);
      res.send(result);
    })

    app.patch('/createSubmission/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: id };
      const newMark = req.body;
      const newAssignmentMark = {
        $set: {
          status: newMark.status
        },
      };
      const result = await createSubmissionCollection.updateOne(filter, newAssignmentMark);
      res.send(result);
    })

    app.put('/createSubmission/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: id };
      const options = { upsert: true };
      const newMark = req.body;
      const newAssignmentAdded = {
        $set: {
          marking: newMark.marking,
          feedback: newMark.feedback,
        }
      }
      const result = await createSubmissionCollection.updateOne(filter, newAssignmentAdded, options);
      res.send(result);
    })

    //Feature related APIs
    app.get('/feature', async (req, res) => {
      const cursor = createFeatureCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Assignment hub server is running')
})

app.listen(port, () => {
  console.log(`Assignment server is running on port: ${port}`);
})