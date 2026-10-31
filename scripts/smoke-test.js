/* A fast file-level check for the core pages and annual report links. */
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.join(__dirname, '..', 'public');
const pages = ['index.html', 'education.html', 'medical.html', 'charity.html', 'volunteer.html', 'confirmation.html', 'reports.html'];
for (const file of pages) {
  const text = fs.readFileSync(path.join(root,file),'utf8');
  assert(text.includes('site-polish.css'), `${file} missing shared styles`);
  assert(text.includes('site-navigation.js'), `${file} missing mobile navigation`);
  assert(text.includes('href="reports.html"'), `${file} missing archive navigation`);
  assert(text.includes('id="mobileToggle"'), `${file} missing mobile toggle`);
  assert(text.includes('aria-expanded="false"'), `${file} missing menu accessibility state`);
  assert(!/href="#"/.test(text), `${file} has an empty placeholder link`);
  assert(!/[\u{1F300}-\u{1FAFF}]/u.test(text), `${file} contains an emoji`);
}
const report = fs.readFileSync(path.join(root,'reports.html'),'utf8');
assert(report.includes('download="COLI-Impact-Report-2025.pdf"'));
assert(report.includes('target="_blank"'));
for (const name of ['coli-impact-report-2025.pdf','impact-report-2025-cover.webp'])
  assert(fs.statSync(path.join(root,'reports',name)).size>1000, `Missing ${name}`);
assert(fs.readFileSync(path.join(root,'reports','coli-impact-report-2025.pdf')).subarray(0,5).toString()==='%PDF-');
const homepage = fs.readFileSync(path.join(root,'index.html'),'utf8');
const visibleCopy = homepage.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ');
const expectedHeadings = [
  'Changing Lives', 'One Child at a Time', 'Our Programs', 'Photo Gallery',
  'Our Founder', 'Voices of', 'Support Our Mission'
];
for(const heading of expectedHeadings) assert(visibleCopy.includes(heading), `Original homepage section missing: ${heading}`);
const sectionTags = [...homepage.matchAll(/<section\b[^>]*>/gi)].map(match => (match[0].match(/\bid="([^"]+)"/) || [,''])[1]);
assert.deepEqual(sectionTags, ['home','programs','gallery','','team-experience','donate'], 'Original section order was changed');
assert(!homepage.includes('homepage-report'), 'Do not add a report section to the original homepage');
assert(!homepage.includes('modern.css'), 'The replacement design theme must not be used');
const originalStyles = fs.readFileSync(path.join(root,'style.css'),'utf8');
const enhancements = fs.readFileSync(path.join(root,'site-polish.css'),'utf8');
for (const color of ['#0b0f19','#3b82f6','#8b5cf6']) {
  assert(originalStyles.includes(color) && enhancements.includes(color), `Original COLI palette color missing: ${color}`);
}
console.log('PASS: 7 core pages; original six homepage sections in the original order; original navy, blue and purple palette; shared menus; no placeholder links or emojis; report PDF and preview.');
