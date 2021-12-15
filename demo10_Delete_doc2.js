// 刪除資料(Update) - 刪除指定資料庫的多筆資料
// db.collection.deleteMany(filter: Document)   
//    1. 根據filter條件搜尋符合條件的document，
//       此條件可以是指定特定的field，也可以透過運算子來建立篩選條件

// 參考api: https://docs.mongodb.com/manual/tutorial/remove-documents/

// 透過MongoClient來連接mongodb
const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb+srv://allen123:allen123@cluster0.vq9ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try{
        // 連接cluster
        await client.connect();

        await deleteListingsScrapedBeforeDate(client, new Date("2019-02-15"));              //注意日期要刮上引號

    } catch(e){
        console.log(e);
    } finally {
        // 關閉cluster的連接
        await client.close();
    }
}

main().catch(console.error);

async function deleteListingsScrapedBeforeDate(client, date) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews")
    .deleteMany({ "last_scraped": { $lt: date } });

    console.log(`${result.deletedCount} document(s) was/were deleted`);
}


// 執行結果：
// 606 document(s) was/were deleted


