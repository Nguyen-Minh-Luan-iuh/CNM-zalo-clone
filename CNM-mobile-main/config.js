import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// const configFirebase = {
//   apiKey: "AIzaSyBq3ON388eopDo6eEqbWYJgeZqnlKDhNqA",
//   authDomain: "phuotp-521b1.firebaseapp.com",
//   projectId: "phuotp-521b1",
//   storageBucket: "phuotp-521b1.appspot.com",
//   messagingSenderId: "1057878539243",
//   appId: "1:1057878539243:web:0ce579e58329cc51bdb7ae",
//   measurementId: "G-4TF8LYDEWZ"
// };
// const configFirebase = {
//   apiKey: "AIzaSyA5YfWN-Y4KjSjXVJDsbz8ktV7brZYxBFM",
//   authDomain: "phuotp2.firebaseapp.com",
//   projectId: "phuotp2",
//   storageBucket: "phuotp2.appspot.com",
//   messagingSenderId: "869694000014",
//   appId: "1:869694000014:web:92a0c920af8c02c41bf2df"
// };

// const configFirebase = {
//   apiKey: "AIzaSyDodbe7E8qMiyc0Lxf_xPoYIUdRLz4owXM",
//   authDomain: "phuotp3.firebaseapp.com",
//   projectId: "phuotp3",
//   storageBucket: "phuotp3.appspot.com",
//   messagingSenderId: "947026321570",
//   appId: "1:947026321570:web:f3b59be931dc067ceab7fb"
// };

// const configFirebase = {
//   apiKey: "AIzaSyAdfszL0mNO0iz_0nmoC0oErIVN4oMQ7Ig",
//   authDomain: "phuotp4-e43d9.firebaseapp.com",
//   projectId: "phuotp4-e43d9",
//   storageBucket: "phuotp4-e43d9.appspot.com",
//   messagingSenderId: "606425943350",
//   appId: "1:606425943350:web:c604f2619044faa7577797"
// };

// const configFirebase = {
//   apiKey: "AIzaSyDMDt-CyHthGT6UyfdkHm--jGcYI0G269g",
//   authDomain: "phuopt6.firebaseapp.com",
//   projectId: "phuopt6",
//   storageBucket: "phuopt6.appspot.com",
//   messagingSenderId: "590865839887",
//   appId: "1:590865839887:web:0c9c9d82f8810e7f5af07a"
// };
// const configFirebase = {
//   apiKey: "AIzaSyA_EESrXxJyLfTDUe-1Utw2YqholxErNXc",
//   authDomain: "phuotp7.firebaseapp.com",
//   projectId: "phuotp7",
//   storageBucket: "phuotp7.appspot.com",
//   messagingSenderId: "733878434207",
//   appId: "1:733878434207:web:fcd3bb7da7d1a4f21425aa"
// };
// const configFirebase = {
//   apiKey: "AIzaSyA_EESrXxJyLfTDUe-1Utw2YqholxErNXc",
//   authDomain: "phuotp7.firebaseapp.com",
//   projectId: "phuotp7",
//   storageBucket: "phuotp7.appspot.com",
//   messagingSenderId: "733878434207",
//   appId: "1:733878434207:web:fcd3bb7da7d1a4f21425aa"
// };

// const firebaseConfig  = {
//   apiKey: "AIzaSyAkCvLOjJ61BERMGkWpf8mDU2J4BlapGUM",
//   authDomain: "phuotp1.firebaseapp.com",
//   projectId: "phuotp1",
//   storageBucket: "phuotp1.appspot.com",
//   messagingSenderId: "919924671508",
//   appId: "1:919924671508:web:a8bac7b9dd230d1ea25301"
// };
// const firebaseConfig = {
//   apiKey: "AIzaSyB2wqFMBcrvsRdOvAPNq4HsTEnGlB4IBSg",
//   authDomain: "phuotp2-3f401.firebaseapp.com",
//   projectId: "phuotp2-3f401",
//   storageBucket: "phuotp2-3f401.appspot.com",
//   messagingSenderId: "507121802964",
//   appId: "1:507121802964:web:bb348aff742f592ff06541"
// };
// const firebaseConfig = {
//   apiKey: "AIzaSyC5ZQVUB9v85XNM_P_WDWfZT8IABhQjwC4",
//   authDomain: "phuotp3-7243b.firebaseapp.com",
//   projectId: "phuotp3-7243b",
//   storageBucket: "phuotp3-7243b.appspot.com",
//   messagingSenderId: "716669947760",
//   appId: "1:716669947760:web:60da2332bd76278e1d89b5"
// };
const firebaseConfig = {
  apiKey: "AIzaSyBuHkPAMa7sh0bKzP_NwmOmlhG_qnl4kWc",
  authDomain: "phuotp4-373e2.firebaseapp.com",
  projectId: "phuotp4-373e2",
  storageBucket: "phuotp4-373e2.appspot.com",
  messagingSenderId: "474430252941",
  appId: "1:474430252941:web:05a250bdb3b0f383c57fc4"
};
// Check if there are no initialized apps
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export default firebase;