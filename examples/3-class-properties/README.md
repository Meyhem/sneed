```sh
$ sneed class --name MyClass --properties name,surname,age,address
```

will create _src/generated-class.ts_

```ts
export class MyClass {
  name: string
  surname: string
  age: string
  address: string
}
```
