import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import os from "os";
import axios from "axios";

const downloadDir = path.join(os.tmpdir());

const startBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page._client().send("Page.setDownloadBehavior", {
    behavior: "allow",
    downloadPath: downloadDir,
  });
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.on("error", (err) => console.error("PAGE ERROR:", err));
  page.on("pageerror", (pageErr) => console.error("PAGE ERROR:", pageErr));

  return { browser, page };
};

const login = async (page) => {
  try {
    console.log("Navigating to the login page...");
    await page.goto("https://www.micarrefour.com.ar/", {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    console.log("Clicking on the login button...");
    await page.locator(".ingresar_acceder_hogar").click();

    console.log("Taking screenshot before login button click...");
    await page.screenshot({ path: "before_login_button_click.png" });

    console.log("Waiting for email input to be visible...");
    await page.waitForSelector("#email", { visible: true, timeout: 60000 });
    await page.locator("#email").fill("robert151196@gmail.com");

    console.log("Waiting for password input to be visible...");
    await page.waitForSelector("#password", { visible: true, timeout: 60000 });
    await page.locator("#password").fill("Jacomilo2022");

    console.log("Taking screenshot after filling email and password...");
    await page.screenshot({ path: "after_filling_email_and_password.png" });

    console.log("Submitting login form...");
    await page.waitForSelector('#login-form button[type="submit"]', {
      visible: true,
      timeout: 20000,
    });
    await page.locator('#login-form button[type="submit"]').click();

    console.log("Waiting for login to complete...");
  } catch (error) {
    console.error("Error during login:", error);
    const screenshotPath = "error_screenshot.png";
    await page.screenshot({ path: screenshotPath });
    console.log(`Screenshot of the error saved at ${screenshotPath}`);
  }
};

const navigateToBilling = async (page) => {
  console.log("Waiting for 'Mis Consumos' element to be visible...");
  await page.waitForSelector('li[class*="consumos"]', {
    visible: true,
    timeout: 60000,
  });
  await page.locator('li[class*="consumos"]').click();

  console.log("Waiting for navigation...");
  await page.waitForNavigation({ waitUntil: "networkidle0" });
};

const fetchLatestPurchaseDate = async () => {
  try {
    const {
      data: { date },
    } = await axios.get(`${process.env.API_ENDPOINT}/latest_purchase`);
    const dateObject = new Date(date);

    const pad = (num) => num.toString().padStart(2, "0");

    // Format: dd/mm/yyyy hh:mm:ss
    const formattedDate =
      `${pad(dateObject.getDate())}/${pad(
        dateObject.getMonth() + 1
      )}/${dateObject.getFullYear()} ` +
      `${pad(dateObject.getHours())}:${pad(dateObject.getMinutes())}:${pad(
        dateObject.getSeconds()
      )}`;
    return formattedDate;
  } catch (error) {
    console.error("Error fetching latest purchase date:", error);
    return null;
  }
};

const processBillingItems = async (page, downloadDir) => {
  const latestPurchaseDate = await fetchLatestPurchaseDate();

  const toUnixTimestamp = (dateStr) => {
    const [day, month, year, hour, minute, second] = dateStr
      .split(/[:/ ]/)
      .map(Number);
    return new Date(year, month - 1, day, hour, minute, second).getTime();
  };

  const gtTimestamp = latestPurchaseDate
    ? toUnixTimestamp(latestPurchaseDate)
    : null;
  console.log("gtTimestamp:", gtTimestamp);

  const tmpDir = path.join(os.tmpdir(), "tmp");
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  const rowsWithPositions = await page.$$eval(
    "#consumos-lista tbody tr",
    (trs, gtTimestamp) => {
      const toUnixTimestamp = (dateStr) => {
        const [day, month, year, hour, minute, second] = dateStr
          .split(/[:/ ]/)
          .map(Number);
        return new Date(year, month - 1, day, hour, minute, second).getTime();
      };

      return trs
        .map((tr, index) => {
          const dateText = tr.querySelector("td:nth-child(1)")?.innerText;
          const rowTimestamp = toUnixTimestamp(dateText);
          return { index, rowTimestamp, dateText };
        })
        .filter(
          ({ rowTimestamp }) => !gtTimestamp || rowTimestamp > gtTimestamp
        );
    },
    gtTimestamp
  );

  for (const { index, dateText } of rowsWithPositions) {
    const rowSelector = `tbody tr:nth-child(${index + 1})`;

    // Select the row element
    const row = await page.$(rowSelector);

    console.log("Processing row with date:", dateText);

    // Define file name
    const [day, month, year, hour, minute, second] = dateText
      .split(/[:/ ]/)
      .map(Number);
    const dateObject = new Date(year, month - 1, day, hour, minute, second);
    const newFileName = `${dateObject.getDate().toString().padStart(2, "0")}${(
      dateObject.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${dateObject.getFullYear()}_${dateObject
      .getHours()
      .toString()
      .padStart(2, "0")}${dateObject
      .getMinutes()
      .toString()
      .padStart(2, "0")}${dateObject
      .getSeconds()
      .toString()
      .padStart(2, "0")}.pdf`;

    console.log("New file name:", newFileName);

    // Select the button within the row
    const button = await row.$("td button");

    if (button) {
      await button.click();
      await page.waitForSelector("#simplemodal-container", { visible: true });
      await page.waitForSelector(
        "#simplemodal-container .download-container button",
        { visible: true }
      );

      const downloadButton = await page.$(".download-container button");
      if (downloadButton) {
        console.log("Download button found, clicking...");
        await downloadButton.click();
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const files = fs
          .readdirSync(downloadDir)
          .filter((file) => file.endsWith(".pdf"));
        if (files.length) {
          const latestFile = files.reduce((prev, curr) => {
            const prevTime = fs.statSync(path.join(downloadDir, prev)).ctime;
            const currTime = fs.statSync(path.join(downloadDir, curr)).ctime;
            return currTime > prevTime ? curr : prev;
          });

          const oldPath = path.join(downloadDir, latestFile);
          const newPath = path.join(tmpDir, newFileName);
          fs.renameSync(oldPath, newPath);
          console.log("Renamed file:", latestFile, "to", newFileName);
        } else {
          console.log("No PDF files found in download directory.");
        }
      } else {
        console.log("Download button not found.");
      }

      await page.keyboard.press("Escape");
      await page.waitForSelector("#simplemodal-container", { hidden: true });
    } else {
      console.log("Modal button not found for row:", dateText);
    }
  }

  if (fs.existsSync(tmpDir)) {
    const files = fs.readdirSync(tmpDir);
    console.log("Contents of the temporary directory:", files);
  } else {
    console.log("Directory does not exist:", tmpDir);
  }

  console.log("Processing complete.");
};

(async () => {
  const { browser, page } = await startBrowser();
  await login(page);
  await navigateToBilling(page);
  await processBillingItems(page, downloadDir);
  await browser.close();
})();
