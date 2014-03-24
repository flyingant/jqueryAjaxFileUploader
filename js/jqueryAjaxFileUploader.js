jQuery.extend({
    /*
     * create a iframe for current uploader options contains
     * @param options
     */
    createIframe: function (options) {
        var iframe;
        var iframeId = options.id;
        var uri = options.uri;
        var isIE = window.ActiveXObject ? true : false;
        var isLowIEVersion = jQuery.browser.version == "6.0" || jQuery.browser.version == "7.0" || jQuery.browser.version == "8.0";
        if (isIE && isLowIEVersion) {
            // I DON'T KNOW WHAT HAPPENED HERE
            iframe = document.createElement('<iframe id="' + iframeId + '" name="' + iframeId + '" />');
            if (typeof uri == 'boolean') {
                iframe.src = 'javascript:false';
            }
            else if (typeof uri == 'string') {
                iframe.src = uri;
            }

        } else {
            iframe = document.createElement("iframe");
            iframe.id = iframeId;
            iframe.name = iframeId;
        }

        //  hide the iframe
        iframe.style.position = 'absolute';
        iframe.style.top = '-10086px';
        iframe.style.left = '-10086px';

        document.body.appendChild(iframe);
        return iframe
    },

    /*
     * options contains
     * @param options
     */
    createForm: function (options) {
        var formId = options.id;
        var formHTMLString = '<form action="" method="" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>';
        var form = jQuery(formHTMLString);
        var extraData = options.extraData;
        // additional data
        if (extraData) {
            for (var i in extraData) {
                jQuery('<input type="hidden" name="' + i + '" value="' + extraData[i] + '" />').appendTo(form);
            }
        }
        jQuery.createFileElements(options.fileContainerId, form);
        jQuery(form).css('position', 'absolute');
        jQuery(form).css('top', '-10086px');
        jQuery(form).css('left', '-10086px');

        jQuery(form).appendTo('body');
        return form;
    },

    /*
     * create the file elements for the submit form and replace the original element with the clone element
     * @param form
     */
    createFileElements: function (fileContainerId, form) {
        jQuery.each(jQuery("#" + fileContainerId).find("input[type=file]"), function () {
            var replaceElement = jQuery(this).clone();
            jQuery(this).attr("id", fileContainerId + +new Date());
            jQuery(this).before(replaceElement);
            jQuery(jQuery(this)).appendTo(form);
        });
        return form;
    },

    ajaxUpload: function (options) {
        var id = +new Date();
        var formId = "uploadForm" + id;
        var iframeId = "uploadIframe" + id;
        var currentBrowse = function () {
            if (navigator.userAgent.indexOf("MSIE") > 0) {
                return "MSIE";
            }
            if (navigator.userAgent.indexOf("Firefox") > 0) {
                return "Firefox";
            }
            if (navigator.userAgent.indexOf("Safari") > 0) {
                return "Safari";
            }
            if (navigator.userAgent.indexOf("Chrome") > 0) {
                return "Chrome";
            }
            if (navigator.userAgent.indexOf("Gecko/") > 0) {
                return "Gecko";
            }
        }
        var iframe = jQuery.createIframe({
            id: iframeId
        });
        var form = jQuery.createForm({
            id: formId,
            fileContainerId: options.fileContainerId,
            extraData: options.data
        });

        try {
            jQuery(form).attr("action", options.url);
            jQuery(form).attr("method", "POST");
            jQuery(form).attr("target", iframeId);
            if (form.encoding) {
                jQuery(form).attr('encoding', 'multipart/form-data');
            }
            else {
                jQuery(form).attr('enctype', 'multipart/form-data');
            }
            jQuery(form).submit();
        } catch (e) {
            if (options.error) {
                options.error(e);
            }
        }

        var loadCallback = function () {
            var result;
            var iframe = document.getElementById(iframeId);
            try {
                if (iframe.contentWindow) {
                    if (currentBrowse() != "Firefox") {
                        result = iframe.contentWindow.document.body ? eval('(' + iframe.contentWindow.document.body.innerText + ')') : null;
                    } else {
                        result = iframe.contentWindow.document.body ? eval('(' + iframe.contentWindow.document.body.textContent + ')') : null;
                    }
                } else if (iframe.contentDocument) {
                    if (currentBrowse() != "Firefox") {
                        result = iframe.contentDocument.document.body ? eval('(' + iframe.contentDocument.document.body.innerText + ')') : null;
                    } else {
                        result = iframe.contentDocument.document.body ? eval('(' + iframe.contentDocument.document.body.textContent + ')') : null;
                    }
                }
            } catch (e) {
                if (options.error) {
                    options.error(e);
                }
            }

            if (options.success) {
                options.success(result);
            }
        };
        jQuery(iframe).load(loadCallback);
        return false
    }



})