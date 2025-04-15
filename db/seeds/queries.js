const db = require("../connection");
db.query("SELECT * FROM users;", (err, result) => {
  if (err) {
    console.error("Error fetching users:", err);
  } else {
    console.log("All users:");
    console.log(result.rows);
  }
});
db.query("SELECT * FROM articles WHERE topic = 'coding';", (err, result) => {
  if (err) {
    console.error("Error fetching articles:", err);
  } else {
    console.log("Articles about coding:");
    console.log(result.rows);
  }
});
db.query("SELECT * FROM comments WHERE votes < 0;", (err, result) => {
  if (err) {
    console.error("Error fetching negative vote comments:", err);
  } else {
    console.log("\nComments with votes less than 0:");
    console.log(result.rows);
  }
});
db.query("SELECT * FROM topics;", (err, result) => {
  if (err) {
    console.error("Error fetching topics:", err);
  } else {
    console.log("\nAll topics:");
    console.log(result.rows);
  }
});
db.query("SELECT * FROM articles WHERE author = 'grumpy19';", (err, result) => {
  if (err) {
    console.error("Error fetching articles by grumpy19:", err);
  } else {
    console.log("\nArticles by grumpy19:");
    console.log(result.rows);
  }
});
// Well done if you've got this far! You should have now confirmed that your databases are fully seeded.

// You should now be able to make some queries to the databases. Import your connection into a new file and see if you can query the following data from your dev database, by running the file with node:

// Get all of the users
// Get all of the articles where the topic is coding
// Get all of the comments where the votes are less than zero
// Get all of the topics
// Get all of the articles by user grumpy19
// Get all of the comments that have more than 10 votes.
