import * as Mongo from "mongodb";

export namespace handleMongo {

    export interface ProduktObj {
        [type: string]: string | string[] | number | undefined;
    }

    let productsCollection: Mongo.Collection;
    let ordersCollection: Mongo.Collection;
    let currentCollection: Mongo.Collection;
    let dbUrl: string = "";

    function chooseUrl(_whichDB: string): void {
        if (_whichDB == "local")
            dbUrl = "mongodb://127.0.0.1:27017/";
        if (_whichDB == "remote")
            dbUrl = "mongodb+srv://AdminForUse:XV8MXEdBYuwXtQnc@ichstudieremitgis-jfrz9.mongodb.net/IchStudiereMitGiS?retryWrites=true&w=majority";
    }

    export async function connectDB(_whichDB: string): Promise<void> { // _url: string
        chooseUrl(_whichDB);
        let options: Mongo.MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true };
        let mongoClient: Mongo.MongoClient = new Mongo.MongoClient(dbUrl, options);
        await mongoClient.connect();
        productsCollection = mongoClient.db("NiceIce").collection("Products");
        ordersCollection = mongoClient.db("NiceIce").collection("Orders");
        console.log("Database connection: ", productsCollection != undefined);
    }

    export async function connectCollection(_collection: string): Promise<void> {
        if (_collection == "products")
            currentCollection = productsCollection;  
        else if (_collection == "orders")
            currentCollection = ordersCollection;
    }

    export function insertEntry(_collection: string, _order: ProduktObj): void {
        connectCollection(_collection);
        console.log("_order", _order);
        currentCollection.insertOne(_order);
    }

    export async function insertObject(_collection: string, _order: ProduktObj[]): Promise<void> {
        debugger;
        connectCollection(_collection);
        console.log("this _collection: ", _order);
        //let replacement: ProduktObj[] = JSON.parse(JSON.stringify(_order).split("_id").join("old_id"));
        await currentCollection.insert(_order[0]);
        await currentCollection.insert(_order[1]);
        console.log("_collection: ", _order);
    }

    export async function removeEntry(_collection: string, _entry: ProduktObj): Promise<void> {
        connectCollection(_collection);
        if (_entry._id != undefined) {
            let id: string = <string>_entry._id;
            let objID: Mongo.ObjectID = new Mongo.ObjectID(id);
            await currentCollection.deleteOne({ "_id": objID });
        }
        else {
            await currentCollection.deleteMany({ "Nr": _entry.Nr});
        }  
    }

    export async function countEntries(_collection: string): Promise<number> {
        connectCollection(_collection);
        let entryCount: number = await currentCollection.count({});
        return entryCount;
    }

    export async function findCollection(_collection: string): Promise<ProduktObj[]> {
        connectCollection(_collection);
        let foundCollection: ProduktObj[] = await currentCollection.find().sort({ category: 1 }).toArray();
        return foundCollection;
    }

    export async function findEntry(_collection: string, _entry: ProduktObj): Promise<ProduktObj> {
        connectCollection(_collection);
        let id: string = <string>_entry._id;
        let objID: Mongo.ObjectID = new Mongo.ObjectID(id);
        let foundEntry: ProduktObj = await currentCollection.findOne({_id: objID})!;
        return foundEntry;
    }

    export async function updateEntry(_collection: string, _entry: ProduktObj): Promise<void> {
        connectCollection(_collection);
        let id: string = <string>_entry._id;
        let objID: Mongo.ObjectID = new Mongo.ObjectID(id);
        delete _entry._id;
        console.log("entry", _entry);
        if (_entry.orderCount != undefined)
            currentCollection.updateOne({_id: objID}, {$set: {orderCount: (<number>_entry.orderCount)}});
        else
            currentCollection.updateOne({_id: objID}, {$set: _entry});
    }

}