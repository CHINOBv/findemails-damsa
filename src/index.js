const axios = require('axios');
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

class Actions {
  emailPage;
  constructor(page, browser) {
    this.page = page;
    this.browser = browser;
  }
  Login = async () => {
    await this.page.waitForSelector("#user");
    await this.page.type("#user", "maximo84");
    await this.page.type("#pass", "Sarabia144");
    await this.page.click("#login_submit");
  };
  ChangeAccount = async () => {
    await this.page.waitForSelector("#ddlAccounts_chosen");
    await this.page.waitForTimeout(1500);
    await this.page.click("#ddlAccounts_chosen");
    await this.page.type(
      "#ddlAccounts_chosen > div > div > input[type=text]",
      "fumigaciones.com"
    );
    await this.page.click("#ddlAccounts_chosen > div > ul > li:nth-child(1)");
  };
  EntryEmails = async () => {
    await this.page.waitForSelector("#item_email_accounts");
    await this.page.click("#item_email_accounts");
    await this.page.waitForTimeout(1500);
    await this.page.click(
      "#email_table_menu_webmail_asistente\\@fumigaciones\\.com"
    );
    await this.page.waitForTimeout(3000);
    const pages = await this.browser.pages();
    this.emailPage = await pages[2];

    await this.emailPage.setViewport({ width: 1366, height: 768 });
    await this.emailPage.setUserAgent(
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
    );
  };
  getEmailPage = () => this.emailPage;

  SearchEmails = async () => {
    await this.emailPage.waitForSelector("#quicksearchbox");
    await this.emailPage.type("#quicksearchbox", "fumigaciones.com:");
    await this.emailPage.click("#searchmenulink");
    await this.emailPage.click("#searchmenu > div > a");
  };
  getEmailsPerPage = async (page) => {
    for (let i = 1; i <= page; i++) {
      if (i !== 4) {
        await this.emailPage.waitForSelector("#messagelist > tbody");
        await iterateEmails(this.emailPage);
        await this.emailPage.click("#rcmbtn133");
      } else {
        console.log("==============END=============");
      }
    }
    await iterateEmails(this.emailPage);
  };
}

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
  const actions = new Actions(page, browser);
  await actions.Login();

  //Select Account
  //Se cambia a la cuenta de Fumigaciones
  await actions.ChangeAccount();
  //Entry to Emails
  //Entra al listado de emails en el hosting

  await actions.EntryEmails();
  const emailPage = await actions.getEmailPage();
  //Configure Emails view

  //Search Email
  //Se hace la busqueda entre los correos
  await actions.SearchEmails();

  //Get Emails Page 1
  //Se obtiene el cuerpo de la tabla que contiene los emials
  await emailPage.waitForSelector("#messagelist > tbody");
  await actions.getEmailsPerPage(4);
  return emailsDatas.flat();
}

Start();

(async () => {
  const emails = await Start();
  //console.log(emails);
  let c = 0;

  await emails.forEach(async (email) => {
    axios("https://rest.gohighlevel.com/v1/contacts/", {
      method: "post",
      headers: {
        Authorization: "Bearer 9ecbe4ab-50c7-4f7b-a656-8867063d0026",
        "Content-Type": "application/json",
      },
      data: {
        email: email.emailAddress,
        name: email.emailFormTo,
        tags: ["fumigacionescom", "clientes"],
      },
    })
      .then(() => {
        c = c + 1;
        //console.log(newUser);
        console.log(c);
      })
      .catch((er) => console.log(er));
  });
  console.log("=====END========");
})();
