const puppeteer = require("puppeteer");

async function Start() {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });
  await page.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  await page.goto(
    "https://damsaequipos.com.mx:2083/cpsess2031748331/frontend/paper_lantern/index.html"
  );

  //Login
  await page.waitForSelector("#user");
  await page.type("#user", "maximo84");
  await page.type("#pass", "Sarabia144");
  await page.click("#login_submit");

  //Select Account

  await page.waitForSelector("#ddlAccounts_chosen");
  await page.waitForTimeout(1500);
  await page.click("#ddlAccounts_chosen");
  await page.type(
    "#ddlAccounts_chosen > div > div > input[type=text]",
    "fumigaciones.com"
  );
  await page.click("#ddlAccounts_chosen > div > ul > li:nth-child(1)");

  //Entry to Emails

  await page.waitForSelector("#item_email_accounts");
  await page.click("#item_email_accounts");
  await page.waitForTimeout(1500);
  await page.click("#email_table_menu_webmail_asistente\\@fumigaciones\\.com");
  await page.waitForTimeout(3000);
  const pages = await browser.pages();
  const emailPage = await pages[2];

  await emailPage.setViewport({ width: 1366, height: 768 });
  await emailPage.setUserAgent(
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
  );

  //Configure Emails view

  

  //Search Email

  await emailPage.waitForSelector("#quicksearchbox");
  await emailPage.type("#quicksearchbox", "fumigaciones.com:");
  await emailPage.click("#searchmenulink");
  await emailPage.click("#searchmenu > div > a");

  await emailPage.waitForTimeout(2000);
  //Get Emails
  await emailPage.waitForSelector("#messagelist > tbody");
  await emailPage.$eval("#messagelist > tbody", (element) => {
    const emails = element.childNodes;

    emails.forEach((element) =>
      console.log(element.childNodes[6].lastChild.childNodes[0].title)
    );
  });
}

Start();

/*

let bt = document.querySelectorAll('#messagelist > tbody');
console.log(bt[0].childNodes[0].cells[3].lastElementChild.firstChild.title);

*/
