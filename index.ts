/**
 * Imports required modules and types.
 */
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'
import { Page } from 'puppeteer'

// Use stealth plugin to avoid detection
puppeteer.use(StealthPlugin())

/**
 * Represents a book with title and author.
 */
interface Book {
  title: string
  author: string
}

/**
 * Logs in to the Audible website.
 * @param page - The Puppeteer Page object to interact with.
 * @returns A promise that resolves when login is complete.
 */
async function login(page: Page): Promise<void> {
  await page.goto('https://www.audible.com/sign-in');
  await page.waitForFunction(
    () => window.location.href === 'https://www.audible.com/?loginAttempt=true',
    { timeout: 60000 }
  );
}


/**
 * Scrapes a single page of the Audible library.
 * @param page - The Puppeteer Page object to interact with.
 * @param pageNum - The page number to scrape.
 * @returns A promise that resolves to an array of Book objects.
 */
async function scrapePage(page: Page, pageNum: number): Promise<Book[]> {
  await page.goto(`https://www.audible.com/library/titles?pageSize=50&page=${pageNum}`, { waitUntil: 'networkidle0' });

  const books = await page.evaluate(() => {
    const bookElements = document.querySelectorAll('.adbl-library-content-row');
    return Array.from(bookElements).map((element) => {
      const titleElement = element.querySelector('.bc-text');
      const authorElement = titleElement?.parentNode?.parentNode?.parentNode?.children[1];
      return {
        title: titleElement?.textContent?.trim() ?? '',
        author: (authorElement?.textContent?.trim() ?? '').replace('By:', '').trim().split(',')[0].trim(),
      };
    });
  });

  return books;
}

/**
 * Scrapes the entire Audible library.
 * @returns A promise that resolves to an array of all Book objects in the library.
 */
async function scrapeAudibleLibrary(): Promise<Book[]> {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Login
  await login(page);

  let allBooks: Book[] = [];
  let currentPage = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    console.log(`Scraping page ${currentPage}...`);
    const books = await scrapePage(page, currentPage);
    allBooks = allBooks.concat(books);

    hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector('.nextButton:not(.bc-button-disabled)');
      return !!nextButton;
    });

    currentPage++;
  }

  await browser.close();
  return allBooks;
}

/**
 * Main function to execute the Audible library scraping process.
 */
async function main() {
  try {
    const books = await scrapeAudibleLibrary();
    console.log(JSON.stringify(books, null, 2));
    console.log(`Total books scraped: ${books.length}`);
  } catch (error) {
    console.error('Error scraping Audible library:', error);
  }
}

// Execute the main function
main();

