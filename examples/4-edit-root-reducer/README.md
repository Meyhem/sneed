This example will scaffold a new reducer file and registers this reducer to existing rootReducer.js file. Observe how existing _redux/rootReducer.js_ will automatically receive your newly generated reducer.

This way you can easily automate whole process of addition of new features.

```sh
$ sneed reducer --feature user
```

will create _redux/userReducer.js_

```js
const initialState = {}

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'DUMMY_ACTION':
      return { ...state }
    default:
      return state
  }
}
```

and will also insert import statement and registration into existing rootReducer.js file

```js
import { combineReducers } from 'redux'

// SNEED INSERT IMPORT
import { userReducer } from 'userReducer'

export const rootReducer = combineReducers({
  // SNEED INSERT REDUCER
  user: userReducer,
})
```

Check out .sneedrc.js for more details on markings & insertion configuration
