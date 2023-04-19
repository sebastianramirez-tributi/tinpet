import { createTransform } from 'redux-persist'
import { encryptTransform } from 'redux-persist-transform-encrypt'
import storageLocal from 'redux-persist/lib/storage'
import storageSession from 'redux-persist/lib/storage/session'

const personalInfoTransform = createTransform(
  (state) => ({ ...state, currentFiling: undefined }),
  (state) => ({ ...state, currentFiling: {} }),
  {
    whitelist: ['personalInfo'],
  }
)

export const personalInfoPersistConfig = {
  key: 'current-filing',
  storage: storageSession,
  whitelist: ['currentFiling'],
  transforms: [
    // encryptTransform({
    //   // @TODO change for a unique key by user
    //   secretKey: 'hello-world',
    // }),
  ],
}

export const rootPersistConfig = {
  key: 'personal-info',
  storage: storageLocal,
  whitelist: ['personalInfo'],
  transforms: [
    personalInfoTransform,
    // encryptTransform({
    //   // @TODO change for a unique key by user
    //   secretKey: 'hello-world',
    // }),
  ],
}
