import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDf40511SV8Sq0CeTf8kf0SoYJ81-9VpG4",
  authDomain: "todoapp-b279c.firebaseapp.com",
  projectId: "todoapp-b279c",
  storageBucket: "todoapp-b279c.appspot.com",
  messagingSenderId: "694939873130",
  appId: "1:694939873130:web:832272c801f36ca2cebf13",
  measurementId: "G-Q06ZGDB29R",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
