```sh
$ sneed component --name button
```

will create _src/components/Button.tsx_

```tsx
import React from 'react'

export interface ButtonProps {}

export const Button = () => {
  return <div></div>
}
```

_src/components/index.ts_

```ts
export * from './Button'
```
