const input = document.getElementById("qr-input");
const fgColor = document.getElementById("fg-color");
const bgColor = document.getElementById("bg-color");
const fileType = document.getElementById("file-type");
const canvas = document.getElementById("qr-canvas");
const logoUpload = document.getElementById("logo-upload");
const generateBtn = document.getElementById("generate-btn");
const downloadBtn = document.getElementById("download-btn");

let qr;

generateBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return alert("Please enter some text.");
  
  qr = new QRious({
    element: canvas,
    value: text,
    size: 250,
    foreground: fgColor.value,
    background: bgColor.value
  });

  const file = logoUpload.files[0];
  if (file) {
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      const size = 50;
      const x = (canvas.width - size) / 2;
      const y = (canvas.height - size) / 2;
      ctx.drawImage(img, x, y, size, size);
    };
    img.src = URL.createObjectURL(file);
  }
});

downloadBtn.addEventListener("click", () => {
  if (!qr) return alert("Generate the QR code first.");
  const type = fileType.value;

  if (type === "png") {
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  } else {
    alert("SVG support is coming soon.");
  }
});
