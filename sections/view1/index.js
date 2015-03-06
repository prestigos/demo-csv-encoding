/*jslint node: true, indent: 2, nomen:true, stupid:true */
'use strict';

module.exports = function (server) {
  /*jslint unparam:true*/
  server.post('/view1/api', function (req, res) {
    console.log(req.body);
    res.status(201).json(201, {
      done: true
    });
  });
  /*jslint unparam:false*/
};

