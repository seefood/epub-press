'use strict';

const assert = require('chai').assert;
const BookServices = require('../lib/book-services');
const Book = require('../lib/book');
const Sinon = require('sinon');
const nock = require('nock');

require('sinon-as-promised');

const urls = ['http://www.a.com', 'http://www.b.com'];
const html = '<title>HTML</title><p>Hello World</p>';
let book;

describe('Book Services', () => {
    beforeEach(() => {
        book = new Book({
            urls,
        });
    });

    describe('html methods', () => {
        it('can update sections html', (done) => {
            const stub = Sinon.stub(BookServices, 'updateSectionHtml');
            stub.resolves({});

            BookServices.updateSectionsHtml(book).then(() => {
                stub.getCalls().forEach((call) => assert.include(urls, call.args[0].url));
                assert.equal(stub.callCount, 2);

                stub.restore();
                done();
            }).catch((err) => {
                stub.restore();
                done(err);
            });
        });

        it('can update section html', (done) => {
            const section = { url: urls[0] };
            nock(urls[0]).get('/').reply(200, html);

            BookServices.updateSectionHtml(section).then((updatedSection) => {
                assert.equal(updatedSection.html, section.html);

                done();
            }).catch(done);
        });
    });

    describe('extraction methods', () => {
        it('can extract sections content', (done) => {
            const stub = Sinon.stub(BookServices, 'extractSectionContent');
            const mockSection = { content: '<p>Content</p>', title: 'HTML' };
            stub.resolves(mockSection);

            BookServices.extractSectionsContent(book).then(() => {
                assert.equal(stub.callCount, book.getSections().length);

                stub.restore();
                done();
            }).catch((err) => {
                stub.restore();
                done(err);
            });
        });

        it('can extract html content', (done) => {
            const section = { html };

            BookServices.extractSectionContent(section).then((extractedSection) => {
                assert.equal(extractedSection.title, 'HTML');
                assert.include(extractedSection.content, `<h1>${extractedSection.title}</h1>`);

                done();
            }).catch(done);
        });
    });
});
