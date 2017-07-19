export function runSequence(stack) {
  let pointer = 0;

  // (function() {
  function getNext() {
    const current = stack[pointer];
    pointer += 1;

    if (current)
      current(getNext);
  }

  getNext();
}

export function flatten(arr) {
  const res = [];

  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr[i].length; j++) {
      res.push(arr[i][j]);
    }
  }

  return res;
}
