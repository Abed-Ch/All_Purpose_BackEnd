const { collectionRef, db } = require("../config/Firebase");
const PDFDocument = require("pdfkit");

const fetchData = async () => {
  let response = {};
  await collectionRef
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        response[doc.id] = doc.data();
      });
    })
    .catch((err) => {
      response = err;
    });
  return response;
};
const getPantry = async (req, res) => {
  let data = await fetchData();
  res.json({ response: data });
};

const updatePantry = async (req, res) => {
  const keys = Object.keys(req.body);
  const batch = db.batch();
  await keys.forEach((key) => {
    const docRef = collectionRef.doc(key);
    batch.set(docRef, req.body[key]);
  });
  batch
    .commit()
    .then(() => {
      res.json({ Success: "done" });
    })
    .catch((error) => {
      res.json({ Error: error });
    });
};

const printCart = async (req, res) => {
  try {
    const fetchedData = await fetchData();
    const cart = {};
    for (const [key, value] of Object.entries(fetchedData)) {
      const categoryItems = {};
      for (const [itemKey, itemValue] of Object.entries(value)) {
        if (itemValue["Cart Amount"] !== 0) {
          categoryItems[
            itemKey
          ] = `${itemValue["Cart Amount"]} ${itemValue["Unit"]}`;
        }
      }
      if (Object.keys(categoryItems).length !== 0) {
        cart[key] = categoryItems;
      }
    }

    const doc = new PDFDocument();
    doc.text("My Shopping Cart", {
      align: "center",
      font: "Helvetica-Bold",
      fontSize: 28,
    });
    doc.moveDown();
    // Set the content-disposition header to attach the filename to the download
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=myShoppingCart.pdf"
    );

    // Pipe the generated PDF into the response stream
    doc.pipe(res);
    Object.entries(cart).forEach(([category, items]) => {
      doc.fontSize("22");
      doc.text(category, { bold: true });
      doc.moveDown();
      doc.fontSize("18");
      Object.entries(items).forEach(([item, quantity]) => {
        doc.text(`  - ${item}: ${quantity}s`);
        doc.moveDown();
      });
      doc.moveDown();
    });

    // End the PDF stream
    doc.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};

module.exports = { getPantry, updatePantry, printCart };
