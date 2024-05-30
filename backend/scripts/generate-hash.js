const Hash = require('../dist/services/Hash').default;

const plain = process.argv[2];

if (!plain) {
    console.log('error');
    return;
}

Hash.hash(plain).then(result => {
    console.log(result);
})