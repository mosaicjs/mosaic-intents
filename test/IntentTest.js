import expect from 'expect.js';
import { Intent } from '../';

describe('Intent', function() {
    it('should be able to execute registered operations ' + 
            'before it returns results', function(done) {
        let intent = new Intent({}, 'abc');
        let results = [];
        intent.then(function(res){
            results.push('end:' + res);
        });
        intent.after(function(res){
            results.push('A:' + res);
        });
        intent.after(function(res){
            results.push('B:' + res);
        });
        
        intent.resolve('X');
        expect(results).to.eql([]);
        intent.then(function(res){
            expect(res).to.be('X');
            expect(results).to.eql(['A:X', 'B:X', 'end:X']);
        }).then(done, done);
    });
    
    it('should bind the intent instance to the intent.resolve method', function(done) {
        let intent = new Intent({});
        let resolve = intent.resolve;
        intent.then(function(result){
            expect(result).to.be('Hello, world!');
        }).then(done, done);
        resolve('Hello, world!');
    });
    it('should bind the intent instance to the intent.reject method', function(done) {
        let intent = new Intent({});
        let reject = intent.reject;
        intent.then(function(result){
            expect().fail();
        }, function(err){
            expect(err).to.eql('Hello, world!');
        }).then(done, done);
        reject('Hello, world!');
    });
    
});

