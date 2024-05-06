// import fs from 'node:fs/promises';
// import * as path from 'node:path';


// const filename = 'db.json';


// const DB_PATH = path.resolve(__dirname,'..', filename)

// export const getDB = async () => {
//     const db = await fs.readFile(DB_PATH, 'utf-8')
//     console.log(db)
//     return JSON.parse(db)
// }

// export const saveDB = async (db) => {
//   await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
//   return db
// }

// export const insert = async (data) => {
// //console.log(DB_PATH);
//   const db = await getDB()
//   db.users.push(data)
//   await saveDB(db)
//   return data 
// }