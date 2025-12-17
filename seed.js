
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';

// IMPORTANT: Fill in your actual Firebase config
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID || "petcheckon-vue3-03523618-b08cd",
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const petLoverGroomingId = 'pet-lover-grooming';

const dogServices = [
    { name: '洗澡+吹乾 (基本 Bath & Dry)', small: '600', medium: '950', large: '1450', category: 'dogs', duration: 'N/A' },
    { name: '洗澡+整理 (Wash & Tidy)', small: '700', medium: '1500', large: '1850', category: 'dogs', duration: 'N/A' },
    { name: '全套美容 (Full Groom)', small: '1600', medium: '2500', large: '3000', category: 'dogs', duration: 'N/A' },
    { name: '單項: 指甲修剪', small: '250', medium: '250', large: '350', category: 'dogs', duration: 'N/A' },
    { name: '單項: 耳朵清潔', small: '120 - 300', medium: '120 - 300', large: '250', category: 'dogs', duration: 'N/A' },
    { name: '單項: 肛門腺擠壓', small: '250', medium: '250', large: '300', category: 'dogs', duration: 'N/A' },
    { name: '單項: 除打結/去毛結 (dematting)', small: '750', medium: '1000', large: '1650', category: 'dogs', duration: 'N/A' },
    { name: '單項: 除毛/脫毛 (de-shedding treatments)', small: '600', medium: '850', large: '1300', category: 'dogs', duration: 'N/A' },
    { name: '單項: 牙刷/牙齒清潔 (表面/拋光)', small: '300 - 900', medium: '300 - 900', large: '300 - 1,000', category: 'dogs', duration: 'N/A' },
    { name: '到府/接送服務 (近距離)', small: '500', medium: '500', large: '500', category: 'dogs', duration: 'N/A' },
    { name: '快速/加急 (Express)', small: '+20% - +50%', medium: '+20% - +50%', large: '+20% - +50%', category: 'dogs', duration: 'N/A' },
    { name: '深層護理/Spa (護色/護毛膜)', small: '600', medium: '800', large: '1200', category: 'dogs', duration: 'N/A' },
    { name: '高齡/醫療照護專案 (慢性病/術後)', small: '視情況報價', medium: '視情況報價', large: '視情況報價', category: 'dogs', duration: 'N/A' },
];

const catServices = [
    { name: '洗澡+吹乾 (短毛)', small: '900', medium: '1200', large: '1800', category: 'cats', duration: 'N/A' },
    { name: '洗澡+全身梳理 (長毛)', small: '1350', medium: '1850', large: '2900', category: 'cats', duration: 'N/A' },
    { name: '剃毛/獅子造型 (Lion Clip)', small: '1700', medium: '2100', large: '3150', category: 'cats', duration: 'N/A' },
    { name: '去打結/Groom-out', small: '1250', medium: '1650', large: '2250', category: 'cats', duration: 'N/A' },
    { name: '指甲修剪', small: '200', medium: '200', large: '250', category: 'cats', duration: 'N/A' },
    { name: '牙刷/口腔保養', small: '600', medium: '600', large: '600', category: 'cats', duration: 'N/A' },
    { name: '到府服務 (貓)', small: '900', medium: '1100', large: '1500', category: 'cats', duration: 'N/A' },
    { name: '專門加項 (除毛/護理)', small: '300', medium: '300', large: '500', category: 'cats', duration: 'N/A' },
];


async function clearServices(storeId) {
    const servicesCollectionRef = collection(db, `stores/${storeId}/services`);
    const querySnapshot = await getDocs(servicesCollectionRef);
    const deletePromises = [];
    querySnapshot.forEach((doc) => {
        deletePromises.push(deleteDoc(doc.ref));
    });
    await Promise.all(deletePromises);
    console.log(`Successfully cleared all existing services for ${storeId}.`);
}


async function seedServices(storeId, services) {
    const servicesCollectionRef = collection(db, `stores/${storeId}/services`);
    for (const service of services) {
        try {
            await addDoc(servicesCollectionRef, service);
            console.log(`Added service: ${service.name}`);
        } catch (error) {
            console.error(`Error adding service ${service.name}:`, error);
        }
    }
}

async function runSeed() {
    console.log(`Starting to seed data for ${petLoverGroomingId}...`);
    
    // First, clear out any old data to prevent duplicates
    await clearServices(petLoverGroomingId);

    // Then, add the new data
    console.log("\n--- Adding Dog Services ---");
    await seedServices(petLoverGroomingId, dogServices);
    
    console.log("\n--- Adding Cat Services ---");
    await seedServices(petLoverGroomingId, catServices);

    console.log("\nSeeding complete!");
}

runSeed();
