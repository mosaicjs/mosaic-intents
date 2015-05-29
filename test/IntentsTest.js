import expect from 'expect.js';
import { Intents } from '../';


function testIntents(MyClass){
    describe('Intents.intent', function() {
        it('should send the promise to registered listeners', function(done) {
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
            var intent = obj.sayHelloWithIntent('Hello');
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
    
            var intent = obj.sayHelloWithAction('Hello');
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
            var intent = obj.sayHelloWithError('Hello');
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
}
describe('Intents', function(){
    describe('Class inheriting from Intents:', function() {
        class MyClass extends Intents {
            sayHelloWithIntent(name){
                return this.intent('hello', name);
            }
            sayHelloWithAction(params){
                return this.action('hello', params, function(intent){
                    setTimeout(function(){
                        intent.resolve('World');
                    }, 10);
                });
            }
            sayHelloWithError(params){
                return this.action('hello', params, function(intent){
                    throw 'World!';
                });
            }
        }
        testIntents(MyClass);
    });
    describe('Class using Intents as mix-ins:', function() {
        class MyClass {
            constructor(){
                Intents(this);
            }
            sayHelloWithIntent(name){
                return this.intent('hello', name);
            }
            sayHelloWithAction(params){
                return this.action('hello', params, function(intent){
                    setTimeout(function(){
                        intent.resolve('World');
                    }, 10);
                });
            }
            sayHelloWithError(params){
                return this.action('hello', params, function(intent){
                    throw 'World!';
                });
            }
        }
        Intents.addTo(MyClass);
        testIntents(MyClass);
    });
});

