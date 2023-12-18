window.onhashchange = function (e) {
  visible = false;

  e.preventDefault();

  var h = getHash();

  if (
    h == "creativity" ||
    h == "conservation" ||
    h == "communication" ||
    h == "portfolio" ||
    h == "gallery" ||
    h == "photography" ||
    h == "about" ||
    h == "experience" ||
    h == "contact" ||
    h == "training-seminars"
  ) {
    ajax_simple(
      "sections/" + getHash() + ".html",
      "content",
      "POST",
      null,
      false,
      false,
      function () {
        adjust_site();
      }
    );
  } else {
    ajax_simple(
      "sections/about.html",
      "content",
      "POST",
      null,
      false,
      false,
      function () {
        adjust_site();
      }
    );
  }

  if (h == "conservation" || h == "gallery") {
    $("#menu_sub a")[5].href = $("#menu_sub a")[5].href.replace(
      "Design",
      "Avian"
    );
  } else {
    $("#menu_sub a")[5].href = $("#menu_sub a")[5].href.replace(
      "Avian",
      "Design"
    );
  }
};

window.onresize = function () {
  try {
    $(".projectControlPrev").css(
      "top",
      $(".projectImages img").height().toString().replace("px", "") / -2 + "px"
    );

    $(".projectControlNext").css(
      "top",
      $(".projectImages img").height().toString().replace("px", "") / -2 + "px"
    );
  } catch (err) {}

  adjust_site();
};

var _SLIDE = true;

function getHash() {
  var h = location.toString().split("#")[1];
  console.log(location, "location");
  console.log(h, "h here");

  h == "" ? (h = "about") : null;

  h == "work" ? (h = "portfolio") : null;

  h == undefined ? (h = "about") : null;

  return h;
}

var _LANG = "es";

var _VALDAR_ERROR;

function ajax_simple(
  ruta,
  contenedor,
  metodo,
  datos,
  alertar,
  refresh,
  callback
) {
  _CT = 0;

  try {
    document.getElementById(contenedor).innerHTML =
      '<div class="spinner-wrapper"><img src="images/loader.gif" width="40px" style="opacity:0.8; display:block;margin:120px auto 120px auto;width:60px !important;" alt="..." onclick="try{document.body.removeChild(_MODAL);}catch(e){}" /></div>';
  } catch (err) {}

  if (window.XMLHttpRequest) {
    xmlhttp = new XMLHttpRequest();
  } else {
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.open(metodo, ruta, true);

  xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  xmlhttp.send(datos);

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      if (alertar == true) {
        alert(xmlhttp.responseText);
      } else {
        document.getElementById(contenedor).innerHTML = xmlhttp.responseText;

        hideControls();

        enableDropdownMenu();
      }

      if (refresh == true) {
        setTimeout("location.reload();", 500);
      }

      try {
        callback();
      } catch (err) {}
    }
  };
}

function hideControls() {
  $(".project").each(function (i) {
    if (this.getElementsByTagName("img").length == 1) {
      $(this).find(".projectControl").css("display", "none");
    } else {
      var btns = document.createElement("div");
      btns.className = "dots-wrapper";

      for (var b = 0; b < this.getElementsByTagName("img").length; b++) {
        var bt = document.createElement("input");

        bt.type = "button";

        b == 0 ? (bt.className = "active") : null;

        bt.setAttribute(
          "extra",
          $(this.getElementsByTagName("img")[b]).attr("extra") == "projectStart"
            ? "projectStart"
            : ""
        );

        $(bt).attr("onclick", "viewImage(" + b + ",'" + this.id + "');");

        btns.appendChild(bt);
      }

      $(this).find(".projectControl").append(btns);
    }

    var g = this;

    $(this)
      .find(".projectImages div:first")
      .fadeIn("slow", function () {
        setTimeout(function () {
          $(g)
            .find(".projectControlPrev")
            .css(
              "top",
              $(g.getElementsByTagName("img")[0])
                .height()
                .toString()
                .replace("px", "") /
                -2 +
                "px"
            );

          $(g)
            .find(".projectControlNext")
            .css(
              "top",
              $(g.getElementsByTagName("img")[0])
                .height()
                .toString()
                .replace("px", "") /
                -2 +
                "px"
            );
        }, 100);
      });

    $(this).find(".projectContents>div:first").fadeIn("slow");
  });
}

