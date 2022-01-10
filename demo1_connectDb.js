// 連接資料庫並列出cluster中所有資料庫名稱
// 透過MongoClient來連接mongodb
const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb+srv://username:password@cluster0.vq9ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try{
        // 連接cluster
        await client.connect();
        // 列出指定該cluster裡的所有database name
        await listDatabases(client);

    } catch(e){
        console.log(e);
    } finally {
        // 關閉cluster的連接
        await client.close();
    }
}

main().catch(console.error);

// 連接資料庫，並列出指定該cluster裡的所有database name
async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();
    
    console.log("Databases:");
    // console.log(databasesList);
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}
