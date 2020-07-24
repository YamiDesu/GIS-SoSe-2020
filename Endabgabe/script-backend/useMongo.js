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
        productsCollection = mongoClient.db("NiceIce").collection("Products");
        ordersCollection = mongoClient.db("NiceIce").collection("Orders");
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
        console.log("_order", _order);
        currentCollection.insertOne(_order);
    }
    handleMongo.insertEntry = insertEntry;
    async function insertObject(_collection, _order) {
        debugger;
        connectCollection(_collection);
        console.log("this _collection: ", _order);
        //let replacement: ProduktObj[] = JSON.parse(JSON.stringify(_order).split("_id").join("old_id"));
        await currentCollection.insert(_order[0]);
        await currentCollection.insert(_order[1]);
        console.log("_collection: ", _order);
    }
    handleMongo.insertObject = insertObject;
    async function removeEntry(_collection, _entry) {
        connectCollection(_collection);
        if (!(_entry.id == undefined)) {
            let id = _entry._id;
            let objID = new Mongo.ObjectID(id);
            await currentCollection.deleteOne({ "_id": objID });
        }
        else {
            await currentCollection.deleteMany({ "Nr": _entry.Nr });
        }
    }
    handleMongo.removeEntry = removeEntry;
    async function countEntries(_collection) {
        connectCollection(_collection);
        let entryCount = await currentCollection.count({});
        return entryCount;
    }
    handleMongo.countEntries = countEntries;
    async function findCollection(_collection) {
        connectCollection(_collection);
        let foundCollection = await currentCollection.find().sort({ category: 1 }).toArray();
        return foundCollection;
    }
    handleMongo.findCollection = findCollection;
    async function findEntry(_collection, _entry) {
        connectCollection(_collection);
        let id = _entry._id;
        let objID = new Mongo.ObjectID(id);
        let foundEntry = await currentCollection.findOne({ _id: objID });
        return foundEntry;
    }
    handleMongo.findEntry = findEntry;
    async function updateEntry(_collection, _entry) {
        connectCollection(_collection);
        let id = _entry._id;
        let objID = new Mongo.ObjectID(id);
        delete _entry._id;
        console.log("entry", _entry);
        if (_entry.orderCount != undefined)
            currentCollection.updateOne({ _id: objID }, { $set: { orderCount: _entry.orderCount } });
        else
            currentCollection.updateOne({ _id: objID }, { $set: _entry });
    }
    handleMongo.updateEntry = updateEntry;
})(handleMongo = exports.handleMongo || (exports.handleMongo = {}));
//# sourceMappingURL=useMongo.js.map