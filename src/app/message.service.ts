import { Injectable } from '@angular/core';
import { getFirestore, collection, doc, setDoc, query, where, getDocs, onSnapshot, or, and } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { environment } from 'src/environments/environment'

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  app = initializeApp(environment.firebaseConfig);
  db = getFirestore(this.app);

  messages = [];

  constructor() { }

  saveNewMessage(newMessage: any) {
    try {
      setDoc(doc(this.db, 'messages', newMessage.date), {
        date: newMessage.date,
        from: newMessage.from,
        message: newMessage.message,
        read: false,
        to: newMessage.to
      })
    }
    catch(error: any) {
      console.log(error)
    }
  }

  loadMessages(toUser: string, fromUser: string) {
    try {
      const q = query(
        collection(this.db, 'messages'),
        or(and(where('to', '==', toUser), where('from', '==', fromUser)),
        and(where('from', '==', toUser), where('to', '==', fromUser)))
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const usersMessages: any = [];
        querySnapshot.forEach((doc) => {
          usersMessages.push(doc.data());
        });
        this.messages = usersMessages;
      })
    }
    catch(error) {
      console.log(error);
    }
  }
}
