import fs from "fs";
import path from "path";
import os from "os";
import { getDocument } from "pdfjs-dist";
import axios from "axios";

const FILES_PATH = path.join(os.tmpdir(), "tmp"); // Change this to your path

async function extractTextFromPDF(pdfPath) {
  try {
    const loadingTask = getDocument(pdfPath);
    const pdfDocument = await loadingTask.promise;
    const textObjects = await extractTextObjectsFromDocument(pdfDocument);
    return textObjects;
  } catch (err) {
    console.error(`Error opening ${pdfPath}: ${err}`);
    return [];
  }
}

async function extractTextObjectsFromDocument(pdfDocument) {
  const textObjects = [];
  const numPages = pdfDocument.numPages;

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();
    textObjects.push(...textContent.items);
  }

  return textObjects;
}

function parseReceiptText(textObjects) {
  const dateMatch = textObjects.find((item) =>
    /Fecha \d{2}\/\d{2}\/\d{2}/.test(item.str)
  );
  const date = dateMatch
    ? dateMatch.str.match(/(\d{2}\/\d{2}\/\d{2})/)[1]
    : "Date not found";

  const totalMatch = textObjects.find((item) =>
    /TOTAL\s*\$[\d,.]+/.test(item.str)
  );
  const total = totalMatch
    ? totalMatch.str.match(/TOTAL\s*\$([\d,.]+)/)[1]
    : "Total not found";

  const categories = {
    Mascotas: [],
    Almacen: [],
    Bebidas: [],
    Fiambreria: [],
    Frutas_Y_Verduras: [],
    Limpieza: [],
    Perfumeria: [],
    Panaderia: [],
    Carniceria: [],
    Otros: [],
  };

  let currentCategory = null;
  let currentProduct = {};

  for (const item of textObjects) {
    const line = item.str;

    if (line.trim() === "DESCUENTOS") {
      break;
    }

    let categoryFound = false;
    for (const category of Object.keys(categories)) {
      if (line.includes(category)) {
        currentCategory = category;
        currentProduct = {};
        categoryFound = true;
        break;
      }
    }

    if (categoryFound) {
      continue;
    }

    if (currentCategory) {
      const amountPriceMatch = line.match(/\d+ x [\d,.]+/);
      if (amountPriceMatch) {
        const parts = line.split(" x ");
        if (parts.length >= 2) {
          if (currentCategory === "Carniceria") {
            const priceMatch = parts[1].match(/([\d,.]+)$/);
            const amountMatch = parts[0].match(/([\d,.]+)$/);
            if (priceMatch && amountMatch) {
              currentProduct["amount"] = amountMatch[1];
              currentProduct["price"] = priceMatch[1];
            }
          } else {
            const priceMatch = parts[1].match(/([\d,.]+)$/);
            if (priceMatch) {
              currentProduct["amount"] = parts[0].trim();
              currentProduct["price"] = priceMatch[1];
            }
          }
        }
      } else if (/^\d{13,}/.test(line)) {
        currentProduct["code"] = line.trim();
        categories[currentCategory].push(currentProduct);
        currentProduct = {};
      } else {
        if (!currentProduct["description"]) {
          currentProduct["description"] = line;
        } else {
          const discount = line.split(" ").pop();
          currentProduct["discount"] = discount;
        }
      }
    }
  }

  return { ...categories };
}

async function processReceipts() {
  const body = [];
  const files = fs
    .readdirSync(FILES_PATH)
    .filter((file) => file.toLowerCase().endsWith(".pdf"));

  for (const file of files) {
    const filePath = path.join(FILES_PATH, file);
    try {
      if (fs.existsSync(filePath)) {
        const textObjects = await extractTextFromPDF(filePath);
        const date = file.split(".pdf")[0];
        const purchase = {
          date,
          categories: parseReceiptText(textObjects),
        };
        body.push(purchase);
      } else {
        console.error(`File does not exist: ${filePath}`);
      }
    } catch (err) {
      console.error(err);
    }
  }
  console.log(JSON.stringify(body, null, 2));
  const { data, error } = await axios.post(
    `${process.env.API_ENDPOINT}/receipts`,
    body,
    { timeout: 30000 }
  );
  console.log(data, error);
}

processReceipts();
