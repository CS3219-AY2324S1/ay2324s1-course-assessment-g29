describe('Test /question', () => {
    describe('Get by name on sync', () => {
        it('health should be okay', () => {
            const actualResult = healthCheckSync();
            expect(actualResult).to.equal('OK');
        });
    });
});