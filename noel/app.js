// noel/app.js
// - Click hộp quà: mở nắp + tự hiện thư
// - Khi thư hiện: chữ tự chạy (không cần click thư)
// - Có nút X và bấm ra ngoài (overlay) để đóng

const boxGift = document.querySelector(".box-gift");
const boxContent = document.querySelector(".box-content");
const closeBtn = document.querySelector(".fa-xmark");

// hotspot cũ trong gift (nếu còn dùng thì vẫn hỗ trợ)
const contentHotspot = document.querySelector(".content");

// text elements
const text1 = document.getElementById("text1"); // <p>
const text2 = document.getElementById("text2"); // <h2>
const text3 = document.getElementById("text3"); // <h2>

let openTimer = null;

function resetTextPositions() {
  // set về trạng thái ban đầu giống CSS (để lần mở sau vẫn chạy lại được)
  if (text1) {
    text1.style.animation = "none";
    text1.style.transform = "translateY(-40px)";
  }
  if (text2) {
    text2.style.animation = "none";
    text2.style.transform = "translateX(-500px)";
  }
  if (text3) {
    text3.style.animation = "none";
    text3.style.transform = "translateX(500px)";
  }

  // force reflow để reset animation chắc chắn
  void (boxContent && boxContent.offsetWidth);
}

function runTextAnimations() {
  resetTextPositions();

  // dùng keyframes đã có sẵn trong style.css:
  // contentText, contenttext1, contenttext2
  if (text1) {
    text1.style.animation = "contentText 3s forwards";
    text1.style.animationDelay = "0.8s";
  }
  if (text2) {
    text2.style.animation = "contenttext1 2s ease-in forwards";
    text2.style.animationDelay = "1.8s";
  }
  if (text3) {
    text3.style.animation = "contenttext2 2s ease-in forwards";
    text3.style.animationDelay = "1.8s";
  }
}

function openLetter() {
  if (!boxContent) return;
  boxContent.classList.add("active");
  runTextAnimations(); // ✅ mở thư là chữ chạy luôn
}

function closeLetter() {
  if (!boxContent) return;
  boxContent.classList.remove("active");
  // reset để lần sau mở lại vẫn chạy
  resetTextPositions();
}

function openGiftAndLetter() {
  if (!boxGift) return;

  // mở nắp quà
  boxGift.classList.add("active");

  // đợi animation mở nắp (CSS) rồi mới hiện thư
  clearTimeout(openTimer);
  openTimer = setTimeout(openLetter, 650);
}

// Click hộp quà -> tự mở + tự hiện thư
if (boxGift) {
  boxGift.addEventListener("click", (e) => {
    e.preventDefault();
    openGiftAndLetter();
  });
}

// Nếu vẫn click vào hotspot .content (để tương thích code cũ) -> cũng mở thư
if (contentHotspot) {
  contentHotspot.addEventListener("click", (e) => {
    e.preventDefault();
    openGiftAndLetter();
  });
}

// Nút X đóng
if (closeBtn) {
  closeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeLetter();
  });
}

// Click ra ngoài overlay để đóng
if (boxContent) {
  boxContent.addEventListener("click", (e) => {
    if (e.target === boxContent) closeLetter();
  });
}