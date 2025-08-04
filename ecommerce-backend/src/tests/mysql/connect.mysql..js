const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  port: 8811,
  password: "12344321",
  database: "test",
});

const batchSize = 100_000;
const totalSize = 10_000_000;

let currentId = 1;

const insertBatch = async() => {
  const values = [];

  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    pool.end((err) => {
      if (err) {
        console.log(`error occurred while running batch`);
      } else {
        console.log(`Connection pool closed successfully`);
      }
    });
    return;
  }

  const sql = "INSERT INTO test_table (id, name, age, address) VALUES ?";
  pool.query(sql, [values], async (err, result) => {
    if (err) {
      console.error(`Error inserting batch: ${err.message}`);
      return;
    }
    console.log(`Inserted ${result.affectedRows} records`);
    await insertBatch();
  });
};

insertBatch().catch(console.error);
