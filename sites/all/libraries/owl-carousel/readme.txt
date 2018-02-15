The CSS3 transitions weren't working in Chrome or IE due to an error in NOT writing classes on the fly, to the "owl-item" object. Fixed by replacing the content of owl.carousel.min.js

Solution found via #7 on:
https://www.drupal.org/node/2292479
