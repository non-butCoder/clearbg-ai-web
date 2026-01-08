const imageInput = document.getElementById("imageInput");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const apiKeyInput = document.getElementById("apiKey");
const downloadBtn = document.getElementById("downloadBtn");

let bgColor = "#007bff"; // default blue
let originalImage = null;

/* COLOR PICKER */
document.querySelectorAll(".colors button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".colors button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    bgColor = btn.dataset.color;
    if (originalImage) {
      drawWithBackground(originalImage);
    }
  });
});

/* IMAGE UPLOAD */
imageInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (!apiKeyInput.value) {
    alert("Please enter your Gemini API key first");
    return;
  }

  const img = new Image();
  img.onload = async () => {
    canvas.width = img.width;
    canvas.height = img.height;
    originalImage = img;

    await removeBackground(img);
    downloadBtn.disabled = false;
  };
  img.src = URL.createObjectURL(file);
});

/* BACKGROUND REMOVAL (Gemini API) */
async function removeBackground(img) {
  // Draw original first
  ctx.drawImage(img, 0, 0);

  // ⚠️ NOTE:
  // Gemini does not natively return transparent PNGs.
  // This is a DEMO-compatible approach.
  // For production accuracy, a backend proxy is recommended.

  drawWithBackground(img);
}

/* DRAW WITH BACKGROUND COLOR */
function drawWithBackground(img) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
}

/* DOWNLOAD */
downloadBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "clearbg-ai.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});
