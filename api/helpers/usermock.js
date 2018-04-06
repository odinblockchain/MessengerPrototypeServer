var faker = require('faker');

const Messages = [
  'New phone, who dis?',
  'Last night was crazy!',
  'The cake is moist',
  'Just read all that FUD lol',
  'I voted Trump',
  'I wiretapped the oval office',
  'Russia was involved',
  'Did you see the look on Clinton\'s face? LOL',
  'My hands aren\'t small, right?',
  'I actually hate pizza',
  'When moon?',
  'Just bought 100k',
  'Put the cake in the oven',
  'I like it spicy',
  'Just cracked that phone',
  'Secrets secrets secrets',
  'The cake is a lie'
];

let getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
  //The maximum is exclusive and the minimum is inclusive
};

module.exports = {
  name: () => {
    return faker.name.findName();
  },

  email: () => {
    return faker.internet.email();
  },

  message: () => {
    return Messages[~~(Messages.length * Math.random())];
  },

  timestamp: () => {
    let dUTC = new Date();
    dUTC.setUTCHours(dUTC.getUTCHours() + getRandomInt(1, 23));
    dUTC.setUTCMinutes(dUTC.getUTCMinutes() + getRandomInt(1, 59));

    return dUTC.getTime();
  }
}
