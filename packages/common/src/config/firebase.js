import { FirebaseService } from '@tributi-co/tributi-components'

const app = FirebaseService.initialize({
  apiKey: process.env.API_KEY_FIREBASE,
  authDomain: process.env.AUTHDOMAIN__FIREBASE,
  databaseURL: process.env.DATABASE_URL__FIREBASE,
  projectId: process.env.PROJECTID__FIREBASE,
  storageBucket: process.env.STORAGEBUCKET__FIREBASE,
  messagingSenderId: process.env.MESSAGINGSENDERID__FIREBASE,
  appId: process.env.APPID__FIREBASE,
})

export const isFirebaseProduction = process.env.FIREBASE_ENV === 'production'

const certificateCollection = app.getCollection(
  isFirebaseProduction ? 'certificates-status' : 'certificates-status-test'
)

export const refCertificates = certificateCollection.collection
