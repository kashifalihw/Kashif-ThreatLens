const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },

    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() +
            path.extname(
                file.originalname
            )
        );

    }

});

const upload =
    multer({ storage });

app.get("/", (req, res) => {

    res.send(
        "Kashif ThreatLens API Running"
    );

});

app.post(
    "/upload",
    upload.single("file"),

    (req, res) => {

        const threatScore =
            Math.floor(
                Math.random() * 100
            );

        let status = "";

        if(threatScore < 40){

            status = "Safe";

        }
        else if(threatScore < 70){

            status =
            "Suspicious";

        }
        else{

            status =
            "Dangerous";

        }

        res.json({

            success: true,

            fileName:
            req.file.originalname,

            fileSize:
            (
                req.file.size / 1024
            ).toFixed(2),

            threatScore,

            status,

            uploadedAt:
            new Date()
            .toLocaleString()

        });

    }

);

const PORT = 5000;

app.listen(PORT, () => {

    console.log(
        `Server Running On Port ${PORT}`
    );

});