import expect from 'expect.js';
import { Intents } from '../';

describe('Intents.intent', function() {
    it('should send the promise to registered listeners', function(done) {
        class MyClass extends Intents {
            sayHello(name){
                return this.intent('hello', name);
            }
        }
        var obj = new MyClass();
        var params;
        var result;
        obj.on('hello', function(intent){
            params = intent.params;
            intent.then(function(r){
                result = r;
            });
        });
        expect(params).to.be(undefined);
        expect(result).to.be(undefined);
        var intent = obj.sayHello('Hello');
        expect(params).to.be('Hello');
        expect(result).to.be(undefined);
        expect(intent.handled).to.be(false);
        
        intent.then(function(r){
            expect(intent.handled).to.be(true);
            expect(params).to.be('Hello');
            expect(result).to.be('World');
        })

        expect(params).to.be('Hello');
        expect(result).to.be(undefined);
        expect(intent.handled).to.be(false);

        intent.resolve('World').then(function(r){
            expect(intent.handled).to.be(true);
            expect(result).to.be('World');
            expect(r).to.be('World');
        }).then(done, done);
        expect(intent.handled).to.be(true);
    });
});

describe('Intents.action', function() {
    it('should notify about the action registered listeners', function(done) {
        class MyClass extends Intents {
            sayHello(params){
                return this.action('hello', params, function(intent){
                    setTimeout(function(){
                        intent.resolve('World');
                    }, 10);
                });
            }
        }
        var obj = new MyClass();
        var params;
        var result;
        obj.on('hello', function(intent){
            params = intent.params;
            intent.then(function(r){
                result = r;
            });
        });
        expect(params).to.be(undefined);
        expect(result).to.be(undefined);

        var intent = obj.sayHello('Hello');
        expect(params).to.be('Hello');
        expect(result).to.be(undefined);
        
        intent.then(function(r){
            expect(intent.handled).to.be(true);
            expect(params).to.be('Hello');
            expect(r).to.be('World');
            expect(result).to.be('World');
        }).then(done, done);
    });
    it('should notify about errors in the action function', function(done) {
        class MyClass extends Intents {
            sayHello(params){
                return this.action('hello', params, function(intent){
                    throw 'World!';
                });
            }
        }
        var obj = new MyClass();
        var params;
        var result;
        var error;
        obj.on('hello', function(intent){
            params = intent.params;
            intent.then(function(r){
                result = r;
            }, function(err) {
                error = err;
            });
        });
        expect(params).to.be(undefined);
        expect(result).to.be(undefined);
        var intent = obj.sayHello('Hello');
        expect(error).to.be(undefined);
        // The error was thrown synchronously
        expect(intent.handled).to.be(true);

        expect(params).to.be('Hello');
        expect(result).to.be(undefined);
        expect(error).to.be(undefined);
        
        intent.then(function(r){
            expect().fail();
        }, function(err) {
            expect(params).to.be('Hello');
            expect(result).to.be(undefined);
            expect(error).to.be('World!');
        }).then(done, done);
    });        
});
