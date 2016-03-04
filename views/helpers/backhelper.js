// document.getElementById("back").href =  "/dashboard/" + window.location.href.match(/dashboard\/([a-z]+)/)[1];
// var a = document.getElementById("back");
// console.log(a);
// console.log("/dashboard/" + window.location.href.match(/dashboard\/([a-z]+)/)[1]);

module.exports = function (link) {
    return "/dashboard/" + window.location.href.match(/dashboard\/([a-z]+)/)[1];
};
