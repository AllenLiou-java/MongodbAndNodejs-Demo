// 建立資料(Create) - 將"單筆"資料存進資料庫中
// db.collection.insertOne(doc: Document)   //插入單筆資料至collection
// 參考api: https://docs.mongodb.com/manual/tutorial/insert-documents/
// 透過MongoClient來連接mongodb
const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb+srv://username:password@cluster0.vq9ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try{
        // 連接cluster
        await client.connect();

        await createListing(client, {
            name: "Lovely Loft",
            summary: "A charming loft in Paris",
            bedrooms: 1,
            bathrooms: 1
        });

    } catch(e){
        console.log(e);
    } finally {
        // 關閉cluster的連接
        await client.close();
    }
}

main().catch(console.error);

async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);
    // console.log(result);        // { acknowledged: true, insertedId: new ObjectId("61b8541cf3da43f6ae508ba5")}
    console.log(`New listing creates with the following id: ${result.insertedId}`);
}

