// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getMessaging } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyA595WdrcLDjSbRs8Z027MvvUpPaUV-Tz0',
  authDomain: 'hearing-18944.firebaseapp.com',
  projectId: 'hearing-18944',
  storageBucket: 'hearing-18944.firebasestorage.app',
  messagingSenderId: '931196004064',
  appId: '1:931196004064:web:e0da310d3c73ea3b235285',
  measurementId: 'G-YLVZ0MSQYC',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);
