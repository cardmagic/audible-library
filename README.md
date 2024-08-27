# Audible Library Scraper

This project is a TypeScript-based web scraper that extracts book information from your Audible library.

## Features

- Logs into your Audible account
- Scrapes all pages of your Audible library
- Extracts book titles and authors
- Outputs the data as JSON

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (version 14 or higher)
- npm (usually comes with Node.js)
- An Audible account

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/cardmagic/audible-library.git
   ```

2. Navigate to the project directory:
   ```
   cd audible-library
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Run the scraper:
   ```
   npm start
   ```

2. The script will output the scraped book data as JSON in the console.

## Dependencies

- axios: HTTP client for making requests
- cheerio: HTML parsing and manipulation
- openai: OpenAI API client (not currently used in the main scraping functionality)
- puppeteer-extra: Enhanced version of Puppeteer for web scraping
- puppeteer-extra-plugin-stealth: Plugin to make Puppeteer harder to detect

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is for personal use only. Please respect Audible's terms of service and do not use this for any commercial purposes or to violate copyright laws.