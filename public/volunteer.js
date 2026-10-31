// Uses the existing /volunteers endpoint without depending on a third-party CDN.
const volunteerForm = document.getElementById('volunteerForm');
if (volunteerForm) volunteerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const status = document.getElementById('volunteerStatus');
  const submit = volunteerForm.querySelector('button[type="submit"]');
  const interests = [...volunteerForm.querySelectorAll('input[name="interests"]:checked')].map(el => el.value);
  if (!interests.length) {
    status.textContent = 'Please choose at least one area of interest.';
    status.className = 'volunteer-status error';
    volunteerForm.querySelector('input[name="interests"]')?.focus();
    return;
  }
  if (!volunteerForm.reportValidity()) return;
  const payload = {
    fullname: volunteerForm.elements.fullname.value.trim(),
    email: volunteerForm.elements.email.value.trim(),
    country: volunteerForm.elements.country.value.trim(),
    phonenumber: volunteerForm.elements.phonenumber.value.trim(),
    interests,
    description: document.getElementById('description').value.trim(),
  };
  submit.disabled = true;
  status.textContent = 'Sending your application…';
  status.className = 'volunteer-status';
  try {
    const response = await fetch('/volunteers', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
    if (!response.ok) throw new Error(response.status === 429 ? 'Too many applications from this connection. Please try again later.' : 'Your application could not be sent. Please try again.');
    volunteerForm.reset();
    window.location.assign('confirmation.html');
  } catch(error) {
    status.textContent = error.message || 'Unable to submit your application. Please try again.';
    status.className = 'volunteer-status error';
    submit.disabled = false;
  }
});
