const fs = require("fs")
const marky = require("marky-markdown")

module.exports = {
  getTerms: (req, res, next) => {

    fs.readFile(__dirname + '/../../assets/Terms.md', "utf8", (err, data) => {
      if (err) {
        sails.log(err);
      } else {
        const terms = marky(data, {
          prefixHeadingIds: true,       // prevent DOM id collisions
          enableHeadingLinkIcons: false, // render icons inside generated section links
          serveImagesWithCDN: false,    // use npm's CDN to proxy images over HTTPS
          headingAnchorClass: 'anchor', // the classname used for anchors in headings.
        });

        res.send(terms);
      }
    });
  }
};