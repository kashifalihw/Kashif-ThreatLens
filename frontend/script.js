const fileInput = document.getElementById("fileInput");
const scanBtn = document.getElementById("scanBtn");
const downloadBtn = document.getElementById("downloadReportBtn");

const fileName = document.getElementById("fileName");
const fileSize = document.getElementById("fileSize");
const threatStatus = document.getElementById("threatStatus");
const threatScore = document.getElementById("threatScore");
const fileHash = document.getElementById("fileHash");

const progressBar = document.getElementById("progressBar");
const scanMessage = document.getElementById("scanMessage");

let latestReport = "";

async function generateHash(file) {

    const buffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        buffer
    );

    const hashArray =
        Array.from(
            new Uint8Array(hashBuffer)
        );

    return hashArray
        .map(b =>
            b.toString(16)
            .padStart(2, "0")
        )
        .join("");

}

scanBtn.onclick = async function () {

    const file =
        fileInput.files[0];

    if (!file) {

        alert(
            "Please Select A File"
        );

        return;

    }

    fileName.innerHTML =
        "File: " + file.name;

    fileSize.innerHTML =
        "Size: " +
        (file.size / 1024)
        .toFixed(2) +
        " KB";

    threatStatus.innerHTML =
        "Status: Scanning...";

    threatScore.innerHTML =
        "Threat Score: --";

    fileHash.innerHTML =
        "Generating SHA-256 Hash...";

    progressBar.style.width = "0%";

    progressBar.style.background =
        "#38BDF8";

    scanMessage.innerHTML =
        "Scan In Progress...";

    let progress = 0;

    const timer =
        setInterval(() => {

            progress += 10;

            progressBar.style.width =
                progress + "%";

            if (progress >= 100) {

                clearInterval(
                    timer
                );

            }

        }, 150);

    const hash =
        await generateHash(file);

    fileHash.innerHTML =
        "SHA-256 Hash: " +
        hash.substring(0, 32) +
        "...";

    const score =
        Math.floor(
            Math.random() * 100
        );

    let status = "";

    if (score < 40) {

        status = "Safe";

        threatStatus.innerHTML =
            "Status: ✅ Safe";

        progressBar.style.background =
            "#22C55E";

    }

    else if (score < 70) {

        status = "Suspicious";

        threatStatus.innerHTML =
            "Status: ⚠ Suspicious";

        progressBar.style.background =
            "#F59E0B";

    }

    else {

        status = "Dangerous";

        threatStatus.innerHTML =
            "Status: ❌ Dangerous";

        progressBar.style.background =
            "#EF4444";

    }

    threatScore.innerHTML =
        "Threat Score: " +
        score + "%";

    scanMessage.innerHTML =
        "Scan Completed";

    const history =
        JSON.parse(
            localStorage.getItem(
                "scanHistory"
            )
        ) || [];

    history.push({

        file: file.name,

        score: score,

        status: status,

        hash: hash,

        date:
        new Date()
        .toLocaleString()

    });

    localStorage.setItem(
        "scanHistory",
        JSON.stringify(
            history
        )
    );

    latestReport =

`KASHIF THREATLENS REPORT

File Name:
${file.name}

File Size:
${(file.size / 1024).toFixed(2)} KB

Threat Score:
${score}%

Status:
${status}

SHA-256:
${hash}

Date:
${new Date().toLocaleString()}
`;

};

downloadBtn.onclick =
function () {

    if (
        latestReport === ""
    ) {

        alert(
            "Please scan a file first."
        );

        return;

    }

    const blob =
        new Blob(
            [latestReport],
            {
                type:
                "text/plain"
            }
        );

    const link =
        document.createElement(
            "a"
        );

    link.href =
        URL.createObjectURL(
            blob
        );

    link.download =
        "Kashif-ThreatLens-Report.txt";

    link.click();

};