let isAnimating = false; // Flag to control animation flow

function viewImage(image, project) {
  if (isAnimating) return; // Prevent new animation if one is already in progress
  isAnimating = true;
  // $("#" + project + " .projectImages>div").each(function (i) {
  //   if (i == image) {
  //     $(this).fadeIn(500);
  //   } else {
  //     $(this).fadeOut(200);
  //   }
  // });

  $("#" + project + " .projectContents>div").each(function (i) {
    if (i == image) {
      $(this).css("display", "block");
    } else {
      $(this).css("display", "none");
    }
  });

  $("#" + project + " .projectControl>div input").each(function (i) {
    if (i == image) {
      this.className = "active";
    } else {
      this.className = "";
    }
  });

  let $projectImages = $("#" + project + " .projectImages>div");

  $projectImages.fadeOut(200).promise().done(function() {
    $projectImages.eq(image).fadeIn(500, function() {
      isAnimating = false; // Reset flag after animation completes
    });
  });
}

function prevImage(project) {
  var step = 0;

  var ims = project.getElementsByTagName("img");

  for (var i = 0; i < ims.length; i++) {
    if ($(ims[i].parentNode.parentNode).css("display") == "block") {
      step = i;
    }
  }

  if (step == 0) {
    viewImage(ims.length - 1, project.id);
  } else {
    viewImage(step - 1, project.id);
  }
}

function nextImage(project) {
  var step = 0;

  var ims = project.getElementsByTagName("img");

  for (var i = 0; i < ims.length; i++) {
    if ($(ims[i].parentNode.parentNode).css("display") == "block") {
      step = i;
    }
  }

  if (step == ims.length - 1) {
    viewImage(0, project.id);
  } else {
    viewImage(step + 1, project.id);
  }
}

function adjust_site() {
  try {
    $("#splash").height(window.innerHeight);

    $("#splash img").height(
      window.innerHeight.toString().replace("px", "") / 2.75
    );

    $($("#splash>div")[0]).css(
      "padding-top",
      window.innerHeight.toString().replace("px", "") / 4
    );
  } catch (err) {}

  try {
    $("#menu a").attr("id", "");

    var h = getHash();

    h == "portfolio" ? (h = "creativity") : null;

    h == "gallery" ? (h = "conservation") : null;

    $("#menu a[href='#" + h + "']").attr("id", "active");
  } catch (err) {}

  if (getHash() != "home") {
    $("#menu").animate({ height: "80px", "line-height": "80px" }, 500);

    $("#menu_left").css("display", "none");

    $("#menu_menu").css("display", "block");

    if (window.innerWidth.toString().replace("px", "") * 1 <= 800) {
    }
  } else {
    $("#menu").animate({ height: "100px", "line-height": "100px" }, 500);

    $("#menu_left").css("display", "block");

    $("#menu_menu").css("display", "none");

    if (window.innerWidth.toString().replace("px", "") * 1 <= 800) {
      // $("#menu").css("background","#4ba8a0");
    }
  }

  try {
    if (
      window.innerHeight.toString().replace("px", "") * 1 >
      window.innerWidth.toString().replace("px", "") * 0.8
    ) {
      $("#creativity,#conservation,#communication").css(
        "background-size",
        "auto 120%"
      );
    } else {
      $("#creativity,#conservation,#communication").css(
        "background-size",
        "120% auto"
      );
    }

    $(".content_section").css(
      "min-height",
      window.innerHeight.toString().replace("px", "") - 140 + "px"
    );
  } catch (err) {}

  try {
    // $("#sidebar_border").height($("#sidebar").height());

    var mts =
      window.innerHeight.toString().replace("px", "") * 1 -
      (720 + $("#sidebar>img").height().toString().replace("px", "") * 1);

    mts < 0 ? (mts = 50) : null;

    if (window.innerWidth.toString().replace("px", "") > 800) {
      $("#work").height($($(".project")[0]).height());

      setTimeout(function () {
        var mts =
          window.innerHeight.toString().replace("px", "") * 1 -
          (720 + $("#sidebar>img").height().toString().replace("px", "") * 1);

        mts < 0 ? (mts = 50) : null;

        $("#work").height($($(".project")[0]).height());
      }, 500);
    }
  } catch (err) {}

  try {
    if (window.innerWidth.toString().replace("px", "") > 800) {
      $(".project").css("opacity", "0");

      $(".project img").each(function () {
        $(this).load(function () {
          // view_portfolio(0);

          $(".project").animate({ opacity: "1" }, 100);

          var g = this.parentNode.parentNode.parentNode.parentNode;

          setTimeout(function () {
            $(g)
              .find(".projectControlPrev")
              .css(
                "top",
                $(g.getElementsByTagName("img")[0])
                  .height()
                  .toString()
                  .replace("px", "") /
                  -2 +
                  "px"
              );

            $(g)
              .find(".projectControlNext")
              .css(
                "top",
                $(g.getElementsByTagName("img")[0])
                  .height()
                  .toString()
                  .replace("px", "") /
                  -2 +
                  "px"
              );
          }, 100);
        });
      });
    }
  } catch (err) {}
}

