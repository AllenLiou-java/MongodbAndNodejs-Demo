// 查詢資料(Read) - 從指定資料庫中查詢多筆資料
// db.collection.find(filter:Document)   //根據條件查詢多筆資料
// 參考api: https://docs.mongodb.com/manual/tutorial/query-documents/
// 透過MongoClient來連接mongodb
const { MongoClient } = require("mongodb");

async function main() {
    const uri = "mongodb+srv://allen123:allen123@cluster0.vq9ik.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try{
        // 連接cluster
        await client.connect();

        await findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
            minimumNumberOfBedrooms: 4,
            minimumNumberOfBathrooms: 2,
            maximumNumberOfResults: 5
        });

    } catch(e){
        console.log(e);
    } finally {
        // 關閉cluster的連接
        await client.close();
    }
}

main().catch(console.error);

// 解構賦值 - 設定函式參數的預設值 - function({ key1='value1', key2='value2', key3='value3'} = {})
//                                ，此種寫法在呼叫函式若未帶入參數，則會自動帶入參數預設值
async function findListingsWithMinimumBedroomsBathroomsAndMostRecentReviews(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
    // find() 返回 cursor
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#find for the find() docs
    // https://ithelp.ithome.com.tw/articles/10185596       // mongodb搜尋-Cursor運用與搜尋原理
    // https://docs.mongodb.com/manual/reference/operator/query/            // mongodb搜尋運算子
    // https://docs.mongodb.com/manual/reference/operator/query/gte/
    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews")
        .find({
            bedrooms: { $gte: minimumNumberOfBedrooms },
            bathrooms: { $gte: minimumNumberOfBathrooms }
        })
        .sort({ last_review: -1 })                      // sort: 將find出的資料，根據條件，進行排序。 .sort({ 資料屬性名: -1 }) , -1表由大到小排序
        .limit(maximumNumberOfResults);                 // limit: 限制find結果的數量
    
        // 將cursor轉成陣列並存成results
    const results = await cursor.toArray();

    if(results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            const date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${date}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
    
}






