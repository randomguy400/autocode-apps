const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const find = await lib.googlesheets.query['@0.3.0'].select({
  range: `A:F`,
  bounds: 'FULL_RANGE',
  where: [{
    'user_id__is': `2`
  }],
  limit: {
    'count': 0,
    'offset': 0
  }
});

console.log(find);
console.log(find.rows[0].fields)
console.log(find.rows[1].fields)
console.log(find.rows[2].fields)