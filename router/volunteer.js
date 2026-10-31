const express = require('express');
const crypto = require('node:crypto');
const Volunteer = require('../models/volunteer');
const router = express.Router();

// Applicant data is private: administrative read/delete operations require an
// independently configured secret. The public site only submits applications.
function requireAdmin(req, res, next) {
  const token = process.env.COLI_ADMIN_TOKEN;
  if (!token || token.length < 24) return res.status(403).json({error:'Administrative access is not configured.'});
  const provided = (req.get('authorization') || '').replace(/^Bearer\s+/i, '');
  const expected = Buffer.from(token);
  const actual = Buffer.from(provided);
  if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) return res.status(403).json({error:'Not authorized.'});
  next();
}

const visitors = new Map();
const windowMs = 15 * 60 * 1000;
function limitApplications(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const history = (visitors.get(key) || []).filter(timestamp => now - timestamp < windowMs);
  if (history.length >= 6) return res.status(429).json({error:'Too many submissions. Please try again later.'});
  history.push(now); visitors.set(key, history);
  if (visitors.size > 10000) for (const [ip, dates] of visitors) if (dates.every(date => now - date >= windowMs)) visitors.delete(ip);
  next();
}

router.post('/volunteers', limitApplications, async (req, res) => {
  try {
    const {fullname,email,country,phonenumber,interests,description} = req.body || {};
    const clean = value => typeof value === 'string' ? value.trim() : '';
    const data = {
      fullname: clean(fullname), email: clean(email).toLowerCase(),
      country: clean(country), phonenumber: clean(phonenumber),
      interests: Array.isArray(interests) ? interests.filter(x => typeof x === 'string' && x.length <= 100).slice(0,10) : [],
      description: clean(description)
    };
    if (!data.fullname || data.fullname.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length > 254 ||
        !data.country || data.country.length > 100 || !data.phonenumber || data.phonenumber.length > 35 ||
        !data.description || data.description.length > 2500 || !data.interests.length) {
      return res.status(400).json({error:'Please check the application details and try again.'});
    }
    await Volunteer.create(data);
    return res.status(201).json({success:true,message:'Application received.'});
  } catch (error) {
    console.error('Volunteer application failed:',error.message);
    return res.status(500).json({error:'Application could not be saved. Please try later.'});
  }
});

router.get('/volunteers', requireAdmin, async (req,res) => {
  try { return res.json(await Volunteer.find().sort({createdAt:-1}).limit(200)); }
  catch(error) { return res.status(500).json({error:'Unable to load applications.'}); }
});
router.get('/volunteers/:id', requireAdmin, async (req,res) => {
  try { const item = await Volunteer.findById(req.params.id); return item ? res.json(item) : res.status(404).json({error:'Not found.'}); }
  catch(error) { return res.status(400).json({error:'Invalid ID.'}); }
});
router.delete('/volunteers/:id', requireAdmin, async (req,res) => {
  try { await Volunteer.findByIdAndDelete(req.params.id); return res.json({success:true}); }
  catch(error) { return res.status(400).json({error:'Invalid ID.'}); }
});
module.exports = router;
