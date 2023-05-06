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
import { getFirestore, collection, doc, setDoc, query, where, getDocs, onSnapshot, updateDoc } from 'firebase/firestore';
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
  dms?: Array<string>;
 
  constructor(private http: HttpClient) {
    const usersQ = query(collection(this.db, 'users'));
    const usersUnsubscribe = onSnapshot(usersQ, (querySnapshot) => {
      const list: any = [];
      querySnapshot.forEach((doc) => {
        list.push(doc.data());
      });
      this.usersList = list;
    })

    onAuthStateChanged(this.auth, (user: any) => {
      if(user) {
        this.signedInUser = user;
        const dmsQ = query(collection(this.db, 'users'), where('displayName', '==', user.displayName));
        const dmsUnsubscribe = onSnapshot(dmsQ, (querySnapshot) => {
          let dms: any;
          querySnapshot.forEach((doc) => {
            dms = doc.data()['dms'];
          });
          if(typeof dms !== undefined && Array.isArray(dms)) {
            const dmsWithStatus = this.usersList.filter((user: any) => dms.includes(user.displayName) )
            this.dms = dmsWithStatus;
          }
        })
        this.changeStatus(true);
      }
    })

   }

   async signIn(user: User) {
    try {
      await signInWithEmailAndPassword(this.auth, user.email, user.password);
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
        uid: loggedInUser.uid,
        dms: []
      });
      this.signout();
      location.reload();
      return 'success';
    } catch(error: any) {
      console.log(error.code);
      return error.code;
    }
  }

  async signout() {
    try {
      await signOut(this.auth);
      return 'success';
    } catch(error) {
      return error;
    }
  }

  async changeStatus(status: boolean) {
     await updateDoc(doc(this.db, 'users', this.signedInUser.uid), {
       signedIn: status
     });
  }

  addToDms(user: string) {
    const newDmList = this.usersList.filter((userFromList: any) => userFromList.displayName === this.signedInUser.displayName)[0].dms;
    if(newDmList.includes(user)) {
      console.log('user is already in list');
    } else {
      newDmList.push(user);
      updateDoc(doc(this.db, 'users', this.signedInUser.uid), {
        dms: newDmList
      })
    }
  }

  removeDm(user: string) {
    const currentDms = this.usersList.filter((userFromList: any) => userFromList.displayName === this.signedInUser.displayName)[0].dms;
    const newDmList = currentDms.filter((dm: string) => dm !== user);
    updateDoc(doc(this.db, 'users', this.signedInUser.uid), {
      dms: newDmList
    } )
  }
}
