let qrCode;

function onTypeChange() {
  const type = document.getElementById("qrType").value;
  const fields = document.getElementById("formFields");
  fields.innerHTML = "";

  if (type === "text") {
    fields.innerHTML = `<input type="text" id="textInput" placeholder="Enter text or URL" />`;
  } else if (type === "wifi") {
    fields.innerHTML = `
      <input type="text" id="ssid" placeholder="WiFi SSID" />
      <input type="password" id="password" placeholder="WiFi Password" />
      <select id="encryption">
        <option value="WPA">WPA/WPA2</option>
        <option value="WEP">WEP</option>
        <option value="nopass">No Password</option>
      </select>
    `;
  } else if (type === "vcard") {
    fields.innerHTML = `
      <input type="text" id="fullName" placeholder="Full Name" />
      <input type="text" id="phone" placeholder="Phone Number" />
      <input type="email" id="email" placeholder="Email" />
    `;
  } else if (type === "payment") {
    fields.innerHTML = `
      <input type="text" id="upi" placeholder="UPI / Payment URL" />
    `;
  }
}

function getQRData() {
  const type = document.getElementById("qrType").value;

  if (type === "text") {
    return document.getElementById("textInput").value;
  }

  if (type === "wifi") {
    const ssid = document.getElementById("ssid").value;
    const password = document.getElementById("password").value;
    const enc = document.getElementById("encryption").value;
    return `WIFI:S:${ssid};T:${enc};P:${password};;`;
  }

  if (type === "vcard") {
    const name = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;

    return `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
END:VCARD`;
  }

  if (type === "payment") {
    return document.getElementById("upi").value;
  }
}

function generateQRCode() {
  const fgColor = document.getElementById("fgColor").value;
  const bgColor = document.getElementById("bgColor").value;
  const ecLevel = document.getElementById("ecLevel").value;
  const data = getQRData();

  if (qrCode) {
    document.getElementById("qrPreview").innerHTML = "";
  }

  qrCode = new QRCodeStyling({
    width: 300,
    height: 300,
    type: "svg",
    data: data,
    image: "",
    dotsOptions: {
      color: fgColor,
      type: "rounded"
    },
    backgroundOptions: {
      color: bgColor,
    },
    imageOptions: {
      crossOrigin: "anonymous",
      margin: 10
    },
    qrOptions: {
      errorCorrectionLevel: ecLevel
    }
  });

  qrCode.append(document.getElementById("qrPreview"));
  // Clear circular logo overlay on new generate (until user uploads)
  document.getElementById("logoCircle").src = "";
}

// Circular logo overlay
document.getElementById("logoUpload").addEventListener("change", function () {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    // Show circular overlay logo on QR preview
    document.getElementById("logoCircle").src = e.target.result;
    // Clear embedded logo inside QR since we're showing overlay
    if (qrCode) {
      qrCode.update({ image: "" });
    }
  };
  if (file) reader.readAsDataURL(file);
});

function downloadQRCode(ext) {
  if (qrCode) {
    qrCode.download({ name: "qr-code", extension: ext });
  }
}

// Initialize form fields
onTypeChange();
