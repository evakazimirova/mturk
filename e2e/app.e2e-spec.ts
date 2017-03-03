import { TemplPage } from './app.po';

describe('templ App', () => {
  let page: TemplPage;

  beforeEach(() => {
    page = new TemplPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
