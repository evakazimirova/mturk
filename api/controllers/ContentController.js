const fs = require("fs")
const marky = require("marky-markdown")

const loadMD = (file, res) => {
  fs.readFile(__dirname + `/../../assets/${file}.md`, "utf8", (error, data) => {
    if (error) {
      sails.log(error);
    } else {
      const terms = marky(data, {
        prefixHeadingIds: true,        // prevent DOM id collisions
        enableHeadingLinkIcons: false, // render icons inside generated section links
        serveImagesWithCDN: false,     // use npm's CDN to proxy images over HTTPS
        headingAnchorClass: 'anchor',  // the classname used for anchors in headings.
      });

      res.send(terms);
    }
  });
}

module.exports = {
  getTerms: (req, res, next) => {
    loadMD('Terms', res);
  },

  getRules: (req, res, next) => {
    loadMD('Rules', res);
  },

  getEmotionsDefinitions: (req, res, next) => {
    loadMD('Emotions Definitions', res);
  }
};