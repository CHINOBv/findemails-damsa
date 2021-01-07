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

  return emails;
};
module.exports = {iterateEmails};