function menu_over(i) {
  try {
    $($("#menu_right>a")[i - 1]).css("color", "#064a76");

    $($("#splash>div img")[i - 1]).attr(
      "src",
      $($("#splash>div img")[i - 1])
        .attr("src")
        .toString()
        .replace("White", "Blue")
    );
  } catch (err) {}
}

function menu_out(i) {
  try {
    $($("#menu_right>a")[i - 1]).css("color", "#FFFFFF");

    $($("#splash>div img")[i - 1]).attr(
      "src",
      $($("#splash>div img")[i - 1])
        .attr("src")
        .toString()
        .replace("Blue", "White")
    );
  } catch (err) {}
}

function view_portfolio(i) {
  $(".project").css("display", "none");

  $($(".project")[i]).css("display", "block");

  $("#sidebar input").attr("id", "");

  if (getHash() == "portfolio") {
    $($("#sidebar input")[i]).attr("id", "active_project");
  }

  var t =
    (($($($(".project")[i]).find("img")[0])
      .width()
      .toString()
      .replace("px", "") /
      13) *
      9 -
      $($($(".project")[i]).find("img")[0])
        .height()
        .toString()
        .replace("px", "")) /
    2;

  if (window.innerWidth.toString().replace("px", "") > 800) {
    $("#work").height(
      $($(".project")[i]).height().toString().replace("px", "") * 1 + t
    );

    $($(".project")[i]).css("margin-top", t + "px");

    var g = $(".project")[i];

    setTimeout(function () {
      $(g)
        .find(".projectControlPrev")
        .css(
          "top",
          $(g.getElementsByTagName("img")[0])
            .height()
            .toString()
            .replace("px", "") /
            -2 +
            "px"
        );

      $(g)
        .find(".projectControlNext")
        .css(
          "top",
          $(g.getElementsByTagName("img")[0])
            .height()
            .toString()
            .replace("px", "") /
            -2 +
            "px"
        );
    }, 100);
  }
}

var _CT = 0;

