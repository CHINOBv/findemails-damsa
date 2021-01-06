const puppeteer = require("puppeteer");

let emailsDatas = [];
const iterateEmails = async (page) => {
  await page.waitForTimeout(2000);

  let emails = await page.$eval("#messagelist > tbody", (element) => {
    let emailsOfPage = [];
    //Aqui se sacan los emails de la tabla, solo las filas
    const emails = element.childNodes;

    //const emailAdress
    emails.forEach((element) => {
      let emailAddress;
      let emailFormTo;
      try {
        //Se itera cada email que se encuentre y lo muestra en la consola, luego de esto sigue pasarlos a bambino
        emailAddress = element.childNodes[6].lastChild.childNodes[0].title;
        emailFormTo =
          element.childNodes[6].lastChild.childNodes[0].childNodes[0].data;
      } catch (error) {
        console.log(error);
      }
      let emailInfo = {
        emailAddress,
        emailFormTo,
      };

      //console.log(emailInfo);
      emailsOfPage.push(emailInfo);
    });
    console.log("=====PAGINA=====");
    return emailsOfPage;
  });

  emailsDatas.push(emails);
};

async function Start() {
  //Se abre el navegador
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
  //Se inicia sesion
  await page.waitForSelector("#user");
  await page.type("#user", "maximo84");
  await page.type("#pass", "Sarabia144");
  await page.click("#login_submit");

  //Select Account
  //Se cambia a la cuenta de Fumigaciones

  await page.waitForSelector("#ddlAccounts_chosen");
  await page.waitForTimeout(1500);
  await page.click("#ddlAccounts_chosen");
  await page.type(
    "#ddlAccounts_chosen > div > div > input[type=text]",
    "fumigaciones.com"
  );
  await page.click("#ddlAccounts_chosen > div > ul > li:nth-child(1)");

  //Entry to Emails
  //Entra al listado de emails en el hosting

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

  //Se hace la busqueda entre los correos
  await emailPage.waitForSelector("#quicksearchbox");
  await emailPage.type("#quicksearchbox", "fumigaciones.com:");
  await emailPage.click("#searchmenulink");
  await emailPage.click("#searchmenu > div > a");

  //Get Emails Page 1
  //Se obtiene el cuerpo de la tabla que contiene los emials
  await emailPage.waitForSelector("#messagelist > tbody");
  await iterateEmails(emailPage);

  //Next Page 2
  await emailPage.click("#rcmbtn133");

  await iterateEmails(emailPage);

  //Next Page 3
  await emailPage.click("#rcmbtn133");
  await iterateEmails(emailPage);

  //Next Page 4
  await emailPage.click("#rcmbtn133");
  await iterateEmails(emailPage);

  let c = 0;
  emailsDatas.forEach((e) => {
    e.forEach(e =>{

      c = c + 1;
      console.log(c);
    })
  });
  console.log(c);
}

Start();

/*

let bt = document.querySelectorAll('#messagelist > tbody');
console.log(bt[0].childNodes[0].cells[3].lastElementChild.firstChild.title);

*/
