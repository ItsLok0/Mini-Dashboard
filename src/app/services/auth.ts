import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInAnonymously, signInWithEmailAndPassword, signOut, user, User } from '@angular/fire/auth';
import { Observable, of, switchMap } from 'rxjs';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private firestore: Firestore = inject(Firestore);
  private router: Router = inject(Router);
  // Observable pour savoir si l'ut est connecté ou non
  user$: Observable<User | null> = user(this.auth);

  // Observable pour récupérer les données supplémentaires de l'utilisateur
  userData$: Observable<any> = this.user$.pipe(
    switchMap(user => {
      if (user) {
        const userDocRef = doc(this.firestore, `users/${user.uid}`);
        return docData(userDocRef);
      } else {
        return of(null);
      }
    })
  );

  // Inscription d'un nouvel utilisateur
  async register(email: string, password: string, moreData: any) {
    // Création de l'utilisateur avec email et mot de passe
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    
    const uid = userCredential.user.uid;
    
    const userData = {
      uid: uid,
      email: email,
      firstName: moreData.firstName,
      lastName: moreData.lastName,
      createdAt: new Date()
    };
    const userDocRef = doc(this.firestore, `users`, uid);
    return setDoc(userDocRef, userData);
  }

  // Connexion d'un utilisateur existant
  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  async loginAsGuest() {
    try {
      const result = await signInAnonymously(this.auth);
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        firstName: 'Invité',
        lastName: 'Invité',
        createdAt: new Date()
      };
      const userDocRef = doc(this.firestore, `users`, result.user.uid);
      await setDoc(userDocRef, userData);
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Erreur de connexion invité:', error);
      throw error;
    }
  }

  // Déconnexion de l'utilisateur
  logout(): Promise<void> {
    if (this.auth.currentUser?.isAnonymous) {
      //SUppression de l'utilisateur si c'est un compte invité (éviter surchage en BDD)
      return this.auth.currentUser.delete().then(() => {
        return signOut(this.auth);
      }).catch((error) => {
        console.error(error);
        return;
      });
    }
    return signOut(this.auth);
  }
}
