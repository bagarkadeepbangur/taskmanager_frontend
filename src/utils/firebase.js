import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyADdzvt7ucuwoMgYs6o9JigC3uI0kIKTVU",
    authDomain: "taskmanager-97571.firebaseapp.com",
    projectId: "taskmanager-97571",
    storageBucket: "taskmanager-97571.firebasestorage.app",
    messagingSenderId: "197093345555",
    appId: "1:197093345555:web:76d45e8e890a8bbd76f2e6",
    measurementId: "G-77HVNNT5PD"
};

// export const app = initializeApp(firebaseConfig);
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);