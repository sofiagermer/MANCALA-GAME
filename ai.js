/*
function recursiveCall (number) {
    if (number == 47) return number;
    return recursiveCall(number-1);
}


var value = recursiveCall(85);
console.log("value = " + value);
*/

var targetObj = [0, 0];

console.log("targetObj[0] = " + targetObj[0]);
console.log("targetObj[1] = " + targetObj[1]);

var targetProxy = new Proxy(targetObj, {
  set: function (target, key, value) {
      console.log(key + " set to " + value);
      target[key] = value;
      return true;
  }
});

targetProxy[0] = 10;


console.log("targetObj[0] = " + targetObj[0]);
console.log("targetObj[1] = " + targetObj[1]);
