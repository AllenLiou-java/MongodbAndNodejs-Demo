// 更新資料(Update) - 更新指定資料庫的單筆資料(指定的資料屬性存在時)
// db.collection.updateOne(filter: Document, update: Document)   
//      1. 根據參數1-filter條件搜尋符合條件的document
//      2. 根據參數2-update條件更新指定的單筆資料

// 參考api: https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne

// 透過MongoClient來連接mongodb
const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb+srv://allen123:allen123@cluster0.vq9ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try{
        // 連接cluster
        await client.connect();

        await updateListingByName(client, "Infinite Views", { bedrooms: 6, beds: 8});

    } catch(e){
        console.log(e);
    } finally {
        // 關閉cluster的連接
        await client.close();
    }
}

main().catch(console.error);

async function updateListingByName(client, nameOfListing, updatedListing) {
    // $set為update運算子: 使用指定的value來取代field的value
    // 參考資料: https://docs.mongodb.com/manual/reference/operator/update/set/#mongodb-update-up.-set
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
        .updateOne({ name: nameOfListing }, { $set: updatedListing});
    
    // console.log(result);   // return { acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount:1 }
    console.log(`${result.matchedCount} document(s) matched the query creteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);
}





