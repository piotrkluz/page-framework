import { Page, Browser, LaunchOptions, launch, connect } from "puppeteer";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

const WS_ENDPOINT = path.join(os.tmpdir(), "puppeteerEndpoint.txt");

declare var page: Page;
export default class BrowserUtils {
    /**
     * Initializes new browser instance OR connect to previously running one if possible.
     * Set globals:
     * page -> Puppeter page instance
     * browser -> Puppeteer browser instance
     * @param options 
     */
    static async init(options: LaunchOptions = {}) {
        //Initialize browser with page
        const browser = await this.tryConnect() || await this.runBrowser(options);
        const page = (await browser.pages())[0];
        this.storeEndpointInFile(browser.wsEndpoint());

        //SET GLOBALS
        (<any>global).browser = browser;
        (<any>global).page = page;
    }

    /**
     * Sets up download path for currently running puppeteer browser.
     * @param path 
     */
    static async setUpDownloadPath(path) {
        const client = await page.target().createCDPSession();
        await client.send('Page.setDownloadBehavior', {
            behavior: 'allow',
            downloadPath: path
        });
    }

    static async disconnect() {
        (<any>global).browser.disconnect();
    }
    
    static async runBrowser(options: LaunchOptions = {}) {
        return await launch(options);
    }
    
    /**
     * Tries to connect to already running browser. 
     * Gets wsEndpoint from OS temp directory.
     */
    static async tryConnect(): Promise<Browser> {
        try {
            return await connect({browserWSEndpoint: this.loadEndpointFromFile() })
        } catch (e) {
            return null;
        }
    }
    
    static storeEndpointInFile(wsEndpoint: string) {
        fs.writeFileSync(WS_ENDPOINT, wsEndpoint)
    }
    
    static loadEndpointFromFile(): string {
        return fs.readFileSync(WS_ENDPOINT).toString().trim();
    }
}