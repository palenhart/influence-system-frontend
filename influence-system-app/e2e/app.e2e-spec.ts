import { InfluenceSystemAppPage } from './app.po';

describe('influence-system-app App', () => {
  let page: InfluenceSystemAppPage;

  beforeEach(() => {
    page = new InfluenceSystemAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
