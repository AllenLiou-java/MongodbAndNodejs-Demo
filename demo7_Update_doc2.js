// 更新資料(Update) - 更新指定資料庫的資料
// 當要更新資料時，若無法確定指定條件的資料是否含有指定資料屬性，我們的做法會有兩種：
//      1. 若資料已經存在，則使用updateOne來更新單筆資料
//      2. 若資料還未建立，則使用insertOne來插入單筆資料
// upsert() 結合以上兩種做法，若query的document結果都不符合，則會建立新的document
// db.collection.updateOne(filter: Document, update: Document, { upsert: true })   //根據參數1-filter條件搜尋符合條件的document，再根據參數2-update條件更新指定的單筆資料

// 參考api: https://docs.mongodb.com/manual/reference/method/db.collection.updateOne/#mongodb-method-db.collection.updateOne

// 透過MongoClient來連接mongodb
const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb+srv://allen123:allen123@cluster0.vq9ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try{
        // 連接cluster
        await client.connect();

        await upsertListingByName(client, "Cozy Cottage", { name: "Cozy Cottage", bedrooms: 2, bathrooms: 2});

    } catch(e){
        console.log(e);
    } finally {
        // 關閉cluster的連接
        await client.close();
    }
}

main().catch(console.error);

async function upsertListingByName(client, nameOfListing, updatedListing) {
    // $set為update運算子: 使用指定的value來取代field的value
    // 參考資料: https://docs.mongodb.com/manual/reference/operator/update/set/#mongodb-update-up.-set
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
        .updateOne({ name: nameOfListing }, { $set: updatedListing}, { upsert: true });
    
    // console.log(result);   // return { acknowledged: true, modifiedCount: 1, upsertedId: null, upsertedCount: 0, matchedCount:1 }
    console.log(`${result.matchedCount} document(s) matched the query creteria`);

    if(result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId}`);
    } else {
        console.log(`${result.modifiedCount} document(s) was/were updated`);
    }
}


// 執行結果：
// 第一次(資料庫資料皆未符合指定條件時，則新增該筆資料) - 
//      0 document(s) matched the query creteria
//      One document was inserted with the id 61b951a3c4e58f905c1d395d
// 第二次(資料庫資料符合指定條件時，則更新該筆資料) - 
//      1 document(s) matched the query creteria
//      1 document(s) was/were updated


