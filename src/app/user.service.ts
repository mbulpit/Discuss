import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile, 
  onAuthStateChanged, 
  signOut,
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment'

type User = {
  displayName?: string,
  email: string,
  password: string
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  app = initializeApp(environment.firebaseConfig);
  auth = getAuth(this.app);
  db = getFirestore(this.app);
  signedInUser?: any;
  usersList?: any;
 
  constructor(private http: HttpClient) {
    onAuthStateChanged(this.auth, (user: any) => {
      if(user) this.signedInUser = user;
    })

    const q = query(collection(this.db, 'users'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list: any = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      this.usersList = list;
    })

   }

   async signIn(user: User) {
    try {
      await signInWithEmailAndPassword(this.auth, user.email, user.password);
      await setDoc(doc(this.db, 'users', this.signedInUser.uid), {
        displayName: this.signedInUser.displayName,
        email: this.signedInUser.email,
        signedIn: true,
        uid: this.signedInUser.uid
      });
      return 'success';
    } catch(error: any) {
      console.log(error.code)
      return error.code;
    }
   }
  

  async createAccount(user: User) {
    const q = query(collection(this.db, 'users'), where('displayName', '==', user.displayName))
    const querySnapshot = await getDocs(q);
    if(!querySnapshot.empty) return 'Display name is already in use';

    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, user.email, user.password);
      const loggedInUser = userCredential.user;
      await updateProfile(loggedInUser, {displayName: user.displayName});
      await setDoc(doc(this.db, 'users', loggedInUser.uid), {
        displayName: user.displayName,
        email: user.email,
        signedIn: true,
        uid: loggedInUser.uid
      });
      return 'success';
    } catch(error: any) {
      console.log(error.code);
      return error.code;
    }
  }

  async signout() {
    try {
      await signOut(this.auth);
      await setDoc(doc(this.db, 'users', this.signedInUser.uid), {
        displayName: this.signedInUser.displayName,
        email: this.signedInUser.email,
        signedIn: false,
        uid: this.signedInUser.uid
      });
      return 'success';
    } catch(error) {
      return error;
    }
  }
}
