function assert(assertion, message) {
    if (!assertion) throw new Error('Assertion failed: ' + message);
}

function addToUI(message){
    const ul = document.getElementById('spec-result')
    const li = document.createElement('li')
    li.innerHTML = message
    ul.append(li)
}

function it(should, test) {
    try {
        test();

        addToUI(`<span style="color: green">${should} √</span>`);
    } catch (error) {
        console.log(should + '\n', error);
    }
}

function describe(description, tests) {
    'use strict';

    addToUI(`<span style="color: blue">${description}</span>`);

    tests();
}

function expect(target) {
    return {
        toBe: function (expected) {
            assert(target === expected, 'expected ' + target + ' to be ' + expected);
        },

        not: {
            toBe: function (expected) {
                assert(target !== expected, 'expected ' + target + ' not to be ' + expected);
            }
        },

        toThrowError: function (errorType, message) {
            var fail;

            try {
                target();
            } catch (error) {
                fail = error;
            }

            assert(typeof fail !== 'undefined', 'should error ' + fail + ' be defined');
            assert(fail instanceof errorType, 'should error be of type ' + errorType.name + ' but got ' + fail.constructor.name);
            assert(fail.message === message, 'should fail with message "' + message + '", but got "' + fail.message + '"');
        },

        toBeInstanceOf: function (expected) {
            assert(target instanceof expected, 'expected ' + target.constructor.name + ' to be instance of ' + expected.name);
        },

        toBeDefined: function () {
            assert(typeof target !== 'undefined', 'should ' + target + ' be defined');
        },

        toBeUndefined: function () {
            assert(typeof target === 'undefined', 'should ' + target + ' be undefined');
        }
    }
}