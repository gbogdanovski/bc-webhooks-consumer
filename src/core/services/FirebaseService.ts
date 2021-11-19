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
        this.db.collection(this.collectionName).onSnapshot(async (querySnapshot) => {
            const shops: Promise<ShopModel>[] = [];
            querySnapshot.forEach(doc => {
                shops.push(this.getShop(doc.id));
            });
            const shopPromises = await Promise.all(shops.map(shop => shop));
            this.shopWebhooksData = shopPromises?.map((x) => {
                return {
                    webhooksEnabled: x.webhooksEnabled,
                    storeHash: x.storeHash,
                    webhooksToken: x.webhooksToken
                };
            });
            console.log(this.shopWebhooksData);
        }, (error) => {
            console.error("Firebase collection listener error: " + error);
        });
    }

    async getShops() {
        const snapshot = await this.db.collection(this.collectionName).get();
        const result = snapshot?.docs.map(doc => doc.data());
        if (result === undefined) {
            return Promise.reject(`Shops were not found`);
        }
        return result as ShopModel[];
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

