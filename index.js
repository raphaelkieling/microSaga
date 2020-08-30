import axios from "axios";
import { microSaga, delay, satisfy, all, fork, spawn } from "./core/micro";

function* newThread() {
  console.log('Running in a new "thread"');
  const data = yield all([delay(3000, "1"), delay(1000, "2"), 3]);
  console.log('Done "thread"');
  return data;
}

function* root() {
  console.log("Init");
  yield delay(3000);
  const request = yield satisfy(
    axios.get("https://jsonplaceholder.typicode.com/todos/1")
  );

  console.log("From first request: ", request.data);

  yield spawn(newThread());

  console.log("Finish");
}

microSaga(root());
