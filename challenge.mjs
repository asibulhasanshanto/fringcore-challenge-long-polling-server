var blockedRequestKeys = [
  /*
    {
        key:"mango",
        queue:[
            {
                callbackFunction: function(){},
                timmer:timmer
            }
        ]
    }
    */
];
export async function blockingGet(key) {
  //   search for the key in blockedRequestKeys
  var blockedRequestKey = blockedRequestKeys.find(
    (blockedRequestKey) => blockedRequestKey.key === key
  );
  //   if it is not found, create a new entry in blockedRequestKeys with an empty queue
  if (!blockedRequestKey) {
    blockedRequestKey = {
      key: key,
      queue: [],
    };
    blockedRequestKeys.push(blockedRequestKey);
  }

  const queueItem = {
    callbackFunction: null,
    timmer: null,
  };
  blockedRequestKey.queue.push(queueItem);
  console.log("new request");
  return new Promise((resolve, reject) => {
    queueItem.timmer = setTimeout(() => {
      clearTimeout(queueItem.timmer);
      queueItem.timmer = null;
      queueItem.callbackFunction = null;
      resolve(null);
    }, 30000);
    queueItem.callbackFunction = resolve;
  });
}

export async function push(key, data) {
  //   search for the key in blockedRequestKeys
  var blockedRequestKey = blockedRequestKeys.find(
    (blockedRequestKey) => blockedRequestKey.key === key
  );

  if (blockedRequestKey) {
    //   if the queue is empty, return
    if (blockedRequestKey.queue.length === 0) {
      return;
    }
    //   if the queue is not empty, remove the first item from the queue
    const queueItem = blockedRequestKey.queue.shift();
    //   if the queueItem has a callbackFunction, call it with the data
    if (queueItem.callbackFunction) {
      clearTimeout(queueItem.timmer);
      queueItem.callbackFunction(data);
    }
  }

  return;
}
