import { Firestore, setLogFunction } from "@google-cloud/firestore";
// import config from "../common/config";
import { ShopModel } from "../models/shop.model";

/**
 * FirebaseService class is used to communicate with firebase.
 * If service account json file is supplied, the firebase instance will start with it.
 * Otherwise, it will start with local firebase emulator instance.
 * To start local emulator instance, please follow the Readme file instructions
 */
export class FirebaseService {
    constructor() {
        if (process.env.NODE_ENV === "production")
            setLogFunction(console.log);

        this.db = new Firestore();
        this.db.settings({ ignoreUndefinedProperties: true });
        if (FirebaseService.instance) {
            return FirebaseService.instance;
        }
        FirebaseService.instance = this;
    }
    private static instance: FirebaseService = new FirebaseService(); //singleton instance
    private db!: FirebaseFirestore.Firestore;
    public shopWebhooksData: ShopModel[] = [];
    private collectionName = 'shops';

    /**
     * Get all shops from firebase and attach listeners to them.
     * All changes will be stored in shopWebhooksData array automatically.
     */
    async attachListener() {
        this.db.collection(this.collectionName).onSnapshot(async (snapshot) => {
            let result = snapshot?.docs.map(doc => doc.data());
            if (result === undefined) {
                return Promise.reject(`Shops were not found`);
            }
            this.shopWebhooksData = result?.map((x) => {
                return {
                    webhooksEnabled: x.webhooksEnabled,
                    storeHash: x.storeHash,
                    webhooksToken: x.webhooksToken
                };
            });
            return this.shopWebhooksData;
        }, (error) => {
            console.error("Firebase collection listener error: " + error);
        });
    }

    /**
     * Get all shops from firebase
     * All changes will be stored in shopWebhooksData array.
     */
    async getShops() {
        const snapshot = await this.db.collection(this.collectionName).get();
        let result = snapshot?.docs.map(doc => doc.data());
        if (result === undefined) {
            return Promise.reject(`Shops were not found`);
        }
        this.shopWebhooksData = result?.map((x) => {
            return {
                webhooksEnabled: x.webhooksEnabled,
                storeHash: x.storeHash,
                webhooksToken: x.webhooksToken
            };
        });
        return this.shopWebhooksData;
    }

    async getShop(shopName: string) {
        const snapshot = await this.db.collection(this.collectionName).doc(shopName).get();
        const result = snapshot?.data();
        if (result === undefined) {
            return Promise.reject(`Shop ${shopName} was not found`);
        }
        return result as ShopModel;
    }
}

