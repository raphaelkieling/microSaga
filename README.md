## MicroSaga

---

A simple study to understand how the redux saga works internally. I did create a base flow with:

- **satisfy**: satisfy a promise resolving
- **delay**: create a delayed function
- **fork**: create a new microSaga but running in other generator function using recursion
- **spawn**: the same as fork but dettach to not block the sequenced operations
- **all**: make a simple `Promise.all` and resolve

All the microSaga is around generators and recursion. I did use recursion because i read that generator is like a program then i thought that a good idea use concepts like a compiler or interpreter to do that.

```js
function* newThread() {
  console.log('Running in a new "thread"');
  const data = yield all([delay(3000, 1), delay(1000, 2), 3]);
  console.log('Done "thread"');
  return data;
}

function* root() {
  console.log("Init");
  yield delay(3000);
  yield spawn(newThread());
  console.log("Finish");
}

microSaga(root());
```

- Will start the generators
- `output: "Init"`
- The interpreter will resolve the delay first (block)
- The interpreter will create a new "thread" with `spawn`  (not block)
- `output: "Finish"`
- `output:[1,2,3]`
