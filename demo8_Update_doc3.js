// 更新資料(Update) - 更新指定資料庫的多筆資料
// db.collection.updateMany(filter: Document, update: Document)   
//      1. 根據參數1-filter條件搜尋符合條件的document
//          1.1. filter的條件可以使用 Element Query 運算子 - https://docs.mongodb.com/manual/reference/operator/query/exists/#mongodb-query-op.-exists
//          1.2. Syntax: { field: { $exists: <boolean> } }
//      3. 根據參數2-update條件更新指定的單筆資料

// 參考api: https://docs.mongodb.com/manual/reference/method/db.collection.updateMany/#mongodb-method-db.collection.updateMany

// 透過MongoClient來連接mongodb
const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb+srv://username:password@cluster0.vq9ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try{
        // 連接cluster
        await client.connect();

        await updateAllListingsToHavePropertyType(client);

    } catch(e){
        console.log(e);
    } finally {
        // 關閉cluster的連接
        await client.close();
    }
}

main().catch(console.error);

async function updateAllListingsToHavePropertyType(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
        .updateMany(
            { property_type: { $exists: false } }, 
            { $set: { property_type: "Unknow" } }
        );

    console.log(`${result.matchedCount} document(s) matched the query creteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);
}


// 執行結果：
// 4 document(s) matched the query creteria
// 4 document(s) was/were updated
// 根據搜尋結果，指定document的field原本無property_type，更新後插入property_type: Unknow 的key-value


