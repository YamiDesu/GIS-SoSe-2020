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
        productsCollection = mongoClient.db("NiceIce").collection("Orders");
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
        currentCollection.insertOne(_order);
    }

    export async function insertObject(_collection: string, _order: ProduktObj[]): Promise<void> {
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

    export async function removeEntry(_collection: string, _entry: ProduktObj): Promise<void> {
        connectCollection(_collection);
        let id: string = <string>_entry._id;
        let objID: Mongo.ObjectID = new Mongo.ObjectID(id);
        await currentCollection.deleteOne({ "_id": objID });
    }

    export async function findCollection(_collection: string): Promise<ProduktObj[]> {
        connectCollection(_collection);
        //await currentCollection.dropIndexes("category");
        //await currentCollection.createIndex( { category: 1});
        let foundCollection: ProduktObj[] = await currentCollection.find().sort({ category: 1 }).toArray();
        return foundCollection;
    }

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

}