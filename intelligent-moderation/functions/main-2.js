const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

var array = [
  {w: true, e: false},
  {w: true, e: 2},
  {w: false, e: 3}
];

let new_array = []

for (let i = 0; i < array.length; i++) {
  let obj = array[i]
  if(obj.w === true)
  new_array.push(`position:` + i)
}

console.log(new_array);