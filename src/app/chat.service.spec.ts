import { ChatMessage, NickMessage, ErrorMessage } from './chat.service';

describe('Message', () => {
    describe('ChatMessage', () => {
        it('should provide proper string', () => {
            let msg = new ChatMessage();
            msg.author = 'Mr. Author';
            msg.body = 'His message';

            expect(msg.toString()).toEqual('Mr. Author: His message');
        });
    });

    describe('NickMessage', () => {
        let msg: NickMessage;

        beforeEach(() => {
            msg = new NickMessage();
            msg.oldName = '';
            msg.newName = '';
        });

        it('should provide info about entering channel', () => {
            msg.newName = 'New me';
            expect(msg.toString()).toEqual('New me has joined the channel');
        });

        it('should provide name change info', () => {
            msg.oldName = 'Old me';
            msg.newName = 'New me';
            expect(msg.toString()).toEqual('Old me has changed nick to New me');
        });

        it('should provide info about leaving channel', () => {
            msg.oldName = 'Old me';
            expect(msg.toString()).toEqual('Old me has left the channel');
        });
    });

    describe('ErrorMessage', () => {
        it('should provide error message', () => {
            let msg = new ErrorMessage();
            msg.errorCode = '123';
            msg.message = 'something bad happened';

            expect(msg.toString()).toEqual('Error (123): something bad happened');
        });
    });
});
