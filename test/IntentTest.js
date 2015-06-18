import expect from 'expect.js';
import { Intent } from '../';

describe('Intent', function() {
    it('should be able to execute registered operations before it returns results', function(done) {
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
});

