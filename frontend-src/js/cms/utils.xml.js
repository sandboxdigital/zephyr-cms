/* globals CMS, Class, Tg, $, Form, tinymce, tinyMCE */

/**
 * Create a new Document object. If no arguments are specified,
 * the document will be empty. If a root tag is specified, the document
 * will contain that single root tag. If the root tag has a namespace
 * prefix, the second argument must specify the URL that identifies the
 * namespace.
 */
CMS.Xml = {
    createXml: function (rootTagName, namespaceURL) {
        if (!rootTagName) rootTagName = "";
        if (!namespaceURL) namespaceURL = "";
        if (document.implementation && document.implementation.createDocument) {
            // This is the W3C standard way to do it
            return document.implementation.createDocument(namespaceURL, rootTagName, null);
        }
        else { // This is the IE way to do it
            // Create an empty document as an ActiveX object
            // If there is no root element, this is all we have to do
            var doc = new ActiveXObject("MSXML2.DOMDocument");
            // If there is a root tag, initialize the document
            if (rootTagName) {
                // Look for a namespace prefix
                var prefix = "";
                var tagname = rootTagName;
                var p = rootTagName.indexOf(':');
                if (p != -1) {
                    prefix = rootTagName.substring(0, p);
                    tagname = rootTagName.substring(p + 1);
                }
                // If we have a namespace, we must have a namespace prefix
                // If we don't have a namespace, we discard any prefix
                if (namespaceURL) {
                    if (!prefix) prefix = "a0"; // What Firefox uses
                }
                else prefix = "";
                // Create the root element (with optional namespace) as a
                // string of text
                var text = "<" + (prefix ? (prefix + ":") : "") + tagname +
                    (namespaceURL
                        ? (" xmlns:" + prefix + '="' + namespaceURL + '"')
                        : "") +
                    "/>";
                // And parse that text into the empty document
                doc.loadXML(text);
            }
            return doc;
        }
    },

    parseXml : function (xmlString)
    {
        if(typeof(ActiveXObject) != 'undefined')
        {
            //Internet Explorer
            xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
            xmlDoc.async = "false";
            xmlDoc.loadXML(xmlString);
            return xmlDoc;
        } else {
            try {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(xmlString, "text/xml");
            } catch (e)
            {
                alert (e);
            }
        }
        return xmlDoc;
    },

    xmlToString: function (elem) {

        var serialized;

        if (typeof(XMLSerializer) != 'undefined') {
            // XMLSerializer exists in current Mozilla browsers
            try {
                serializer = new XMLSerializer();
                serialized = serializer.serializeToString(elem);
            }
            catch (e) {
                // Internet Explorer has a different approach to serializing XML
                alert("Oh dear unable to serialize XML\nError:\n" + e);
            }
        } else {
            // Internet Explorer has a different approach to serializing XML
            serialized = elem.xml;
        }

        return serialized;
    }
};