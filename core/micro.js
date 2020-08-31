function _isPromise(value) {
  return 'then' in value;
}

export function microSaga(generator, init = null) {
  const next = generator.next(init);
  const { value, done } = next;

  if (done) return value;

  if (_isPromise(value)) {
    return value.then((result) => {
      return microSaga(generator, result);
    });
  }

  switch (value.type) {
    case 'SATISFY':
      return value.payload.then((result) =>
        microSaga(generator, result)
      );

    case 'FORK':
      return microSaga(value.payload).then((dataFromFork) => {
        return microSaga(generator, dataFromFork);
      });

    case 'SPAWN':
      microSaga(value.payload);
      return microSaga(generator);

    case 'ALL':
      return Promise.all(value.payload).then((result) => {
        return microSaga(generator, result);
      });

    default:
      return microSaga(generator);
  }
}

// Core functions
export function delay(time, rt) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(rt);
    }, time);
  });
}

export function satisfy(promise) {
  return {
    type: 'SATISFY',
    payload: promise
  };
}

export function all(functions) {
  return {
    type: 'ALL',
    payload: functions
  };
}

export function fork(generator) {
  return {
    type: 'FORK',
    payload: generator
  };
}

export function spawn(generator) {
  return {
    type: 'SPAWN',
    payload: generator
  };
}
