/**
 *  Material is a clean HTML5 theme for LuCI. It is based on luci-theme-bootstrap and MUI
 *
 *  luci-theme-argon
 *      Copyright 2023 gngpp <gngppz@gmail.com>
 *
 *  Have a bug? Please create an issue here on GitHub!
 *      https://github.com/LuttyYang/luci-theme-material/issues
 *
 *  luci-theme-bootstrap:
 *      Copyright 2008 Steven Barth <steven@midlink.org>
 *      Copyright 2008 Jo-Philipp Wich <jow@openwrt.org>
 *      Copyright 2012 David Menting <david@nut-bolt.nl>
 *
 *  MUI:
 *      https://github.com/muicss/mui
 * 
 *      luci-theme-material:
 *      https://github.com/LuttyYang/luci-theme-material/
 *
 *
 *  Licensed to the public under the Apache License 2.0
 */
(function ($) {

    $(".main > .loading").fadeOut();
    
    /**
     * trim text, Remove spaces, wrap
     * @param text
     * @returns {string}
     */
    function trimText(text) {
        return text.replace(/[ \t\n\r]+/g, " ");
    }

    var lastNode = undefined;
    var mainNodeName = undefined;

    var nodeUrl = "";
    (function (node) {
        if (node[0] == "admin") {
            luciLocation = [node[1], node[2]];
        } else {
            luciLocation = node;
        }

        for (var i in luciLocation) {
            nodeUrl += luciLocation[i];
            if (i != luciLocation.length - 1) {
                nodeUrl += "/";
            }
        }
    })(luciLocation);

    /**
     * get the current node by Burl (primary)
     * @returns {boolean} success?
     */
    function getCurrentNodeByUrl() {
        var ret = false;
        if (!$('body').hasClass('logged-in')) {
            luciLocation = ["Main", "Login"];
            return true;
        }
        $(".main > .main-left > .nav > .slide > .active").next(".slide-menu").stop(true).slideUp("fast");
        $(".main > .main-left > .nav > .slide > .menu").removeClass("active");
        $(".main > .main-left > .nav > .slide > .menu").each(function () {
            var ulNode = $(this);

            ulNode.next().find("a").each(function () {
                var that = $(this);
                var href = that.attr("href");

                if (new RegExp(nodeUrl + "$").test(href)) {
                    ulNode.click();
                    ulNode.next(".slide-menu").stop(true, true);
                    lastNode = that.parent();
                    lastNode.addClass("active");
                    ret = true;
                    return true;
                }
            });
        });
        return ret;
    }

    /**
     * menu click
     */
    $(".main > .main-left > .nav > .slide > .menu").click(function () {
        var ul = $(this).next(".slide-menu");
        var menu = $(this);
        if (!menu.hasClass("exit")) {
            $(".main > .main-left > .nav > .slide > .active").next(".slide-menu").stop(true).slideUp("fast");
            $(".main > .main-left > .nav > .slide > .menu").removeClass("active");
            if (!ul.is(":visible")) {
                menu.addClass("active");
                ul.addClass("active");
                ul.stop(true).slideDown("fast");
            } else {
                ul.stop(true).slideUp("fast", function () {
                    menu.removeClass("active");
                    ul.removeClass("active");
                });
            }

            return false;
        }
    });

    if ($("#cbi-dhcp-lan-ignore").length > 0) {
        observer.observe(document.getElementById("cbi-dhcp-lan-ignore"), {
            subtree: true,
            attributes: true
        });
    }

    /**
     * hook menu click and add the hash
     */
    $(".main > .main-left > .nav > .slide > .slide-menu > li > a").click(function () {
        if (lastNode != undefined) 
        lastNode.removeClass("active");
        $(this).parent().addClass("active");
        $(".main > .loading").fadeIn("fast");
        return true;
    });

    /**
     * fix menu click
     */
    $(".main > .main-left > .nav > .slide > .slide-menu > li").click(function () {
        if (lastNode != undefined) 
            lastNode.removeClass("active");
        $(this).addClass("active");
        $(".main > .loading").fadeIn("fast");
        window.location = $($(this).find("a")[0]).attr("href");
        return false;
    });

    /**
     * get current node and open it
     */
    if (getCurrentNodeByUrl()) {
        mainNodeName = "node-" + luciLocation[0] + "-" + luciLocation[1];
        mainNodeName = mainNodeName.replace(/[ \t\n\r\/]+/g, "_").toLowerCase();
        $("body").addClass(mainNodeName);
    }
    
    $(".cbi-button-up").val("");
    $(".cbi-button-down").val("");

    /**
     * hook other "A Label" and add hash to it.
     */
    $("#maincontent > .container").find("a").each(function () {
        var that = $(this);
        var onclick = that.attr("onclick");
        if (onclick == undefined || onclick == "") {
            that.click(function () {
                var href = that.attr("href");
                if (href.indexOf("#") == -1) {
                    $(".main > .loading").fadeIn("fast");
                    return true;
                }
            });
        }
    });

    /**
     * Sidebar expand
     */
    var showSide = false;
    $(".showSide").click(function () {
        if (showSide) {
            $(".darkMask").stop(true).fadeOut("fast");
            $(".main-left").stop(true).animate({
                width: "0"
            }, "fast");
            $(".main-right").css("overflow-y", "auto");
            $("header>.container>.brand").css("padding", "0 67px")
            showSide = false;
        } else {
            $(".darkMask").stop(true).fadeIn("fast");
            $(".main-left").stop(true).animate({
                width: "17rem"
            }, "fast");
            $(".main-right").css("overflow-y", "hidden");
            $(".showSide").css("display", "none");
            $("header").css("box-shadow", "17rem 2px 4px rgb(0 0 0 / 8%)")
            $("header>.container>.brand").css("padding", "0 0")
            showSide = true;
        }
    });

    $(".darkMask").click(function () {
        if (showSide) {
            $(".darkMask").stop(true).fadeOut("fast");
            $(".main-left").stop(true).animate({
                width: "0"
            }, "fast");
            $(".main-right").css("overflow-y", "auto");
            $(".showSide").css("display", "");
            $("header").css("box-shadow", "0 2px 4px rgb(0 0 0 / 8%)")
            $("header>.container>.brand").css("padding", "0 67px")
            showSide = false;
        }
    });

    $(window).resize(function () {
        if ($(window).width() > 992) {
            $(".showSide").css("display", "");
            $(".main-left").css("width", "");
            $(".darkMask").stop(true);
            $(".darkMask").css("display", "none");
            $("header").css("box-shadow", "17rem 2px 4px rgb(0 0 0 / 8%)")
            $("header>.container>.brand").css("padding", "0 0")
            showSide = false;
        } else {
            $("header").css("box-shadow", "0 2px 4px rgb(0 0 0 / 8%)")
            $("header>.container>.brand").css("padding", "0 67px")
        }
        if (showSide) {
            $("header").css("box-shadow", "17rem 2px 4px rgb(0 0 0 / 8%)")
            $("header>.container>.brand").css("padding", "0 0")
        }
    });

    /**
     * fix legend position
     */
    $("legend").each(function () {
        var that = $(this);
        that.after("<span class='panel-title'>" + that.text() + "</span>");
    });

    $(".main-right").focus();
    $(".main-right").blur();
    $("input").attr("size", "0");

    if (mainNodeName != undefined) {
        switch (mainNodeName) {
            case "node-status-system_log":
            case "node-status-kernel_log":
                $("#syslog").focus(function () {
                    $("#syslog").blur();
                    $(".main-right").focus();
                    $(".main-right").blur();
                });
                break;
            case "node-status-firewall":
                var button = $(".node-status-firewall > .main fieldset li > a");
                button.addClass("cbi-button cbi-button-reset a-to-btn");
                break;
            case "node-system-reboot":
                var button = $(".node-system-reboot > .main > .main-right p > a");
                button.addClass("cbi-button cbi-input-reset a-to-btn");
                break;
        }
    }

})(jQuery);
