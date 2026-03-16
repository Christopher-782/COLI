const navbar = document.getElementById("navbar");
const mobileToggle = document.getElementById("mobileToggle");
const mobileMenu = document.getElementById("mobileMenu");
const volunteerForm = document.getElementById("volunteerForm");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");
});

mobileToggle.addEventListener("click", () => {
  mobileMenu.style.display =
    mobileMenu.style.display === "block" ? "none" : "block";
});

volunteerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const fullname = document.getElementById("fullname").value;
    const email = document.getElementById("email").value;
    const country = document.getElementById("country").value;
    const phonenumber = document.getElementById("phonenumber").value;
    const description = document.getElementById("description").value;
    const interests = document.querySelectorAll(
      'input[name="interests"]:checked',
    );

    let selectedInterests = [];

    interests.forEach((box) => {
      selectedInterests.push(box.value);
    });

    const volunteerData = {
      fullname,
      email,
      phonenumber,
      country,
      interests: selectedInterests,
      description,
    };
    console.log(volunteerData);

    await axios.post("/volunteers", volunteerData);
    volunteerForm.reset();
    window.location.href = "confirmation.html";
  } catch (err) {
    console.log("Failed To Fetch:", err.message);
  }
});
