/**
 * Created by paul on 5/15/14.
 */

var Chance = require('chance');
var chance = new Chance();
//var valueGenerator = require('../dataGenerators/valueGenerator.js');
module.exports = {

    random: function (input) {
        //console.log('creating random value: '+ JSON.stringify(input))
        return input.valueList[chance.integer({min: 0, max: input.valueList.length})];
    },

    unique: function (input) {
        //console.log('creating unique value: '+ JSON.stringify(input))
        var value = {};
        if (!input) {
            return chance.string({length: 40});
        }
        value = chance.string({length: input.valueLength});
        if (input.prepend) {
            value = input.prepend + value
        }
        if (input.postpend) {
            value = value + input.postpend;
        }
        return value;
    },
    date: function (input) {
        //console.log('creating data value: '+ JSON.stringify(input))
        dateInMilliseconds = Date.now()
        if (input.differenceFromToday){
            dateInMilliseconds = dateInMilliseconds + input.differenceFromToday;
        }
        return new Date(input.dateInMilliseconds).toJSON();
    }
}
/*
console.log('max unique:'+module.exports.unique())
console.log('7 unique:'+module.exports.unique({valueLength:7 }))
console.log('7 unique:'+module.exports.unique(7,'PRE-'))
console.log('7 unique:'+module.exports.unique(7,'PRE-','-POST'))

console.log('max random:'+module.exports.random(['one','two','three']))
    */