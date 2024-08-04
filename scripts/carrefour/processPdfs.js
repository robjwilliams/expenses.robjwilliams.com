import fs from "fs";
import path from "path";
import os from "os";
const { PDFDocument } = "pdf-lib";

const FILES_PATH = path.join(os.tmpdir(), "tmp"); // Change this to your path

async function extractTextFromPDF(pdfPath) {
  let text = "";
  try {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      text += page
        .getTextContent()
        .items.map((item) => item.str)
        .join(" ");
    }
  } catch (error) {
    console.error(`Error opening ${pdfPath}: ${error.message}`);
  }
  return text;
}

function parseReceiptText(text) {
  const dateMatch = text.match(/Fecha (\d{2}\/\d{2}\/\d{2})/);
  const date = dateMatch ? dateMatch[1] : "Date not found";

  const totalMatch = text.match(/TOTAL\s*\$([\d,.]+)/);
  const total = totalMatch ? totalMatch[1] : "Total not found";

  const items = [];
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
  const itemLines = text.split("\n");

  for (const line of itemLines) {
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

  return { date, total, items: categories };
}

async function processReceipts() {
  const response = [];
  const files = fs
    .readdirSync(FILES_PATH)
    .filter((file) => file.toLowerCase().endsWith(".pdf"));
  for (const file of files) {
    const filePath = path.join(FILES_PATH, file);
    const text = await extractTextFromPDF(filePath);
    const date = file.split(".pdf")[0];
    const purchase = {
      date,
      items: parseReceiptText(text),
    };
    console.log(purchase);
    response.push(purchase);
  }
  console.log(JSON.stringify(response, null, 2));
}

processReceipts();
