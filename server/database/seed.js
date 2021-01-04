const Doc = require("../schema/DocSchema");

const seedDocs = async () => {
  const titles = ["Privacy-Policy", "DMCA-Notice", "Acceptable-Use-Policy"];

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];

    const dbDoc = await Doc.findOne({ title: title });
    if (dbDoc) continue;

    const newDoc = new Doc({
      title,
      content: "Start writing the " + title + " content",
    });
    await newDoc.save();
  }
};

module.exports = {
  seedDocs,
};
