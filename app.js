const express = require("express");
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");

const Donor = require("./models/Donor");
const Recipient = require("./models/Recipient");
const Organ = require("./models/Organ");
const Hospital = require("./models/Hospital");
const Match = require("./models/Match");

const app = express();
app.use(expressLayouts);
app.set('layout', 'layout'); 

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/organ-donation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "layout");

// Routes
app.get("/", (req, res) => {
  res.redirect("/donor"); // Or create a dashboard.ejs and render it
});

// Donor

// app.get("/donor", (req, res) => {
//   res.render("donor");
// });

// app.get("/donor", async (req, res) => {
//     const hospitals = await Hospital.find();
//     res.render("donor", { hospitals });
//   });
  
  app.get("/donor", async (req, res) => {
    const hospitals = await Hospital.find();
    res.render("donor", {
      hospitals,
      success: req.query.success === "1"
    });
  });

// app.post("/donor/create", async (req, res) => {
//   const donor = new Donor(req.body);
//   await donor.save();
//   res.redirect("/donor");
// });

// app.post("/donor/create", async (req, res) => {
//     const donor = new Donor(req.body);
//     await donor.save();
//     res.redirect("/donor?success=1");
//   });
app.post("/donor/create", async (req, res) => {
    const donor = new Donor(req.body);
    
    await donor.save();
    const organ = new Organ({
        organType: donor.organType,
        donorID: donor._id,
        storedAt: donor.hospitalID
    });
    await organ.save();
    organ.save()
    res.redirect("/donor?success=1");
  });
  

//dashboard
app.get("/dashboard", async (req, res) => {
    const donorCount = await Donor.countDocuments();
    const recipientCount = await Recipient.countDocuments();
    const matchCount = await Match.countDocuments();
    const hospitalCount = await Hospital.countDocuments();
  
    const organStats = {
      Eye: await Donor.countDocuments({ organType: "Eye" }),
      Heart: await Donor.countDocuments({ organType: "Heart" }),
      Kidney: await Donor.countDocuments({ organType: "Kidney" }),
      Lungs: await Donor.countDocuments({ organType: "Lungs" }),
    };
  
    res.render("dashboard", {
      donorCount,
      recipientCount,
      matchCount,
      hospitalCount,
      organStats
    });
  });
  

// Recipient

// app.get("/recipient", (req, res) => {
//   res.render("recipient");
// });
// app.get("/recipient", async (req, res) => {
//     const hospitals = await Hospital.find();
//     res.render("recipient", { hospitals });
//   });

  app.get("/recipient", async (req, res) => {
    const hospitals = await Hospital.find();
    res.render("recipient", {
      hospitals,
      success: req.query.success === "1"
    });
  });
  
// app.post("/recipient/create", async (req, res) => {
//   const recipient = new Recipient(req.body);
//   await recipient.save();
//   res.redirect("/recipient");
// });

app.post("/recipient/create", async (req, res) => {
    const recipient = new Recipient(req.body);
    await recipient.save();
    res.redirect("/recipient?success=1");
  });
  
// Organ
app.get("/organ", (req, res) => {
  res.render("organ");
});
app.post("/organ/create", async (req, res) => {
  const organ = new Organ(req.body);
  await organ.save();
  res.redirect("/organ");
// try {
//     const organ = new Organ(req.body);
//     await organ.save();
//     res.redirect("/organ?success=1");
//   } catch (error) {
//     console.error("Error creating organ:", error);
//     res.status(500).send("Error creating organ");
//   }

});

// Hospital
app.get("/hospital", async (req, res) => {
    const hospitals = await Hospital.find(); // Fetch from MongoDB
    res.render("hospital", { hospitals });   // Pass to EJS
  });
  
  app.post("/hospital/create", async (req, res) => {
    const hospital = new Hospital(req.body);
    await hospital.save();
    res.redirect("/hospital"); // Refresh with updated data
  });
  

// Match
app.get("/match", (req, res) => {
    res.render("match", {
      matchResults: [],
      organType: req.query.organType || '',
      bloodGroup: req.query.bloodGroup || '',
      confirmed: req.query.confirmed
    });
  });
  
  
app.post("/match/create", async (req, res) => {
  const match = new Match(req.body);
  await match.save();
  res.redirect("/match");
});

app.post("/match/confirm", async (req, res) => {
    const { donorID, recipientID, organType, bloodGroup } = req.body;
  
    const existing = await Match.findOne({
      $or: [
        { donorID },
        { recipientID }
      ]
    });
  
    if (!existing) {
      await Match.create({ donorID, recipientID });
    }
  
    res.redirect(`/match?confirmed=1&organType=${organType}&bloodGroup=${bloodGroup}`);
  });
  

  app.post("/match/search", async (req, res) => {
    const { organType, bloodGroup } = req.body;
  
    const donors = await Donor.find({ organType, bloodGroup });
    const recipients = await Recipient.find({ organNeeded: organType, bloodGroup });
  
    // Get confirmed donor and recipient IDs
    const confirmed = await Match.find({}, "donorID recipientID");
    const usedDonorIDs = confirmed.map(m => m.donorID.toString());
    const usedRecipientIDs = confirmed.map(m => m.recipientID.toString());
  
    const matchResults = [];
  
    for (let donor of donors) {
      if (usedDonorIDs.includes(donor._id.toString())) continue;
  
      for (let recipient of recipients) {
        if (usedRecipientIDs.includes(recipient._id.toString())) continue;
  
        matchResults.push({ donor, recipient });
      }
    }
  
    res.render("match", {
      matchResults,
      organType,
      bloodGroup
    });
  });
  
  
  app.get("/matches", async (req, res) => {
    const matches = await Match.find()
      .populate("donorID")
      .populate("recipientID")
      .sort({ createdAt: -1 });
  
    res.render("matches", { matches });
  });
  
  
// Start Server
app.listen(3000, () => {
  console.log("Server is running at3000");
});
