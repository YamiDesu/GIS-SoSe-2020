"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMongo = void 0;
const Mongo = require("mongodb");
var handleMongo;
(function (handleMongo) {
    let productsCollection;
    let ordersCollection;
    let currentCollection;
    let dbUrl = "";
    function chooseUrl(_whichDB) {
        if (_whichDB == "local")
            dbUrl = "mongodb://127.0.0.1:27017/";
        if (_whichDB == "remote")
            dbUrl = "mongodb+srv://AdminForUse:XV8MXEdBYuwXtQnc@ichstudieremitgis-jfrz9.mongodb.net/IchStudiereMitGiS?retryWrites=true&w=majority";
    }
    async function connectDB(_whichDB) {
        chooseUrl(_whichDB);
        let options = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient = new Mongo.MongoClient(dbUrl, options);
        await mongoClient.connect();
        productsCollection = mongoClient.db("NiceIce").collection("Orders");
        console.log("Database connection: ", productsCollection != undefined);
    }
    handleMongo.connectDB = connectDB;
    async function connectCollection(_collection) {
        if (_collection == "products")
            currentCollection = productsCollection;
        else if (_collection == "orders")
            currentCollection = ordersCollection;
    }
    handleMongo.connectCollection = connectCollection;
    function insertEntry(_collection, _order) {
        connectCollection(_collection);
        currentCollection.insertOne(_order);
    }
    handleMongo.insertEntry = insertEntry;
    async function insertObject(_collection, _order) {
        debugger;
        connectCollection(_collection);
        /*for (const key in _order[0]) {
            key.split("_id");
        }
        delete _order[0]._id;
        delete _order[1]._id;*/
        console.log("this _collection: ", _order);
        //let replacement: ProduktObj[] = JSON.parse(JSON.stringify(_order).split("_id").join("old_id"));
        await currentCollection.insert(_order[0]);
        await currentCollection.insert(_order[1]);
        console.log("_collection: ", _order);
        /*for (const iterator of _order) {
            console.log(iterator);
            //let insertion: string = JSON.stringify(iterator).replace("[", "").replace("]", "");
            let replacement: ProduktObj[] = JSON.parse(JSON.stringify(iterator).split("_id").join("old_id"));
            //let replacement: ProduktObj[] = JSON.parse(insertion.split("_id").join("old_id"));
            await currentCollection.insert(replacement[0]);
            console.log("replacement[0]", replacement[0]);
        }*/
    }
    handleMongo.insertObject = insertObject;
    async function removeEntry(_collection, _entry) {
        connectCollection(_collection);
        let id = _entry._id;
        let objID = new Mongo.ObjectID(id);
        await currentCollection.deleteOne({ "_id": objID });
    }
    handleMongo.removeEntry = removeEntry;
    async function findCollection(_collection) {
        connectCollection(_collection);
        //await currentCollection.dropIndexes("category");
        //await currentCollection.createIndex( { category: 1});
        let foundCollection = await currentCollection.find().sort({ category: 1 }).toArray();
        return foundCollection;
    }
    handleMongo.findCollection = findCollection;
    /*
    async function findManyData(_order: Personalien): Promise<string> {
    let test: Mongo.Cursor = content.find(_order);
    let testArray: Personalien[] = await test.toArray();
    console.log( testArray );
    return testArray.toString();
    }

    async function findOneData(_order: Personalien): Promise<void> {
    let test2: any = await content.findOne(_order);
    console.log("findOneData: ", test2);
    //console.log(test2.name);
    }

    function removeData(_order: Personalien): void {
    content.remove(_order);
    }
    */
})(handleMongo = exports.handleMongo || (exports.handleMongo = {}));
//# sourceMappingURL=useMongo.js.map