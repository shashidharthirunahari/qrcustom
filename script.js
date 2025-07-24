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
      <input type="text" id="org" placeholder="Organization" />
      <input type="text" id="title" placeholder="Job Title" />
    `;
  } else if (type === "payment") {
    fields.innerHTML = `
      <input type="text" id="upi" placeholder="UPI / Payment URL" />
    `;
  } else if (type === "sms") {
    fields.innerHTML = `
      <input type="text" id="smsNumber" placeholder="Phone Number" />
      <input type="text" id="smsMessage" placeholder="Message" />
    `;
  } else if (type === "email") {
    fields.innerHTML = `
      <input type="email" id="emailTo" placeholder="Recipient Email" />
      <input type="text" id="emailSubject" placeholder="Subject" />
      <textarea id="emailBody" placeholder="Email Body"></textarea>
    `;
  } else if (type === "location") {
    fields.innerHTML = `
      <input type="text" id="latitude" placeholder="Latitude (e.g. 37.7749)" />
      <input type="text" id="longitude" placeholder="Longitude (e.g. -122.4194)" />
      <input type="text" id="label" placeholder="Label (optional)" />
    `;
  } else if (type === "calendar") {
    fields.innerHTML = `
      <input type="text" id="eventTitle" placeholder="Event Title" />
      <input type="text" id="eventLocation" placeholder="Event Location" />
      <input type="datetime-local" id="startDate" placeholder="Start Date & Time" />
      <input type="datetime-local" id="endDate" placeholder="End Date & Time" />
      <textarea id="eventDescription" placeholder="Description"></textarea>
    `;
  }
}

function getQRData() {
  const type = document.getElementById("qrType").value;

  if (type === "text") {
    return document.getElementById("textInput").value.trim();
  }

  if (type === "wifi") {
    const ssid = document.getElementById("ssid").value.trim();
    const password = document.getElementById("password").value.trim();
    const enc = document.getElementById("encryption").value;
    return `WIFI:S:${ssid};T:${enc};P:${password};;`;
  }

  if (type === "vcard") {
    const name = document.getElementById("fullName").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const email = document.getElementById("email").value.trim();
    const org = document.getElementById("org").value.trim();
    const title = document.getElementById("title").value.trim();

    return `BEGIN:VCARD
VERSION:3.0
FN:${name}
ORG:${org}
TITLE:${title}
TEL:${phone}
EMAIL:${email}
END:VCARD`;
  }

  if (type === "payment") {
    return document.getElementById("upi").value.trim();
  }

  if (type === "sms") {
    const number = document.getElementById("smsNumber").value.trim();
    const message = document.getElementById("smsMessage").value.trim();
    return `SMSTO:${number}:${message}`;
  }

  if (type === "email") {
    const to = document.getElementById("emailTo").value.trim();
    const subject = encodeURIComponent(document.getElementById("emailSubject").value.trim());
    const body = encodeURIComponent(document.getElementById("emailBody").value.trim());
    return `mailto:${to}?subject=${subject}&body=${body}`;
  }

  if (type === "location") {
    const lat = document.getElementById("latitude").value.trim();
    const lon = document.getElementById("longitude").value.trim();
    const label = document.getElementById("label").value.trim();
    return `geo:${lat},${lon}${label ? `?q=${encodeURIComponent(label)}` : ""}`;
  }

  if (type === "calendar") {
    const title = document.getElementById("eventTitle").value.trim();
    const location = document.getElementById("eventLocation").value.trim();
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;
    const description = document.getElementById("eventDescription").value.trim();

    // Format dates to YYYYMMDDTHHmmssZ (UTC ISO)
    const startUTC = start ? formatDateToUTC(start) : "";
    const endUTC = end ? formatDateToUTC(end) : "";

    return `BEGIN:VEVENT
SUMMARY:${title}
LOCATION:${location}
DESCRIPTION:${description}
DTSTART:${startUTC}
DTEND:${endUTC}
END:VEVENT`;
  }

  return ""; // default empty
}

// Helper: format input datetime-local to YYYYMMDDTHHmmssZ format
function formatDateToUTC(dateTimeLocal) {
  const date = new Date(dateTimeLocal);
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

function generateQRCode() {
  const fgColor = document.getElementById("fgColor").value;
  const bgColor = document.getElementById("bgColor").value;
  const ecLevel = document.getElementById("ecLevel").value;
  const data = getQRData();

  if (!data) {
    alert("Please enter valid data!");
    return;
  }

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

// Initialize form fields on page load
onTypeChange();
