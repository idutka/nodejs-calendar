const args = process.argv.slice(2);

const data = {};

args.forEach((item) => {
    const [key, value] = item.split('=')
    data[key.substr(1)] = value
});

module.exports.PORT = process.env.PORT;
module.exports.ENV = data.env;
