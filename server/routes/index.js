var express = require('express');
var router = express.Router();

const geoip = require('geoip-lite');

const Event = require('./../models/events');
const Session = require('./../models/session');
const Page = require('./../models/pages');
var uuid = require('uuid');


router.post('/init', function (req, res, next) {
  const { user, page, url } = req.body;
  if (!page && !user) {
    res.json({});
  }

  Page.findOne({ url })
    .then(currentPage => {
      if (!currentPage) {
        let pageID = uuid.v4();
        let page = new Page({ url, pageID })
        return page.save();
      }
      return currentPage;
    })
    .then((currentPage) => {
      const { pageID } = currentPage;
      if (!user) {
        res.json({ pageID });
        return true;
      }
      let userID = uuid.v4();
      res.json({ userID, pageID });
    })

});

router.post('/collect', function (req, res, next) {
  const { event, options } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  let geo = geoip.lookup(ip);
  const country = geo && geo.country ? geo.country : '';

  if (event == 'init') {
    /**
     * Save page views
     */
    const {
      userID,
      pageID,
      url,
      browser,
      userAgent,
      timestamp,
    } = options;

    let user = new Session({
      userID,
      pageID,
      url,
      browser,
      userAgent,
      country,
      timestamp,
    });
    user.save()
      .then(d => res.json('ok'));
  } else {
    /**
     * Save custom data (like clicks)
     */
    let e = new Event({ event, options });
    e.save()
      .then(d => res.json('ok'))
      .catch(e => {console.log(e)})
  }
});

router.get('/search/byPageID', function (req, res, next) {
  const { PageID } = req.query;
  Session.find({ PageID })
    .then(d => {res.json(d)})
    .catch(e => {console.log(e)})
});
router.get('/search/byBrowserName', function (req, res, next) {
  const { browserName } = req.query;
  Session.find({ userAgent: new RegExp(browserName, 'gi') })
    .then(d => {res.json(d)})
});
router.get('/search/byCountry', function (req, res, next) {
  const { country } = req.query;
  Session.find({ country }).then(d => {res.json(d)})
});
router.get('/search/byReturning', function (req, res, next) {
  Session.aggregate([
    {
      $group: {
        _id: '$userID',
        count: { $sum: 1 },
      },
    }, {
      $bucket: {
        groupBy: '$count',
        boundaries: [1, 2],
        default: 'returning',
        output: {
          'count': { $sum: 1 },
        },
      },
    },
  ]).then(d => {
    let stats = d.reduce((a, o) => {
      a[o._id] = o.count;
      return a;
    }, {});
    const newUsers = stats[1] || 0;
    const returning = stats['returning'] || 0;
    const total = newUsers + returning;
    const rate = Math.round(returning / total * 100) / 100;
    res.json({ new: newUsers, returning, total, rate })
  })
});

router.get('/clear', function (req, res, next) {
  Session.deleteMany({}).then(e => {res.json(0)})
});

module.exports = router;
