"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMongo = void 0;
const Mongo = require("mongodb");
var handleMongo;
(function (handleMongo) {
    let content;
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
        //content = mongoClient.db("db").collection("Students");
        content = mongoClient.db("MeineHochschule").collection("Students");
        console.log("Database connection: ", content != undefined);
    }
    handleMongo.connectDB = connectDB;
    function insertData(_order) {
        content.insertOne(_order);
    }
    handleMongo.insertData = insertData;
    async function removeData(_entry) {
        //console.log("_entry: ", _entry);
        //console.log(_entry._id);
        let id = _entry._id;
        let objID = new Mongo.ObjectID(id);
        await content.deleteOne({ "_id": objID });
    }
    handleMongo.removeData = removeData;
    async function findCollection() {
        let foundCollection = await content.find().toArray();
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
//# sourceMappingURL=mongo.js.map