function prev_testimonial() {
  var l = $(".testimonial").length;

  if (_CT == 0) {
    _CT = l - 1;
  } else {
    _CT--;
  }

  $(".dot").css("opacity", "0.7");

  $(".dot").css("background", "rgb(219,234,204)");

  $($(".dot")[_CT]).css("opacity", "0.8");

  $($(".dot")[_CT]).css("background", "rgb(42,88,39)");

  $(".content_text-about").css("display", "none");

  $($(".testimonial")[_CT]).css("display", "block");

  $(".content_controls").css("display", "block");

  var h =
    (240 -
      $($(".testimonial")[_CT])
        .find("div")
        .height()
        .toString()
        .replace("px", "") *
        1) /
    2;
}

function next_testimonial() {
  var l = $(".testimonial").length;

  if (_CT == l - 1) {
    _CT = 0;
  } else {
    _CT++;
  }

  $(".dot").css("opacity", "0.7");

  $(".dot").css("background", "rgb(219,234,204)");

  $($(".dot")[_CT]).css("opacity", "0.8");

  $($(".dot")[_CT]).css("background", "rgb(42,88,39)");

  $(".content_text-about").css("display", "none");

  $($(".testimonial")[_CT]).css("display", "block");

  $(".content_controls").css("display", "block");

  var h =
    (240 -
      $($(".testimonial")[_CT])
        .find("div")
        .height()
        .toString()
        .replace("px", "") *
        1) /
    2;
}

function view_testimonial(i, element) {
  var text = element;

  $(".dot").css("opacity", "0.7");

  $(".dot").css("background", "rgb(219,234,204)");

  $(element).css("opacity", "0.8");

  $(element).css("background", "rgb(42,88,39)");

  $(".content_text-about").css("display", "none");

  $($(".testimonial")[i]).css("display", "block");

  $(".content_controls").css("display", "block");

  _CT = i;
}

let visible;

function createTestimonialDots() {
  if (!visible) {
    var l = $(".testimonial").length;

    var html = $("#testimonials-container-dots");

    for (var i = 0; i < l; i++) {
      (function (i) {
        html.append(
          '<span class="dot" onclick="view_testimonial(' +
            i +
            ', $(this))"></span>'
        );
      })(i);
    }

    visible = true;
  }
}

function jumpToPortfolio(num) {
  var portfolioNumber = parseInt(num);

  var get = location.href;

  location.href = "#" + "portfolio";

  // console.log(num);

  console.log("Jump");

  console.log(portfolioNumber);

  switch (portfolioNumber) {
    case 1:
      setTimeout("view_portfolio(1);", 100);

      break;

    case 2:
      setTimeout("view_portfolio(2);", 100);

      break;

    case 3:
      setTimeout("view_portfolio(3);", 100);

      break;

    case 4:
      setTimeout("view_portfolio(4);", 100);

      break;

    case 5:
      setTimeout("view_portfolio(5);", 100);

      break;

    default:
      setTimeout("view_portfolio(0);", 100);
  }
}

$(window).on("load", function () {
  enableDropdownMenu();
});

// This function applies and remove a css class on hover

function applyCSSClassHover(toggleClass, cssSelektor, className) {
  $(toggleClass).mouseover(function () {
    $(cssSelektor).addClass(className);
  });

  $(toggleClass).mouseleave(function () {
    $(cssSelektor).removeClass(className);
  });
}

// This function shows the dropdown menu when hovering over the sidebar item

function applyCSSHover(
  toggleClass,
  cssSelektor,
  cssSetting,
  cssPropertyOne,
  cssPropertyTwo
) {
  $(toggleClass).mouseover(function () {
    $(cssSelektor).css(cssSetting, cssPropertyOne);
  });

  $(toggleClass).mouseleave(function () {
    $(cssSelektor).css(cssSetting, cssPropertyTwo);
  });
}

function enableDropdownMenu() {
  console.log("enableDropdownMenu");

  applyCSSClassHover(
    "#dropdown-child-memberships",
    "#membershipsinfobox",
    "showInfoMemberBox"
  );

  applyCSSClassHover(
    "#dropdown-child-clearanceinfo",
    "#clearanceinfobox",
    "showInfoBox"
  );
}
