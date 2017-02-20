import { OywoPage } from './app.po';

describe('oywo App', function() {
  let page: OywoPage;

  beforeEach(() => {
    page = new OywoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
