import * as Mongo from "mongodb";

export namespace handleMongo {

    export interface Personalien {
        [type: string]: string | string[] | number | undefined;
    }

    let content: Mongo.Collection;
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
        //content = mongoClient.db("db").collection("Students");
        content = mongoClient.db("MeineHochschule").collection("Students");
        console.log("Database connection: ", content != undefined);
    }

    export function insertData(_order: Personalien): void {
        content.insertOne(_order);
    }

    export async function removeData(_entry: Personalien): Promise<void> {
        //console.log("_entry: ", _entry);
        //console.log(_entry._id);
        let id: string = <string>_entry._id;
        let objID: Mongo.ObjectID = new Mongo.ObjectID(id);
        await content.deleteOne({"_id": objID});
    }

    export async function findCollection(): Promise<Personalien[]> {
        let foundCollection: Personalien[] = await content.find().toArray();
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