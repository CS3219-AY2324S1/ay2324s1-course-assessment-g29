const { MongoClient } = require("mongodb");

async function main() {
  const uri =
    "mongodb+srv://xingzheng385:EoF1MuR95pdguGGm@cluster3219.klf73r8.mongodb.net/?retryWrites=true&w=majority";

  const client = new MongoClient(uri);

  try {
    await client.connect(); // block operation till connected to db

    await POST(client, {
      name: "Two Sum",
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

      You may assume that each input would have exactly one solution, and you may not use the same element twice.
      
      You can return the answer in any order.`,
      tags: ["Array", "Hashtable"],
    });

    await GET(client, "Two Sum");

    await PUT(client, "Two Sum", {
      description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

      You may assume that each input would have exactly one solution, and you may not use the same element twice.
      
      You can return the answer in any order.`,
      tags: ["Array", "Hashtable", "Easy"],
    });

    await DELETE(client, "Two Sum");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

async function POST(client, newQuestion) {
  const result = await client
    .db("question_database")
    .collection("questions")
    .insertOne(newQuestion);

  console.log(
    `New question created with the following id: ${result.insertedId}`
  );
}

async function GET(client, nameOfQuestion) {
  const result = await client
    .db("question_database")
    .collection("questions")
    .findOne({ name: nameOfQuestion });

  if (result) {
    console.log(
      `Found a question in the collection with the name ${nameOfQuestion}`
    );
    console.log(result);
  } else {
    console.log(
      `No question found in the collection with the name ${nameOfQuestion}`
    );
  }
}

async function PUT(client, nameOfQuestion, updatedQuestion) {
  const result = await client
    .db("question_database")
    .collection("questions")
    .updateOne({ name: nameOfQuestion }, { $set: updatedQuestion });

  console.log(`${result.matchedCount} document(s) matched the query criteria`);
  console.log(`${result.modifiedCount} document(s) was/were updated`);
}

async function DELETE(client, nameOfQuestion) {
  const result = await client
    .db("question_database")
    .collection("questions")
    .deleteOne({ name: nameOfQuestion });

  console.log(`${result.deletedCount} document was deleted`);
}

// async function createMultipleQuestions(client, newQuestions) {
//   const result = await client
//     .db("question_databse")
//     .collection("questions")
//     .insertMany(newQuestions);

//   console.log(
//     `${result.insertedCount} new questions created with the following id(s): `
//   );
//   console.log(result.insertedIds);
// }

// async function findQuestionsWithTag(
//   client,
//   { tag, maximumNumberOfResults = Number.MAX_SAFE_INTEGER } = {}
// ) {
//   const cursor = client
//     .db("question_database")
//     .collection("questions")
//     .find({
//       tag: tag,
//     })
//     .sort({ last_review: -1 })
//     .limit(maximumNumberOfResults);

//   const results = await cursor.toArray();
// }

// async function upsertQuestionByName(client, nameOfQuestion, updatedQuestion) {
//   const result = await client
//     .db("question_database")
//     .collection("questions")
//     .updateOne(
//       { name: nameOfQuestion },
//       { $set: updatedQuestion },
//       { upsert: true }
//     );

//   console.log(`${result.matchedCount} documents(s) matched the query criteria`);

//   if (result.upsertedCount > 0) {
//     console.log(`One document was inserted with the id ${result.upsertedId}`);
//   } else {
//     console.log(`${result.modifiedCount} document(s) was/were updated`);
//   }
// }

// async function listDatabases(client) {
//   const databasesList = await client.db().admin().listDatabases();
//   console.log("Databases: ");
//   databasesList.databases.forEach((db) => {
//     console.log(`- ${db.name}`);
//   });
// }

// function myfunction() {
//   alert("hello world!");
// }
