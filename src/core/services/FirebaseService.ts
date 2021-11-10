import * as firebase from "firebase-admin";
import config from "../common/config";
import { ShopModel } from "../models/shop.model";

/**
 * FirebaseService class is used to communicate with firebase.
 */
export class FirebaseService {
    private static instance: FirebaseService = new FirebaseService(); //singleton instance
    private firestoreDb: firebase.firestore.Firestore | undefined;
    public shopWebhooksData: ShopModel[] = [];

    constructor() {
        if (FirebaseService.instance) {
            return FirebaseService.instance;
        }
        FirebaseService.instance = this;
        this.initFirebaseApp();
    }

    /**
     * This method will initialize firebase app instance and will set observer on the `shops` collection.
     * This observer will be used to get the webhooks related data for each shop and it will store that data into public variable called `shopWebhooksData`.
     */
    initFirebaseApp() {
        if (firebase.apps.length === 0) {
            if (config.gcpAuthorize.apiKeyJson) {
                firebase.initializeApp({
                    credential: firebase.credential.cert(JSON.parse(config.gcpAuthorize.apiKeyJson)),
                });
            } else {
                firebase.initializeApp();
            }
            this.firestoreDb = firebase.firestore();
            this.firestoreDb.settings({ ignoreUndefinedProperties: true });
            this.attachListeners();
        }
        else {
            console.log("Firebase already initialized with app name: " + firebase?.apps[0]?.name);
        }
    }

    private attachListeners() {
        this.firestoreDb?.collection("shops").onSnapshot(async (querySnapshot) => {
            const shops: Promise<ShopModel>[] = [];
            querySnapshot.forEach(doc => {
                shops.push(this.getShop(doc.id));
            });
            const shopPromises = await Promise.all(shops.map(shop => shop));
            this.shopWebhooksData = shopPromises?.map((x) => { return { webhooksEnabled: x.webhooksEnabled, storeHash: x.storeHash, webhooksToken: x.webhooksToken }; });
            console.log(this.shopWebhooksData);
        });
    }

    async getWebhooksTokens(): Promise<ShopModel[]> {
        const shops = await this.firestoreDb?.collection("shops").get().then(async (querySnapshot) => {
            const shopsPromises: Promise<ShopModel>[] = [];
            querySnapshot.forEach(doc => {
                shopsPromises.push(this.getShop(doc.id));
            });
            return await Promise.all(shopsPromises.map(shop => shop));
        }).catch(error => console.log(error));

        this.shopWebhooksData = shops?.map((x) => { return { webhooksEnabled: x.webhooksEnabled, storeHash: x.storeHash, webhooksToken: x.webhooksToken }; }) || [];
        return this.shopWebhooksData;
    }

    async getShop(shopName: string) {
        const snapshot = await this.firestoreDb?.collection("shops").doc(shopName).get();
        const result = snapshot?.data();
        if (result === undefined) {
            return Promise.reject(`Shop ${shopName} was not found`);
        }
        return result as ShopModel;
    }
}